import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Spacer } from '@/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppForm } from '@/hooks/form/use-app-form'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/_authed/form')({
  component: SimpleForm,
})

const schema = z
  .object({
    slackUsername: z.string().min(1, 'Required'),
    app: z.enum(
      ['forms', 'digisign', 'breeze', 'bmui', 'offers', 'prime', 'books', 'other'] as const,
      'Please choose an app',
    ),
    affectedCount: z.enum(['one', 'multiple', 'brokerage', 'everyone'], 'Required'),
    isBlocker: z.stringbool('Required'),
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
  const { data: session } = authClient.useSession()
  const form = useAppForm({
    // @ts-expect-error
    defaultValues: {
      slackUsername: '',
      app: '',
      affectedCount: 'one',
      isBlocker: 'no',
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
            <div className="flex gap-4 items-center">
              {session?.user.image ? (
                <img src={session.user.image} alt="" className="h-10 w-10 rounded-full" />
              ) : null}
              {session?.user.email}
            </div>

            <form.AppField name="slackUsername">
              {(field) => (
                <field.TextField
                  label="What is your Slack username?"
                  inputProps={{ autoComplete: 'off' }}
                  placeholder="@Zach"
                />
              )}
            </form.AppField>

            <Spacer />

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
                    <Spacer />

                    {/* <form.AppField name="affectedCount">
                      {(field) => (
                        <field.Select
                          label="How many users are affected by this issue?"
                          values={[
                            { value: 'one', label: 'Just one user' },
                            { value: 'multiple', label: 'Multiple user reports' },
                            { value: 'brokerage', label: 'An entire brokerage' },
                            { value: 'everyone', label: 'Everyone' },
                          ]}
                        />
                      )}
                    </form.AppField> */}
                    <form.AppField name="affectedCount">
                      {(field) => (
                        <field.RadioToggleGroup
                          label="How many users are affected by this issue?"
                          classes={{
                            labelRoot: 'flex-col items-start',
                          }}
                        >
                          <field.ToggleGroupItem value="one">Just one user</field.ToggleGroupItem>
                          <field.ToggleGroupItem value="multiple">
                            Multiple user reports
                          </field.ToggleGroupItem>
                          <field.ToggleGroupItem value="brokerage">
                            An entire brokerage
                          </field.ToggleGroupItem>
                          <field.ToggleGroupItem value="everyone">Everyone</field.ToggleGroupItem>
                        </field.RadioToggleGroup>
                      )}
                    </form.AppField>
                    <form.AppField name="isBlocker">
                      {(field) => (
                        <field.RadioToggleGroup label="Is this a blocker for them?">
                          <field.ToggleGroupItem value="no">No</field.ToggleGroupItem>
                          <field.ToggleGroupItem value="yes">Yes</field.ToggleGroupItem>
                        </field.RadioToggleGroup>
                      )}
                    </form.AppField>

                    <form.AppField name="email">
                      {(field) => (
                        <field.TextField
                          label="What is the email of the account reporting the issue?"
                          inputProps={{ autoComplete: 'off' }}
                        />
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

                    <Spacer />

                    <form.AppField name="video">
                      {(field) => (
                        <field.TextField
                          label="Provide a link to a video screen recording of the issue."
                          description={
                            <>
                              This could be a video from a customer or one you recorded yourself.
                              Someone walking through the issue makes it much easier for us to
                              understand the problem.{' '}
                              <a href="https://jam.dev" className="underline">
                                Jam.dev
                              </a>{' '}
                              is a great free tool. You can also use Slack.
                            </>
                          }
                        />
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
                        <field.TextField
                          label="Have you created any tickets regarding this issue? Or has this been reported in this channel previously? (provide links)"
                          placeholder="https://skyslope.atlassian.net/browse/AP-789"
                        />
                      )}
                    </form.AppField>

                    <Spacer />

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
