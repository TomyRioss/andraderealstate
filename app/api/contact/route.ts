import { NextRequest, NextResponse } from 'next/server'
import { pb } from '@/lib/pocketbase'
import { invalidatePocketBaseCollection, withoutPocketBaseMetadata } from '@/lib/pocketbase-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, name, phone, email, address, photos, message } = body

    const cleanPhone = (phone ?? '').replace(/\s+/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Phone required (min 10 chars)' }, { status: 400 })
    }
    if (!type || !['BUY', 'SELL', 'MANAGE'].includes(type)) {
      return NextResponse.json({ error: 'Type must be BUY, SELL or MANAGE' }, { status: 400 })
    }
    if (type !== 'MANAGE' && !email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const entry = await pb.collection('contact_forms').create({
      status: 'PENDING',
      active: true,
      type,
      name: name ?? null,
      phone: cleanPhone,
      email: email ?? '',
      address: address ?? null,
      photos: photos ?? [],
      notes: message ?? null,
      createdAt: now,
      updatedAt: now,
    })

    invalidatePocketBaseCollection('contact_forms')
    return NextResponse.json(withoutPocketBaseMetadata(entry), { status: 201 })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 400 })
  }
}
