import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '@/middleware/auth'

export const Route = createFileRoute('/_authed')({
  component: Outlet,
  server: {
    middleware: [authMiddleware],
  },
})
