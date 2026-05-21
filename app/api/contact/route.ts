import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, name, phone, email, address, photos } = body

    const cleanPhone = (phone ?? '').replace(/\s+/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Phone required (min 10 chars)' }, { status: 400 })
    }
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    if (!type || !['BUY', 'SELL'].includes(type)) {
      return NextResponse.json({ error: 'Type must be BUY or SELL' }, { status: 400 })
    }

    const entry = await prisma.contactForm.create({
      data: {
        type,
        name: name ?? null,
        phone: cleanPhone,
        email,
        address: address ?? null,
        photos: photos ?? [],
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 400 })
  }
}
