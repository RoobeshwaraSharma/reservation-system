import ServiceSearch from "./ServiceSearch";
import ServicesTable from "./ServicesTable";
import { getSearchServices, getServices } from "@/lib/quaries/getServices";

export const metadata = {
  title: "Service Search",
};

export default async function Rooms({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  if (!searchText) {
    const results = await getServices();
    return (
      <>
        <ServiceSearch />
        {results.length ? (
          <ServicesTable data={results} />
        ) : (
          <p className="mt-4">No services found</p>
        )}
      </>
    );
  }

  const results = await getSearchServices(searchText ?? "");

  return (
    <>
      <ServiceSearch />
      {results.length ? (
        <ServicesTable data={results} />
      ) : (
        <p className="mt-4">No results found</p>
      )}
    </>
  );
}
