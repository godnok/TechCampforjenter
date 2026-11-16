'use server'
// Server Action: denne funksjonen kjører bare på serveren, selv om skjemaet (i nettleseren) kaller den.

import config from '@payload-config'
import { getPayload } from 'payload'

type FieldName = 'name' | 'company' | 'email' | 'phone' | 'message'

export type SponsorFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string // feilmelding for hele skjemaet
  errors?: Partial<Record<FieldName, string>> // feilmelding per felt
  values?: Partial<Record<FieldName, string>> // det brukeren skrev, så det ikke forsvinner ved feil
}

const MAX_LENGTH = 5000

export async function submitSponsorInquiry(
  _previousState: SponsorFormState,
  formData: FormData,
): Promise<SponsorFormState> {
  const get = (key: string) => String(formData.get(key) ?? '').trim()

  // Honeypot: et skjult felt mennesker ikke ser. Er det fylt ut, er det en robot.
  // Vi later som alt gikk bra, men lagrer ingenting.
  if (get('website')) {
    return { status: 'success' }
  }

  const values = {
    name: get('name'),
    company: get('company'),
    email: get('email'),
    phone: get('phone'),
    message: get('message'),
  }

  // Sjekk feltene på serveren – nettleseren kan aldri stoles på alene
  const errors: SponsorFormState['errors'] = {}
  if (!values.name) errors.name = 'Skriv inn navnet ditt.'
  if (!values.company) errors.company = 'Skriv inn navnet på bedriften.'
  if (!values.email) {
    errors.email = 'Skriv inn e-postadressen din.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'E-postadressen ser ikke riktig ut.'
  }
  if (!values.message) {
    errors.message = 'Skriv en kort melding.'
  } else if (values.message.length > MAX_LENGTH) {
    errors.message = `Meldingen kan være maks ${MAX_LENGTH} tegn.`
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Noen av feltene må rettes.', errors, values }
  }

  try {
    const payload = await getPayload({ config })
    // Local API hopper over access-reglene (overrideAccess er standard her),
    // så skjemaet kan lagre selv om det offentlige API-et er stengt.
    await payload.create({
      collection: 'sponsor-inquiries',
      data: {
        name: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone || undefined,
        message: values.message,
        status: 'new',
      },
    })
    return { status: 'success' }
  } catch (error) {
    // Logges på serveren, så vi kan feilsøke – brukeren får en vennlig melding
    console.error('Kunne ikke lagre sponsorhenvendelse:', error)
    return {
      status: 'error',
      message: 'Noe gikk galt da vi skulle sende henvendelsen. Prøv igjen litt senere.',
      values,
    }
  }
}
