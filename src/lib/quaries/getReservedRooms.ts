import { db } from "@/db";
import { reservationRooms, rooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getRoomsForReservation(reservationId: number) {
  const roomDetails = await db
    .select({
      roomNumber: rooms.roomNumber,
      roomType: rooms.roomType,
      bedType: rooms.bedType,
      maxOccupants: rooms.maxOccupants,
      maxChildren: rooms.maxChildren,
      status: rooms.status,
      ratePerNight: rooms.ratePerNight,
      assignedDate: reservationRooms.assignedDate,
      checkInTime: reservationRooms.checkInTime,
      checkOutTime: reservationRooms.checkOutTime,
    })
    .from(reservationRooms)
    .innerJoin(rooms, eq(reservationRooms.roomId, rooms.id))
    .where(eq(reservationRooms.reservationId, reservationId));

  return roomDetails;
}
