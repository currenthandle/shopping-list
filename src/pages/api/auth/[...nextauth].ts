import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

import { env } from '../../../env/server.mjs'
import { prisma } from '../../../server/db/client'

export const authOptions: NextAuthOptions = {
  pages: {
    //signIn: '/login',
    newUser: '/signUp',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          //placeholder: 'jsmith',
        },
        password: {
          label: 'Password',
          type: 'password',
          //placeholder: '********',
        },
      },
      async authorize(credentials, req) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          })
          if (user) {
            if (!credentials?.password || !user.password) {
              return null
            }
            const hash = user?.password
            const password = credentials?.password
            const result = await bcrypt.compare(password, hash)
            if (result) {
              return user
            }
            throw new Error('Invalid password')
          }
          return null
        } catch (error) {
          console.error(error)
        }
        return null
      },
    }),
  ],
}

export default NextAuth(authOptions)
