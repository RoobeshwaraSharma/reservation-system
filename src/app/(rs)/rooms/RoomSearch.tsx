import Form from "next/form";
import { Input } from "@/components/ui/input";
import SearchButton from "@/components/SearchButton";
import CreateRoom from "./CreateRoom";

export default function RoomSearch() {
  return (
    <Form action="/rooms" className="flex gap-2 items-center">
      <Input
        name="searchText"
        type="text"
        placeholder="Search Room"
        className="w-full"
        autoFocus
      />
      <SearchButton />
      <CreateRoom />
    </Form>
  );
}
