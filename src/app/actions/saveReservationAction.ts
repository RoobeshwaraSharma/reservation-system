"use server";

import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { bill, reservations } from "@/db/schema";
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
            firstName: reservation.firstName,
            lastName: reservation.lastName,
            numAdults: reservation.numAdults,
            numChildren: reservation.numChildren,
            checkInDate: reservation.checkInDate,
            checkOutDate: reservation.checkOutDate,
            status: reservation.status,
            createdBy: reservation.createdBy,
          })
          .returning({ insertedId: reservations.id });

        // Convert to Date objects
        const checkIn = new Date(reservation.checkInDate);
        const checkOut = new Date(reservation.checkOutDate);

        // Calculate number of nights (minimum 1)
        let nightDiff = Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );
        nightDiff = Math.max(nightDiff, 1);

        // Base rate per couple per night
        const baseRate = 200;
        const numAdults = reservation.numAdults ?? 1;
        const coupleUnits = Math.ceil(numAdults / 2);
        const baseAmount = baseRate * coupleUnits * nightDiff;

        // Add 10% tax
        const taxAmount = baseAmount * 0.1;
        const totalWithTax = baseAmount + taxAmount;

        // Insert bill
        await db.insert(bill).values({
          reservationId: result[0].insertedId,
          totalAmount: totalWithTax.toFixed(2),
        });

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
