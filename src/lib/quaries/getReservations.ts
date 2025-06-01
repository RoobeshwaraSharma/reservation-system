import { db } from "@/db";
import { reservations } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function getReservations() {
  const reservation = await db
    .select()
    .from(reservations)
    .orderBy(
      sql`CASE ${reservations.status}
          WHEN 'Active' THEN 1
          WHEN 'Cancelled' THEN 2
          WHEN 'Completed' THEN 3
          WHEN 'No-show' THEN 4
          ELSE 5
        END`,
      desc(reservations.checkInDate)
    );

  return reservation;
}
