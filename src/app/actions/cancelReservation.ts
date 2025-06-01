// /lib/actions/checkInReservation.ts

"use server";

import { db } from "@/db";
import { reservations } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

import {
  checkInReservationSchema,
  CheckInReservationSchemaType,
} from "@/zod-schemas/checkIn";
import { eq } from "drizzle-orm";

export const cancelReservation = actionClient
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
      // 1. Update reservation status
      await db
        .update(reservations)
        .set({
          status: "Cancelled",
        })
        .where(eq(reservations.id, reservationId));

      return {
        message: `Reservation #${reservationId} cancelled successfully.`,
      };
    }
  );
