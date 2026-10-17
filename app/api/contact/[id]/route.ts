import { NextRequest, NextResponse } from 'next/server'
import { pb } from '@/lib/pocketbase'
import { invalidatePocketBaseCollection, withoutPocketBaseMetadata } from '@/lib/pocketbase-data'
import { auth } from '@/auth'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { status, notes, active } = body

    const validStatuses = ['PENDING', 'CONTACTED', 'CLOSED', 'DISCARDED']
    if (status !== undefined && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 422 })
    }

    const data: Record<string, unknown> = {}
    if (status !== undefined) data.status = status
    if (notes !== undefined) data.notes = notes
    if (active !== undefined) data.active = active

    const entry = await pb.collection('contact_forms').update(id, data)
    invalidatePocketBaseCollection('contact_forms')
    return NextResponse.json(withoutPocketBaseMetadata(entry))
  } catch (err) {
    console.error('[PUT /api/contact/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await pb.collection('contact_forms').delete(id)
    invalidatePocketBaseCollection('contact_forms')
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/contact/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
