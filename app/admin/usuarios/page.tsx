import { pb } from '@/lib/pocketbase'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import UsersTable from '@/components/admin/UsersTable'

export default async function UsuariosPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const users = await pb.collection('admins').getFullList<{
    id: string
    name: string | null
    email: string
    role: 'ADMIN' | 'SUPER_ADMIN'
    createdAt: string | Date
  }>({ sort: '-createdAt', fields: 'id,name,email,role,createdAt' })

  const sessionRole = (session.user as { role?: string }).role ?? 'ADMIN'
  const sessionId = (session.user as { id?: string }).id ?? ''

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5">
        <h1 className="font-heading text-3xl font-medium text-[#0D1A2D]">Usuarios</h1>
      </div>
      <UsersTable
        users={users.map((u) => ({ ...u, createdAt: new Date(u.createdAt).toISOString() }))}
        sessionRole={sessionRole}
        sessionId={sessionId}
      />
    </div>
  )
}
