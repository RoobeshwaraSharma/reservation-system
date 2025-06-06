import { db } from "@/db";
import { services } from "@/db/schema";
import { ilike } from "drizzle-orm"; // Importing necessary functions

export async function getServices() {
  const servicesData = await db.select().from(services);

  return servicesData;
}

export async function getSearchServices(searchText: string) {
  const searchPattern = `%${searchText.toLowerCase()}%`; // Creating the search pattern

  const servicesData = await db
    .select()
    .from(services)
    .where(ilike(services.name, searchPattern));

  return servicesData;
}

export type ServicesType = Awaited<ReturnType<typeof getServices>>;
