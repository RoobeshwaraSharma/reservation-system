import { db } from "@/db";
import { reservations, bill } from "@/db/schema";
import { eq, ilike, or, and, sql, asc } from "drizzle-orm";

export async function getReservationSearchResults(
  searchText: string,
  customerEmail: string
) {
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
      billTotalAmount: bill.totalAmount,
      billStatus: bill.status,
    })
    .from(reservations)
    .leftJoin(bill, eq(reservations.id, bill.reservationId))
    .where(
      and(
        eq(reservations.customerEmail, customerEmail),
        or(
          ilike(reservations.status, `%${searchText}%`),
          sql`${reservations.checkInDate}::text ilike ${`%${searchText}%`}`,
          sql`${reservations.checkOutDate}::text ilike ${`%${searchText}%`}`
        )
      )
    )
    .orderBy(asc(reservations.checkInDate));

  return results;
}

export type ReservationSearchResultsType = Awaited<
  ReturnType<typeof getReservationSearchResults>
>;
