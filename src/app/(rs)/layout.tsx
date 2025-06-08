import { Header } from "@/components/Header";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function RSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getPermission } = getKindeServerSession();
  const employeePermission = await getPermission("employee");

  const isEmployee = employeePermission?.isGranted;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <Header isCustomer={!isEmployee} />
      <div className="px-4 py-2">{children}</div>
    </div>
  );
}
