import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import RoomSearch from "./RoomSearch";
import RoomTable from "./RoomTable";
import { getRooms, getSearchRooms } from "@/lib/quaries/getRooms";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Room Search",
};

export default async function Rooms({
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
