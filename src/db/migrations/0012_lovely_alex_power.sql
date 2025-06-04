ALTER TABLE "payments" DROP CONSTRAINT "payment_status_check";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payment_method_check";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payment_status_check" CHECK ("payments"."payment_status" IN (
        'requires_payment_method',
        'requires_confirmation',
        'requires_action',
        'processing',
        'succeeded',
        'canceled',
        'failed'
      ));--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payment_method_check" CHECK ("payments"."payment_method" IN (
        'card',
        'bank_transfer',
        'us_bank_account',
        'klarna',
        'paypal',
        'cashapp'
      ));