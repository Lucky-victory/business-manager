import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { debtors } from "@/lib/db/schema";
import { generateUUID, IS_DEV } from "@/lib/utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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
    const debtors = await db.query.debtors.findMany({
      where: (debtors, { eq }) => eq(debtors.userId, authSession?.user?.id),
      orderBy: (debtors, { desc }) => desc(debtors.name),
    });
    return NextResponse.json(
      { data: debtors, message: "Debtors fetched successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch debtors",
        message: IS_DEV ? error?.message : "Failed to fetch debtors",
      },

      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    const debtor = await db.transaction(async (tx) => {
      const id = generateUUID();
      await tx.insert(debtors).values({
        id,
        name,
        phone,
        email,
        address,
        userId: authSession?.user?.id,
      });
      return await tx.query.debtors.findFirst({
        where: (debtors, { eq, and }) =>
          and(eq(debtors.id, id), eq(debtors.userId, authSession?.user?.id)),
      });
    });

    return NextResponse.json(
      { data: debtor, message: "Debtor created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to create debtor",
        message: IS_DEV ? error?.message : "Failed to create debtor",
      },
      { status: 500 }
    );
  }
}
