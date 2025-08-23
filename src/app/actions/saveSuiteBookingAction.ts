"use server";

import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { bill, reservations, rooms, reservationRooms } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

const suiteBookingSchema = z
  .object({
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
    bookingType: z.enum(["weekly", "monthly"]),
    suiteId: z.coerce.number().min(1, "Suite selection is required"),
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

type SuiteBookingSchemaType = z.infer<typeof suiteBookingSchema>;

export const saveSuiteBookingAction = actionClient
  .metadata({ actionName: "saveSuiteBookingAction" })
  .schema(suiteBookingSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: booking,
    }: {
      parsedInput: SuiteBookingSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      // Check if suite is available
      const suite = await db
        .select()
        .from(rooms)
        .where(eq(rooms.id, booking.suiteId))
        .limit(1);

      if (!suite[0] || suite[0].status !== "Available") {
        throw new Error("Selected suite is not available");
      }

      if (suite[0].roomType !== "Suite") {
        throw new Error("Selected room is not a suite");
      }

      // Calculate number of weeks or months
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();

      let periodCount = 1;
      if (booking.bookingType === "weekly") {
        periodCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
      } else {
        periodCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 30));
      }

      // Get the appropriate rate
      const rate =
        booking.bookingType === "weekly"
          ? suite[0].ratePerWeek
          : suite[0].ratePerMonth;

      if (!rate) {
        throw new Error(
          `${
            booking.bookingType === "weekly" ? "Weekly" : "Monthly"
          } rate not set for this suite`
        );
      }

      const baseAmount = parseFloat(rate) * periodCount;

      // Add 10% tax
      const taxAmount = baseAmount * 0.1;
      const totalWithTax = baseAmount + taxAmount;

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
          isTravelCompany: false,
        })
        .returning({ insertedId: reservations.id });

      // Assign the suite to the reservation
      await db.insert(reservationRooms).values({
        reservationId: result[0].insertedId,
        roomId: booking.suiteId,
        assignedDate: new Date(),
      });

      // Create the bill
      await db.insert(bill).values({
        reservationId: result[0].insertedId,
        totalAmount: totalWithTax.toFixed(2),
      });

      // If payment method is cash, mark as paid
      if (booking.paymentMethod === "cash") {
        await db
          .update(bill)
          .set({ status: "Payment Paid" })
          .where(eq(bill.reservationId, result[0].insertedId));
      }

      return {
        message: `Suite booking #${
          result[0].insertedId
        } created successfully. ${periodCount} ${
          booking.bookingType === "weekly" ? "week(s)" : "month(s)"
        } at $${rate} per ${
          booking.bookingType
        }. Total: $${totalWithTax.toFixed(2)}`,
      };
    }
  );
