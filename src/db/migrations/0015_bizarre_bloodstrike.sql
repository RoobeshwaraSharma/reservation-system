ALTER TABLE "reservations" ADD COLUMN "is_travel_company" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "travel_company_name" varchar(100);