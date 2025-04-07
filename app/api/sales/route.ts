import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"
import { sales } from "@/lib/db/schema"

export async function GET() {
  try {
    const allSales = await db.select().from(sales).orderBy(sales.date)
    return NextResponse.json(allSales)
  } catch (error) {
    console.error("Failed to fetch sales:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const saleId = body.id || uuidv4()
    const date = body.date ? new Date(body.date) : new Date()

    const newSale = {
      id: saleId,
      item: body.item,
      quantity: body.quantity,
      price: body.price,
      amount: body.amount,
      paymentType: body.paymentType,
      date,
    }

    await db.insert(sales).values(newSale)

    return NextResponse.json(newSale, { status: 201 })
  } catch (error) {
    console.error("Failed to create sale:", error)
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}

