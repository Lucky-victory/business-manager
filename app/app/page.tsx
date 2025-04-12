"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { SalesList } from "@/components/sales/sales-list";
import { CreditList } from "@/components/credit/credit-list";
import { SearchResults } from "@/components/search/search-results";
import { authClient } from "@/lib/auth-client";
import { parseAsStringLiteral, useQueryState } from "nuqs";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { searchResults, searchSalesAndCredit, fetchUser } = useStore();
  const { useSession } = authClient;
  const { data } = useSession();

  const tabs = ["sales", "credit", "search"] as const;
  const [tabQueryState, setTabQueryState] = useQueryState(
    "tab",
    parseAsStringLiteral(tabs).withDefault("sales")
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setTabQueryState("search");
      setIsSearching(true);
      searchSalesAndCredit(searchQuery).then(() => {
        setIsSearching(false);
      });
    } else {
      setIsSearching(false);
    }
  };
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-bold text-3xl">
          Hi, {data?.user?.name.split(" ")[0]}
        </span>
        <a
          href="/profile"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <span>Profile Settings</span>
        </a>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search sales or credit..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {tabQueryState === "search" ? (
        <SearchResults
          results={searchResults}
          isSearching={isSearching}
          onClear={() => {
            setIsSearching(false);
            setSearchQuery("");
          }}
        />
      ) : (
        <Tabs
          value={tabQueryState}
          onValueChange={(value) =>
            setTabQueryState(value as "sales" | "credit")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="credit">Credit</TabsTrigger>
          </TabsList>
          <TabsContent value="sales">
            <SalesList />
          </TabsContent>
          <TabsContent value="credit">
            <CreditList />
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
