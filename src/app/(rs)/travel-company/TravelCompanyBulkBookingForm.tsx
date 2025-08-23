"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import { useAction } from "next-safe-action/hooks";
import { saveTravelCompanyBulkBookingAction } from "@/app/actions/saveTravelCompanyBulkBookingAction";
import { toast } from "sonner";
import { LoaderCircle, Plus, Minus } from "lucide-react";
import { z } from "zod";

const travelCompanyBulkBookingSchema = z
  .object({
    travelCompanyName: z.string().min(1, "Travel company name is required"),
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
    numRooms: z.coerce
      .number()
      .min(3, "Minimum 3 rooms required for bulk booking"),
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

type TravelCompanyBulkBookingSchemaType = z.infer<
  typeof travelCompanyBulkBookingSchema
>;

export function TravelCompanyBulkBookingForm() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const defaultValues: TravelCompanyBulkBookingSchemaType = {
    travelCompanyName: "",
    customerEmail: "",
    firstName: "",
    lastName: "",
    checkInDate: today,
    checkOutDate: tomorrow,
    numAdults: 1,
    numChildren: 0,
    numRooms: 3,
    paymentMethod: "card",
  };

  const form = useForm<TravelCompanyBulkBookingSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(travelCompanyBulkBookingSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
  } = useAction(saveTravelCompanyBulkBookingAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success("Bulk booking created successfully! 🎉");
        form.reset(defaultValues);
      }
    },
    onError({ error }) {
      toast.error(`Bulk booking failed. Error: ${error}`);
    },
  });

  async function submitForm(data: TravelCompanyBulkBookingSchemaType) {
    executeSave(data);
  }

  const numRooms = form.watch("numRooms");

  return (
    <div className="flex flex-col gap-2 sm:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithLabel<TravelCompanyBulkBookingSchemaType>
              fieldTitle="Travel Company Name"
              nameInSchema="travelCompanyName"
              placeholder="Enter travel company name"
            />

            <InputWithLabel<TravelCompanyBulkBookingSchemaType>
              fieldTitle="Contact Email"
              nameInSchema="customerEmail"
              type="email"
              placeholder="contact@travelcompany.com"
            />

            <InputWithLabel<TravelCompanyBulkBookingSchemaType>
              fieldTitle="Contact First Name"
              nameInSchema="firstName"
              placeholder="Enter first name"
            />

            <InputWithLabel<TravelCompanyBulkBookingSchemaType>
              fieldTitle="Contact Last Name"
              nameInSchema="lastName"
              placeholder="Enter last name"
            />

            <InputWithLabel<TravelCompanyBulkBookingSchemaType>
              fieldTitle="Check-in Date"
              nameInSchema="checkInDate"
              type="date"
            />

            <InputWithLabel<TravelCompanyBulkBookingSchemaType>
              fieldTitle="Check-out Date"
              nameInSchema="checkOutDate"
              type="date"
            />

            <InputWithLabel<TravelCompanyBulkBookingSchemaType>
              fieldTitle="Number of Adults"
              nameInSchema="numAdults"
              type="number"
              min="1"
            />

            <InputWithLabel<TravelCompanyBulkBookingSchemaType>
              fieldTitle="Number of Children"
              nameInSchema="numChildren"
              type="number"
              min="0"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Rooms</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const current = form.getValues("numRooms");
                    if (current > 3) {
                      form.setValue("numRooms", current - 1);
                    }
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-medium">{numRooms}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const current = form.getValues("numRooms");
                    form.setValue("numRooms", current + 1);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 3 rooms required for bulk booking
              </p>
            </div>

            <SelectWithLabel<TravelCompanyBulkBookingSchemaType>
              fieldTitle="Payment Method"
              nameInSchema="paymentMethod"
              data={[
                { id: "card", description: "Credit Card" },
                { id: "cash", description: "Cash" },
              ]}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Bulk Booking Benefits
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 15% discount applied to total bill</li>
              <li>• Priority room assignment</li>
              <li>• Dedicated travel company billing</li>
              <li>• Flexible payment options (Card/Cash)</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Creating Bulk Booking...
                </>
              ) : (
                "Create Bulk Booking"
              )}
            </Button>
          </div>

          {saveResult && <DisplayServerActionResponse result={saveResult} />}
        </form>
      </Form>
    </div>
  );
}
