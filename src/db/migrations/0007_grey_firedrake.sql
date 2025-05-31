ALTER TABLE "reservations" ALTER COLUMN "customer_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "first_name" varchar(100);--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "last_name" varchar(100);