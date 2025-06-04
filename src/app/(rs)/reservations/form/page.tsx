import { Backbutton } from "@/components/BackButton";
import ReservationForm from "./ReservationForm";
import { getReservation } from "@/lib/quaries/getReservation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { reservationId } = await searchParams;

  if (reservationId) {
    return {
      title: `Edit Reservation #${reservationId}`,
    };
  } else {
    return {
      title: `New Reservation`,
    };
  }
}

export default async function ReservationFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { reservationId } = await searchParams;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // New reservation
  if (!reservationId) {
    return <ReservationForm isEditable={true} user={user} />;
  }

  // Edit reservation
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
      <ReservationForm
        reservation={reservation}
        isEditable={reservation.status === "Active"}
      />
    );
  }

  return null;
}
