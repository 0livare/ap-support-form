import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const searchSchema = z.object({
  permalink: z.string().optional(),
})

export const Route = createFileRoute('/_authed/success')({
  component: SuccessPage,
  validateSearch: searchSchema,
})

function SuccessPage() {
  const { permalink } = Route.useSearch()

  return (
    <div className="h-full flex flex-col justify-center items-center p-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-600">
            ✓ Form Submitted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">
            Your support request has been sent to the team via Slack.
          </p>

          {permalink && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">View your message in Slack:</p>
              <a
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {permalink}
              </a>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Link to="/">
              <Button>Submit Another Request</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
