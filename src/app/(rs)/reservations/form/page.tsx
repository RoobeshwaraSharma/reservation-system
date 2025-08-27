import { Backbutton } from "@/components/BackButton";
import ReservationForm from "./ReservationForm";
import { getReservation } from "@/lib/quaries/getReservation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

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
  const { getUser, getPermission } = getKindeServerSession();
  const user = await getUser();
  const employeePermission = await getPermission("employee");
  const managerPermission = await getPermission("manager");

  // Managers should have all employee permissions plus additional features
  const hasEmployeeAccess =
    employeePermission?.isGranted || managerPermission?.isGranted;

  if (!user) {
    redirect("/");
  }

  // New reservation
  if (!reservationId) {
    return (
      <ReservationForm
        isEditable={true}
        user={user}
        employeePermission={hasEmployeeAccess ?? false}
      />
    );
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
        reservation={reservation.reservations}
        isEditable={reservation.reservations.status === "Active"}
        employeePermission={hasEmployeeAccess ?? false}
        isPayOnline={reservation.bill?.status !== "Payment Paid"}
      />
    );
  }

  return null;
}
