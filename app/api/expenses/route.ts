import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { expenses } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { generateUUID, IS_DEV } from "@/lib/utils";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
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

    const allExpenses = await db.query.expenses.findMany({
      orderBy: [desc(expenses.date)],
      where: (expenses, { eq }) => eq(expenses.userId, authSession.user.id),
    });

    return NextResponse.json(
      { data: allExpenses, message: "Expenses fetched successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch expenses",
        message: IS_DEV ? error?.message : "Failed to fetch expenses",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const expenseId = body.id || generateUUID();

    const newExpense = {
      id: expenseId,
      userId: authSession.user.id,
      item: body.item,
      amount: body.amount,
      paymentType: body.paymentType,
      category: body.category || null,
      notes: body.notes || null,
      date: new Date(body.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdExpense = await db.transaction(async (tx) => {
      await tx.insert(expenses).values(newExpense);

      return await tx.query.expenses.findFirst({
        where: (expenses, { eq, and }) =>
          and(
            eq(expenses.id, expenseId),
            eq(expenses.userId, authSession.user.id)
          ),
      });
    });

    return NextResponse.json(
      { data: createdExpense, message: "Expense created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to create expense",
        message: IS_DEV ? error?.message : "Failed to create expense",
      },
      { status: 500 }
    );
  }
}
