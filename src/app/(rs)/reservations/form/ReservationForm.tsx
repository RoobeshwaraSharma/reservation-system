"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { DateInputWithLabel } from "@/components/inputs/DateInputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";

import {
  insertReservationSchema,
  type insertReservationSchemaType,
  reservationStatusEnum,
  createdByEnum,
} from "@/zod-schemas/reservation";

import { useAction } from "next-safe-action/hooks";
import { saveReservationAction } from "@/app/actions/saveReservationAction";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cancelReservation } from "@/app/actions/cancelReservation";

type Props = {
  reservation?: {
    id: number;
    customerEmail: string;
    firstName: string;
    lastName: string;
    numAdults: number | null;
    numChildren: number | null;
    checkInDate: Date;
    checkOutDate: Date;
    status: string;
    createdBy: string;
    createdAt: Date | null;
  };
  isEditable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: KindeUser<Record<string, any>>;
  employeePermission: boolean;
  isPayOnline?: boolean;
};

const statusOptions = [
  { id: "Active", description: "Active" },
  { id: "Cancelled", description: "Cancelled" },
  { id: "Completed", description: "Completed" },
  { id: "No-show", description: "No-show" },
];

const createdByOptions = [
  { id: "Customer", description: "Customer" },
  { id: "Clerk", description: "Clerk" },
];

// Infer enum types
type ReservationStatus = z.infer<typeof reservationStatusEnum>;
type CreatedBy = z.infer<typeof createdByEnum>;

export default function ReservationForm({
  reservation,
  isEditable = true,
  user,
  employeePermission,
  isPayOnline = false,
}: Props) {
  const router = useRouter();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [isPending, startTransition] = useTransition();

  const defaultValues: insertReservationSchemaType = {
    id: reservation?.id ?? "(New)",
    customerEmail:
      reservation?.customerEmail ??
      (employeePermission ? "" : user?.email ?? ""),
    firstName:
      reservation?.firstName ??
      (employeePermission ? "" : user?.given_name ?? ""),
    lastName:
      reservation?.lastName ??
      (employeePermission ? "" : user?.family_name ?? ""),
    numAdults: reservation?.numAdults ?? 1,
    numChildren: reservation?.numChildren ?? 0,
    checkInDate: reservation?.checkInDate ?? today,
    checkOutDate: reservation?.checkOutDate ?? tomorrow,
    status: (reservation?.status as ReservationStatus) ?? "Active",
    createdBy:
      (reservation?.createdBy as CreatedBy) ??
      (employeePermission ? "Clerk" : "Customer"),
  };
  const form = useForm<insertReservationSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertReservationSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveReservationAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast("Success! 🎉");
      }
    },
    onError({ error }) {
      toast(`Save Failed. Error: ${error}`);
    },
  });

  async function submitForm(data: insertReservationSchemaType) {
    executeSave(data);
  }

  const { execute: executeCancel, isPending: isCancelling } = useAction(
    cancelReservation,
    {
      onSuccess({ data }) {
        toast.success(data?.message ?? "Cancelled successfully.");
        router.refresh();
      },
      onError({ error }) {
        console.log(error);
        toast.error(`Cancel failed: ${error.serverError}`);
      },
    }
  );

  const handleCancel = (reservationId: number) => {
    toast.custom((t) => (
      <div className="p-4 flex flex-col gap-3 bg-white dark:bg-zinc-900 rounded-md shadow-lg border dark:border-zinc-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Are you sure ? You want to cancel the reservation?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              toast.dismiss(t);
              startTransition(() => {
                executeCancel({ reservationId });
              });
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResponse result={saveResult} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {reservation?.id && isEditable
            ? `Edit Reservation #${reservation.id}`
            : reservation?.id
            ? `View Reservation #${reservation.id}`
            : "New Reservation Form"}
        </h2>
        <Button
          onClick={() => router.push("/reservations")}
          variant="secondary"
          className="mt-4 sm:mt-0"
        >
          Back
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 md:gap-8"
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <div className="flex gap-2">
              <InputWithLabel<insertReservationSchemaType>
                fieldTitle="First Name"
                nameInSchema="firstName"
                disabled
              />
              <InputWithLabel<insertReservationSchemaType>
                fieldTitle="Last Name"
                nameInSchema="lastName"
                disabled
              />
            </div>

            <InputWithLabel<insertReservationSchemaType>
              fieldTitle="Email"
              nameInSchema="customerEmail"
              disabled
            />

            <InputWithLabel<insertReservationSchemaType>
              fieldTitle="Number of Adults"
              nameInSchema="numAdults"
              type="number"
              disabled={!isEditable}
            />

            <InputWithLabel<insertReservationSchemaType>
              fieldTitle="Number of Children"
              nameInSchema="numChildren"
              type="number"
              disabled={!isEditable}
            />

            <DateInputWithLabel<insertReservationSchemaType>
              fieldTitle="Check-in Date"
              nameInSchema="checkInDate"
              type="date"
              disabled={!isEditable}
            />

            <DateInputWithLabel<insertReservationSchemaType>
              fieldTitle="Check-out Date"
              nameInSchema="checkOutDate"
              type="date"
              disabled={!isEditable}
            />
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <SelectWithLabel<insertReservationSchemaType>
              fieldTitle="Status"
              nameInSchema="status"
              data={statusOptions}
              disabled
            />

            <SelectWithLabel<insertReservationSchemaType>
              fieldTitle="Created By"
              nameInSchema="createdBy"
              data={createdByOptions}
              disabled
            />

            {isEditable ? (
              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  className="w-3/4"
                  variant="default"
                  title="Save"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  title="Reset"
                  onClick={() => {
                    form.reset(defaultValues);
                    resetSaveAction();
                  }}
                >
                  Reset
                </Button>
                {reservation?.id && (
                  <Button
                    type="button"
                    variant="destructive"
                    title="Cancel"
                    onClick={() => {
                      handleCancel(reservation.id);
                    }}
                    disabled={isCancelling || isPending}
                  >
                    {isCancelling || isPending ? "Cancelling..." : "Cancel"}
                  </Button>
                )}
              </div>
            ) : null}
            {reservation?.id && isPayOnline && (
              <Button
                className="mt-4"
                type="button"
                variant="default"
                onClick={async () => {
                  const res = await fetch("/api/create-checkout-session", {
                    method: "POST",
                    body: JSON.stringify({ reservationId: reservation.id }),
                  });

                  const { url } = await res.json();
                  if (url) {
                    window.location.href = url;
                  }
                }}
              >
                Pay Online
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
