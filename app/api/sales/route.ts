import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sales } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { desc } from "drizzle-orm";
import { generateUUID, IS_DEV } from "@/lib/utils";

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
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch sales",
        message: IS_DEV ? error?.message : "Failed to fetch sales",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const saleId = body.id || generateUUID();
    const date = body.date ? new Date(body.date) : new Date();
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const newSale = {
      ...body,
      id: saleId,
      date,
      userId: authSession?.user?.id,
    };

    await db.insert(sales).values(newSale);

    return NextResponse.json(
      { data: newSale, message: "Sale created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to create sale",
        message: IS_DEV ? error?.message : "Failed to create sale",
      },
      { status: 500 }
    );
  }
}
