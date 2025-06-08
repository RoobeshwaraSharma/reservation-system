import { db } from "@/db";
import { payments, bill } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPayments(reservationId: number) {
  const paymentDetails = await db
    .select({
      id: payments.id,
      billId: payments.billId,
      amount: payments.amount,
      paymentMethod: payments.paymentMethod,
      paymentStatus: payments.paymentStatus,
      paymentDate: payments.paymentDate,
    })
    .from(payments)
    .innerJoin(bill, eq(payments.billId, bill.id))
    .where(eq(bill.reservationId, reservationId));

  return paymentDetails;
}
