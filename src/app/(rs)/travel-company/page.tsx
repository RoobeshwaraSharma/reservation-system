import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { TravelCompanyBulkBookingForm } from "./TravelCompanyBulkBookingForm";

export default async function TravelCompanyPage() {
  const { getPermission } = getKindeServerSession();
  const employeePermission = await getPermission("employee");

  if (!employeePermission?.isGranted) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Travel Company Bulk Booking</h1>
        <p className="text-muted-foreground mt-2">
          Create bulk reservations for travel companies with 15% discount
        </p>
      </div>

      <TravelCompanyBulkBookingForm />
    </div>
  );
}
