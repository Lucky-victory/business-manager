"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Search, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SalesList } from "@/components/sales/sales-list";
import { CreditList } from "@/components/credit/credit-list";
import { ExpensesList } from "@/components/expenses/expenses-list";
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
  const tabs = ["sales", "credit", "expenses", "search"] as const;
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

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!auth?.user?.name) return "U";
    const names = auth.user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <header className="mb-8 flex items-center justify-between bg-white dark:bg-gray-950 py-3 px-1 rounded-lg shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold">
          {greetUser(auth?.user?.name?.split(" ")[0] || "there")}
        </h1>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-10 px-3"
            >
              <Avatar className="h-8 w-8 border-2 border-emerald-100">
                <AvatarImage src={auth?.user?.image || ""} alt="User Avatar" />

                <AvatarFallback className="bg-emerald-600 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">My Account</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-sm font-medium">
                {auth?.user?.name || "User"}
              </div>
              <div className="px-2 py-1 text-xs text-muted-foreground">
                {auth?.user?.email || ""}
              </div>
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left px-2 py-1.5"
                onClick={() => router.push("/profile")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left px-2 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </header>

      <form onSubmit={handleSearch} className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search sales, credit, or expenses..."
          className="pl-10 h-11 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="bg-white dark:bg-gray-950 rounded-lg p-4 shadow-sm">
        {tabQueryState === "search" ? (
          <SearchResults
            results={searchResults}
            isSearching={isSearching}
            onClear={() => {
              setIsSearching(false);
              setSearchQuery("");
              setTabQueryState("sales");
            }}
          />
        ) : (
          <Tabs
            value={tabQueryState}
            onValueChange={(value) =>
              setTabQueryState(value as "sales" | "credit" | "expenses")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="pt-2">
              <SalesList />
            </TabsContent>
            <TabsContent value="credit" className="pt-2">
              <CreditList />
            </TabsContent>
            <TabsContent value="expenses" className="pt-2">
              <ExpensesList />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
