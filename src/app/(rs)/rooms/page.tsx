import RoomSearch from "./RoomSearch";
import RoomTable from "./RoomTable";
import { getRooms, getSearchRooms } from "@/lib/quaries/getRooms";

export const metadata = {
  title: "Room Search",
};

export default async function Rooms({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  if (!searchText) {
    const results = await getRooms();
    return (
      <>
        <RoomSearch />
        {results.length ? (
          <RoomTable data={results} />
        ) : (
          <p className="mt-4">No rooms found</p>
        )}
      </>
    );
  }

  const results = await getSearchRooms(searchText ?? "");

  return (
    <>
      <RoomSearch />
      {results.length ? (
        <RoomTable data={results} />
      ) : (
        <p className="mt-4">No results found</p>
      )}
    </>
  );
}
