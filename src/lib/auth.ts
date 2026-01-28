import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  // Base URL for OAuth redirects
  baseURL: process.env.VITE_BETTER_AUTH_URL || window.location.origin,

  // Google OAuth configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Request these scopes from Google
      scope: ['email', 'profile'],
    },
  },

  // Domain validation hook - only allow @skyslope.com emails
  databaseHooks: {
    user: {
      create: {
        before: async (user, _context) => {
          const email = user.email?.toLowerCase()
          const domain = email?.split('@')[1]

          // Reject non-skyslope.com emails
          if (domain !== 'skyslope.com') {
            throw new Error('Only SkySlope email addresses (@skyslope.com) are allowed to sign in.')
          }

          return { data: user }
        },
      },
    },
  },

  plugins: [tanstackStartCookies()],
})
