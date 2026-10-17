import { NextRequest, NextResponse } from 'next/server'
import { pb } from '@/lib/pocketbase'
import { invalidatePocketBaseCollection, listTestimonials, withoutPocketBaseMetadata } from '@/lib/pocketbase-data'
import { sortByCreatedAtDescending } from '@/lib/property-search'

export async function GET() {
  try {
    const data = sortByCreatedAtDescending((await listTestimonials()).filter((testimonial) => testimonial.status === 'APPROVED'))
    return NextResponse.json({ data })
  } catch (err) {
    console.error('[GET /api/testimonials]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { author, location, rating, content } = body

    if (!author || String(author).trim().length < 2) {
      return NextResponse.json({ error: 'Author min 2 chars' }, { status: 400 })
    }
    const ratingNum = Number(rating)
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'Rating must be integer 1-5' }, { status: 400 })
    }
    if (!content || String(content).trim().length < 10) {
      return NextResponse.json({ error: 'Content min 10 chars' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const testimonial = await pb.collection('testimonials').create({
      author: String(author).trim(),
      location: location ?? null,
      rating: ratingNum,
      content: String(content).trim(),
      status: 'PENDING',
      active: true,
      createdAt: now,
      updatedAt: now,
    })

    invalidatePocketBaseCollection('testimonials')
    return NextResponse.json(withoutPocketBaseMetadata(testimonial), { status: 201 })
  } catch (err) {
    console.error('[POST /api/testimonials]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 400 })
  }
}
