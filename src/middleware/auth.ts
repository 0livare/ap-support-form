import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const authMiddleware = createMiddleware()
  .server(async ({ next }) => {
    const headers = getRequestHeaders()

    // Initialize auth instance and get session
    if (!auth.instance) {
      auth.instance = auth.createInstance()
    }

    const session = await auth.instance.api.getSession({ headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return await next()
  })
