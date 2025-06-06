import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  integer,
  text,
  numeric,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone").unique().notNull(),
  address1: varchar("address1").notNull(),
  address2: varchar("address2"),
  city: varchar("city").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zip: varchar("zip", { length: 10 }).notNull(),
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  title: varchar("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  tech: varchar("tech").notNull().default("unassigned"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Create relations
export const customersRelations = relations(customers, ({ many }) => ({
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  customers: one(customers, {
    fields: [tickets.customerId],
    references: [customers.id],
  }),
}));

// ROOMS TABLE
export const rooms = pgTable(
  "rooms",
  {
    id: serial("room_id").primaryKey(),
    roomNumber: varchar("room_number", { length: 10 }).unique().notNull(),
    roomType: varchar("room_type", { length: 20 }).notNull(),
    bedType: varchar("bed_type", { length: 20 }).notNull(), // e.g., 'Single', 'Double', 'Queen', 'King'
    maxOccupants: integer("max_occupants"), // e.g., 2, 4
    maxChildren: integer("max_children"), // e.g., 2, 4
    status: varchar("status", { length: 20 }).notNull(),
    ratePerNight: numeric("rate_per_night", { precision: 10, scale: 2 }),
    ratePerWeek: numeric("rate_per_week", { precision: 10, scale: 2 }),
    ratePerMonth: numeric("rate_per_month", { precision: 10, scale: 2 }),
  },
  (rooms) => [
    check("room_type_check", sql`${rooms.roomType} IN ('Standard', 'Suite')`),
    check(
      "room_status_check",
      sql`${rooms.status} IN ('Available', 'Occupied', 'Maintenance')`
    ),
  ]
);

// RESERVATIONS TABLE
export const reservations = pgTable(
  "reservations",
  {
    id: serial("reservation_id").primaryKey(),

    customerEmail: varchar("customer_email", { length: 100 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),

    numAdults: integer("num_adults").default(1),
    numChildren: integer("num_children").default(0),

    checkInDate: timestamp("check_in_date").notNull(),
    checkOutDate: timestamp("check_out_date").notNull(),

    status: varchar("status", { length: 20 }).notNull(),
    createdBy: varchar("created_by", { length: 20 }).notNull(),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    check(
      "reservation_status_check",
      sql`${table.status} IN ('Active', 'Cancelled', 'Completed', 'No-show','Inprogress')`
    ),
    check("created_by_check", sql`${table.createdBy} IN ('Customer', 'Clerk')`),
  ]
);

// RESERVATION ROOMS TABLE
export const reservationRooms = pgTable("reservation_rooms", {
  id: serial("id").primaryKey(),
  reservationId: integer("reservation_id")
    .notNull()
    .references(() => reservations.id),
  roomId: integer("room_id")
    .notNull()
    .references(() => rooms.id),
  assignedDate: timestamp("assigned_date"),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
});

// ROOM RELATIONS
export const roomsRelations = relations(rooms, ({ many }) => ({
  reservationRooms: many(reservationRooms),
}));

// RESERVATION ROOMS RELATIONS
export const reservationRoomsRelations = relations(
  reservationRooms,
  ({ one }) => ({
    reservation: one(reservations, {
      fields: [reservationRooms.reservationId],
      references: [reservations.id],
    }),
    room: one(rooms, {
      fields: [reservationRooms.roomId],
      references: [rooms.id],
    }),
  })
);

export const bill = pgTable(
  "bill",
  {
    id: serial("bill_id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }),
    status: varchar("status", { length: 20 })
      .notNull()
      .default("Payment Pending"),
    reservationId: integer("reservation_id")
      .notNull()
      .unique() // Ensures 1-to-1 relationship
      .references(() => reservations.id),
  },
  (bill) => [
    check(
      "bill_status_check",
      sql`${bill.status} IN ('Payment Pending', 'Payment Paid')`
    ),
  ]
);

export const reservationsRelations = relations(reservations, ({ one }) => ({
  bill: one(bill, {
    fields: [reservations.id],
    references: [bill.reservationId],
  }),
}));

export const payments = pgTable(
  "payments",
  {
    id: serial("payment_id").primaryKey(),

    billId: integer("bill_id")
      .notNull()
      .references(() => bill.id),

    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

    paymentMethod: varchar("payment_method", { length: 50 }).notNull(),

    paymentStatus: varchar("payment_status", { length: 30 }).notNull(),

    paymentDate: timestamp("payment_date").defaultNow(),
  },
  (payments) => [
    check(
      "payment_status_check",
      sql`${payments.paymentStatus} IN (
        'requires_payment_method',
        'requires_confirmation',
        'requires_action',
        'processing',
        'succeeded',
        'canceled',
        'failed'
      )`
    ),
    check(
      "payment_method_check",
      sql`${payments.paymentMethod} IN (
        'card',
        'bank_transfer',
        'us_bank_account',
        'klarna',
        'paypal',
        'cashapp'
      )`
    ),
  ]
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  bill: one(bill, {
    fields: [payments.billId],
    references: [bill.id],
  }),
}));

export const billsRelations = relations(bill, ({ one, many }) => ({
  reservation: one(reservations, {
    fields: [bill.reservationId],
    references: [reservations.id],
  }),
  payments: many(payments),
}));

export const services = pgTable("services", {
  id: serial("service_id").primaryKey(),
  name: varchar("name").unique().notNull(),
  chargePerPerson: numeric("charge_per_person", { precision: 10, scale: 2 }),
});

export const reservationServices = pgTable("reservation_services", {
  id: serial("id").primaryKey(),
  reservationId: integer("reservation_id")
    .notNull()
    .references(() => reservations.id),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id),
  assignDate: timestamp("assigned_date").defaultNow(),
  totalCharge: numeric("total_charge", { precision: 10, scale: 2 }),
});

// RELATION FROM RESERVATIONS TO RESERVATION SERVICES (MANY-TO-MANY THROUGH reservationServices)
export const reservationsServiceRelations = relations(
  reservations,
  ({ many }) => ({
    reservationServices: many(reservationServices), // Many services for a reservation
  })
);

// RELATION FROM SERVICES TO RESERVATION SERVICES (MANY-TO-MANY THROUGH reservationServices)
export const servicesRelations = relations(services, ({ many }) => ({
  reservationServices: many(reservationServices), // Many reservations for a service
}));

// RELATION FROM RESERVATION SERVICES TO BOTH RESERVATIONS AND SERVICES
export const reservationServicesRelations = relations(
  reservationServices,
  ({ one }) => ({
    reservation: one(reservations, {
      fields: [reservationServices.reservationId],
      references: [reservations.id],
    }),
    service: one(services, {
      fields: [reservationServices.serviceId],
      references: [services.id],
    }),
  })
);
