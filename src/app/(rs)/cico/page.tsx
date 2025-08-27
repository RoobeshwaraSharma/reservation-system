import { getReservationCicoSearchResult } from "@/lib/quaries/getReservationCicoSearchResult";
import { getReservations } from "@/lib/quaries/getReservations";
import ReservationCicoSearch from "./ReservationRoomSearch";
import ReservationCicoTable from "./ReservationRoomTable";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Reservation Room Search",
};

export default async function ReservationCico({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;
  const { getPermission } = getKindeServerSession();
  const employeePermission = await getPermission("employee");
  const managerPermission = await getPermission("manager");

  // Managers should have all employee permissions plus additional features
  const hasEmployeeAccess =
    employeePermission?.isGranted || managerPermission?.isGranted;

  if (!hasEmployeeAccess) {
    redirect("/");
  }

  if (!searchText) {
    const results = await getReservations();
    return (
      <>
        <ReservationCicoSearch />
        {results.length ? (
          <ReservationCicoTable data={results} />
        ) : (
          <p className="mt-4">No Reservations found</p>
        )}
      </>
    );
  }

  const results = await getReservationCicoSearchResult(searchText ?? "");

  return (
    <>
      <ReservationCicoSearch />
      {results.length ? (
        <ReservationCicoTable data={results} />
      ) : (
        <p className="mt-4">No results found</p>
      )}
    </>
  );
}
