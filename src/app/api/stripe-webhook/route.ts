// /app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { bill, payments } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Webhook Event Received:", event.type, session);

    const billId = session.metadata?.billId;
    const amount = session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : "0";

    if (billId) {
      // First, insert the payment record into the payments table
      await db.insert(payments).values({
        billId: parseInt(billId),
        amount,
        paymentMethod: session.payment_method_types[0],
        paymentStatus: "succeeded", // Stripe payment succeeded
        paymentDate: new Date(),
      });

      // Then, update the status of the bill to 'Payment Paid'
      await db
        .update(bill)
        .set({
          status: "Payment Paid", // Set the bill status to 'Payment Paid'
        })
        .where(eq(bill.id, parseInt(billId)));
    }
  }

  return NextResponse.json({ received: true });
}
