import { createAuthClient } from 'better-auth/react'

// Use window.location.origin for the client to work in both dev and production
// This ensures the client always connects to the same origin it's served from
export const authClient = createAuthClient({
  baseURL:
    typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_BETTER_AUTH_URL,
})
