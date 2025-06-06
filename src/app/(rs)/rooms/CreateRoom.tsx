"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const router = useRouter();
  return (
    <Button type="button" onClick={() => router.push("/rooms/form")}>
      New Room
    </Button>
  );
}
