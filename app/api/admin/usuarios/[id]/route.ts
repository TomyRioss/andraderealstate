import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, email, password, role } = body

  const sessionRole = (session.user as { role?: string }).role
  const data: Record<string, unknown> = {}

  if (name !== undefined) data.name = name
  if (email !== undefined) data.email = email
  if (password) data.password = await bcrypt.hash(password, 10)
  if (role && sessionRole === 'SUPER_ADMIN') data.role = role

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  return NextResponse.json(user)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const sessionId = (session.user as { id?: string }).id

  if (id === sessionId) return NextResponse.json({ error: 'No podés eliminarte a vos mismo' }, { status: 400 })

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
