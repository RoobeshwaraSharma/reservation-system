import { Backbutton } from "@/components/BackButton";
import { getCustomer } from "@/lib/quaries/getCustomer";
import CustomerForm from "./customerForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId } = await searchParams;

  if (!customerId) return { title: "New Customer" };

  return { title: `Edit Customer #${customerId}` };
}

export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission("manager");
    const isManager = managerPermission?.isGranted;

    // customers/form/
    const { customerId } = await searchParams;
    //Edit customer form

    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));
      if (!customer) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Customer Id #{customerId} not found
            </h2>
            <Backbutton title="Go Back" variant="default" />
          </>
        );
      }
      console.log(customer);
      //Put customer form component
      return (
        <CustomerForm
          key={customerId}
          customer={customer}
          isManager={isManager}
        />
      );
    } else {
      // new customer form component
      return <CustomerForm key="new" isManager={isManager} />;
    }
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
  }
}
