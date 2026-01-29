import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

// Lazy initialization to avoid accessing env vars at module load time
// This is required for Cloudflare Workers compatibility
let authInstance: ReturnType<typeof betterAuth> | null = null

function createAuthInstance() {
  return betterAuth({
    // Base URL for OAuth redirects - must be set in environment variables
    baseURL: process.env.VITE_BETTER_AUTH_URL!,

    // Google OAuth configuration
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
}

function getAuthInstance() {
  if (!authInstance) {
    authInstance = createAuthInstance()
  }
  return authInstance
}

export const auth = {
  get handler() {
    return getAuthInstance().handler
  },
  get instance() {
    return authInstance
  },
  set instance(value) {
    authInstance = value
  },
  createInstance: createAuthInstance,
}
