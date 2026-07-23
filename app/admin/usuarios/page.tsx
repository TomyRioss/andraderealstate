import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import UsersTable from '@/components/admin/UsersTable'

export default async function UsuariosPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  const sessionRole = (session.user as { role?: string }).role ?? 'ADMIN'
  const sessionId = (session.user as { id?: string }).id ?? ''

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="text-3xl font-light" style={{ color: '#F5EDD8', fontFamily: 'Georgia, serif' }}>Usuarios</h1>
      </div>
      <UsersTable
        users={users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() }))}
        sessionRole={sessionRole}
        sessionId={sessionId}
      />
    </div>
  )
}
