ALTER TABLE "reservations" ADD COLUMN "num_adults" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "num_children" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "bed_type" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "max_occupants" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "max_children" integer NOT NULL;