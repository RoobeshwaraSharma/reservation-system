import { TravelCompanyBulkBookingForm } from "./TravelCompanyBulkBookingForm";

export default async function TravelCompanyPage() {
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
