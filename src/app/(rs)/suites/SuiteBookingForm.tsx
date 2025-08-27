"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import { useAction } from "next-safe-action/hooks";
import { saveSuiteBookingAction } from "@/app/actions/saveSuiteBookingAction";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { useEffect, useState } from "react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

const suiteBookingSchema = z
  .object({
    customerEmail: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    checkInDate: z.coerce.date({
      errorMap: () => ({ message: "Invalid check-in date" }),
    }),
    checkOutDate: z.coerce.date({
      errorMap: () => ({ message: "Invalid check-out date" }),
    }),
    numAdults: z.coerce.number().min(1, "At least 1 adult required"),
    numChildren: z.coerce.number().min(0, "Children cannot be negative"),
    bookingType: z.enum(["weekly", "monthly"]),
    suiteId: z.coerce.number().min(1, "Suite selection is required"),
    paymentMethod: z.enum(["card", "cash"]),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDate);
      const checkOut = new Date(data.checkOutDate);
      return checkOut > checkIn;
    },
    {
      path: ["checkOutDate"],
      message: "Check-out date must be after check-in date",
    }
  );

type SuiteBookingSchemaType = z.infer<typeof suiteBookingSchema>;

type Suite = {
  id: number;
  roomNumber: string;
  ratePerWeek: string | null;
  ratePerMonth: string | null;
  status: string;
};

export function SuiteBookingForm({
  user,
  employeePermission,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: KindeUser<Record<string, any>>;
  employeePermission: boolean;
}) {
  const [availableSuites, setAvailableSuites] = useState<Suite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableSuites = async () => {
      try {
        const response = await fetch("/api/suites/available");
        if (response.ok) {
          const data = await response.json();
          setAvailableSuites(data);
        }
      } catch (error) {
        console.error("Failed to fetch available suites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSuites();
  }, []);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const defaultValues: SuiteBookingSchemaType = {
    customerEmail: employeePermission ? "" : user?.email ?? "",
    firstName: employeePermission ? "" : user?.given_name ?? "",
    lastName: employeePermission ? "" : user?.family_name ?? "",
    checkInDate: today,
    checkOutDate: tomorrow,
    numAdults: 1,
    numChildren: 0,
    bookingType: "weekly",
    suiteId: 0,
    paymentMethod: "card",
  };

  const form = useForm<SuiteBookingSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(suiteBookingSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
  } = useAction(saveSuiteBookingAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success("Suite booking created successfully! 🎉");
        form.reset(defaultValues);
      }
    },
    onError({ error }) {
      toast.error(`Suite booking failed. Error: ${error}`);
    },
  });

  async function submitForm(data: SuiteBookingSchemaType) {
    executeSave(data);
  }

  const bookingType = form.watch("bookingType");
  const selectedSuiteId = form.watch("suiteId");

  const selectedSuite = availableSuites.find(
    (suite) => suite.id === selectedSuiteId
  );
  const rate =
    bookingType === "weekly"
      ? selectedSuite?.ratePerWeek
      : selectedSuite?.ratePerMonth;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithLabel<SuiteBookingSchemaType>
              fieldTitle="Email"
              nameInSchema="customerEmail"
              type="email"
              placeholder="customer@example.com"
              disabled={!employeePermission}
            />

            <InputWithLabel<SuiteBookingSchemaType>
              fieldTitle="First Name"
              nameInSchema="firstName"
              placeholder="Enter first name"
              disabled={!employeePermission}
            />

            <InputWithLabel<SuiteBookingSchemaType>
              fieldTitle="Last Name"
              nameInSchema="lastName"
              placeholder="Enter last name"
              disabled={!employeePermission}
            />

            <InputWithLabel<SuiteBookingSchemaType>
              fieldTitle="Check-in Date"
              nameInSchema="checkInDate"
              type="date"
            />

            <InputWithLabel<SuiteBookingSchemaType>
              fieldTitle="Check-out Date"
              nameInSchema="checkOutDate"
              type="date"
            />

            <InputWithLabel<SuiteBookingSchemaType>
              fieldTitle="Number of Adults"
              nameInSchema="numAdults"
              type="number"
              min="1"
            />

            <InputWithLabel<SuiteBookingSchemaType>
              fieldTitle="Number of Children"
              nameInSchema="numChildren"
              type="number"
              min="0"
            />

            <SelectWithLabel<SuiteBookingSchemaType>
              fieldTitle="Booking Type"
              nameInSchema="bookingType"
              data={[
                { id: "weekly", description: "Weekly Rate" },
                { id: "monthly", description: "Monthly Rate" },
              ]}
            />

            <SelectWithLabel<SuiteBookingSchemaType>
              fieldTitle="Select Suite"
              nameInSchema="suiteId"
              data={availableSuites.map((suite) => ({
                id: suite.id.toString(),
                description: `Suite ${suite.roomNumber} - $${
                  bookingType === "weekly"
                    ? suite.ratePerWeek
                    : suite.ratePerMonth
                }/week`,
              }))}
            />

            <SelectWithLabel<SuiteBookingSchemaType>
              fieldTitle="Payment Method"
              nameInSchema="paymentMethod"
              data={[
                { id: "card", description: "Credit Card" },
                { id: "cash", description: "Cash" },
              ]}
            />
          </div>

          {selectedSuite && rate && (
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Suite Booking Summary
              </h3>
              <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <p>• Suite: {selectedSuite.roomNumber}</p>
                <p>
                  • Rate: ${rate} per{" "}
                  {bookingType === "weekly" ? "week" : "month"}
                </p>
                <p>• Status: {selectedSuite.status}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSaving || availableSuites.length === 0}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Creating Suite Booking...
                </>
              ) : (
                "Create Suite Booking"
              )}
            </Button>
          </div>

          {saveResult && <DisplayServerActionResponse result={saveResult} />}
        </form>
      </Form>
    </div>
  );
}
