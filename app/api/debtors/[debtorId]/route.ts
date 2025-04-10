import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { debtors } from "@/lib/db/schema";
import { IS_DEV } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { debtorId: string } }
) {
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
    const debtor = await db.query.debtors.findFirst({
      where: (debtors, { eq, and }) =>
        and(
          eq(debtors.id, params.debtorId),
          eq(debtors.userId, authSession?.user?.id)
        ),
    });

    if (!debtor) {
      return NextResponse.json(
        { error: "Debtor not found", data: null, message: "Debtor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: debtor, message: "Debtor fetched successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch debtor",
        message: IS_DEV ? error?.message : "Failed to fetch debtor",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { debtorId: string } }
) {
  try {
    const body = await request.json();
    const { name, phone, email, address } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
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

    const updatedDebtor = await db.transaction(async (tx) => {
      await tx
        .update(debtors)
        .set({ name, phone, email, address })
        .where(
          and(
            eq(debtors.id, params.debtorId),
            eq(debtors.userId, authSession?.user?.id)
          )
        );

      return await tx.query.debtors.findFirst({
        where: (debtors, { eq, and }) =>
          and(
            eq(debtors.id, params.debtorId),
            eq(debtors.userId, authSession?.user?.id)
          ),
      });
    });

    if (!updatedDebtor) {
      return NextResponse.json(
        { error: "Debtor not found", data: null, message: "Debtor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: updatedDebtor, message: "Debtor updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to update debtor",
        message: IS_DEV ? error?.message : "Failed to update debtor",
      },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { debtorId: string } }
) {
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
    const debtor = await db.query.debtors.findFirst({
      where: (debtors, { eq, and }) =>
        and(
          eq(debtors.id, params.debtorId),
          eq(debtors.userId, authSession?.user?.id)
        ),
    });
    if (!debtor) {
      return NextResponse.json(
        { error: "Debtor not found", data: null, message: "Debtor not found" },
        { status: 404 }
      );
    }
    await db
      .delete(debtors)
      .where(
        and(
          eq(debtors.id, params.debtorId),
          eq(debtors.userId, authSession?.user?.id)
        )
      );
    return NextResponse.json(
      { data: null, message: "Debtor deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to delete debtor",
        message: IS_DEV ? error?.message : "Failed to delete debtor",
      },
      { status: 500 }
    );
  }
}
