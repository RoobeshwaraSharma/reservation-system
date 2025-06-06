"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  bedTypeEnum,
  insertRoomSchema,
  insertRoomSchemaType,
  roomStatusEnum,
  roomTypeEnum,
} from "@/zod-schemas/room";
import { z } from "zod";
import { saveRoomAction } from "@/app/actions/saveRoomAction";

type Props = {
  room?: {
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
  };
  isEditable?: boolean;
};

const statusOptions = [
  { id: "Available", description: "Available" },
  { id: "Occupied", description: "Occupied" },
  { id: "Maintenance", description: "Maintenance" },
];

const roomTypeOptions = [
  { id: "Standard", description: "Standard" },
  { id: "Suite", description: "Suite" },
];

const bedTypeOptions = [
  { id: "Single", description: "Single" },
  { id: "Double", description: "Double" },
  { id: "Queen", description: "Queen" },
  { id: "King", description: "King" },
];

// Infer enum types
type RoomStatus = z.infer<typeof roomStatusEnum>;
type RoomType = z.infer<typeof roomTypeEnum>;
type BedType = z.infer<typeof bedTypeEnum>;

export default function RoomForm({ room, isEditable = true }: Props) {
  const router = useRouter();

  const defaultValues: insertRoomSchemaType = {
    id: room?.id ?? "(New)",
    roomNumber: room?.roomNumber ?? "",
    roomType: (room?.roomType as RoomType) ?? "Standard",
    bedType: (room?.bedType as BedType) ?? "Single",
    maxOccupants: room?.maxOccupants ?? 1,
    maxChildren: room?.maxChildren ?? 0,
    status: (room?.status as RoomStatus) ?? "Available",
    ratePerNight: room?.ratePerNight ? parseFloat(room.ratePerNight) : 0.0,
    ratePerWeek: room?.ratePerWeek ? parseFloat(room.ratePerWeek) : 0.0,
    ratePerMonth: room?.ratePerMonth ? parseFloat(room.ratePerMonth) : 0.0,
  };

  const form = useForm<insertRoomSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertRoomSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveRoomAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast(`Success! 🎉 - ${data.message}`);
      }
    },
    onError({ error }) {
      toast(`Save Failed. Error: ${error}`);
    },
  });

  async function submitForm(data: insertRoomSchemaType) {
    executeSave(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResponse result={saveResult} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {room?.id && isEditable
            ? `Edit Room #${room.id}`
            : room?.id
            ? `View Room #${room.id}`
            : "New Room Form"}
        </h2>
        <Button
          onClick={() => router.push("/rooms")}
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
            <InputWithLabel<insertRoomSchemaType>
              fieldTitle="Room Number"
              nameInSchema="roomNumber"
              disabled={!isEditable}
              placeholder="100"
            />
            <SelectWithLabel<insertRoomSchemaType>
              fieldTitle="Room Type"
              nameInSchema="roomType"
              data={roomTypeOptions}
              disabled={!isEditable}
            />
            <SelectWithLabel<insertRoomSchemaType>
              fieldTitle="Bed Type"
              nameInSchema="bedType"
              data={bedTypeOptions}
              disabled={!isEditable}
            />
            <InputWithLabel<insertRoomSchemaType>
              fieldTitle="Max Occupants"
              nameInSchema="maxOccupants"
              type="number"
              disabled={!isEditable}
            />
            <InputWithLabel<insertRoomSchemaType>
              fieldTitle="Max Children"
              nameInSchema="maxChildren"
              type="number"
              disabled={!isEditable}
            />
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<insertRoomSchemaType>
              fieldTitle="Rate Per Night"
              nameInSchema="ratePerNight"
              type="number"
              disabled={!isEditable}
            />
            <InputWithLabel<insertRoomSchemaType>
              fieldTitle="Rate Per Week"
              nameInSchema="ratePerWeek"
              type="number"
              disabled={!isEditable}
            />
            <InputWithLabel<insertRoomSchemaType>
              fieldTitle="Rate Per Month"
              nameInSchema="ratePerMonth"
              type="number"
              disabled={!isEditable}
            />
            <SelectWithLabel<insertRoomSchemaType>
              fieldTitle="Status"
              nameInSchema="status"
              data={statusOptions}
              disabled={!isEditable}
            />
            {isEditable && (
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
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
