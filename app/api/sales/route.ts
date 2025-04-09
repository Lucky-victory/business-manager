import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { sales } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const authSession = await auth.api.getSession({ headers: await headers() });
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const allSales = await db.query.sales.findMany({
      orderBy: [desc(sales.date)],
      where: (sales, { eq }) => eq(sales.userId, authSession?.user?.id),
    });
    return NextResponse.json(
      { data: allSales, message: "Sales fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const saleId = body.id || uuidv4();
    const date = body.date ? new Date(body.date) : new Date();
    const authSession = await auth.api.getSession({ headers: await headers() });

    if (!authSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const newSale = {
      id: saleId,
      item: body.item,
      quantity: body.quantity,
      price: body.price,
      amount: body.amount,
      paymentType: body.paymentType,
      date,
      userId: authSession?.user?.id,
    };

    await db.insert(sales).values(newSale);

    return NextResponse.json(newSale, { status: 201 });
  } catch (error) {
    console.error("Failed to create sale:", error);
    return NextResponse.json(
      { error: "Failed to create sale" },
      { status: 500 }
    );
  }
}
