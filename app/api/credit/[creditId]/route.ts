import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { credits } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(request: Request, { params }: { params: { creditId: string } }) {
  try {
    const creditId = params.creditId
    const body = await request.json()

    // Update the credit status
    await db
      .update(credits)
      .set({
        isPaid: body.isPaid,
        paidDate: body.isPaid ? new Date(body.paidDate || new Date()) : null,
        updatedAt: new Date(),
      })
      .where(eq(credits.id, creditId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update credit status:", error)
    return NextResponse.json({ error: "Failed to update credit status" }, { status: 500 })
  }
}

