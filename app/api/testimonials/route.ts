import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.testimonial.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    })
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

    const testimonial = await prisma.testimonial.create({
      data: {
        author: String(author).trim(),
        location: location ?? null,
        rating: ratingNum,
        content: String(content).trim(),
        status: 'PENDING',
      },
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (err) {
    console.error('[POST /api/testimonials]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 400 })
  }
}
