import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { credits } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { creditIds, isPaid, paidDate } = body

    if (!creditIds || !Array.isArray(creditIds) || creditIds.length === 0) {
      return NextResponse.json({ error: "Invalid credit IDs" }, { status: 400 })
    }

    // Update multiple credit statuses
    await db
      .update(credits)
      .set({
        isPaid,
        paidDate: isPaid ? new Date(paidDate || new Date()) : null,
        updatedAt: new Date(),
      })
      .where(inArray(credits.id, creditIds))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update multiple credit statuses:", error)
    return NextResponse.json({ error: "Failed to update multiple credit statuses" }, { status: 500 })
  }
}

