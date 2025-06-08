// /app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { bill, payments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // ensure you're using the correct version
});

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

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

    const billId = session.metadata?.billId;
    const amount = session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : "0";

    if (!billId) {
      return NextResponse.json({ error: "Missing billId" }, { status: 400 });
    }

    const numericBillId = parseInt(billId);

    // 1. Insert new payment record
    await db.insert(payments).values({
      billId: numericBillId,
      amount,
      paymentMethod: session.payment_method_types?.[0] ?? "unknown",
      paymentStatus: "succeeded",
      paymentDate: new Date(),
    });

    // 2. Fetch bill total amount
    const [billRecord] = await db
      .select({ totalAmount: bill.totalAmount })
      .from(bill)
      .where(eq(bill.id, numericBillId));

    if (!billRecord) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    // 3. Sum all payments linked to this bill
    const [paymentSum] = await db
      .select({
        totalPaid: sql<number>`SUM(${payments.amount})`.as("totalPaid"),
      })
      .from(payments)
      .where(eq(payments.billId, numericBillId));

    const totalPaidNum = parseFloat(paymentSum?.totalPaid.toString() ?? "0");
    const totalAmountNum = parseFloat(billRecord.totalAmount!);

    // 4. Determine and update bill status
    const newStatus =
      totalPaidNum >= totalAmountNum ? "Payment Paid" : "Partial Payment";

    await db
      .update(bill)
      .set({ status: newStatus })
      .where(eq(bill.id, numericBillId));
  }

  return NextResponse.json({ received: true });
}
