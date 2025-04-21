"use client";

import type React from "react";

import { useEffect, useState, Fragment } from "react";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { ProFeatureBadge } from "@/components/ui/pro-feature-badge";
import {
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  BarChart3,
  Plus,
  Sparkles,
  HomeIcon,
  CreditCard,
  DollarSign,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { PlansModal } from "@/components/subscription/plans-modal";
import { cn } from "@/lib/utils";
import { PlanFeatures } from "@/lib/types/subscription";
import { MobileSearchPage } from "@/components/search/mobile-search-page";
import Link from "next/link";

// Extracted Mobile Search Page Component for better organization

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSearchPageOpen, setIsSearchPageOpen] = useState(false);
  const isMobile = useIsMobile();
  const {
    searchResults,
    searchSalesAndCredit,
    fetchUser,
    clearState,
    fetchExpenses,
  } = useStore();
  const auth = useAuth();
  const router = useRouter();
  const tabs = ["sales", "credit", "expenses", "search"] as const;
  const [tabQueryState, setTabQueryState] = useQueryState(
    "tab",
    parseAsStringLiteral(tabs).withDefault("sales")
  );
  const {
    isFeatureEnabled,
    setShowPlansModal,
    setFeatureClicked,
    fetchSubscriptionData,
  } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  useEffect(() => {
    fetchUser();
    fetchExpenses();
  }, [fetchUser, fetchExpenses]);

  useEffect(() => {
    // Close sidebar by default on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Handle search tab on mobile
  useEffect(() => {
    if (isMobile && tabQueryState === "search") {
      setIsSearchPageOpen(true);
    } else {
      setIsSearchPageOpen(false);
    }
  }, [tabQueryState, isMobile]);

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

  const navItems = [
    {
      id: "sales" as keyof PlanFeatures,
      label: "Sales",
      icon: <BarChart3 className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: "credit" as keyof PlanFeatures,
      label: "Credit",
      icon: <CreditCard className="h-5 w-5" />,
      enabled: isFeatureEnabled("credit"),
    },
    {
      id: "expenses" as keyof PlanFeatures,
      label: "Expenses",
      icon: <DollarSign className="h-5 w-5" />,
      enabled: isFeatureEnabled("expenses"),
    },
  ];

  // Filter sidebar items for mobile to prevent duplication with bottom tab bar
  const sidebarItems = isMobile
    ? [
        {
          id: "profile",
          label: "Profile Settings",
          icon: <Settings className="h-5 w-5" />,
          onClick: () => router.push("/profile"),
          enabled: true,
        },
        {
          id: "subscription",
          label: "Subscription Plans",
          icon: <Sparkles className="h-5 w-5" />,
          onClick: () => router.push("/plans"),
          enabled: true,
        },
      ]
    : navItems;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "bg-white relative dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-full z-30 transition-all duration-300",
          isMobile
            ? `fixed inset-y-0 left-0 w-64 transform ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `${sidebarOpen ? "w-64" : "w-20"} flex-shrink-0`
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <div
            className={cn(
              "flex items-center",
              !sidebarOpen && !isMobile && "justify-center w-full"
            )}
          >
            {sidebarOpen ? (
              <h1 className="font-bold text-xl">Dashboard</h1>
            ) : (
              !isMobile && <BarChart3 className="h-6 w-6" />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(!sidebarOpen && !isMobile && "hidden")}
          >
            {isMobile ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="py-4 px-2 space-y-3">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={tabQueryState === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start mb-1 py-4",
                !sidebarOpen && !isMobile && "justify-center px-2"
              )}
              onClick={() => {
                if (!item.enabled) {
                  setFeatureClicked(item.id as keyof PlanFeatures);
                  setShowPlansModal(true);
                  return;
                }

                if ("onClick" in item) {
                  item.onClick();
                } else {
                  setTabQueryState(item.id as any);
                }

                if (isMobile) setSidebarOpen(false);
              }}
            >
              {item.icon}
              {(sidebarOpen || isMobile) && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {!item.enabled && <ProFeatureBadge className="ml-auto" />}
                </>
              )}
            </Button>
          ))}
        </div>

        {/* Logout Button for Mobile */}
        {isMobile && (
          <div className="px-2 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="ml-2">Logout</span>
            </Button>
          </div>
        )}

        {/* User Profile Section - Only shown in Desktop or when sidebar open in mobile */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-800 p-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  !sidebarOpen && !isMobile && "justify-center px-2"
                )}
              >
                <Avatar className="h-8 w-8 border-2 border-emerald-100">
                  <AvatarImage
                    src={auth?.user?.image || ""}
                    alt="User Avatar"
                  />
                  <AvatarFallback className="bg-emerald-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {(sidebarOpen || isMobile) && (
                  <>
                    <span className="ml-3 truncate">
                      {auth?.user?.name || "User"}
                    </span>
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </>
                )}
              </Button>
            </PopoverTrigger>
            {/* Popover content - Only shown in Desktop */}
            {!isMobile && (
              <PopoverContent className="w-56 p-2" align="end">
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {auth?.user?.name || "User"}
                  </div>
                  <div className="px-2 py-1 text-xs text-muted-foreground truncate">
                    {auth?.user?.email || ""}
                  </div>
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left px-2 py-1.5"
                    asChild
                  >
                    <Link href="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left px-2 py-1.5"
                    asChild
                  >
                    <Link href="/plans">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Subscription Plans
                    </Link>
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
            )}
          </Popover>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden",
          isMobile ? "pb-16" : "" // Add bottom padding on mobile for the tab bar
        )}
      >
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-4 sticky top-0 z-20">
          <div className="flex items-center gap-4 w-full">
            {/* Mobile: Avatar to open sidebar, Desktop: Menu icon when sidebar is closed */}
            {(!sidebarOpen || isMobile) && (
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "icon"}
                onClick={() => setSidebarOpen(true)}
                className={isMobile ? "p-0" : ""}
              >
                {isMobile ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={auth?.user?.image || ""}
                      alt="User Avatar"
                    />
                    <AvatarFallback className="bg-emerald-600 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
            <h1 className="text-xl font-bold flex-1 truncate">
              {isSearchPageOpen
                ? "Search"
                : greetUser(auth?.user?.name?.split(" ")[0] || "there")}
            </h1>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="relative max-w-md hidden md:block flex-1"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4">
          {/* Mobile Search - only visible when not in search page */}
          {isMobile && !isSearchPageOpen && (
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 h-10 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}

          <div className="bg-white dark:bg-gray-950 rounded-lg p-4 shadow-sm h-full">
            {isSearchPageOpen ? (
              <MobileSearchPage
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                isSearching={isSearching}
                handleSearch={handleSearch}
                onBackToMain={() => {
                  setTabQueryState("sales");
                  setSearchQuery("");
                }}
              />
            ) : tabQueryState === "search" ? (
              <SearchResults
                results={searchResults}
                isSearching={isSearching}
                onClear={() => {
                  setIsSearching(false);
                  setSearchQuery("");
                  setTabQueryState("sales");
                }}
              />
            ) : tabQueryState === "sales" ? (
              <SalesList />
            ) : tabQueryState === "credit" ? (
              <CreditList />
            ) : (
              <ExpensesList />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 h-16 flex items-center justify-around z-20">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "flex-col h-full rounded-none relative",
                tabQueryState === item.id ? "bg-gray-100 dark:bg-gray-900" : ""
              )}
              onClick={() => {
                if (!item.enabled) {
                  setFeatureClicked(item.id);
                  setShowPlansModal(true);
                  return;
                }
                setTabQueryState(item.id as any);
              }}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
              {!item.enabled && (
                <span className="absolute top-2 right-2">
                  <ProFeatureBadge className="h-4 w-4" />
                </span>
              )}
            </Button>
          ))}
          <Button
            variant="ghost"
            className={cn(
              "flex-col h-full rounded-none",
              isSearchPageOpen ? "bg-gray-100 dark:bg-gray-900" : ""
            )}
            onClick={() => setTabQueryState("search")}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Button>
        </div>
      )}

      <PlansModal />
    </div>
  );
}
