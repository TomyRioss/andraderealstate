import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { weddingQuoteSchema } from '@/lib/validations/wedding'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = weddingQuoteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }
    const { name, phone, email, notes, items } = parsed.data

    const dbItems = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.itemId) }, active: true },
    })
    const validIds = new Set(dbItems.map((i) => i.id))

    const quoteItems = items
      .filter((i) => validIds.has(i.itemId))
      .map((i) => ({
        itemId: i.itemId,
        quantity: i.quantity,
        priceAtAdd: 0,
      }))

    if (quoteItems.length === 0) {
      return NextResponse.json({ error: 'No valid items in quote' }, { status: 400 })
    }

    const total = 0

    const quote = await prisma.weddingQuote.create({
      data: {
        name,
        phone: phone.replace(/\s+/g, ''),
        email: email || null,
        notes: notes ?? null,
        total,
        items: { create: quoteItems },
      },
    })

    return NextResponse.json(quote, { status: 201 })
  } catch (err) {
    console.error('[POST /api/wedding/quotes]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
