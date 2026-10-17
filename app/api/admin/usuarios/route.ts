import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { pb } from '@/lib/pocketbase'
import { withoutPocketBaseMetadata } from '@/lib/pocketbase-data'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await pb.collection('admins').getFullList({
    sort: '-createdAt',
    fields: 'id,name,email,role,createdAt',
  })
  return NextResponse.json(users.map(withoutPocketBaseMetadata))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, email, password, role } = body
  if (!email || !password) return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })

  const sessionRole = (session.user as { role?: string }).role
  const assignedRole = sessionRole === 'SUPER_ADMIN' && role ? role : 'ADMIN'

  try {
    await pb.collection('admins').getFirstListItem(pb.filter('email = {:email}', { email }))
    return NextResponse.json({ error: 'El email ya está en uso' }, { status: 409 })
  } catch (error) {
    if ((error as { status?: number }).status !== 404) throw error
  }

  const hashed = await bcrypt.hash(password, 10)
  const now = new Date().toISOString()
  const user = await pb.collection('admins').create({
    name,
    email,
    password: hashed,
    role: assignedRole,
    createdAt: now,
    updatedAt: now,
  })
  const { password: _password, ...publicUser } = withoutPocketBaseMetadata(user)
  return NextResponse.json(publicUser, { status: 201 })
}