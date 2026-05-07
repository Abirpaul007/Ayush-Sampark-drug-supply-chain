import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db/mongodborder'
import { User } from '@/lib/models/User'
import { Verification } from '@/lib/models/Verification' 

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        await dbConnect()
        const user = await User.findOne({
          $or: [{ email: credentials.email }, { name: credentials.name }],
        })

        if (!user) throw new Error('No user found with this email or username')
        if (!user.isEmailVerified) throw new Error('Please verify your account before logging in')

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error('Incorrect password')

        // ✅ Fetch the application status
        const verification = await Verification.findOne({ userId: user._id })

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified,
          isVerified: user.isVerified,
          role: user.role,
          applicationStatus: verification?.applicationStatus || null, // ✅ Add this
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      await dbConnect()

      // On login
      if (user) {
        token.id = user.id
        token.isVerified = user.isVerified
        token.isEmailVerified = user.isEmailVerified
        token.role = user.role
        token.name = user.name
        token.applicationStatus = (user as any).applicationStatus || null // ✅ set applicationStatus
      } else {
        // On subsequent requests
        const freshUser = await User.findOne({ email: token.email })
        if (freshUser) {
          token.id = freshUser._id.toString()
          token.isVerified = freshUser.isVerified
          token.isEmailVerified = freshUser.isEmailVerified
          token.role = freshUser.role
          token.name = freshUser.name

          // ✅ Re-fetch applicationStatus from Verification model
          const verification = await Verification.findOne({ userId: freshUser._id })
          token.applicationStatus = verification?.applicationStatus || null
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token.id
        session.user.isVerified = token.isVerified
        session.user.isEmailVerified = token.isEmailVerified
        session.user.role = token.role
        session.user.name = token.name
        session.user.applicationStatus = token.applicationStatus || null // ✅ Add this
      }
      return session
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/sign-in',
  },
}
