CREATE TABLE "reservation_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"reservation_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	"assigned_date" timestamp DEFAULT now(),
	"total_charge" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "services" (
	"service_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"charge_per_person" numeric(10, 2),
	CONSTRAINT "services_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "reservation_services" ADD CONSTRAINT "reservation_services_reservation_id_reservations_reservation_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("reservation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation_services" ADD CONSTRAINT "reservation_services_service_id_services_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("service_id") ON DELETE no action ON UPDATE no action;