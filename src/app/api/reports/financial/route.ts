import { NextResponse } from "next/server";
import { db } from "@/db";
import { bill, payments, reservationServices, reservations } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get total revenue from all bills
    const totalRevenueResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${bill.totalAmount}), 0)` })
      .from(bill);
    const totalRevenue = parseFloat(totalRevenueResult[0].total.toString());

    // Get room revenue (bills for completed reservations)
    const roomRevenueResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${bill.totalAmount}), 0)` })
      .from(bill)
      .innerJoin(reservations, eq(bill.reservationId, reservations.id))
      .where(eq(reservations.status, "Completed"));
    const roomRevenue = parseFloat(roomRevenueResult[0].total.toString());

    // Get service revenue
    const serviceRevenueResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${reservationServices.totalCharge}), 0)`,
      })
      .from(reservationServices);
    const serviceRevenue = parseFloat(serviceRevenueResult[0].total.toString());

    // Get pending payments
    const pendingPaymentsResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${bill.totalAmount}), 0)` })
      .from(bill)
      .where(eq(bill.status, "Payment Pending"));
    const pendingPayments = parseFloat(
      pendingPaymentsResult[0].total.toString()
    );

    // Get completed payments
    const completedPaymentsResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${payments.amount}), 0)` })
      .from(payments)
      .where(eq(payments.paymentStatus, "succeeded"));
    const completedPayments = parseFloat(
      completedPaymentsResult[0].total.toString()
    );

    // Calculate average room rate
    const avgRoomRateResult = await db
      .select({ avg: sql<number>`COALESCE(AVG(${bill.totalAmount}), 0)` })
      .from(bill);
    const averageRoomRate = parseFloat(avgRoomRateResult[0].avg.toString());

    return NextResponse.json({
      totalRevenue,
      roomRevenue,
      serviceRevenue,
      pendingPayments,
      completedPayments,
      averageRoomRate,
    });
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial data" },
      { status: 500 }
    );
  }
}
