"use client";
import { cancelReservation } from "@/app/actions/cancelReservation";
import { checkInReservation } from "@/app/actions/checkInReservation";
import { checkOutReservation } from "@/app/actions/checkOutReservation";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  reservation: {
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
  roomCount: number;
};

export default function ReservationRoomDetails({
  reservation,
  roomCount,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { execute: executeCheckIn, isPending: isCheckingIn } = useAction(
    checkInReservation,
    {
      onSuccess({ data }) {
        toast.success(data?.message ?? "Checked in successfully.");
        router.refresh();
      },
      onError({ error }) {
        console.log(error);
        toast.error(`Check-in failed: ${error.serverError}`);
      },
    }
  );

  const handleCheckIn = () => {
    toast.custom((t) => (
      <div className="p-4 flex flex-col gap-3 bg-white dark:bg-zinc-900 rounded-md shadow-lg border dark:border-zinc-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Confirm check-in for {reservation.firstName} {reservation.lastName}?
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
                executeCheckIn({ reservationId: reservation.id });
              });
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    ));
  };

  const { execute: executeCheckOut, isPending: isCheckingOut } = useAction(
    checkOutReservation,
    {
      onSuccess({ data }) {
        toast.success(data?.message ?? "Checked out successfully.");
        router.refresh();
      },
      onError({ error }) {
        console.log(error);
        toast.error(`Check-out failed: ${error.serverError}`);
      },
    }
  );

  const handleCheckOut = () => {
    toast.custom((t) => (
      <div className="p-4 flex flex-col gap-3 bg-white dark:bg-zinc-900 rounded-md shadow-lg border dark:border-zinc-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Confirm check-out for {reservation.firstName} {reservation.lastName}?
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
                executeCheckOut({ reservationId: reservation.id });
              });
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    ));
  };

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

  const handleCancel = () => {
    toast.custom((t) => (
      <div className="p-4 flex flex-col gap-3 bg-white dark:bg-zinc-900 rounded-md shadow-lg border dark:border-zinc-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Confirm cancellation for {reservation.firstName}{" "}
          {reservation.lastName}?
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
                executeCancel({ reservationId: reservation.id });
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
    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-xl shadow p-6 mb-6 w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Reservation Details
        </h2>
        <Button
          onClick={() => router.push("/cico")}
          variant="secondary"
          className="mt-4 sm:mt-0"
        >
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
        <div className="space-y-1">
          <p>
            <span className="font-medium">Reservation ID:</span>{" "}
            {reservation.id}
          </p>
          <p>
            <span className="font-medium">Customer:</span>{" "}
            {reservation.firstName} {reservation.lastName}
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            {reservation.customerEmail}
          </p>
          <p>
            <span className="font-medium">Adults:</span>{" "}
            {reservation.numAdults ?? "-"}
          </p>
          <p>
            <span className="font-medium">Children:</span>{" "}
            {reservation.numChildren ?? "-"}
          </p>
        </div>

        <div className="space-y-1">
          <p>
            <span className="font-medium">Check-In:</span>{" "}
            {reservation.checkInDate.toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Check-Out:</span>{" "}
            {reservation.checkOutDate.toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Created At:</span>{" "}
            {reservation.createdAt?.toLocaleDateString() ?? "-"}
          </p>
          <p>
            <span className="font-medium">Created By:</span>{" "}
            {reservation.createdBy}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                reservation.status === "Active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : reservation.status === "Inprogress"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {reservation.status}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {reservation.status === "Active" && (
          <Button
            variant="default"
            title="Assign-room"
            onClick={() =>
              router.push(`assign-room?reservationId=${reservation.id}`)
            }
          >
            Assign Room
          </Button>
        )}

        {roomCount > 0 && reservation.status === "Active" && (
          <Button
            variant="default"
            title="In"
            onClick={handleCheckIn}
            disabled={isCheckingIn || isPending}
          >
            {isCheckingIn || isPending ? "Checking In..." : "Check In"}
          </Button>
        )}

        {reservation.status === "Inprogress" && (
          <Button
            variant="secondary"
            title="Out"
            onClick={handleCheckOut}
            disabled={isCheckingOut || isPending}
          >
            {isCheckingOut || isPending ? "Checking Out..." : "Check Out"}
          </Button>
        )}

        {reservation.status === "Active" && (
          <Button
            variant="destructive"
            title="Cancel"
            onClick={handleCancel}
            disabled={isCancelling || isPending}
          >
            {isCancelling || isPending ? "Cancelling..." : "Cancel"}
          </Button>
        )}
      </div>
    </div>
  );
}
