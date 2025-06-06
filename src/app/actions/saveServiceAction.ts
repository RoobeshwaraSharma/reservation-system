"use server";

import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { services } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  insertServiceSchema,
  insertServiceSchemaType,
} from "@/zod-schemas/service";

export const saveServiceAction = actionClient
  .metadata({ actionName: "saveServiceAction" })
  .schema(insertServiceSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: service,
    }: {
      parsedInput: insertServiceSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();
      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");

      // New service
      if (service.id === "(New)") {
        const result = await db
          .insert(services)
          .values({
            name: service.name,
            chargePerPerson: service.chargePerPerson
              ? String(service.chargePerPerson)
              : null,
          })
          .returning({ insertedId: services.id });

        return {
          message: `Service ID #${result[0].insertedId} created successfully`,
        };
      }

      // Update service
      const result = await db
        .update(services)
        .set({
          name: service.name,
          chargePerPerson: service.chargePerPerson
            ? service.chargePerPerson.toString()
            : null,
        })
        .where(eq(services.id, service.id!))
        .returning({ updatedId: services.id });

      return {
        message: `Service ID #${result[0].updatedId} updated successfully`,
      };
    }
  );
