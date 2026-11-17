import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
} from 'payload'

import { cancellationEmails, spotOfferedEmails } from '@/emails/registrationEmails'
import { sendEmails } from '@/emails/sendEmails'
import type { Registration } from '@/payload-types'

/** Camp-feltet kan være hele objektet eller bare ID-en, avhengig av «depth» */
function getCampId(camp: Registration['camp']): number {
  return typeof camp === 'object' ? camp.id : camp
}

/**
 * SPERRE (kjører FØR lagring):
 * Hindrer at noen flyttes til «Påmeldt» når campen allerede er full.
 * Gjelder bare endringer i admin (update) – nye påmeldinger håndteres av skjemaet.
 */
export const preventOverbooking: CollectionBeforeChangeHook<Registration> = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || !originalDoc) return data

  const wasRegistered = originalDoc.status === 'registered'
  const willBeRegistered = (data.status ?? originalDoc.status) === 'registered'
  if (!willBeRegistered || wasRegistered) return data // ingen ny plass tas

  const campId = getCampId(originalDoc.camp)
  const camp = await req.payload.findByID({ collection: 'camps', id: campId, depth: 0, req })
  const { totalDocs: registered } = await req.payload.count({
    collection: 'registrations',
    where: { and: [{ camp: { equals: campId } }, { status: { equals: 'registered' } }] },
    req,
  })

  if (registered >= camp.capacity) {
    // Vises som feilmelding i admin, og lagringen stoppes
    throw new APIError(
      `Campen er full (${registered} av ${camp.capacity}). Sett en annen påmelding til Avmeldt først.`,
      400,
      undefined,
      true, // isPublic: meldingen kan vises til brukeren
    )
  }

  return data
}

/**
 * E-POST (kjører ETTER lagring):
 *  Venteliste → Påmeldt:  «Du har fått plass!»
 *  Alt        → Avmeldt:  bekreftelse på avmelding
 * Til både deltaker og foresatt. Andre endringer sender ingenting.
 */
export const sendStatusEmails: CollectionAfterChangeHook<Registration> = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || !previousDoc || previousDoc.status === doc.status) return doc

  const promoted = previousDoc.status === 'waitlist' && doc.status === 'registered'
  const cancelled = doc.status === 'cancelled'
  if (!promoted && !cancelled) return doc

  const camp = await req.payload.findByID({
    collection: 'camps',
    id: getCampId(doc.camp),
    depth: 0,
    req,
  })

  // sendEmails logger feil i stedet for å kaste dem, så statusendringen er uansett lagret
  await sendEmails(req.payload, promoted ? spotOfferedEmails(doc, camp) : cancellationEmails(doc, camp))

  return doc
}
