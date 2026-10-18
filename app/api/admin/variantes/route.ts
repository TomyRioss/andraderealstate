import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, images, productId } = body

  if (!name || !productId) {
    return NextResponse.json({ error: 'Nombre y producto requeridos' }, { status: 400 })
  }

  const variant = await prisma.productVariant.create({
    data: {
      name,
      description: description || null,
      images: Array.isArray(images) ? images : [],
      productId,
    },
  })
  return NextResponse.json(variant, { status: 201 })
}
