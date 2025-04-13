"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SalesList } from "@/components/sales/sales-list";
import { CreditList } from "@/components/credit/credit-list";
import { SearchResults } from "@/components/search/search-results";
import { authClient, useAuth } from "@/lib/auth-client";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { greetUser } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { searchResults, searchSalesAndCredit, fetchUser, clearState } =
    useStore();
  const auth = useAuth();
  const router = useRouter();
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

  function handleLogout() {
    authClient.signOut().then(() => {
      clearState();
      router.push("/");
    });
  }

  const userInitials = auth?.user?.name
    ? auth.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-bold text-3xl">
          {greetUser(auth?.user?.name.split(" ")[0] || "there")}
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={auth?.user?.image || ""} alt="User Avatar" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
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
