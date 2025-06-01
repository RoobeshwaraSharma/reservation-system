import Form from "next/form";
import { Input } from "@/components/ui/input";
import SearchButton from "@/components/SearchButton";

export default function ReservationCicoSearch() {
  return (
    <Form action="/cico" className="flex gap-2 items-center">
      <Input
        name="searchText"
        type="text"
        placeholder="Search Reservation"
        className="w-full"
        autoFocus
      />
      <SearchButton />
    </Form>
  );
}
