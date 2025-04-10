import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { credits } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { IS_DEV } from "@/lib/utils";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { creditIds, isPaid, paidDate } = body;

    if (!creditIds || !Array.isArray(creditIds) || creditIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid credit IDs" },
        { status: 400 }
      );
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
    // Update multiple credit statuses
    await db
      .update(credits)
      .set({
        isPaid,
        paidDate: isPaid ? new Date(paidDate || new Date()) : null,
        updatedAt: new Date(),
      })
      .where(
        and(
          inArray(credits.id, creditIds),
          eq(credits.userId, authSession?.user?.id)
        )
      );

    return NextResponse.json(
      { data: [], message: "Credit statuses updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to update multiple credit statuses",
        message: IS_DEV
          ? error?.message
          : "Failed to update multiple credit statuses",
      },
      { status: 500 }
    );
  }
}
