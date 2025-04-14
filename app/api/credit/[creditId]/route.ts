import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { credits } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { IS_DEV } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: { creditId: string } }
) {
  try {
    const creditId = await params.creditId;
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
    const existingCredit = await db.query.credits.findFirst({
      where: (credits, { eq, and }) =>
        and(
          eq(credits.id, creditId),
          eq(credits.userId, authSession?.user?.id)
        ),
    });
    if (!existingCredit) {
      return NextResponse.json(
        { error: "Credit not found", data: null, message: "Credit not found" },
        { status: 404 }
      );
    }
    const updatedCredit = await db.transaction(async (tx) => {
      await tx
        .update(credits)
        .set({
          isPaid: body.isPaid,
          paidDate: body.isPaid ? new Date(body.paidDate || new Date()) : null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(credits.id, creditId),
            eq(credits.userId, authSession?.user?.id)
          )
        );
      return await tx.query.credits.findFirst({
        where: (credits, { eq, and }) =>
          and(
            eq(credits.id, creditId),
            eq(credits.userId, authSession?.user?.id)
          ),
      });
    });

    return NextResponse.json(
      { data: updatedCredit, message: "Credit status updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to update credit status",
        message: IS_DEV ? error?.message : "Failed to update credit status",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { creditId: string } }
) {
  try {
    const creditId = await params.creditId;
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", data: null, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const existingCredit = await db.query.credits.findFirst({
      where: (credits, { eq, and }) =>
        and(
          eq(credits.id, creditId),
          eq(credits.userId, authSession?.user?.id)
        ),
    });
    if (!existingCredit) {
      return NextResponse.json(
        { error: "Credit not found", data: null, message: "Credit not found" },
        { status: 404 }
      );
    }
    await db
      .delete(credits)
      .where(
        and(eq(credits.id, creditId), eq(credits.userId, authSession?.user?.id))
      );
    return NextResponse.json(
      { message: "Credit deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to delete credit",
        message: IS_DEV ? error?.message : "Failed to delete credit",
      },
      { status: 500 }
    );
  }
}
