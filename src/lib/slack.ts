import { createServerFn } from '@tanstack/react-start'
import { type ApSupportFormShape, apSupportFormSchema } from '@/lib/ap-support-form-schema'

interface SlackFile {
  id: string
  title: string
}

interface SlackMessageResponse {
  ok: boolean
  channel: string
  ts: string
  error?: string
}

interface SlackFileUploadResponse {
  ok: boolean
  files: SlackFile[]
  error?: string
}

// Helper to format app names for display
function formatAppName(app: ApSupportFormShape['app']): string {
  const appNames: Record<string, string> = {
    forms: 'Forms',
    digisign: 'Digisign',
    breeze: 'Breeze',
    bmui: 'Brokerage Management',
    offers: 'Offers',
    prime: 'Prime',
    books: 'Books',
    other: 'Other',
  }
  return appNames[app] || app
}

// Helper to get urgency emoji and color
function getUrgencyDetails(affectedCount: ApSupportFormShape['affectedCount']) {
  const details: Record<ApSupportFormShape['affectedCount'], { emoji: string; color: string }> = {
    one: { emoji: '💡', color: '#36a64f' }, // green
    multiple: { emoji: '🔵', color: '#2196F3' }, // blue
    brokerage: { emoji: '🟡', color: '#FFA500' }, // orange
    everyone: { emoji: '🔴', color: '#FF0000' }, // red
  }
  return details[affectedCount] || { emoji: '⚪', color: '#808080' }
}

// Upload files to Slack and return file IDs
async function uploadFilesToSlack(
  files: File[],
  channelId: string,
  botToken: string,
): Promise<string[]> {
  if (!files || files.length === 0) {
    return []
  }

  try {
    // files.uploadV2 supports multiple files in one request
    const formData = new FormData()

    // Add each file to the form data
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name)
    }

    formData.append('channel_ids', channelId)

    const response = await fetch('https://slack.com/api/files.uploadV2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${botToken}`,
      },
      body: formData,
    })

    const result = (await response.json()) as SlackFileUploadResponse

    if (!result.ok) {
      console.error('Slack file upload error:', result.error)
      throw new Error(`Failed to upload files: ${result.error}`)
    }

    return result.files.map((f) => f.id)
  } catch (error) {
    console.error('Error uploading files to Slack:', error)
    throw error
  }
}

// Build Slack Block Kit message
function buildSlackMessage(data: ApSupportFormShape, fileIds?: string[]) {
  const { emoji } = getUrgencyDetails(data.affectedCount)
  const appName = formatAppName(data.app)

  // Build context elements
  const contextElements: string[] = []
  if (data.subId) {
    contextElements.push(`*Subscriber ID:* ${data.subId}`)
  }
  if (data.screenshots && data.screenshots.length > 0) {
    contextElements.push(`*Screenshots:* ${data.screenshots.length} file(s)`)
  }
  if (data.previousTicketNumbers) {
    contextElements.push(`*Previous Tickets:* ${data.previousTicketNumbers}`)
  }

  const blocks: Array<Record<string, unknown>> = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${emoji} New Support Request - ${appName}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Affected Count:*\n${capitalize(data.affectedCount)}`,
        },
        {
          type: 'mrkdwn',
          text: `*Blocker?:*\n${data.isBlocker ? 'Yes' : 'No'}`,
        },
        {
          type: 'mrkdwn',
          text: `*Email:*\n${data.email}`,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Description:*\n${data.description}`,
      },
    },
  ]

  // Add optional fields
  if (data.video) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Video Recording:*\n<${data.video}|View Video>`,
      },
    })
  }

  if (data.formsFile) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Forms File:*\n<${data.formsFile}|View Forms File>`,
      },
    })
  }

  if (data.digiEnvelope) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Digisign Envelope:*\n<${data.digiEnvelope}|View Envelope>`,
      },
    })
  }

  // Add context section if we have any
  if (contextElements.length > 0) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: contextElements.join(' • '),
        },
      ],
    })
  }

  const message: {
    text: string
    blocks: typeof blocks
    files?: string[]
  } = {
    text: `New support request for ${appName} from ${data.email}`,
    blocks,
  }

  // Add file references if files were uploaded
  if (fileIds && fileIds.length > 0) {
    message.files = fileIds
  }

  return message
}

// Generate Slack permalink from channel and timestamp
function generatePermalink(channelId: string, ts: string, workspaceId: string): string {
  // Remove the period from timestamp to create message ID
  const messageId = ts.replace('.', '')
  return `https://${workspaceId}.slack.com/archives/${channelId}/p${messageId}`
}

// Main server function to send Slack message
export const sendSlackMessageServer = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) => apSupportFormSchema.parse(data))
  .handler(async (ctx) => {
    const data = ctx.data
    const botToken = process.env.SLACK_BOT_TOKEN
    const channelId = process.env.SLACK_CHANNEL_ID
    const workspaceId = process.env.SLACK_WORKSPACE_ID || 'skyslope' // Default to skyslope

    if (!botToken) {
      console.error('SLACK_BOT_TOKEN not configured')
      throw new Error('Slack integration not configured. Please set SLACK_BOT_TOKEN.')
    }

    if (!channelId) {
      console.error('SLACK_CHANNEL_ID not configured')
      throw new Error('Slack integration not configured. Please set SLACK_CHANNEL_ID.')
    }

    try {
      // Step 1: Upload files if present
      let fileIds: string[] = []
      if (data.screenshots && data.screenshots.length > 0) {
        try {
          fileIds = await uploadFilesToSlack(data.screenshots, channelId, botToken)
        } catch (fileError) {
          // Log but continue - we can still post the message without files
          console.error('Failed to upload files, continuing without them:', fileError)
        }
      }

      // Step 2: Build and post message
      const message = buildSlackMessage(data, fileIds)

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${botToken}`,
        },
        body: JSON.stringify({
          channel: channelId,
          ...message,
        }),
      })

      const result = (await response.json()) as SlackMessageResponse

      if (!result.ok) {
        console.error('Slack API error:', result.error)
        throw new Error(`Failed to send Slack message: ${result.error}`)
      }

      // Step 3: Generate permalink
      const permalink = generatePermalink(channelId, result.ts, workspaceId)

      return {
        success: true,
        permalink,
        channel: result.channel,
        timestamp: result.ts,
      }
    } catch (error) {
      console.error('Error sending Slack message:', error)
      throw error
    }
  })

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
