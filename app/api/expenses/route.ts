import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { expenses } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and, sql } from "drizzle-orm";
import { generateUUID } from "@/lib/utils";
import {
  checkFeatureAccess,
  checkUsageLimits,
  incrementUsageCounter,
} from "@/lib/subscription/subscription-guard";

// GET handler to fetch expenses
export async function GET(request: NextRequest) {
  try {
    // Check if user has access to expenses feature
    const featureAccessCheck = await checkFeatureAccess(request, "expenses");
    if (featureAccessCheck) return featureAccessCheck;

    // Get the user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Get expenses for the user
    const userExpenses = await db.query.expenses.findMany({
      where: and(eq(expenses.userId, userId), eq(expenses.isDeleted, false)),
      orderBy: [desc(expenses.date)],
      limit,
      offset,
    });

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(expenses)
      .where(and(eq(expenses.userId, userId), eq(expenses.isDeleted, false)));

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: userExpenses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST handler to create a new expense
export async function POST(request: NextRequest) {
  try {
    // Check if user has access to expenses feature
    const featureAccessCheck = await checkFeatureAccess(request, "expenses");
    if (featureAccessCheck) return featureAccessCheck;

    // Check if user has reached their transaction limit
    const usageLimitCheck = await checkUsageLimits(request, "expenses");
    if (usageLimitCheck) return usageLimitCheck;

    // Get the user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate required fields
    const { item, amount, paymentType, date } = body;
    if (!item || !amount || !paymentType || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new expense
    const id = generateUUID();
    const now = new Date();
    const expenseDate = new Date(date);

    // Create a new expense
    await db.insert(expenses).values({
      id,
      userId,
      item,
      amount: amount.toString(),
      paymentType,
      category: body.category || null,
      notes: body.notes || null,
      date: expenseDate,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    });

    // Fetch the created expense
    const newExpense = await db.query.expenses.findFirst({
      where: eq(expenses.id, id),
    });

    // Increment the expenses usage counter
    await incrementUsageCounter(request, "expenses");

    return NextResponse.json(
      {
        message: "Expense created successfully",
        data: newExpense,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}

// PUT handler to update an expense
export async function PUT(request: NextRequest) {
  try {
    // Check if user has access to expenses feature
    const featureAccessCheck = await checkFeatureAccess(request, "expenses");
    if (featureAccessCheck) return featureAccessCheck;

    // Get the user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate required fields
    const { id, item, amount, paymentType, date } = body;
    if (!id || !item || !amount || !paymentType || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the expense exists and belongs to the user
    const existingExpense = await db.query.expenses.findFirst({
      where: and(
        eq(expenses.id, id),
        eq(expenses.userId, userId),
        eq(expenses.isDeleted, false)
      ),
    });

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Update the expense
    const now = new Date();
    const expenseDate = new Date(date);

    // Update the expense
    await db
      .update(expenses)
      .set({
        item,
        amount: amount.toString(),
        paymentType,
        category: body.category || null,
        notes: body.notes || null,
        date: expenseDate,
        updatedAt: now,
      })
      .where(eq(expenses.id, id));

    // Fetch the updated expense
    const updatedExpense = await db.query.expenses.findFirst({
      where: eq(expenses.id, id),
    });

    return NextResponse.json({
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// DELETE handler to soft delete an expense
export async function DELETE(request: NextRequest) {
  try {
    // Check if user has access to expenses feature
    const featureAccessCheck = await checkFeatureAccess(request, "expenses");
    if (featureAccessCheck) return featureAccessCheck;

    // Get the user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    // Check if the expense exists and belongs to the user
    const existingExpense = await db.query.expenses.findFirst({
      where: and(
        eq(expenses.id, id),
        eq(expenses.userId, userId),
        eq(expenses.isDeleted, false)
      ),
    });

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Soft delete the expense
    const now = new Date();
    await db
      .update(expenses)
      .set({
        isDeleted: true,
        deletedAt: now,
        updatedAt: now,
      })
      .where(eq(expenses.id, id));

    return NextResponse.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
