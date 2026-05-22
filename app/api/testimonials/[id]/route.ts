import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()
    const { status, author, location, rating, content, active } = body

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const data: Record<string, unknown> = {}
    if (status !== undefined) data.status = status
    if (author !== undefined) data.author = author
    if (location !== undefined) data.location = location
    if (rating !== undefined) data.rating = Number(rating)
    if (content !== undefined) data.content = content
    if (active !== undefined) data.active = active

    const updated = await prisma.testimonial.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/testimonials/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 400 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await params
    await prisma.testimonial.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/testimonials/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 400 })
  }
}
