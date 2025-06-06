import { db } from "@/db";
import { rooms } from "@/db/schema";
import { ilike, or, sql, desc } from "drizzle-orm"; // Importing necessary functions

export async function getRooms() {
  const roomsData = await db.select().from(rooms);

  return roomsData;
}

export async function getSearchRooms(searchText: string) {
  const searchPattern = `%${searchText.toLowerCase()}%`; // Creating the search pattern

  const roomsData = await db
    .select()
    .from(rooms)
    .where(
      or(
        ilike(rooms.roomNumber, searchPattern),
        ilike(rooms.roomType, searchPattern),
        ilike(rooms.bedType, searchPattern),
        ilike(rooms.status, searchPattern),
        ilike(sql`CAST(${rooms.ratePerNight} AS TEXT)`, searchPattern) // Casting numeric ratePerNight to text and using ilike
      )
    )
    .orderBy(desc(rooms.roomNumber)); // Adjust ordering if necessary

  return roomsData;
}

export type RoomsType = Awaited<ReturnType<typeof getRooms>>;
