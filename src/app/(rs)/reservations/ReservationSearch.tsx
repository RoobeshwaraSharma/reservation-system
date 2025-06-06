import Form from "next/form";
import { Input } from "@/components/ui/input";
import SearchButton from "@/components/SearchButton";
import CreateReservation from "./CreateReservation";

export default function ReservationSearch() {
  return (
    <Form action="/reservations" className="flex gap-2 items-center">
      <Input
        name="searchText"
        type="text"
        placeholder="Search Reservation"
        className="w-full"
        autoFocus
      />
      <SearchButton />
      <CreateReservation />
    </Form>
  );
}
