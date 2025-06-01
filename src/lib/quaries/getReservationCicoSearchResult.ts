import { db } from "@/db";
import { reservations } from "@/db/schema";
import { desc, ilike, or, sql } from "drizzle-orm";

export async function getReservationCicoSearchResult(searchText: string) {
  const searchPattern = `%${searchText}%`;

  const reservation = await db
    .select()
    .from(reservations)
    .where(
      or(
        ilike(reservations.firstName, searchPattern),
        ilike(reservations.lastName, searchPattern),
        ilike(reservations.customerEmail, searchPattern),
        ilike(sql`CAST(${reservations.checkInDate} AS TEXT)`, searchPattern),
        ilike(sql`CAST(${reservations.checkOutDate} AS TEXT)`, searchPattern),
        ilike(reservations.status, searchPattern)
      )
    )
    .orderBy(desc(reservations.checkInDate));

  return reservation;
}

export type ReservationCicoSearchResultsType = Awaited<
  ReturnType<typeof getReservationCicoSearchResult>
>;
