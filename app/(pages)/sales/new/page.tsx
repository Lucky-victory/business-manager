"use client";
import { SalesForm } from "@/components/sales/sales-form";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  return (
    <>
      <SalesForm
        open={true}
        onOpenChange={() => {
          router.back();
        }}
      />
    </>
  );
}
