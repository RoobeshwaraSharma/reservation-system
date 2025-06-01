// /lib/actions/checkInReservation.ts

"use server";

import { db } from "@/db";
import { reservations, reservationRooms, rooms } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

import {
  checkInReservationSchema,
  CheckInReservationSchemaType,
} from "@/zod-schemas/checkIn";
import { eq, inArray } from "drizzle-orm";

export const checkOutReservation = actionClient
  .metadata({ actionName: "checkInReservation" })
  .schema(checkInReservationSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput }: { parsedInput: CheckInReservationSchemaType }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      const { reservationId } = parsedInput;
      const now = new Date();

      // 1. Update reservation status & checkInTime
      await db
        .update(reservations)
        .set({
          status: "Completed",
          checkOutDate: now,
        })
        .where(eq(reservations.id, reservationId));

      // 2. Get all rooms linked to this reservation
      const assignedRooms = await db
        .select({ roomId: reservationRooms.roomId })
        .from(reservationRooms)
        .where(eq(reservationRooms.reservationId, reservationId));

      const roomIds = assignedRooms.map((r) => r.roomId);

      if (roomIds.length === 0) {
        throw new Error("No rooms assigned to this reservation.");
      }

      // 3. Update all room statuses to "Available"
      await db
        .update(rooms)
        .set({ status: "Available" })
        .where(inArray(rooms.id, roomIds));

      // 4. Update check-in time in reservationRooms
      await db
        .update(reservationRooms)
        .set({ checkOutTime: now })
        .where(eq(reservationRooms.reservationId, reservationId));

      return {
        message: `Reservation #${reservationId} checked out successfully.`,
      };
    }
  );
