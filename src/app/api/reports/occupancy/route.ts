import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rooms, reservations, reservationRooms, bill } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "7");

    const occupancyData = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Get total rooms
      const totalRoomsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(rooms);
      const totalRooms = totalRoomsResult[0].count;

      // Get occupied rooms for this date
      const occupiedRoomsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(reservationRooms)
        .innerJoin(
          reservations,
          eq(reservationRooms.reservationId, reservations.id)
        )
        .where(
          and(
            gte(reservations.checkInDate, new Date(dateStr)),
            lte(reservations.checkOutDate, new Date(dateStr)),
            eq(reservations.status, "Inprogress")
          )
        );
      const occupiedRooms = occupiedRoomsResult[0].count;

      // Calculate revenue for this date
      const revenueResult = await db
        .select({ total: sql<number>`COALESCE(SUM(${bill.totalAmount}), 0)` })
        .from(bill)
        .innerJoin(reservations, eq(bill.reservationId, reservations.id))
        .where(
          and(
            gte(reservations.checkInDate, new Date(dateStr)),
            lte(reservations.checkOutDate, new Date(dateStr)),
            eq(reservations.status, "Inprogress")
          )
        );
      const revenue = parseFloat(revenueResult[0].total.toString());

      const occupancyRate =
        totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

      occupancyData.push({
        date: dateStr,
        totalRooms,
        occupiedRooms,
        occupancyRate: Math.round(occupancyRate * 100) / 100,
        revenue,
      });
    }

    return NextResponse.json(occupancyData);
  } catch (error) {
    console.error("Error fetching occupancy data:", error);
    return NextResponse.json(
      { error: "Failed to fetch occupancy data" },
      { status: 500 }
    );
  }
}
