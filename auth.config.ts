import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
      if (isAdminPath) return !!auth?.user
      return true
    },
  },
  session: { strategy: 'jwt' },
}
