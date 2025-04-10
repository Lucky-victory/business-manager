import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sales } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { IS_DEV } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { saleId: string } }
) {
  try {
    const saleId = params.saleId;
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const sale = await db.query.sales.findFirst({
      where: (sales, { eq, and }) =>
        and(eq(sales.id, saleId), eq(sales.userId, authSession?.user?.id)),
    });
    if (!sale) {
      return NextResponse.json(
        { error: "Sale not found", data: null, message: "Sale not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { data: sale, message: "Sale retrieved successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to get sale",
        message: IS_DEV ? error?.message : "Failed to get sale",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { saleId: string } }
) {
  try {
    const saleId = params.saleId;
    const body = await request.json();
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const existingSale = await db.query.sales.findFirst({
      where: (sales, { eq, and }) =>
        and(eq(sales.id, saleId), eq(sales.userId, authSession?.user?.id)),
    });
    if (!existingSale) {
      return NextResponse.json(
        { error: "Sale not found", data: null, message: "Sale not found" },
        { status: 404 }
      );
    }
    const updatedSale = await db.transaction(async (tx) => {
      await tx
        .update(sales)
        .set({
          ...body,
          date: new Date(body.date),
        })
        .where(
          and(eq(sales.id, saleId), eq(sales.userId, authSession?.user?.id))
        );
      return await tx.query.sales.findFirst({
        where: (sales, { eq, and }) =>
          and(eq(sales.id, saleId), eq(sales.userId, authSession?.user?.id)),
      });
    });

    return NextResponse.json(
      { data: updatedSale, message: "Sale status updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to update sale status",
        message: IS_DEV ? error?.message : "Failed to update sale status",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { saleId: string } }
) {
  try {
    const saleId = params.saleId;
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const existingSale = await db.query.sales.findFirst({
      where: (sales, { eq, and }) =>
        and(eq(sales.id, saleId), eq(sales.userId, authSession?.user?.id)),
    });
    if (!existingSale) {
      return NextResponse.json(
        { error: "Sale not found", data: null, message: "Sale not found" },
        { status: 404 }
      );
    }
    await db
      .delete(sales)
      .where(
        and(eq(sales.id, saleId), eq(sales.userId, authSession?.user?.id))
      );
    return NextResponse.json(
      { message: "Sale deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to delete sale",
        message: IS_DEV ? error?.message : "Failed to delete sale",
      },
      { status: 500 }
    );
  }
}
