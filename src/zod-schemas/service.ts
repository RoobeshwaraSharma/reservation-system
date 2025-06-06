import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { services, tickets } from "@/db/schema";
import { z } from "zod";

export const insertServiceSchema = createInsertSchema(services, {
  id: z.union([z.number(), z.literal("(New)")]),
  name: (schema) => schema.name.min(1, "Title is required"),
  chargePerPerson: () =>
    z.preprocess(
      (val) => (typeof val === "string" ? parseFloat(val) : val),
      z.number().min(0, "Charge per person must be a positive value")
    ),
});

export const selectTicketSchema = createSelectSchema(tickets);

export type insertServiceSchemaType = typeof insertServiceSchema._type;
