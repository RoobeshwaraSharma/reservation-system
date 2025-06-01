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
          WHEN 'Inprogress' THEN 2
          WHEN 'Cancelled' THEN 3
          WHEN 'Completed' THEN 4
          WHEN 'No-show' THEN 5
          ELSE 5
        END`,
      desc(reservations.checkInDate)
    );

  return reservation;
}
