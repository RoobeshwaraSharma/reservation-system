import { getReservationByEmail } from "@/lib/quaries/getReservationByEmail";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ReservationSearch from "./ReservationSearch";
import ReservationTable from "./ReservationTable";
import { getReservationSearchResults } from "@/lib/quaries/getReservationSearchResult";
import CreateReservation from "./CreateReservation";

export const metadata = {
  title: "Reservertion Search",
};

export default async function Tickets({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;
  const { getUser } = getKindeServerSession();

  const customerEmail = (await getUser()).email;

  if (!searchText && customerEmail) {
    const results = await getReservationByEmail(customerEmail);
    return (
      <>
        <ReservationSearch />
        <div className="flex justify-center">
          <CreateReservation />
        </div>
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
      <CreateReservation />
      {results.length ? (
        <ReservationTable data={results} />
      ) : (
        <p className="mt-4">No results found</p>
      )}
    </>
  );
}
