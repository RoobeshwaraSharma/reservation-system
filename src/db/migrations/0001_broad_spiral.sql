CREATE TABLE "reservation_rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"reservation_id" integer NOT NULL,
	"room_id" integer NOT NULL,
	"assigned_date" date,
	"check_in_time" timestamp,
	"check_out_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"reservation_id" serial PRIMARY KEY NOT NULL,
	"customer_email" varchar(100) NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"status" varchar(20) NOT NULL,
	"created_by" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "reservation_status_check" CHECK ("reservations"."status" IN ('Active', 'Cancelled', 'Completed', 'No-show')),
	CONSTRAINT "created_by_check" CHECK ("reservations"."created_by" IN ('Customer', 'Clerk'))
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"room_id" serial PRIMARY KEY NOT NULL,
	"room_number" varchar(10) NOT NULL,
	"room_type" varchar(20) NOT NULL,
	"status" varchar(20) NOT NULL,
	"rate_per_night" numeric(10, 2),
	"rate_per_week" numeric(10, 2),
	"rate_per_month" numeric(10, 2),
	CONSTRAINT "rooms_room_number_unique" UNIQUE("room_number"),
	CONSTRAINT "room_type_check" CHECK ("rooms"."room_type" IN ('Standard', 'Suite')),
	CONSTRAINT "room_status_check" CHECK ("rooms"."status" IN ('Available', 'Occupied', 'Maintenance'))
);
--> statement-breakpoint
ALTER TABLE "reservation_rooms" ADD CONSTRAINT "reservation_rooms_reservation_id_reservations_reservation_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("reservation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation_rooms" ADD CONSTRAINT "reservation_rooms_room_id_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("room_id") ON DELETE no action ON UPDATE no action;