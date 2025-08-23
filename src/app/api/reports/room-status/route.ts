import { NextResponse } from "next/server";
import { db } from "@/db";
import { rooms, reservations } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get total rooms
    const totalRoomsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(rooms);
    const totalRooms = totalRoomsResult[0].count;

    // Get available rooms
    const availableRoomsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(rooms)
      .where(eq(rooms.status, "Available"));
    const availableRooms = availableRoomsResult[0].count;

    // Get occupied rooms
    const occupiedRoomsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(rooms)
      .where(eq(rooms.status, "Occupied"));
    const occupiedRooms = occupiedRoomsResult[0].count;

    // Get maintenance rooms
    const maintenanceRoomsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(rooms)
      .where(eq(rooms.status, "Maintenance"));
    const maintenanceRooms = maintenanceRoomsResult[0].count;

    // Get upcoming bookings (next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingBookingsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reservations)
      .where(
        and(
          gte(reservations.checkInDate, today),
          lte(reservations.checkInDate, nextWeek),
          eq(reservations.status, "Active")
        )
      );
    const upcomingBookings = upcomingBookingsResult[0].count;

    // Calculate occupancy rate
    const occupancyRate =
      totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    return NextResponse.json({
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      upcomingBookings,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
    });
  } catch (error) {
    console.error("Error fetching room status data:", error);
    return NextResponse.json(
      { error: "Failed to fetch room status data" },
      { status: 500 }
    );
  }
}
