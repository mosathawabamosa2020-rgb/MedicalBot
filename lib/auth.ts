import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'

const prisma = new PrismaClient()

let adapter: any = undefined
try {
  // adapter is optional in tests if package not installed
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaAdapter } = require('@next-auth/prisma-adapter')
  adapter = PrismaAdapter(prisma as any)
} catch (e) {
  // package not available in test env; proceed without adapter
  adapter = undefined
}

export const authOptions = {
  adapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        const ok = await bcrypt.compare(credentials.password, user.password)
        if (!ok) return null
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role || token.role
      if (user) {
        // also store sub for compatibility with default NextAuth JWT
        token.sub = (user as any).id || token.sub
      }
      return token
    },
    async session({ session, token }) {
      // avoid calling properties as functions; use token.sub for id
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      if (session?.user && token?.role) {
        session.user.role = token.role
      }
      return session
    }
  }
}

export default authOptions
