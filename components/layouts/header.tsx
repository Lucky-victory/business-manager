"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-client";
import { Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { greetUser } from "@/lib/utils";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  onSearch?: (query: string) => void;
}

export function Header({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  onSearch,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const auth = useAuth();
  const isMobile = useIsMobile();

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!auth?.user?.name) return "U";
    const names = auth.user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  const isSearchPage = activeTab === "search";

  return (
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
                <AvatarImage src={auth?.user?.image || ""} alt="User Avatar" />
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
          {isSearchPage
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
  );
}
