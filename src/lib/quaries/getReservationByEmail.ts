import { db } from "@/db";
import { reservations } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getReservationByEmail(email: string) {
  const results = await db
    .select({
      id: reservations.id,
      customerEmail: reservations.customerEmail,
      numAdults: reservations.numAdults,
      numChildren: reservations.numChildren,
      checkInDate: reservations.checkInDate,
      checkOutDate: reservations.checkOutDate,
      status: reservations.status,
      createdBy: reservations.createdBy,
    })
    .from(reservations)
    .where(eq(reservations.customerEmail, email))
    .orderBy(asc(reservations.checkInDate));

  return results;
}
