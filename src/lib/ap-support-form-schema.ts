import { z } from 'zod'

export const apSupportFormSchema = z
  .object({
    slackUsername: z.string().min(1, 'Required'),
    app: z.enum(
      ['forms', 'digisign', 'breeze', 'bmui', 'offers', 'prime', 'books', 'other'] as const,
      'Please choose an app',
    ),
    affectedCount: z.enum(['one', 'multiple', 'brokerage', 'everyone'], 'Required'),
    isBlocker: z.stringbool('Required'),
    email: z
      .string()
      .min(1, 'At least one email is required')
      .refine(
        (value) => {
          const emails = value
            .split(/[,\s]+/)
            .map((e) => e.trim())
            .filter(Boolean)
          return emails.every((email) => z.string().email().safeParse(email).success)
        },
        { message: 'Invalid email' },
      ),
    subId: z.string().optional(),
    video: z.url(),
    screenshots: z.array(z.instanceof(File)).max(10, 'Maximum 10 files allowed').optional(),
    formsFile: z.url().optional(),
    digiEnvelope: z
      .url()
      .regex(
        /^https:\/\/send\.skyslope\.com\/envelopes\/[a-f0-9-]+/,
        'Invalid Digisign envelope URL',
      )
      .optional(),
    previousTicketNumbers: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
  })
  .refine(
    (data) => {
      if (data.app === 'bmui') return !!data.subId
      return true
    },
    {
      error: 'Subscriber ID is required for BMUI issues',
      path: ['subId'],
    },
  )

export type ApSupportFormShape = z.infer<typeof apSupportFormSchema>
