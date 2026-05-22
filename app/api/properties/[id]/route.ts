import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { propertySchema } from '@/lib/validations/property'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    let property = await prisma.property.findUnique({ where: { id } }).catch(() => null)
    if (!property) {
      property = await prisma.property.findUnique({ where: { slug: id } })
    }

    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(property)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const parsed = propertySchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    const data = Object.fromEntries(
      Object.entries(parsed.data).map(([k, v]) => [k, v === undefined ? null : v])
    ) as Parameters<typeof prisma.property.update>[0]['data']

    const property = await prisma.property.update({
      where: { id },
      data,
    })
    return NextResponse.json(property)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const data: Record<string, unknown> = {}
    if (body.active !== undefined) data.active = body.active
    if (body.featured !== undefined) data.featured = body.featured

    const property = await prisma.property.update({ where: { id }, data })
    return NextResponse.json(property)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await prisma.property.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
