import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { credits } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateUUID, IS_DEV } from "@/lib/utils";

export async function GET() {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const allCredits = await db.query.credits.findMany({
      orderBy: [desc(credits.date)],
      where: (credits, { eq }) => eq(credits.userId, authSession?.user?.id),
    });

    return NextResponse.json(
      { data: allCredits, message: "Credits fetched successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch credit data",
        message: IS_DEV ? error?.message : "Failed to fetch credit data",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { debtorId, id: creditId = generateUUID() } = body;

    const date = body.date ? new Date(body.date) : new Date();

    // Create the credit entry
    const newCredit = {
      id: creditId,
      debtorId,
      type: body.type,
      item: body.type === "purchase" ? body.item : null,
      quantity: body.type === "purchase" ? body.quantity : null,
      price: body.type === "purchase" ? body.price : null,
      amount: body.amount,
      paymentType: body.type === "payment" ? body.paymentType : null,
      date,
      userId: authSession?.user?.id,
    };
    const debtor = await db.query.debtors.findFirst({
      where: (debtors, { eq }) => eq(debtors.id, debtorId),
    });
    if (!debtor) {
      throw new Error("Debtor not found");
    }
    const createdCredit = await db.transaction(async (tx) => {
      await tx.insert(credits).values(newCredit);

      return await tx.query.credits.findFirst({
        where: (credits, { eq, and }) =>
          and(
            eq(credits.id, creditId),
            eq(credits.userId, authSession?.user?.id)
          ),
      });
    });

    return NextResponse.json(
      { data: createdCredit, message: "Credit created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to create credit entry",
        message: IS_DEV ? error?.message : "Failed to create credit entry",
      },
      { status: 500 }
    );
  }
}
