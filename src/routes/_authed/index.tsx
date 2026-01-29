import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/')({
  async beforeLoad() {
    throw redirect({ to: '/form' })
  },
})
