import { Backbutton } from "@/components/BackButton";
import { getReservation } from "@/lib/quaries/getReservation";
import AssignServiceForm from "./AssignServiceForm";
import { getServices } from "@/lib/quaries/getServices";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { reservationId } = await searchParams;

  if (reservationId) {
    return {
      title: `Assign Service #${reservationId}`,
    };
  } else {
    return {
      title: `Invalid Service`,
    };
  }
}

export default async function AssignServiceFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { reservationId } = await searchParams;

  if (!reservationId) {
    return <p>Invalid Reservation Id</p>;
  }
  const services = await getServices();

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
      <AssignServiceForm
        reservationId={parseInt(reservationId)}
        services={services}
      />
    );
  }

  return null;
}
