"use server";

import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { bill, reservations, rooms } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const travelCompanyBulkBookingSchema = z
  .object({
    travelCompanyName: z.string().min(1, "Travel company name is required"),
    customerEmail: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    checkInDate: z.coerce.date({
      errorMap: () => ({ message: "Invalid check-in date" }),
    }),
    checkOutDate: z.coerce.date({
      errorMap: () => ({ message: "Invalid check-out date" }),
    }),
    numAdults: z.coerce.number().min(1, "At least 1 adult required"),
    numChildren: z.coerce.number().min(0, "Children cannot be negative"),
    numRooms: z.coerce
      .number()
      .min(3, "Minimum 3 rooms required for bulk booking"),
    paymentMethod: z.enum(["card", "cash"]),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDate);
      const checkOut = new Date(data.checkOutDate);
      return checkOut > checkIn;
    },
    {
      path: ["checkOutDate"],
      message: "Check-out date must be after check-in date",
    }
  );

type TravelCompanyBulkBookingSchemaType = z.infer<
  typeof travelCompanyBulkBookingSchema
>;

export const saveTravelCompanyBulkBookingAction = actionClient
  .metadata({ actionName: "saveTravelCompanyBulkBookingAction" })
  .schema(travelCompanyBulkBookingSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: booking,
    }: {
      parsedInput: TravelCompanyBulkBookingSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      // Check if enough rooms are available for the date range
      const availableRooms = await db
        .select()
        .from(rooms)
        .where(
          and(
            eq(rooms.status, "Available"),
            eq(rooms.roomType, "Standard") // For bulk bookings, use standard rooms
          )
        );

      if (availableRooms.length < booking.numRooms) {
        throw new Error(
          `Only ${availableRooms.length} rooms available. ${booking.numRooms} rooms requested.`
        );
      }

      // Calculate number of nights
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      let nightDiff = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      nightDiff = Math.max(nightDiff, 1);

      // Base rate calculation
      const baseRate = 200; // $200 per couple per night
      const numAdults = booking.numAdults ?? 1;
      const coupleUnits = Math.ceil(numAdults / 2);
      const baseAmount = baseRate * coupleUnits * nightDiff * booking.numRooms;

      // Apply 15% discount for travel company bulk booking
      const discountAmount = baseAmount * 0.15;
      const discountedAmount = baseAmount - discountAmount;

      // Add 10% tax
      const taxAmount = discountedAmount * 0.1;
      const totalWithTax = discountedAmount + taxAmount;

      // Create the reservation
      const result = await db
        .insert(reservations)
        .values({
          customerEmail: booking.customerEmail.toLowerCase(),
          firstName: booking.firstName,
          lastName: booking.lastName,
          numAdults: booking.numAdults,
          numChildren: booking.numChildren,
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          status: "Active",
          createdBy: "Clerk",
          isTravelCompany: true,
          travelCompanyName: booking.travelCompanyName,
        })
        .returning({ insertedId: reservations.id });

      // Create the bill with travel company discount
      await db.insert(bill).values({
        reservationId: result[0].insertedId,
        totalAmount: totalWithTax.toFixed(2),
      });

      // If payment method is cash, mark as paid
      if (booking.paymentMethod === "cash") {
        // Update bill status to paid
        await db
          .update(bill)
          .set({ status: "Payment Paid" })
          .where(eq(bill.reservationId, result[0].insertedId));
      }

      return {
        message: `Travel company bulk booking #${
          result[0].insertedId
        } created successfully with 15% discount. Total: $${totalWithTax.toFixed(
          2
        )}`,
      };
    }
  );
