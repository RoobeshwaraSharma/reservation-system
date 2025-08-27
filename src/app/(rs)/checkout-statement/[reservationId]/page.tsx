import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { CheckoutStatement } from "./CheckoutStatement";

export default async function CheckoutStatementPage({
  params,
}: {
  params: Promise<{ reservationId: string }>;
}) {
  const { reservationId } = await params;
  const { getPermission } = getKindeServerSession();
  const employeePermission = await getPermission("employee");
  const managerPermission = await getPermission("manager");

  // Managers should have all employee permissions plus additional features
  const hasEmployeeAccess =
    employeePermission?.isGranted || managerPermission?.isGranted;

  if (!hasEmployeeAccess) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Checkout Statement</h1>
        <p className="text-muted-foreground mt-2">
          Reservation #{reservationId}
        </p>
      </div>

      <CheckoutStatement reservationId={parseInt(reservationId)} />
    </div>
  );
}
