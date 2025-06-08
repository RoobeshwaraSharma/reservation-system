ALTER TABLE "bill" DROP CONSTRAINT "bill_status_check";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payment_method_check";--> statement-breakpoint
ALTER TABLE "bill" ADD CONSTRAINT "bill_status_check" CHECK ("bill"."status" IN ('Payment Pending', 'Payment Paid','Partial Payment'));--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payment_method_check" CHECK ("payments"."payment_method" IN (
        'card',
        'bank_transfer',
        'us_bank_account',
        'klarna',
        'paypal',
        'cashapp',
        'unknown'
      ));