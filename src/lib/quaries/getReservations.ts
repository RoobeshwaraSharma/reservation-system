import { db } from "@/db";
import { reservations, bill } from "@/db/schema";
import { desc, sql, eq } from "drizzle-orm";

export async function getReservations() {
  const reservation = await db
    .select({
      id: reservations.id,
      customerEmail: reservations.customerEmail,
      firstName: reservations.firstName,
      lastName: reservations.lastName,
      numAdults: reservations.numAdults,
      numChildren: reservations.numChildren,
      checkInDate: reservations.checkInDate,
      checkOutDate: reservations.checkOutDate,
      status: reservations.status,
      createdBy: reservations.createdBy,
      isTravelCompany: reservations.isTravelCompany,
      travelCompanyName: reservations.travelCompanyName,
      createdAt: reservations.createdAt,
      billTotalAmount: bill.totalAmount,
      billStatus: bill.status,
    })
    .from(reservations)
    .leftJoin(bill, eq(reservations.id, bill.reservationId))
    .orderBy(
      sql`CASE ${reservations.status}
          WHEN 'Active' THEN 1
          WHEN 'Inprogress' THEN 2
          WHEN 'Cancelled' THEN 4
          WHEN 'Completed' THEN 3
          WHEN 'No-show' THEN 5
          ELSE 5
        END`,
      desc(reservations.checkInDate)
    );

  return reservation;
}
