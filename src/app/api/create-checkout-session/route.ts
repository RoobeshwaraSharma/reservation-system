// /app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { bill } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { reservationId } = await req.json();

  // Get bill by reservationId
  const result = await db
    .select()
    .from(bill)
    .where(eq(bill.reservationId, reservationId));

  const currentBill = result[0];
  if (!currentBill) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Reservation Bill #${currentBill.id}`,
          },
          unit_amount: parseFloat(currentBill.totalAmount as string) * 100, // in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?reservationId=${reservationId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reservations`,
    metadata: {
      reservationId: reservationId.toString(),
      billId: currentBill.id.toString(),
    },
  });

  return NextResponse.json({ url: session.url });
}
