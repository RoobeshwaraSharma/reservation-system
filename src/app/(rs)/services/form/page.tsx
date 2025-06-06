import { Backbutton } from "@/components/BackButton";
import ServiceForm from "./ServiceForm";
import { getService } from "@/lib/quaries/getService";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { serviceId } = await searchParams;

  if (serviceId) {
    return {
      title: `Edit Service #${serviceId}`,
    };
  } else {
    return {
      title: `New Service`,
    };
  }
}

export default async function ServiceFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { serviceId } = await searchParams;

  // New reservation
  if (!serviceId) {
    return <ServiceForm isEditable={true} />;
  }

  // Edit reservation
  if (serviceId) {
    const service = await getService(parseInt(serviceId));
    if (!service) {
      return (
        <>
          <h2 className="text-2xl mb-2">Room ID #{serviceId} not found</h2>
          <Backbutton title="Go Back" variant="default" />
        </>
      );
    }

    return <ServiceForm service={service} />;
  }

  return null;
}
