import { ArrowLeft, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchResults } from "./search-results";

export const MobileSearchPage = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  handleSearch,
  onBackToMain,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  isSearching: boolean;
  handleSearch: (e: React.FormEvent) => void;
  onBackToMain: () => void;
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={onBackToMain}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 h-10 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </form>
      </div>

      {searchQuery === "" ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium mb-2">Search your data</h3>
          <p className="text-muted-foreground">
            Enter a search term to find sales, credits, or expenses
          </p>
        </div>
      ) : searchResults.length === 0 && !isSearching ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try searching with different keywords
          </p>
        </div>
      ) : (
        <div className="overflow-auto flex-1">
          <SearchResults
            results={searchResults}
            isSearching={isSearching}
            onClear={() => {
              setSearchQuery("");
              onBackToMain();
            }}
          />
        </div>
      )}
    </div>
  );
};
