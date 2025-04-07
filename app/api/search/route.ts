import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sales, credits, debtors } from "@/lib/db/schema"
import { like, eq } from "drizzle-orm"
import { format } from "date-fns"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    // Search in sales
    const salesResults = await db
      .select()
      .from(sales)
      .where(like(sales.item, `%${query}%`))
      .orderBy(sales.date)

    // Search in credits and join with debtors to get names
    const creditResults = await db
      .select({
        credit: credits,
        debtor: debtors,
      })
      .from(credits)
      .leftJoin(debtors, eq(credits.debtorId, debtors.id))
      .where(like(debtors.name, `%${query}%`))
      .orderBy(credits.date)

    // Format results
    const formattedSalesResults = salesResults.map((sale) => ({
      id: sale.id,
      type: "sale",
      title: sale.item,
      subtitle: `Quantity: ${sale.quantity}`,
      amount: Number(sale.amount),
      date: sale.date.toISOString(),
      path: `/sales/${format(sale.date, "yyyy-MM-dd")}`,
    }))

    const formattedCreditResults = creditResults.map(({ credit, debtor }) => ({
      id: credit.id,
      type: "credit",
      title: debtor.name,
      subtitle: credit.type === "purchase" ? `Item: ${credit.item}` : `Payment: ${credit.paymentType}`,
      amount: Number(credit.amount),
      date: credit.date.toISOString(),
      path: `/credit/${credit.debtorId}`,
    }))

    return NextResponse.json({
      results: [...formattedSalesResults, ...formattedCreditResults],
    })
  } catch (error) {
    console.error("Search failed:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

