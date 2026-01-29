import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const signOutServerFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { auth } = await import('@/lib/auth')
  await auth.instance.api.signOut({ headers: new Headers() })
})

export const Route = createFileRoute('/logout')({
  async beforeLoad() {
    await signOutServerFn()
    throw redirect({ to: '/login' })
  },
})
