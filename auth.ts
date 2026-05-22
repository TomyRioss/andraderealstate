import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

class InvalidCredentials extends CredentialsSignin {
  code = 'invalid_credentials'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
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

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new InvalidCredentials()

        const isValid =
          (await bcrypt.compare(password, user.password).catch(() => false)) ||
          password === user.password

        if (!isValid) throw new InvalidCredentials()

        return { id: user.id, email: user.email, name: user.name ?? undefined }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
})
