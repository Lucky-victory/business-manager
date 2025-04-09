// pages/credit/[debtorId]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CreditForm } from "@/components/credit/credit-form";
import { Toaster } from "@/components/ui/toaster";
import { CreditSummary } from "@/components/credit/credit-summary";
import { CreditTabs } from "@/components/credit/credit-tabs";
import { PageHeader } from "@/components/ui/page-header";

export default function CreditDetailPage({
  params,
}: {
  params: { debtorId: string };
}) {
  const router = useRouter();
  const _params = use<{ debtorId: string }>(params as any);
  const debtorId = _params.debtorId;

  const { credits, fetchCredits } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Filter credits for the selected debtor
  const debtorCredits = credits.filter(
    (credit) => credit.debtorId === debtorId
  );

  // Get debtor name
  // const debtorName =
  //   debtorCredits.length > 0 ? debtorCredits[0].debtorName : "Unknown Debtor";
  const debtorName = "Unknown Debtor";

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={debtorName}
        backButton={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <CreditSummary debtorCredits={debtorCredits} />

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/credit/${debtorId}/invoice`)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      <CreditTabs debtorCredits={debtorCredits} />

      <CreditForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        defaultDebtorId={debtorId}
        defaultDebtorName={debtorName}
      />

      <Toaster />
    </div>
  );
}
