import { reservationServices } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base schema from DB
const baseSchema = createInsertSchema(reservationServices, {
  reservationId: (schema) =>
    schema.reservationId.min(1, "Reservation is required"),
  serviceId: (schema) => schema.serviceId.min(1, "Service is required"),
  totalCharge: () =>
    z.preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z.number().min(0, "Total charge must be a positive value").optional()
    ),
});

// Extended schema with frontend-only roomIdString
export const insertReservationServiceSchema = baseSchema.extend({
  serviceIdString: z.string().min(1, "Service selection is required"),
});

// Type for useForm
export type InsertReservationServiceSchemaType = z.infer<
  typeof insertReservationServiceSchema
>;
