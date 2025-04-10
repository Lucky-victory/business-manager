import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sales, credits, debtors } from "@/lib/db/schema";
import { like, eq, and } from "drizzle-orm";
import { format } from "date-fns";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { IS_DEV } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    if (!query) {
      return NextResponse.json({ results: [] });
    }
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }
    // Search in sales
    const salesResults = await db
      .select()
      .from(sales)
      .where(
        and(
          like(sales.item, `%${query}%`),
          eq(sales.userId, authSession?.user?.id)
        )
      )
      .orderBy(sales.date);

    // Search in credits and join with debtors to get names
    const creditResults = await db
      .select({
        credit: credits,
        debtor: debtors,
      })
      .from(credits)
      .leftJoin(debtors, eq(credits.debtorId, debtors.id))
      .where(
        and(
          like(debtors.name, `%${query}%`),
          eq(credits.userId, authSession?.user?.id)
        )
      )
      .orderBy(credits.date);

    // Format results
    const formattedSalesResults = salesResults.map((sale) => ({
      id: sale.id,
      type: "sale",
      title: sale.item,
      subtitle: `Quantity: ${sale.quantity}`,
      amount: Number(sale.amount),
      date: sale.date.toISOString(),
      path: `/sales/${format(sale.date, "yyyy-MM-dd")}`,
    }));

    const formattedCreditResults = creditResults.map(({ credit, debtor }) => ({
      id: credit.id,
      type: "credit",
      title: debtor?.name,
      subtitle:
        credit.type === "purchase"
          ? `Item: ${credit.item}`
          : `Payment: ${credit.paymentType}`,
      amount: Number(credit.amount),
      date: credit.date.toISOString(),
      path: `/credit/${credit.debtorId}`,
    }));

    return NextResponse.json({
      data: [...formattedSalesResults, ...formattedCreditResults],
      message: "Search results fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Search failed",
        message: IS_DEV ? error?.message : "Search failed",
      },
      { status: 500 }
    );
  }
}
