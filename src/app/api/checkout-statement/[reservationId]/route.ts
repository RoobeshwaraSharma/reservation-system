import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  reservations,
  bill,
  payments,
  reservationServices,
  services,
  reservationRooms,
  rooms,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const { reservationId: reservationIdStr } = await params;
    const reservationId = parseInt(reservationIdStr);

    if (isNaN(reservationId)) {
      return NextResponse.json(
        { error: "Invalid reservation ID" },
        { status: 400 }
      );
    }

    // Get reservation details
    const reservation = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, reservationId))
      .limit(1);

    if (!reservation[0]) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Get bill details
    const billDetails = await db
      .select()
      .from(bill)
      .where(eq(bill.reservationId, reservationId))
      .limit(1);

    // Get payment details
    const paymentDetails = await db
      .select()
      .from(payments)
      .innerJoin(bill, eq(payments.billId, bill.id))
      .where(eq(bill.reservationId, reservationId));

    // Get service details
    const serviceDetails = await db
      .select({
        serviceName: services.name,
        chargePerPerson: services.chargePerPerson,
        totalCharge: reservationServices.totalCharge,
        assignDate: reservationServices.assignDate,
      })
      .from(reservationServices)
      .innerJoin(services, eq(reservationServices.serviceId, services.id))
      .where(eq(reservationServices.reservationId, reservationId));

    // Get room details
    const roomDetails = await db
      .select({
        roomNumber: rooms.roomNumber,
        roomType: rooms.roomType,
        bedType: rooms.bedType,
        ratePerNight: rooms.ratePerNight,
        assignedDate: reservationRooms.assignedDate,
        checkInTime: reservationRooms.checkInTime,
        checkOutTime: reservationRooms.checkOutTime,
      })
      .from(reservationRooms)
      .innerJoin(rooms, eq(reservationRooms.roomId, rooms.id))
      .where(eq(reservationRooms.reservationId, reservationId));

    // Calculate totals
    const totalPaid = paymentDetails.reduce((sum, payment) => {
      return sum + parseFloat(payment.payments.amount.toString());
    }, 0);

    const totalServices = serviceDetails.reduce((sum, service) => {
      return sum + parseFloat(service.totalCharge?.toString() || "0");
    }, 0);

    const billAmount = billDetails[0]
      ? parseFloat(billDetails[0].totalAmount?.toString() || "0")
      : 0;
    const balance = billAmount - totalPaid;

    // Generate statement
    const statement = {
      reservationId: reservation[0].id,
      customerName: `${reservation[0].firstName} ${reservation[0].lastName}`,
      customerEmail: reservation[0].customerEmail,
      checkInDate: reservation[0].checkInDate,
      checkOutDate: reservation[0].checkOutDate,
      status: reservation[0].status,
      isTravelCompany: reservation[0].isTravelCompany,
      travelCompanyName: reservation[0].travelCompanyName,

      // Room details
      rooms: roomDetails,

      // Service details
      services: serviceDetails,

      // Financial summary
      billAmount: billAmount.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      balance: balance.toFixed(2),
      totalServices: totalServices.toFixed(2),

      // Payment history
      payments: paymentDetails.map((payment) => ({
        amount: payment.payments.amount,
        paymentMethod: payment.payments.paymentMethod,
        paymentStatus: payment.payments.paymentStatus,
        paymentDate: payment.payments.paymentDate,
      })),

      // Statement metadata
      generatedAt: new Date().toISOString(),
      statementNumber: `STMT-${reservationId}-${Date.now()}`,
    };

    return NextResponse.json(statement);
  } catch (error) {
    console.error("Error generating checkout statement:", error);
    return NextResponse.json(
      { error: "Failed to generate checkout statement" },
      { status: 500 }
    );
  }
}
