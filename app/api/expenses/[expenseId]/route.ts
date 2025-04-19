import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { expenses } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { IS_DEV } from "@/lib/utils";
import isEmpty from "just-is-empty";

export async function GET(
  request: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const expenseId = params.expenseId;

    const [expense] = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)));

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: expense, message: "Expense fetched successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch expense",
        message: IS_DEV ? error?.message : "Failed to fetch expense",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const expenseId = params.expenseId;
    const body = await request.json();

    // Check if expense exists and belongs to user
    const [existingExpense] = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)));

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      item: !isEmpty(body.item) ? body.item : existingExpense.item,
      amount: !isEmpty(body.amount) ? body.amount : existingExpense.amount,
      paymentType: !isEmpty(body.paymentType)
        ? body.paymentType
        : existingExpense.paymentType,
      category: !isEmpty(body.category)
        ? body.category
        : existingExpense.category,
      notes: !isEmpty(body.notes) ? body.notes : existingExpense.notes,
      date: !isEmpty(body.date) ? new Date(body.date) : existingExpense.date,
      updatedAt: new Date(),
    };

    // Update expense using transaction
    const updatedExpense = await db.transaction(async (tx) => {
      await tx
        .update(expenses)
        .set(updateData)
        .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)));

      return await tx.query.expenses.findFirst({
        where: (expenses, { eq, and }) =>
          and(eq(expenses.id, expenseId), eq(expenses.userId, userId)),
      });
    });

    return NextResponse.json(
      { data: updatedExpense, message: "Expense updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      {
        error: "Failed to update expense",
        message: IS_DEV ? error?.message : "Failed to update expense",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const expenseId = params.expenseId;

    // Check if expense exists and belongs to user
    const [existingExpense] = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)));

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Delete expense
    await db
      .delete(expenses)
      .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)));

    return NextResponse.json(
      { success: true, message: "Expense deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      {
        error: "Failed to delete expense",
        message: IS_DEV ? error?.message : "Failed to delete expense",
      },
      { status: 500 }
    );
  }
}
