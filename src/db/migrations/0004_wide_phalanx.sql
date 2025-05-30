ALTER TABLE "reservations" ALTER COLUMN "num_adults" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "num_children" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "max_occupants" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "max_children" DROP NOT NULL;