export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { pb } from '@/lib/pocketbase'
import { invalidatePocketBaseCollection, listProperties, withoutPocketBaseMetadata } from '@/lib/pocketbase-data'
import { filterProperties, sortByCreatedAtDescending } from '@/lib/property-search'
import { auth } from '@/auth'
import { propertySchema } from '@/lib/validations/property'


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
    const positiveInteger = (value: string | null, fallback: number) => {
      const parsed = Number.parseInt(value ?? '', 10)
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
    }
    const numeric = (value: string | null) => {
      if (!value) return undefined
      const parsed = Number.parseFloat(value)
      return Number.isFinite(parsed) ? parsed : undefined
    }
    const page = positiveInteger(searchParams.get('page'), 1)
    const limit = positiveInteger(searchParams.get('limit'), 12)
    const bedroomCount = bedrooms ? Number.parseInt(bedrooms, 10) : undefined
    const filtered = sortByCreatedAtDescending(filterProperties(await listProperties(), {
      activeOnly: true,
      contractType,
      category,
      city,
      search,
      featured: featured === null ? undefined : featured === 'true',
      bedrooms: bedroomCount !== undefined && Number.isFinite(bedroomCount) ? bedroomCount : undefined,
      minPrice: numeric(minPrice),
      maxPrice: numeric(maxPrice),
    }))
    const total = filtered.length
    const data = filtered.slice((page - 1) * limit, page * limit)

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
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

    const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined))
    const now = new Date().toISOString()
    const property = await pb.collection('properties').create({
      ...data,
      createdAt: data.createdAt ?? now,
      updatedAt: data.updatedAt ?? now,
    })
    invalidatePocketBaseCollection('properties')
    return NextResponse.json(withoutPocketBaseMetadata(property), { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
