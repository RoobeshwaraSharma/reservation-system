"use server";

import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { reservations } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import {
  insertReservationSchema,
  type insertReservationSchemaType,
} from "@/zod-schemas/reservation";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const saveReservationAction = actionClient
  .metadata({ actionName: "saveReservationAction" })
  .schema(insertReservationSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: reservation,
    }: {
      parsedInput: insertReservationSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      // New reservation
      if (reservation.id === "(New)") {
        const result = await db
          .insert(reservations)
          .values({
            customerEmail: reservation.customerEmail.toLowerCase(),
            numAdults: reservation.numAdults,
            numChildren: reservation.numChildren,
            checkInDate: reservation.checkInDate,
            checkOutDate: reservation.checkOutDate,
            status: reservation.status,
            createdBy: reservation.createdBy,
          })
          .returning({ insertedId: reservations.id });

        return {
          message: `Reservation ID #${result[0].insertedId} created successfully`,
        };
      }

      // Update reservation
      const result = await db
        .update(reservations)
        .set({
          customerEmail: reservation.customerEmail.toLowerCase(),
          numAdults: reservation.numAdults,
          numChildren: reservation.numChildren,
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          status: reservation.status,
          createdBy: reservation.createdBy,
        })
        .where(eq(reservations.id, reservation.id!))
        .returning({ updatedId: reservations.id });

      return {
        message: `Reservation ID #${result[0].updatedId} updated successfully`,
      };
    }
  );
