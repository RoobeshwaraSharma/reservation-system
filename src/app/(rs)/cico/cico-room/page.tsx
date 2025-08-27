import { Backbutton } from "@/components/BackButton";
import ReservationRoomDetails from "./ReservationRoomDetails";
import { getReservation } from "@/lib/quaries/getReservation";
import ReservationRoomstable from "./ReservationRoomsTable";
import { getRoomsForReservation } from "@/lib/quaries/getReservedRooms";
import { getServicesForReservation } from "@/lib/quaries/getReservationServices";
import ReservationServiceTable from "./ReservationServicesTable";
import { getPayments } from "@/lib/quaries/getPayments";
import PaymentsTable from "./PaymentsTable";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { reservationId } = await searchParams;

  if (reservationId) {
    return {
      title: `Reserve Rooms for #${reservationId}`,
    };
  } else {
    return {
      title: `Invalid ReservationId`,
    };
  }
}

export default async function CheckInOutRservation({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { reservationId } = await searchParams;

  // Reservation is undefined
  if (!reservationId) {
    return (
      <>
        <h2 className="text-2xl mb-2">
          Reservation ID #{reservationId} not found
        </h2>
        <Backbutton title="Go Back" variant="default" />
      </>
    );
  }

  const reservation = await getReservation(parseInt(reservationId));

  if (!reservation) {
    return (
      <>
        <h2 className="text-2xl mb-2">
          Reservation ID #{reservationId} not found
        </h2>
        <Backbutton title="Go Back" variant="default" />
      </>
    );
  }

  const reservedRooms = await getRoomsForReservation(parseInt(reservationId));
  const reservedServices = await getServicesForReservation(
    parseInt(reservationId)
  );

  const payments = await getPayments(parseInt(reservationId));
  return (
    <>
      <ReservationRoomDetails
        reservation={reservation.reservations}
        roomCount={reservedRooms.length}
      />
      <div className="mt-4 text-center">
        {reservedRooms.length ? (
          <>
            <h1 className="font-bold">Assinged Rooms</h1>
            <ReservationRoomstable data={reservedRooms} />
          </>
        ) : (
          <p>Assigned Rooms Not Found</p>
        )}
      </div>

      <div className="mt-4 text-center">
        {reservedServices.length ? (
          <>
            <h1 className="font-bold">Assinged Services</h1>
            <ReservationServiceTable data={reservedServices} />
          </>
        ) : (
          <p>No Services Assigned</p>
        )}
      </div>

      <div className="mt-4 text-center">
        {payments.length ? (
          <>
            <h1 className="font-bold">Customer Payments</h1>
            <PaymentsTable data={payments} />
          </>
        ) : (
          <p>No Payments Found</p>
        )}
      </div>
    </>
  );
}
