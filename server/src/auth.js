
import 'dotenv/config'
import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from './db/index.js'
import * as schema from './db/schema.js'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  trustedOrigins: [
    process.env.CLIENT_URL ?? 'http://localhost:5173',
  ],

  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },

  plugins: [
    admin({
      defaultRole: 'user',
      adminUserIds: process.env.ADMIN_USER_ID
        ? [process.env.ADMIN_USER_ID]
        : [],
    }),
  ],
})
