import { db } from "@/db";
import { reservationServices, services } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getServicesForReservation(reservationId: number) {
  const roomDetails = await db
    .select({
      serviceName: services.name,
      chargePerPerson: services.chargePerPerson,
      assignedDate: reservationServices.assignDate,
      totalCharge: reservationServices.totalCharge,
    })
    .from(reservationServices)
    .innerJoin(services, eq(reservationServices.serviceId, services.id))
    .where(eq(reservationServices.reservationId, reservationId));

  return roomDetails;
}
