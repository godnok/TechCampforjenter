import type { Payload } from 'payload'

import type { Email } from './registrationEmails'

/**
 * Sender flere e-poster samtidig. Feiler én (f.eks. ugyldig adresse eller Resend nede),
 * logges feilen – men den stopper ikke de andre, og påmeldingen er uansett lagret.
 * Svar på e-posten går til Go'nok (EMAIL_NOTIFY_ADDRESS).
 */
export async function sendEmails(payload: Payload, emails: Email[]): Promise<void> {
  const replyTo = process.env.EMAIL_NOTIFY_ADDRESS

  const results = await Promise.allSettled(
    emails.map((email) =>
      payload.sendEmail({
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        replyTo,
      }),
    ),
  )

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Kunne ikke sende e-post «${emails[index].subject}»:`, result.reason)
    }
  })
}
