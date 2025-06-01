"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { saveAssignRoom } from "@/app/actions/saveAssignRoom";
import {
  InsertReservationRoomSchemaType,
  insertReservationRoomSchema,
} from "@/zod-schemas/assingRoom";

type Props = {
  reservationId: number;
  availableRooms: {
    id: number;
    roomNumber: string;
    roomType: string;
    bedType: string;
    maxOccupants: number | null;
    maxChildren: number | null;
    status: string;
    ratePerNight: string | null;
    ratePerWeek: string | null;
    ratePerMonth: string | null;
  }[];
};

export default function AssignRoomForm({
  reservationId,
  availableRooms,
}: Props) {
  const router = useRouter();

  const assignedDate = new Date(); // Date object

  const defaultValues: InsertReservationRoomSchemaType = {
    reservationId,
    roomId: 0,
    assignedDate,
    roomIdString: "empty",
  };

  const form = useForm<InsertReservationRoomSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertReservationRoomSchema),
    defaultValues,
  });
  console.log(form.formState.errors);
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "roomIdString" && value.roomIdString) {
        form.setValue("roomId", Number(value.roomIdString));
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const {
    execute: executeSave,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveAssignRoom, {
    onSuccess({ data }) {
      toast.success(data?.message ?? "Room assigned successfully! 🎉");
      router.push("cico-room?reservationId=${reservation.id}");
    },
    onError({ error }) {
      toast.error(`Room assignment failed. ${error ?? "Please try again."}`);
    },
  });

  const selectedRoomId = form.watch("roomId");

  const selectedRoom = useMemo(() => {
    return availableRooms.find((room) => room.id === selectedRoomId);
  }, [selectedRoomId, availableRooms]);

  function onSubmit(data: InsertReservationRoomSchemaType) {
    console.log("Submitting");
    executeSave(data);
  }

  return (
    <div className="flex flex-col gap-2 sm:px-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">
          Assign Room for Reservation #{reservationId}
        </h2>
        <Button
          onClick={() => {
            router.push(`cico-room?reservationId=${reservationId}`);
          }}
          variant={"secondary"}
        >
          Back
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <SelectWithLabel<InsertReservationRoomSchemaType>
                nameInSchema="roomIdString"
                fieldTitle="Select Room"
                data={[
                  { id: "empty", description: "-- Select a Room --" },
                  ...availableRooms.map((room) => ({
                    id: String(room.id),
                    description: `Room #${room.roomNumber}`,
                  })),
                ]}
              />
            </div>

            {selectedRoom && (
              <div className="flex flex-col gap-3 w-full max-w-sm bg-muted p-4 rounded-md">
                <p>
                  <strong>Room Type:</strong> {selectedRoom.roomType}
                </p>
                <p>
                  <strong>Bed Type:</strong> {selectedRoom.bedType}
                </p>
                <p>
                  <strong>Rate/Night:</strong> $
                  {selectedRoom.ratePerNight ?? "N/A"}
                </p>
                <p>
                  <strong>Max Occupants:</strong>{" "}
                  {selectedRoom.maxOccupants ?? "N/A"}
                </p>
                <p>
                  <strong>Max Children:</strong>{" "}
                  {selectedRoom.maxChildren ?? "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRoom.status}
                </p>
              </div>
            )}
          </div>
          {/* ✅ These buttons must go INSIDE the <form> */}
          <div className="mt-6 flex gap-4">
            <Button
              type="submit"
              disabled={isSaving || selectedRoomId === 0}
              className="w-32"
              title="Assign Room"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" /> Saving
                </>
              ) : (
                "Assign Room"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset(defaultValues);
                resetSaveAction();
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
