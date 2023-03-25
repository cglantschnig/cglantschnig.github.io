import sendgridMail, { MailDataRequired } from '@sendgrid/mail'
import type { Handler, HandlerResponse } from '@netlify/functions'

type EmailBodyType = {
  name: string
  email: string
  message: string
}

if (!process.env.SENDGRID_EMAIL_FROM) {
  throw new Error('SENDGRID_EMAIL_FROM is required')
}
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is required')
}
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return response(405, {
      message: 'Unsupported HTTP Method'
    })
  }
  if (!event.body) {
    return response(400, {
      message: 'Empty Payload'
    })
  }
  const { name, email, message } = JSON.parse(event.body) as EmailBodyType

  if (!name) {
    return response(400, {
      message: 'name is required'
    })
  }
  if (!email) {
    return response(400, {
      message: 'email is required'
    })
  }
  if (!message) {
    return response(400, {
      message: 'message is required'
    })
  }

  const msg: MailDataRequired = {
    to: email,
    from: process.env.SENDGRID_EMAIL_FROM!,
    subject: `Contact Request from ${name}`,
    text: message,
  }
  try {
    await sendgridMail.send(msg)
  } catch(e) {
    console.error(e);
    return response(500, {
      message: `Could not send email`
    })
  }

  return response(200, {
    message: `Hello, ${name}!`,
    code: process.env.SENDGRID_API_KEY
  })
}

function response(code: number, body: Record<string, any>): HandlerResponse {
  return {
    statusCode: code,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  }
}
