import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { reservations } from "@/db/schema";
import { z } from "zod";

// Define enums matching DB constraints
export const reservationStatusEnum = z.enum([
  "Active",
  "Inprogress",
  "Cancelled",
  "Completed",
  "No-show",
]);
export const createdByEnum = z.enum(["Customer", "Clerk"]);

const baseInsertReservationSchema = createInsertSchema(reservations, {
  id: z.union([z.number(), z.literal("(New)")]),

  customerEmail: (schema) =>
    schema.customerEmail
      .min(1, "Email is required")
      .email("Invalid email address"),

  firstName: (schema) => schema.firstName.min(1, "First name is required"),
  lastName: (schema) => schema.lastName.min(1, "Last name is required"),

  numAdults: () => z.coerce.number().min(0).default(1),
  numChildren: () => z.coerce.number().min(0).default(0),
  checkInDate: () =>
    z.coerce.date({ errorMap: () => ({ message: "Invalid check-in date" }) }),
  checkOutDate: () =>
    z.coerce.date({ errorMap: () => ({ message: "Invalid check-out date" }) }),

  status: () => reservationStatusEnum,
  createdBy: () => createdByEnum,
});

// Add custom validation for date fields
export const insertReservationSchema = baseInsertReservationSchema.refine(
  (data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    return checkOut > checkIn;
  },
  {
    path: ["checkOutDate"],
    message: "Check-out date must be after check-in date",
  }
);

export const selectReservationSchema = createSelectSchema(reservations);

export type insertReservationSchemaType = typeof insertReservationSchema._type;
// Base type inferred from Zod schema
type BaseSelectReservationSchemaType = typeof selectReservationSchema._type;

export type selectReservationSchemaType = Omit<
  BaseSelectReservationSchemaType,
  "status" | "createdBy"
> & {
  status: z.infer<typeof reservationStatusEnum>;
  createdBy: z.infer<typeof createdByEnum>;
};
