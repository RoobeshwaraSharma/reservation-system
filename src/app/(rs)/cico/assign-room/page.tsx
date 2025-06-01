import { Backbutton } from "@/components/BackButton";
import { getReservation } from "@/lib/quaries/getReservation";
import AssignRoomForm from "./AssignRoomForm";
import { getAvailableRooms } from "@/lib/quaries/getRooms";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { reservationId } = await searchParams;

  if (reservationId) {
    return {
      title: `Assign Room #${reservationId}`,
    };
  } else {
    return {
      title: `Invalid Reservation`,
    };
  }
}

export default async function AssignRoomFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { reservationId } = await searchParams;

  if (!reservationId) {
    return <p>Invalid Reservation Id</p>;
  }
  const availableRooms = await getAvailableRooms();

  if (reservationId) {
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
    return (
      <AssignRoomForm
        reservationId={parseInt(reservationId)}
        availableRooms={availableRooms}
      />
    );
  }

  return null;
}
