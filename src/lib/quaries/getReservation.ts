import { db } from "@/db";
import { bill, reservations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getReservation(id: number) {
  const reservation = await db
    .select()
    .from(reservations)
    .leftJoin(bill, eq(reservations.id, bill.reservationId))
    .where(eq(reservations.id, id));

  return reservation[0];
}
