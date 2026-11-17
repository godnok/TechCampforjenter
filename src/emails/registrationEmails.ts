import type { Camp, Registration } from '@/payload-types'
import { formatDate, formatDateRange } from '@/utilities/formatDateRange'
import {
  buttonLink,
  detailsTable,
  detailsText,
  emailLayout,
  escapeHtml,
  getSiteUrl,
  heading,
  paragraph,
} from './layout'

export type Email = {
  to: string
  subject: string
  html: string
  text: string
}

type Result = 'registered' | 'waitlist'

/** «11.–12. august 2027 på Quality Hotel» */
function whenAndWhere(camp: Camp): string {
  return `${formatDateRange(camp.startDate, camp.endDate)} på ${camp.location}`
}

/** Bekreftelse til deltakeren – kort og vennlig */
export function participantEmail(registration: Registration, camp: Camp, result: Result): Email {
  const campName = escapeHtml(camp.name)
  const when = escapeHtml(whenAndWhere(camp))

  if (result === 'waitlist') {
    const subject = `Du står på venteliste til ${camp.name}`
    const body = [
      heading(`Hei ${registration.participantName}!`),
      paragraph(
        `Takk for påmeldingen til <strong>${campName}</strong> (${when}). Campen er dessverre full akkurat nå, så du står på <strong>venteliste</strong>.`,
      ),
      paragraph('Vi gir deg beskjed på e-post hvis det blir ledig plass.'),
      paragraph('Har du spørsmål? Bare svar på denne e-posten.'),
    ].join('')
    return {
      to: registration.participantEmail,
      subject,
      html: emailLayout({ title: subject, bodyHtml: body }),
      text: `Hei ${registration.participantName}!\n\nTakk for påmeldingen til ${camp.name} (${whenAndWhere(camp)}). Campen er dessverre full akkurat nå, så du står på venteliste.\n\nVi gir deg beskjed på e-post hvis det blir ledig plass.\n\nHar du spørsmål? Bare svar på denne e-posten.`,
    }
  }

  const subject = `Du er påmeldt ${camp.name}!`
  const body = [
    heading(`Hei ${registration.participantName}!`),
    paragraph(`Du er påmeldt <strong>${campName}</strong>, ${when}. Vi gleder oss til å se deg!`),
    paragraph(
      'Praktisk informasjon, som oppmøtetid og hva du skal ha med, kommer på e-post nærmere campen.',
    ),
    paragraph('Har du spørsmål? Bare svar på denne e-posten.'),
  ].join('')
  return {
    to: registration.participantEmail,
    subject,
    html: emailLayout({ title: subject, bodyHtml: body }),
    text: `Hei ${registration.participantName}!\n\nDu er påmeldt ${camp.name}, ${whenAndWhere(camp)}. Vi gleder oss til å se deg!\n\nPraktisk informasjon, som oppmøtetid og hva du skal ha med, kommer på e-post nærmere campen.\n\nHar du spørsmål? Bare svar på denne e-posten.`,
  }
}

/** Alle opplysningene som ble sendt inn – til foresatt, så de kan se at alt stemmer */
function submittedDetails(registration: Registration, camp: Camp): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ['Camp', camp.name],
    ['Dato', formatDateRange(camp.startDate, camp.endDate)],
    ['Sted', camp.location],
    ['Deltaker', registration.participantName],
    ['Telefon', registration.participantPhone],
    ['E-post', registration.participantEmail],
    ['Fødselsdato', formatDate(registration.birthDate)],
    ['Skole', registration.school],
    [
      'Matallergier',
      registration.hasAllergies === 'yes' ? `Ja: ${registration.allergies ?? ''}` : 'Nei',
    ],
  ]
  if (registration.referredBy) rows.push(['Vervet av', registration.referredBy])
  rows.push(
    ['Foresatt', registration.guardianName],
    ['Foresattes telefon', registration.guardianPhone],
    ['Foresattes e-post', registration.guardianEmail],
  )
  return rows
}

/** Bekreftelse til foresatt – med oversikt over alt som ble sendt inn */
export function guardianEmail(registration: Registration, camp: Camp, result: Result): Email {
  const participant = escapeHtml(registration.participantName)
  const campName = escapeHtml(camp.name)
  const details = submittedDetails(registration, camp)

  const intro =
    result === 'waitlist'
      ? `<strong>${participant}</strong> er satt på <strong>venteliste</strong> til ${campName}, fordi campen er full akkurat nå. Vi gir beskjed på e-post hvis det blir ledig plass.`
      : `<strong>${participant}</strong> er påmeldt <strong>${campName}</strong>. Vi gleder oss!`
  const introText =
    result === 'waitlist'
      ? `${registration.participantName} er satt på venteliste til ${camp.name}, fordi campen er full akkurat nå. Vi gir beskjed på e-post hvis det blir ledig plass.`
      : `${registration.participantName} er påmeldt ${camp.name}. Vi gleder oss!`

  const subject =
    result === 'waitlist'
      ? `Venteliste: ${registration.participantName} – ${camp.name}`
      : `Påmelding bekreftet: ${registration.participantName} – ${camp.name}`

  const body = [
    heading(`Hei ${registration.guardianName}!`),
    paragraph(intro),
    paragraph('Her er opplysningene som ble sendt inn:'),
    detailsTable(details),
    // Bildesamtykke og praktisk info gjelder bare de som har fått plass – ikke venteliste
    result === 'registered'
      ? paragraph(
          'Før campen sender vi et skjema for <strong>bildesamtykke</strong> som må signeres av foresatt. Praktisk informasjon kommer også på e-post nærmere campen.',
        )
      : '',
    paragraph('Er noe feil, eller ønsker dere å melde av? Svar på denne e-posten.'),
    `<p style="margin:0;font-size:13px;color:#555555;">Opplysningene slettes ett år etter campen. Les mer i <a href="${getSiteUrl()}/personvern" style="color:#c4237f;">personvernerklæringen</a>.</p>`,
  ].join('')

  return {
    to: registration.guardianEmail,
    subject,
    html: emailLayout({ title: subject, bodyHtml: body }),
    text: [
      `Hei ${registration.guardianName}!`,
      introText,
      `Her er opplysningene som ble sendt inn:\n${detailsText(details)}`,
      ...(result === 'registered'
        ? [
            'Før campen sender vi et skjema for bildesamtykke som må signeres av foresatt. Praktisk informasjon kommer også på e-post nærmere campen.',
          ]
        : []),
      'Er noe feil, eller ønsker dere å melde av? Svar på denne e-posten.',
      `Opplysningene slettes ett år etter campen. Personvernerklæring: ${getSiteUrl()}/personvern`,
    ].join('\n\n'),
  }
}

/**
 * Varsel til Go'nok. Inneholder bevisst IKKE allergier, fødselsdato eller kontaktinfo –
 * bare en lenke til admin, der opplysningene er beskyttet av innlogging.
 */
export function registrationNotificationEmail(
  registration: Registration,
  camp: Camp,
  result: Result,
  to: string,
): Email {
  const status = result === 'waitlist' ? 'Venteliste' : 'Påmeldt'
  const adminUrl = `${getSiteUrl()}/admin/collections/registrations/${registration.id}`
  const subject = `Ny påmelding: ${camp.name} (${status})`
  const rows: Array<[string, string]> = [
    ['Deltaker', registration.participantName],
    ['Camp', camp.name],
    ['Status', status],
  ]
  const body = [
    heading('Ny påmelding'),
    detailsTable(rows),
    buttonLink(adminUrl, 'Se påmeldingen i admin'),
  ].join('')

  return {
    to,
    subject,
    html: emailLayout({ title: subject, bodyHtml: body }),
    text: `Ny påmelding\n\n${detailsText(rows)}\n\nSe påmeldingen i admin: ${adminUrl}`,
  }
}

/** Felles hjelper: lager HTML- og tekstversjon av en enkel e-post med avsnitt */
function simpleEmail(to: string, subject: string, greeting: string, paragraphs: string[]): Email {
  return {
    to,
    subject,
    html: emailLayout({
      title: subject,
      bodyHtml: [heading(greeting), ...paragraphs.map((text) => paragraph(text))].join(''),
    }),
    // Fjern HTML-tagger (<strong> o.l.) og gjør &amp; tilbake til & i tekstversjonen
    text: [greeting, ...paragraphs]
      .map((text) =>
        text
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'"),
      )
      .join('\n\n'),
  }
}

/**
 * «Du har fått plass!» – sendes når status endres fra Venteliste til Påmeldt i admin.
 * Til både deltaker og foresatt.
 */
export function spotOfferedEmails(registration: Registration, camp: Camp): Email[] {
  const participant = escapeHtml(registration.participantName)
  const campName = escapeHtml(camp.name)
  const when = escapeHtml(whenAndWhere(camp))

  return [
    simpleEmail(
      registration.participantEmail,
      `Du har fått plass på ${camp.name}!`,
      `Hei ${registration.participantName}!`,
      [
        `Det har blitt ledig plass, og du er nå <strong>påmeldt ${campName}</strong>, ${when}. Vi gleder oss til å se deg!`,
        'Praktisk informasjon, som oppmøtetid og hva du skal ha med, kommer på e-post nærmere campen.',
        'Har du spørsmål? Bare svar på denne e-posten.',
      ],
    ),
    simpleEmail(
      registration.guardianEmail,
      `Plass bekreftet: ${registration.participantName} – ${camp.name}`,
      `Hei ${registration.guardianName}!`,
      [
        `Det har blitt ledig plass, og <strong>${participant}</strong> er nå påmeldt <strong>${campName}</strong>, ${when}.`,
        'Før campen sender vi et skjema for <strong>bildesamtykke</strong> som må signeres av foresatt. Praktisk informasjon kommer også på e-post nærmere campen.',
        'Ønsker dere likevel ikke plassen? Svar på denne e-posten så snart som mulig, så kan vi gi den til nestemann på ventelisten.',
      ],
    ),
  ]
}

/**
 * Bekreftelse på avmelding – sendes når status settes til Avmeldt i admin.
 * Til både deltaker og foresatt.
 */
export function cancellationEmails(registration: Registration, camp: Camp): Email[] {
  const participant = escapeHtml(registration.participantName)
  const campName = escapeHtml(camp.name)
  const when = escapeHtml(whenAndWhere(camp))

  return [
    simpleEmail(
      registration.participantEmail,
      `Avmelding fra ${camp.name}`,
      `Hei ${registration.participantName}!`,
      [
        `Vi har registrert at du er <strong>meldt av ${campName}</strong> (${when}).`,
        'Ombestemmer du deg, er du velkommen til å melde deg på igjen så lenge påmeldingen er åpen.',
        'Er dette feil? Svar på denne e-posten.',
      ],
    ),
    simpleEmail(
      registration.guardianEmail,
      `Avmelding: ${registration.participantName} – ${camp.name}`,
      `Hei ${registration.guardianName}!`,
      [
        `Vi har registrert at <strong>${participant}</strong> er meldt av <strong>${campName}</strong> (${when}).`,
        'Er dette feil? Svar på denne e-posten.',
      ],
    ),
  ]
}
