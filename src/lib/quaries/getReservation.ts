import { db } from "@/db";
import { reservations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getReservation(id: number) {
  const reservation = await db
    .select()
    .from(reservations)
    .where(eq(reservations.id, id));

  return reservation[0];
}
