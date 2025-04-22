
"use client";

import { ProFeatureWrapper } from "@/components/ui/pro-feature-wrapper";
import { SalesList } from "@/components/sales/sales-list";
import { CreditList } from "@/components/credit/credit-list";
import { ExpensesList } from "@/components/expenses/expenses-list";
import { SearchComponent } from "@/components/search/search-component";

interface ContentWrapperProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ContentWrapper({
  activeTab,
  setActiveTab,
}: ContentWrapperProps) {
  const isSearchPage = activeTab === "search";

  return (
    <>
      <SearchComponent
        isSearchPage={isSearchPage}
        onClearSearch={() => setActiveTab("sales")}
      />

      {!isSearchPage && (
        <>
          {activeTab === "sales" && <SalesList />}

          {activeTab === "credit" && (
            <ProFeatureWrapper feature="credit">
              <CreditList />
            </ProFeatureWrapper>
          )}

          {activeTab === "expenses" && (
            <ProFeatureWrapper feature="expenses">
              <ExpensesList />
            </ProFeatureWrapper>
          )}
        </>
      )}
    </>
  );
}
