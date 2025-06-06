import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getService(id: number) {
  const service = await db.select().from(services).where(eq(services.id, id));

  return service[0];
}
