import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getRoom(id: number) {
  const room = await db.select().from(rooms).where(eq(rooms.id, id));

  return room[0];
}
