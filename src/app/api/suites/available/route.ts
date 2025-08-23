import { NextResponse } from "next/server";
import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get all available suites
    const availableSuites = await db
      .select({
        id: rooms.id,
        roomNumber: rooms.roomNumber,
        roomType: rooms.roomType,
        bedType: rooms.bedType,
        maxOccupants: rooms.maxOccupants,
        maxChildren: rooms.maxChildren,
        status: rooms.status,
        ratePerNight: rooms.ratePerNight,
        ratePerWeek: rooms.ratePerWeek,
        ratePerMonth: rooms.ratePerMonth,
      })
      .from(rooms)
      .where(eq(rooms.roomType, "Suite"));

    // Filter to only available suites
    const filteredSuites = availableSuites.filter(
      (suite) => suite.status === "Available"
    );

    return NextResponse.json(filteredSuites);
  } catch (error) {
    console.error("Error fetching available suites:", error);
    return NextResponse.json(
      { error: "Failed to fetch available suites" },
      { status: 500 }
    );
  }
}
