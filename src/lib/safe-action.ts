import { NeonDbError } from "@neondatabase/serverless";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleServerError(e, utils) {
    if (e.constructor.name === "NeonDbError") {
      const { code, detail } = e as NeonDbError;
      if (code === "23505") {
        // feedback displayed for user
        // not reported to Sentry
        return `Unique entry required. ${detail}`;
      }
    }

    const { clientInput, metadata } = utils;
    console.log("ClientInput", clientInput);
    console.log(metadata);
    if (e.constructor.name === "NeonDbError") {
      return "Database Error: Your data did not save. Support will be notified.";
    }
    return e.message;
  },
});
