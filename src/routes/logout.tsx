import { createFileRoute, redirect } from '@tanstack/react-router'
import { auth } from '@/lib/auth'

export const Route = createFileRoute('/logout')({
  async beforeLoad() {
    await auth.instance.api.signOut({ headers: new Headers() })
    throw redirect({ to: '/login' })
  },
})
