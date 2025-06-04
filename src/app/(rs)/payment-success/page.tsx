// /app/payment-success/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4 text-lg">
        Thank you for your payment for Reservation #{reservationId}.
      </p>
      <Link href={`/reservations/form?reservationId=${reservationId}`}>
        <Button>View Reservation</Button>
      </Link>
    </div>
  );
}
