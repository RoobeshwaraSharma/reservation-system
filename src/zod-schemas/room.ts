import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { rooms } from "@/db/schema";
import { z } from "zod";

// Define enums matching DB constraints for rooms
export const roomTypeEnum = z.enum(["Standard", "Suite"]);
export const bedTypeEnum = z.enum(["Single", "Double", "Queen", "King"]);
export const roomStatusEnum = z.enum(["Available", "Occupied", "Maintenance"]);

// Base schema for insert
const baseInsertRoomSchema = createInsertSchema(rooms, {
  id: z.union([z.number(), z.literal("(New)")]),

  roomNumber: (schema) =>
    schema.roomNumber
      .min(1, "Room number is required")
      .max(10, "Room number is too long"),

  roomType: () => roomTypeEnum,
  bedType: () => bedTypeEnum,

  maxOccupants: () =>
    z.coerce.number().min(1, "Max occupants must be at least 1").default(1),
  maxChildren: () =>
    z.coerce.number().min(0, "Max children cannot be less than 0").default(0),

  status: () => roomStatusEnum,

  // Convert string values to numbers or null if not available
  ratePerNight: () =>
    z.preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z
        .number()
        .min(0, "Rate per night must be a positive value")
        .nullable()
        .optional()
    ),

  ratePerWeek: () =>
    z.preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z
        .number()
        .min(0, "Rate per week must be a positive value")
        .nullable()
        .optional()
    ),

  ratePerMonth: () =>
    z.preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z
        .number()
        .min(0, "Rate per month must be a positive value")
        .nullable()
        .optional()
    ),
});

// Add custom validation if needed
export const insertRoomSchema = baseInsertRoomSchema.refine(
  (data) => {
    // Custom validation: ensure rate per night, rate per week, and rate per month are not all empty
    return data.ratePerNight || data.ratePerWeek || data.ratePerMonth;
  },
  {
    path: ["ratePerNight", "ratePerWeek", "ratePerMonth"],
    message: "At least one rate (per night, week, or month) must be provided",
  }
);

export const selectRoomSchema = createSelectSchema(rooms);

// Export types for TypeScript inference
export type insertRoomSchemaType = typeof insertRoomSchema._type;
type BaseSelectRoomSchemaType = typeof selectRoomSchema._type;

export type selectRoomSchemaType = Omit<
  BaseSelectRoomSchemaType,
  "status" | "roomType" | "bedType"
> & {
  status: z.infer<typeof roomStatusEnum>;
  roomType: z.infer<typeof roomTypeEnum>;
  bedType: z.infer<typeof bedTypeEnum>;
};
