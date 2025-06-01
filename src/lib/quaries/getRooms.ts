import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAvailableRooms() {
  const roomsData = await db
    .select()
    .from(rooms)
    .where(eq(rooms.status, "Available"));

  return roomsData;
}
export type RoomsType = Awaited<ReturnType<typeof getAvailableRooms>>;
