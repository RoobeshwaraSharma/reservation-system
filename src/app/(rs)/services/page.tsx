import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ServiceSearch from "./ServiceSearch";
import ServicesTable from "./ServicesTable";
import { getSearchServices, getServices } from "@/lib/quaries/getServices";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Service Search",
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
