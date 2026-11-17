import type { SponsorInquiry } from '@/payload-types'
import {
  buttonLink,
  detailsTable,
  detailsText,
  emailLayout,
  getSiteUrl,
  heading,
} from './layout'
import type { Email } from './registrationEmails'

/** Varsel til Go'nok når en bedrift har sendt skjemaet på /bli-sponsor */
export function sponsorInquiryNotificationEmail(inquiry: SponsorInquiry, to: string): Email {
  const adminUrl = `${getSiteUrl()}/admin/collections/sponsor-inquiries/${inquiry.id}`
  const subject = `Ny sponsorhenvendelse: ${inquiry.company}`
  const rows: Array<[string, string]> = [
    ['Bedrift', inquiry.company],
    ['Navn', inquiry.name],
    ['E-post', inquiry.email],
  ]
  if (inquiry.phone) rows.push(['Telefon', inquiry.phone])
  rows.push(['Melding', inquiry.message])

  const body = [
    heading('Ny sponsorhenvendelse'),
    detailsTable(rows),
    buttonLink(adminUrl, 'Se henvendelsen i admin'),
  ].join('')

  return {
    to,
    subject,
    html: emailLayout({ title: subject, bodyHtml: body }),
    text: `Ny sponsorhenvendelse\n\n${detailsText(rows)}\n\nSe henvendelsen i admin: ${adminUrl}`,
  }
}
