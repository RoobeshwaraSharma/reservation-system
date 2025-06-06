"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  insertServiceSchema,
  insertServiceSchemaType,
} from "@/zod-schemas/service";
import { saveServiceAction } from "@/app/actions/saveServiceAction";

type Props = {
  service?: {
    id: number;
    name: string;
    chargePerPerson: string | null;
  };
  isEditable?: boolean;
};

export default function ServiceForm({ service, isEditable = true }: Props) {
  const router = useRouter();

  const defaultValues: insertServiceSchemaType = {
    id: service?.id ?? "(New)",
    name: service?.name ?? "",
    chargePerPerson: service?.chargePerPerson
      ? parseFloat(service.chargePerPerson)
      : 0.0,
  };

  const form = useForm<insertServiceSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertServiceSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveServiceAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast(`Success! 🎉 - ${data.message}`);
      }
    },
    onError({ error }) {
      toast(`Save Failed. Error: ${error}`);
    },
  });

  async function submitForm(data: insertServiceSchemaType) {
    executeSave(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResponse result={saveResult} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {service?.id && isEditable
            ? `Edit service #${service.id}`
            : service?.id
            ? `View service #${service.id}`
            : "New service Form"}
        </h2>
        <Button
          onClick={() => router.push("/services")}
          variant="secondary"
          className="mt-4 sm:mt-0"
        >
          Back
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 md:gap-8"
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InputWithLabel<insertServiceSchemaType>
              fieldTitle="Service Name"
              nameInSchema="name"
              disabled={!isEditable}
              placeholder="Pub"
            />
            <InputWithLabel<insertServiceSchemaType>
              fieldTitle="Charge Per Person"
              nameInSchema="chargePerPerson"
              type="number"
              disabled={!isEditable}
            />
            {isEditable && (
              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  className="w-3/4"
                  variant="default"
                  title="Save"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  title="Reset"
                  onClick={() => {
                    form.reset(defaultValues);
                    resetSaveAction();
                  }}
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
