"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import {
  insertReservationServiceSchema,
  InsertReservationServiceSchemaType,
} from "@/zod-schemas/assingService";
import { saveAssignService } from "@/app/actions/saveAssignService";

type Props = {
  reservationId: number;
  services: {
    id: number;
    name: string;
    chargePerPerson: string | null;
  }[];
};

export default function AssignServiceForm({ reservationId, services }: Props) {
  const router = useRouter();

  const defaultValues: InsertReservationServiceSchemaType = {
    reservationId,
    serviceId: 0,
    serviceIdString: "empty",
  };

  const form = useForm<InsertReservationServiceSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertReservationServiceSchema),
    defaultValues,
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "serviceIdString" && value.serviceIdString) {
        form.setValue("serviceId", Number(value.serviceIdString));
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const {
    execute: executeSave,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveAssignService, {
    onSuccess({ data }) {
      toast.success(data?.message ?? "Service assigned successfully! 🎉");
      router.push(`cico-room?reservationId=${reservationId}`);
    },
    onError({ error }) {
      toast.error(`Service assignment failed. ${error ?? "Please try again."}`);
    },
  });

  const selectedServiceId = form.watch("serviceId");

  const selectedService = useMemo(() => {
    return services.find((service) => service.id === selectedServiceId);
  }, [selectedServiceId, services]);

  function onSubmit(data: InsertReservationServiceSchemaType) {
    console.log("Submitting");
    executeSave(data);
  }

  return (
    <div className="flex flex-col gap-2 sm:px-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">
          Assign Service for Reservation #{reservationId}
        </h2>
        <Button
          onClick={() => {
            router.push(`cico-room?reservationId=${reservationId}`);
          }}
          variant={"secondary"}
        >
          Back
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <SelectWithLabel<InsertReservationServiceSchemaType>
                nameInSchema="serviceIdString"
                fieldTitle="Select Service"
                data={[
                  { id: "empty", description: "-- Select a Service --" },
                  ...services.map((service) => ({
                    id: String(service.id),
                    description: `Service #${service.name}`,
                  })),
                ]}
              />
            </div>

            {selectedService && (
              <div className="flex flex-col gap-3 w-full max-w-sm bg-muted p-4 rounded-md">
                <p>
                  <strong>Room Type:</strong> {selectedService.name}
                </p>
                <p>
                  <strong>Rate/Per Person:</strong> $
                  {selectedService.chargePerPerson ?? "N/A"}
                </p>
              </div>
            )}
          </div>
          {/* ✅ These buttons must go INSIDE the <form> */}
          <div className="mt-6 flex gap-4">
            <Button
              type="submit"
              disabled={isSaving || selectedServiceId === 0}
              className="w-32"
              title="Assign Service"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" /> Saving
                </>
              ) : (
                "Assign Service"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset(defaultValues);
                resetSaveAction();
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
