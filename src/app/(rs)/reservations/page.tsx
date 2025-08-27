import { getReservationByEmail } from "@/lib/quaries/getReservationByEmail";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ReservationSearch from "./ReservationSearch";
import ReservationTable from "./ReservationTable";
import { getReservationSearchResults } from "@/lib/quaries/getReservationSearchResult";
import { getReservations } from "@/lib/quaries/getReservations";

export const metadata = {
  title: "Reservertion Search",
};

export default async function Tickets({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;
  const { getUser, getPermission } = getKindeServerSession();

  const employeePermission = await getPermission("employee");

  const customerEmail = (await getUser()).email;

  const isEmployee = employeePermission?.isGranted;

  // If employee, show all reservations regardless of search
  if (isEmployee) {
    const results = await getReservations();
    return (
      <>
        <ReservationSearch />
        {results.length ? (
          <ReservationTable data={results} />
        ) : (
          <p className="mt-4">No reservations found</p>
        )}
      </>
    );
  }

  // For customers, show only their reservations
  if (!searchText && customerEmail) {
    const results = await getReservationByEmail(customerEmail);
    return (
      <>
        <ReservationSearch />
        {results.length ? (
          <ReservationTable data={results} />
        ) : (
          <p className="mt-4">No reservations found</p>
        )}
      </>
    );
  }

  const results = await getReservationSearchResults(
    searchText ?? "",
    customerEmail ?? ""
  );

  return (
    <>
      <ReservationSearch />
      {results.length ? (
        <ReservationTable data={results} />
      ) : (
        <p className="mt-4">No results found</p>
      )}
    </>
  );
}
