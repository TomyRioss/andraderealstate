import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getAdminPocketBase } from '@/lib/pocketbase-admin'
import { authConfig } from '@/auth.config'

class InvalidCredentials extends CredentialsSignin {
  code = 'invalid_credentials'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) throw new InvalidCredentials()

        let user
        try {
          const pb = await getAdminPocketBase()
          user = await pb.collection('admins').getFirstListItem(
            pb.filter('email = {:email}', { email }),
          )
        } catch (error) {
          if (!(error instanceof Error && 'status' in error && error.status === 404)) {
            throw error
          }
          user = null
        }
        if (!user) throw new InvalidCredentials()

        const isValid =
          (await bcrypt.compare(password, user.password).catch(() => false)) ||
          password === user.password

        if (!isValid) throw new InvalidCredentials()

        return { id: user.id, email: user.email, name: user.name ?? null, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role
      return token
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string
      return session
    },
  },
})
