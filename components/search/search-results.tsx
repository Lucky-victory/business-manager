"use client";

import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import Link from "next/link";
import { useStore } from "@/lib/store";

type SearchResult = {
  id: string;
  type: "sale" | "credit";
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  path: string;
};

export function SearchResults({
  results,
  onClear,
  isSearching,
}: {
  results: SearchResult[];
  onClear: () => void;
  isSearching: boolean;
}) {
  const { formatCurrency } = useStore();
  const tabs = ["sales", "credit", "search"] as const;
  const [tabQueryState, setTabQueryState] = useQueryState(
    "tab",
    parseAsStringLiteral(tabs).withDefault("sales")
  );

  function handleClear() {
    setTabQueryState("sales");
    onClear();
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Search Results</h2>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        {isSearching ? (
          <div className="text-center py-10 text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            Searching data...
          </div>
        ) : (
          <>
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                // passHref
                className="mb-4 block"
                href={result.path}
              >
                <Card
                  key={`${result.type}-${result.id}`}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  // onClick={() => router.push(result.path)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{result.title}</h3>
                          <Badge
                            variant={
                              result.type === "sale" ? "default" : "secondary"
                            }
                          >
                            {result.type === "sale" ? "Sale" : "Credit"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(Number(result.amount))}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(result.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {results.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No results found. Try a different search term.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
