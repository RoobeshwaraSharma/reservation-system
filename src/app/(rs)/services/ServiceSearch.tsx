import Form from "next/form";
import { Input } from "@/components/ui/input";
import SearchButton from "@/components/SearchButton";
import CreateService from "./CreateService";

export default function ServiceSearch() {
  return (
    <Form action="/services" className="flex gap-2 items-center">
      <Input
        name="searchText"
        type="text"
        placeholder="Search Service"
        className="w-full"
        autoFocus
      />
      <SearchButton />
      <CreateService />
    </Form>
  );
}
