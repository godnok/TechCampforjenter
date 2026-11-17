import type { Payload } from 'payload'

import type { Camp } from '@/payload-types'

/** Campen er for deltakere mellom 13 og 16 år (på campens startdato) */
export const MIN_AGE = 13
export const MAX_AGE = 16

const ONE_DAY = 24 * 60 * 60 * 1000

/**
 * Er påmeldingen åpen? Fristen lagres som starten av dagen,
 * så påmeldingen er åpen ut hele fristdagen.
 */
export function isRegistrationOpen(camp: Pick<Camp, 'registrationDeadline'>): boolean {
  const deadlineEnd = new Date(camp.registrationDeadline).getTime() + ONE_DAY
  return Date.now() < deadlineEnd
}

/** År, måned og dag for et tidspunkt – i norsk tidssone */
function datePartsInNorway(date: Date) {
  // en-CA gir formatet «2027-08-11»
  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Oslo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  const [year, month, day] = formatted.split('-').map(Number)
  return { year, month, day }
}

/**
 * Alder på en gitt dato.
 * birthDate: «ÅÅÅÅ-MM-DD» (fra datovelgeren i skjemaet)
 * onDateIso: dato fra Payload, f.eks. campens startdato
 */
export function getAgeOnDate(birthDate: string, onDateIso: string): number {
  const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number)
  const { year, month, day } = datePartsInNorway(new Date(onDateIso))

  let age = year - birthYear
  // Har ikke hatt bursdag ennå det året → ett år yngre
  if (month < birthMonth || (month === birthMonth && day < birthDay)) age--
  return age
}

/** Antall deltakere med status «Påmeldt» på en camp (ikke venteliste/avmeldt) */
export async function countRegistered(payload: Payload, campId: Camp['id']): Promise<number> {
  const { totalDocs } = await payload.count({
    collection: 'registrations',
    where: {
      and: [{ camp: { equals: campId } }, { status: { equals: 'registered' } }],
    },
  })
  return totalDocs
}
