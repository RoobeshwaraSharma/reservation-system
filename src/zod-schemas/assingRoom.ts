import { reservationRooms } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base schema from DB
const baseSchema = createInsertSchema(reservationRooms, {
  reservationId: (schema) =>
    schema.reservationId.min(1, "Reservation is required"),
  roomId: (schema) => schema.roomId.min(1, "Room is required"),
  assignedDate: (schema) => schema.assignedDate.optional(),
  checkInTime: (schema) => schema.checkInTime.optional(),
  checkOutTime: (schema) => schema.checkOutTime.optional(),
});

// Extended schema with frontend-only roomIdString
export const insertReservationRoomSchema = baseSchema.extend({
  roomIdString: z.string().min(1, "Room selection is required"),
});

// Type for useForm
export type InsertReservationRoomSchemaType = z.infer<
  typeof insertReservationRoomSchema
>;
