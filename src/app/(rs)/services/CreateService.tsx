"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateService() {
  const router = useRouter();
  return (
    <Button type="button" onClick={() => router.push("/services/form")}>
      New Service
    </Button>
  );
}
