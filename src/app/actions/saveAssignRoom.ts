"use server";

import { db } from "@/db";
import { reservationRooms } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  insertReservationRoomSchema,
  InsertReservationRoomSchemaType,
} from "@/zod-schemas/assingRoom";

export const saveAssignRoom = actionClient
  .metadata({ actionName: "saveAssignRoom" })
  .schema(insertReservationRoomSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput,
    }: {
      parsedInput: InsertReservationRoomSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      const result = await db
        .insert(reservationRooms)
        .values({
          reservationId: parsedInput.reservationId,
          roomId: parsedInput.roomId,
          assignedDate: new Date(),
        })
        .returning({ insertedId: reservationRooms.id });

      return {
        message: `Room assigned successfully (Assignment ID #${result[0].insertedId})`,
      };
    }
  );
