import { Backbutton } from "@/components/BackButton";
import ReservationRoomDetails from "./ReservationRoomDetails";
import { getReservation } from "@/lib/quaries/getReservation";
import ReservationRoomstable from "./ReservationRoomsTable";
import { getRoomsForReservation } from "@/lib/quaries/getReservedRooms";

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
  const reservedRooms = await getRoomsForReservation(parseInt(reservationId));
  return (
    <>
      <ReservationRoomDetails
        reservation={reservation}
        roomCount={reservedRooms.length}
      />
      <div className="mt-4 text-center">
        {reservedRooms.length ? (
          <ReservationRoomstable data={reservedRooms} />
        ) : (
          <p>Assigned Rooms Not Found</p>
        )}
      </div>
    </>
  );
}
