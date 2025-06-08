"use server";

import { db } from "@/db";
import { reservationServices, reservations, bill, services } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  insertReservationServiceSchema,
  InsertReservationServiceSchemaType,
} from "@/zod-schemas/assingService";
import { eq } from "drizzle-orm"; // Importing the eq operator for Drizzle ORM

export const saveAssignService = actionClient
  .metadata({ actionName: "saveAssignService" })
  .schema(insertReservationServiceSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput,
    }: {
      parsedInput: InsertReservationServiceSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      // Step 1: Get the total occupant count from the reservations table
      const reservation = await db
        .select()
        .from(reservations)
        .where(eq(reservations.id, parsedInput.reservationId))
        .limit(1);

      if (!reservation) {
        throw new Error("Reservation not found");
      }

      const totalOccupants = reservation[0].numAdults;

      // Step 2: Get the perPersonCharge from the service table
      const serviceDetails = await db
        .select()
        .from(services)
        .where(eq(services.id, parsedInput.serviceId))
        .limit(1);

      if (!serviceDetails) {
        throw new Error("Service not found");
      }

      // Convert perPersonCharge to a number or fallback to 0 if it's null
      const perPersonCharge = parseFloat(
        serviceDetails[0].chargePerPerson || "0"
      );

      // Step 3: Calculate the total charge
      const totalCharge = totalOccupants! * perPersonCharge;

      // Step 4: Insert into reservationServices table
      const result = await db
        .insert(reservationServices)
        .values({
          reservationId: parsedInput.reservationId,
          serviceId: parsedInput.serviceId,
          totalCharge: totalCharge.toString(),
        })
        .returning({ insertedId: reservationServices.id });

      // Step 5: Query the bill table to get the total_amount and update with service charge + 10% tax
      const billRecord = await db
        .select()
        .from(bill)
        .where(eq(bill.reservationId, parsedInput.reservationId))
        .limit(1);

      if (!billRecord) {
        throw new Error("Bill not found for this reservation");
      }

      const currentTotalAmount = parseFloat(billRecord[0].totalAmount!);

      // Calculate service charge with 10% tax
      const serviceChargeWithTax = totalCharge * 1.1;
      const totalBill = (currentTotalAmount + serviceChargeWithTax).toString();
      // Update the bill with the new amount
      await db
        .update(bill)
        .set({
          totalAmount: totalBill,
        })
        .where(eq(bill.reservationId, parsedInput.reservationId));

      return {
        message: `Service assigned successfully (Assignment ID #${result[0].insertedId}). Bill updated to $${totalBill}`,
      };
    }
  );
