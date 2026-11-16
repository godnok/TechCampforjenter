'use server'
// Server Action: kjører bare på serveren. Alle sjekker skjer her – nettleseren kan aldri stoles på alene.

import config from '@payload-config'
import { getPayload } from 'payload'

import type { Camp } from '@/payload-types'
import {
  countRegistered,
  getAgeOnDate,
  isRegistrationOpen,
  MAX_AGE,
  MIN_AGE,
} from '@/utilities/registration'

export type RegistrationFieldName =
  | 'participantName'
  | 'participantPhone'
  | 'participantEmail'
  | 'birthDate'
  | 'school'
  | 'guardianName'
  | 'guardianPhone'
  | 'guardianEmail'
  | 'hasAllergies'
  | 'allergies'
  | 'referredBy'
  | 'privacyConsent'

export type RegistrationFormState = {
  status: 'idle' | 'success' | 'error'
  result?: 'registered' | 'waitlist' // fikk plass, eller havnet på venteliste
  message?: string
  errors?: Partial<Record<RegistrationFieldName, string>>
  values?: Partial<Record<RegistrationFieldName, string>>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Godtar norske og utenlandske nummer: sifre, mellomrom, bindestrek, parentes og ev. + først */
function isValidPhone(value: string): boolean {
  if (!/^\+?[0-9\s()-]+$/.test(value)) return false
  const digits = value.replace(/\D/g, '').length
  return digits >= 8 && digits <= 15
}

/** Gyldig dato på formatet ÅÅÅÅ-MM-DD (fra datovelgeren) */
function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}

// campId «bindes» inn fra skjemaet med .bind(), så vi vet hvilken camp det gjelder
export async function submitRegistration(
  campId: Camp['id'],
  _previousState: RegistrationFormState,
  formData: FormData,
): Promise<RegistrationFormState> {
  const get = (key: string) => String(formData.get(key) ?? '').trim()

  // Honeypot: skjult felt som bare roboter fyller ut
  if (get('website')) return { status: 'success', result: 'registered' }

  const values = {
    participantName: get('participantName'),
    participantPhone: get('participantPhone'),
    participantEmail: get('participantEmail').toLowerCase(),
    birthDate: get('birthDate'),
    school: get('school'),
    guardianName: get('guardianName'),
    guardianPhone: get('guardianPhone'),
    guardianEmail: get('guardianEmail').toLowerCase(),
    hasAllergies: get('hasAllergies'),
    allergies: get('allergies'),
    referredBy: get('referredBy'),
    privacyConsent: formData.get('privacyConsent') === 'on' ? 'on' : '',
  }

  const payload = await getPayload({ config })

  // Finnes campen, og er påmeldingen fortsatt åpen?
  const camp = await payload.findByID({ collection: 'camps', id: campId }).catch(() => null)
  if (!camp) {
    return { status: 'error', message: 'Vi fant ikke campen. Gå tilbake og prøv igjen.', values }
  }
  if (!isRegistrationOpen(camp)) {
    return { status: 'error', message: 'Påmeldingsfristen for denne campen er ute.', values }
  }

  // ---------- Sjekk feltene ----------
  const errors: RegistrationFormState['errors'] = {}
  const tooLong = (value: string, max: number) => value.length > max

  if (!values.participantName) errors.participantName = 'Skriv inn fullt navn.'
  else if (tooLong(values.participantName, 200)) errors.participantName = 'Navnet er for langt.'

  if (!values.participantPhone) errors.participantPhone = 'Skriv inn telefonnummeret ditt.'
  else if (!isValidPhone(values.participantPhone))
    errors.participantPhone = 'Telefonnummeret ser ikke riktig ut.'

  if (!values.participantEmail) errors.participantEmail = 'Skriv inn e-postadressen din.'
  else if (!EMAIL_PATTERN.test(values.participantEmail))
    errors.participantEmail = 'E-postadressen ser ikke riktig ut.'

  if (!values.birthDate) {
    errors.birthDate = 'Velg fødselsdatoen din.'
  } else if (!isValidDate(values.birthDate)) {
    errors.birthDate = 'Fødselsdatoen ser ikke riktig ut.'
  } else {
    const age = getAgeOnDate(values.birthDate, camp.startDate)
    if (age < MIN_AGE || age > MAX_AGE) {
      errors.birthDate = `Tech Camp er for deg som er mellom ${MIN_AGE} og ${MAX_AGE} år når campen starter.`
    }
  }

  if (!values.school) errors.school = 'Skriv inn hvilken skole du går på.'
  else if (tooLong(values.school, 200)) errors.school = 'Skolenavnet er for langt.'

  if (!values.guardianName) errors.guardianName = 'Skriv inn navnet til en foresatt.'
  else if (tooLong(values.guardianName, 200)) errors.guardianName = 'Navnet er for langt.'

  if (!values.guardianPhone) errors.guardianPhone = 'Skriv inn telefonnummeret til foresatt.'
  else if (!isValidPhone(values.guardianPhone))
    errors.guardianPhone = 'Telefonnummeret ser ikke riktig ut.'

  if (!values.guardianEmail) errors.guardianEmail = 'Skriv inn e-postadressen til foresatt.'
  else if (!EMAIL_PATTERN.test(values.guardianEmail))
    errors.guardianEmail = 'E-postadressen ser ikke riktig ut.'

  if (values.hasAllergies !== 'no' && values.hasAllergies !== 'yes') {
    errors.hasAllergies = 'Velg om du har matallergier.'
  } else if (values.hasAllergies === 'yes' && !values.allergies) {
    errors.allergies = 'Skriv hvilke matallergier du har.'
  } else if (tooLong(values.allergies, 1000)) {
    errors.allergies = 'Teksten er for lang.'
  }

  if (tooLong(values.referredBy, 200)) errors.referredBy = 'Navnet er for langt.'

  if (!values.privacyConsent) errors.privacyConsent = 'Samtykke må gis for å melde seg på.'

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Noen av feltene må rettes.', errors, values }
  }

  // Lagres midt på dagen (UTC), så datoen aldri forskyves av tidssoner
  const birthDateIso = `${values.birthDate}T12:00:00.000Z`

  try {
    // ---------- Duplikat: allerede påmeldt denne campen? ----------
    const { totalDocs: duplicates } = await payload.count({
      collection: 'registrations',
      where: {
        and: [
          { camp: { equals: camp.id } },
          { status: { not_equals: 'cancelled' } }, // avmeldte kan melde seg på igjen
          {
            or: [
              { participantEmail: { equals: values.participantEmail } },
              {
                and: [
                  { participantName: { equals: values.participantName } },
                  { birthDate: { equals: birthDateIso } },
                ],
              },
            ],
          },
        ],
      },
    })
    if (duplicates > 0) {
      return {
        status: 'error',
        message: `Du er allerede påmeldt ${camp.name}. Ta kontakt med oss hvis noe er feil.`,
        values,
      }
    }

    // ---------- Plass eller venteliste? ----------
    const registeredCount = await countRegistered(payload, camp.id)
    let result: 'registered' | 'waitlist' =
      registeredCount < camp.capacity ? 'registered' : 'waitlist'

    const created = await payload.create({
      collection: 'registrations',
      data: {
        camp: camp.id,
        status: result,
        participantName: values.participantName,
        participantPhone: values.participantPhone,
        participantEmail: values.participantEmail,
        birthDate: birthDateIso,
        school: values.school,
        guardianName: values.guardianName,
        guardianPhone: values.guardianPhone,
        guardianEmail: values.guardianEmail,
        hasAllergies: values.hasAllergies as 'no' | 'yes',
        allergies: values.hasAllergies === 'yes' ? values.allergies : undefined,
        referredBy: values.referredBy || undefined,
        privacyConsent: true,
      },
    })

    // ---------- Dobbeltsjekk ved samtidige påmeldinger ----------
    // Meldte to seg på samme sekund og tok den siste plassen, settes den sist ankomne
    // på venteliste. Vi henter de første [antall plasser] påmeldte, sortert på tidspunkt.
    if (result === 'registered') {
      const { docs: firstRegistered } = await payload.find({
        collection: 'registrations',
        where: {
          and: [{ camp: { equals: camp.id } }, { status: { equals: 'registered' } }],
        },
        sort: 'createdAt',
        limit: camp.capacity,
        depth: 0,
      })
      if (!firstRegistered.some((registration) => registration.id === created.id)) {
        await payload.update({
          collection: 'registrations',
          id: created.id,
          data: { status: 'waitlist' },
        })
        result = 'waitlist'
      }
    }

    return { status: 'success', result }
  } catch (error) {
    console.error('Kunne ikke lagre påmelding:', error)
    return {
      status: 'error',
      message: 'Noe gikk galt da vi skulle lagre påmeldingen. Prøv igjen litt senere.',
      values,
    }
  }
}
