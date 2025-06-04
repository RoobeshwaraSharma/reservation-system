"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateReservation() {
  const router = useRouter();
  return (
    <Button
      type="button"
      onClick={() => router.push("/reservations/form")}
      className="mt-3"
    >
      New Reservation
    </Button>
  );
}
