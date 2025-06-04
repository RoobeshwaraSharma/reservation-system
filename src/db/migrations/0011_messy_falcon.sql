CREATE TABLE "bill" (
	"bill_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"total_amount" numeric(10, 2),
	"status" varchar(20) DEFAULT 'Payment Pending' NOT NULL,
	"reservation_id" integer NOT NULL,
	CONSTRAINT "bill_reservation_id_unique" UNIQUE("reservation_id"),
	CONSTRAINT "bill_status_check" CHECK ("bill"."status" IN ('Payment Pending', 'Payment Paid'))
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"bill_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_status" varchar(20) DEFAULT 'Pending' NOT NULL,
	"payment_date" timestamp DEFAULT now(),
	CONSTRAINT "payment_status_check" CHECK ("payments"."payment_status" IN ('Pending', 'Completed', 'Failed', 'Refunded')),
	CONSTRAINT "payment_method_check" CHECK ("payments"."payment_method" IN ('Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Mobile Payment'))
);
--> statement-breakpoint
ALTER TABLE "bill" ADD CONSTRAINT "bill_reservation_id_reservations_reservation_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("reservation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_bill_id_bill_bill_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bill"("bill_id") ON DELETE no action ON UPDATE no action;