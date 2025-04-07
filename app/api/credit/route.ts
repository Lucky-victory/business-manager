import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"
import { credits, debtors } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const allCredits = await db.select().from(credits).orderBy(credits.date)
    const allDebtors = await db.select().from(debtors)

    return NextResponse.json({ credits: allCredits, debtors: allDebtors })
  } catch (error) {
    console.error("Failed to fetch credit data:", error)
    return NextResponse.json({ error: "Failed to fetch credit data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const creditId = body.id || uuidv4()
    const debtorId = body.debtorId || uuidv4()
    const date = body.date ? new Date(body.date) : new Date()

    // Check if debtor exists, if not create them
    const existingDebtor = await db.select().from(debtors).where(eq(debtors.id, debtorId))

    if (existingDebtor.length === 0 && body.debtorName) {
      await db.insert(debtors).values({
        id: debtorId,
        name: body.debtorName,
      })
    }

    // Create the credit entry
    const newCredit = {
      id: creditId,
      debtorId,
      type: body.type,
      item: body.type === "purchase" ? body.item : null,
      quantity: body.type === "purchase" ? body.quantity : null,
      price: body.type === "purchase" ? body.price : null,
      amount: body.amount,
      paymentType: body.type === "payment" ? body.paymentType : null,
      date,
    }

    await db.insert(credits).values(newCredit)

    return NextResponse.json(newCredit, { status: 201 })
  } catch (error) {
    console.error("Failed to create credit entry:", error)
    return NextResponse.json({ error: "Failed to create credit entry" }, { status: 500 })
  }
}

