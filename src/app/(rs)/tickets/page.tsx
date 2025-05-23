import TicketSearch from "@/app/(rs)/tickets/TicketSearch";
import { getOpenTickets } from "@/lib/quaries/getOpenTickets";
import { getTicketSearchResults } from "@/lib/quaries/getTicketSearchResults";
import TicketTable from "./TicketTable";

export const metadata = {
  title: "Ticket Search",
};

export default async function Tickets({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  if (!searchText) {
    const results = await getOpenTickets();
    return (
      <>
        <TicketSearch />
        {results.length ? (
          <TicketTable data={results} />
        ) : (
          <p className="mt-4">No open tickets found</p>
        )}
      </>
    );
  }

  const results = await getTicketSearchResults(searchText);

  return (
    <>
      <TicketSearch />
      {results.length ? (
        <TicketTable data={results} />
      ) : (
        <p className="mt-4">No results found</p>
      )}
    </>
  );
}
