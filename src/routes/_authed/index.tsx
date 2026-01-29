import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppForm } from '@/hooks/demo.form'

export const Route = createFileRoute('/_authed/')({
  component: SimpleForm,
})

const schema = z
  .object({
    app: z.enum(
      ['forms', 'digisign', 'breeze', 'bmui', 'offers', 'prime', 'books', 'other'] as const,
      'Please choose an app',
    ),
    urgency: z.enum(
      ['info', 'low', 'medium', 'high'],
      'Please specify the urgency of this request',
    ),
    email: z.email(),
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

type FormValues = z.infer<typeof schema>

function SimpleForm() {
  const form = useAppForm({
    // @ts-expect-error
    defaultValues: {
      app: '',
      urgency: '',
      email: '',
      video: '',
      screenshots: [],
      formsFile: '',
      digiEnvelope: '',
      previousTicketNumbers: '',
      description: '',
    } as Partial<FormValues>,
    validators: {
      onBlur: schema,
    },
    onSubmit: ({ value }) => {
      console.log(value)
      // Show success message
      alert('Form submitted successfully!')
    },
  })

  return (
    <div className="min-h-full flex flex-col justify-center items-center p-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Agent Platform Support Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <form.AppField name="app">
              {(field) => (
                <field.Select
                  label="Which app is this regarding?"
                  values={[
                    { value: 'forms', label: 'Forms' },
                    { value: 'digisign', label: 'Digign' },
                    { value: 'breeze', label: 'Breeze' },
                    { value: 'bmui', label: 'Brokerage Management' },
                    { value: 'offers', label: 'Offers' },
                    { value: 'prime', label: 'Prime' },
                    { value: 'books', label: 'Books' },
                    { value: 'other', label: 'Something else' },
                  ]}
                />
              )}
            </form.AppField>

            <form.Subscribe selector={(state) => state.values.app}>
              {(app) =>
                app === 'books' ? (
                  <p>
                    The Agent Platform team does not support Books. The books support channel is{' '}
                    <a href="https://skyslope.slack.com/archives/C04QX8VGU56">#books-support</a>
                  </p>
                ) : app === 'prime' ? (
                  <p>
                    The Agent Platform team does not support Prime. The Prime support channel is{' '}
                    <a href="https://skyslope.slack.com/archives/CMJT7VD61">#prime-core</a>
                  </p>
                ) : app === 'other' ? (
                  <p>
                    The Agent Platform team only supports the apps listed above. This request likely
                    belongs in a different channel.
                  </p>
                ) : app ? (
                  <>
                    <form.AppField name="urgency">
                      {(field) => (
                        <field.Select
                          label="How urgent is this request?"
                          values={[
                            {
                              value: 'info',
                              label: 'Just letting you know - no further action needed',
                            },
                            {
                              value: 'low',
                              label: 'Needs action eventually - should write a ticket',
                            },
                            { value: 'medium', label: 'One user is blocked' },
                            {
                              value: 'high',
                              label: 'Many users are blocked - NEEDS IMMEDIATE ACTION',
                            },
                          ]}
                        />
                      )}
                    </form.AppField>

                    <form.AppField name="email">
                      {(field) => (
                        <field.TextField label="What is the email of the account reporting the issue?" />
                      )}
                    </form.AppField>

                    {app === 'bmui' && (
                      <form.AppField name="subId">
                        {(field) => (
                          <field.TextField
                            label="What is the subscriber ID for this user's brokerage?"
                            isOptional={false}
                          />
                        )}
                      </form.AppField>
                    )}

                    <form.AppField name="video">
                      {(field) => (
                        <field.TextField label="Provide a link to a video recording of the issue." />
                      )}
                    </form.AppField>

                    <form.AppField name="screenshots">
                      {(field) => (
                        <field.FileUpload label="Are there any screenshots that would be useful in addition to your video?" />
                      )}
                    </form.AppField>

                    {app === 'forms' && (
                      <form.AppField name="formsFile">
                        {(field) => (
                          <field.TextField
                            label="Do you have a link to the Forms File in question?"
                            placeholder="https://forms.skyslope.com/file/582106/documents"
                          />
                        )}
                      </form.AppField>
                    )}
                    {app === 'digisign' && (
                      <form.AppField name="digiEnvelope">
                        {(field) => (
                          <field.TextField
                            label="Do you have a link to the Digisign envelope in question?"
                            placeholder="https://send.skyslope.com/envelopes/1a7680f4-6752-4121-b033-d68711b1646e"
                          />
                        )}
                      </form.AppField>
                    )}

                    <form.AppField name="previousTicketNumbers">
                      {(field) => (
                        <field.TextField label="Have you created any tickets regarding this issue? Or has this been reported in this channel previously? (provide links)" />
                      )}
                    </form.AppField>

                    <form.AppField name="description">
                      {(field) => (
                        <field.TextArea
                          label="Describe the issue. How can we reproduce it?"
                          placeholder={`1. Go to the templates page\n2. Find '123 Main st'\n3. Open the more menu`}
                          rows={10}
                          className="field-sizing-fixed"
                        />
                      )}
                    </form.AppField>
                  </>
                ) : null
              }
            </form.Subscribe>

            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton label="Submit" />
              </form.AppForm>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
