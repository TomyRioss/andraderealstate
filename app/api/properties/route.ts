import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { propertySchema } from '@/lib/validations/property'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const contractType = searchParams.get('contractType')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const featured = searchParams.get('featured')
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10))

    const where: Prisma.PropertyWhereInput = { active: true }

    if (contractType) where.contractType = contractType as never
    if (category) where.category = category as never
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (featured !== null && featured !== undefined)
      where.featured = featured === 'true'
    if (bedrooms) where.bedrooms = parseInt(bedrooms, 10)
    if (minPrice || maxPrice) {
      where.priceMXN = {}
      if (minPrice) (where.priceMXN as Prisma.FloatNullableFilter).gte = parseFloat(minPrice)
      if (maxPrice) (where.priceMXN as Prisma.FloatNullableFilter).lte = parseFloat(maxPrice)
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [data, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count({ where }),
    ])

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    }

    const parsed = propertySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    // exactOptionalPropertyTypes: convert undefined optionals to null for Prisma
    const data = Object.fromEntries(
      Object.entries(parsed.data).map(([k, v]) => [k, v === undefined ? null : v])
    ) as Parameters<typeof prisma.property.create>[0]['data']

    const property = await prisma.property.create({ data })
    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
