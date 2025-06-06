"use server";

import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { rooms } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import {
  insertRoomSchema,
  type insertRoomSchemaType,
} from "@/zod-schemas/room";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const saveRoomAction = actionClient
  .metadata({ actionName: "saveRoomAction" })
  .schema(insertRoomSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ parsedInput: room }: { parsedInput: insertRoomSchemaType }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      // New room
      if (room.id === "(New)") {
        const result = await db
          .insert(rooms)
          .values({
            roomNumber: room.roomNumber,
            roomType: room.roomType,
            bedType: room.bedType,
            maxOccupants: room.maxOccupants,
            maxChildren: room.maxChildren,
            status: room.status,
            ratePerNight: room.ratePerNight ? String(room.ratePerNight) : null, // Ensure it's a string or null
            ratePerWeek: room.ratePerWeek ? String(room.ratePerWeek) : null, // Ensure it's a string or null
            ratePerMonth: room.ratePerMonth ? String(room.ratePerMonth) : null, // Ensure it's a string or null
          })
          .returning({ insertedId: rooms.id });

        return {
          message: `Room ID #${result[0].insertedId} created successfully`,
        };
      }

      // Update room
      const result = await db
        .update(rooms)
        .set({
          roomNumber: room.roomNumber,
          roomType: room.roomType,
          bedType: room.bedType,
          maxOccupants: room.maxOccupants,
          maxChildren: room.maxChildren,
          status: room.status,
          ratePerNight: room.ratePerNight ? room.ratePerNight.toString() : null,
          ratePerWeek: room.ratePerWeek ? room.ratePerWeek.toString() : null,
          ratePerMonth: room.ratePerMonth ? room.ratePerMonth.toString() : null,
        })
        .where(eq(rooms.id, room.id!))
        .returning({ updatedId: rooms.id });

      return {
        message: `Room ID #${result[0].updatedId} updated successfully`,
      };
    }
  );
