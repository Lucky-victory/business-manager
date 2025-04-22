// components/search/SearchComponent.tsx
"use client";

import { useState, FormEvent } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchResults } from "@/components/search/search-results";
import { MobileSearchPage } from "@/components/search/mobile-search-page";
import { useStore } from "@/lib/store";

interface SearchComponentProps {
  isSearchPage: boolean;
  onClearSearch?: () => void;
}

export function SearchComponent({
  isSearchPage,
  onClearSearch,
}: SearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { searchResults, searchSalesAndCredit } = useStore();
  const isMobile = useIsMobile();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      searchSalesAndCredit(searchQuery).then(() => {
        setIsSearching(false);
      });
    } else {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setIsSearching(false);
    setSearchQuery("");
    if (onClearSearch) onClearSearch();
  };

  // For mobile: Show search bar if not in search page
  if (isMobile && !isSearchPage) {
    return (
      <form onSubmit={handleSearch} className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search..."
          className="pl-10 h-10 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
    );
  }

  // For search page
  if (isSearchPage) {
    if (isMobile) {
      return (
        <MobileSearchPage
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          handleSearch={handleSearch}
          onBackToMain={handleClear}
        />
      );
    }

    return (
      <SearchResults
        results={searchResults}
        isSearching={isSearching}
        onClear={handleClear}
      />
    );
  }

  return null;
}
