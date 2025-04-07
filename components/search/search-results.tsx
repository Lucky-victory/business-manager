"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type SearchResult = {
  id: string
  type: "sale" | "credit"
  title: string
  subtitle: string
  amount: number
  date: string
  path: string
}

export function SearchResults({
  results,
  onClear,
}: {
  results: SearchResult[]
  onClear: () => void
}) {
  const router = useRouter()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Search Results</h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <Card
            key={`${result.type}-${result.id}`}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => router.push(result.path)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{result.title}</h3>
                    <Badge variant={result.type === "sale" ? "default" : "secondary"}>
                      {result.type === "sale" ? "Sale" : "Credit"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${result.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(result.date), "MMM d, yyyy")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {results.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">No results found. Try a different search term.</div>
        )}
      </div>
    </div>
  )
}

