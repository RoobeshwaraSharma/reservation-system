// /zod-schemas/checkInReservation.ts

import { z } from "zod";

export const checkInReservationSchema = z.object({
  reservationId: z.number().int().positive(),
});

export type CheckInReservationSchemaType = z.infer<
  typeof checkInReservationSchema
>;
