import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { SuiteBookingForm } from "./SuiteBookingForm";
import { SuiteAvailability } from "./SuiteAvailability";

export default async function SuitesPage() {
  // const { getPermission } = getKindeServerSession();
  // const employeePermission = await getPermission("employee");

  // if (!employeePermission?.isGranted) {
  //   redirect("/");
  // }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Suite Management</h1>
        <p className="text-muted-foreground mt-2">
          Book suites for weekly or monthly stays with special rates
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <SuiteBookingForm />
        <SuiteAvailability />
      </div>
    </div>
  );
}
