import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { DailyOccupancyReport } from "./DailyOccupancyReport";
import { RoomStatusReport } from "./RoomStatusReport";
import { FinancialReport } from "./FinancialReport";

export default async function ReportsPage() {
  const { getPermission } = getKindeServerSession();
  const managerPermission = await getPermission("manager");

  if (!managerPermission?.isGranted) {
    redirect("/");
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Hotel Management Reports</h1>
        <p className="text-muted-foreground mt-2">
          View occupancy, revenue, and room status reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DailyOccupancyReport />
        <FinancialReport />
        <RoomStatusReport />
      </div>
    </div>
  );
}
