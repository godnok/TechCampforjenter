'use client'
// Klientkomponent: viser feilmeldinger, «Sender …» og takkemelding uten å laste siden på nytt.

import { useActionState } from 'react'

import {
  submitSponsorInquiry,
  type SponsorFormState,
} from '@/app/(frontend)/bli-sponsor/actions'
import styles from './SponsorForm.module.css'

const initialState: SponsorFormState = { status: 'idle' }

export function SponsorForm() {
  // useActionState kobler skjemaet til Server Action-en:
  // state = svaret fra serveren, formAction = sendes til <form>, pending = mens den jobber
  const [state, formAction, pending] = useActionState(submitSponsorInquiry, initialState)

  if (state.status === 'success') {
    return (
      // role="status": skjermlesere leser opp takkemeldingen automatisk
      <div className={styles.success} role="status">
        <h2>Takk for henvendelsen!</h2>
        <p>Vi har mottatt meldingen din og tar kontakt så snart vi kan.</p>
      </div>
    )
  }

  return (
    // noValidate: vi viser våre egne, norske feilmeldinger fra serveren i stedet for nettleserens
    <form action={formAction} className={styles.form} noValidate>
      {state.status === 'error' && state.message && (
        // role="alert": leses opp med en gang den dukker opp
        <p className={styles.formError} role="alert">
          {state.message}
        </p>
      )}

      <Field name="name" label="Navn" autoComplete="name" required state={state} />
      <Field name="company" label="Bedrift" autoComplete="organization" required state={state} />
      <Field name="email" label="E-post" type="email" autoComplete="email" required state={state} />
      <Field name="phone" label="Telefon" type="tel" autoComplete="tel" state={state} />
      <Field name="message" label="Melding" multiline required state={state} />

      {/* Honeypot: skjult for mennesker (og skjermlesere), men roboter fyller den ut */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Ikke fyll ut dette feltet</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="button" disabled={pending}>
        {pending ? 'Sender …' : 'Send henvendelse'}
      </button>

      <p className={styles.privacy}>
        Vi bruker opplysningene bare til å svare på henvendelsen din.
      </p>
    </form>
  )
}

type FieldProps = {
  name: 'name' | 'company' | 'email' | 'phone' | 'message'
  label: string
  state: SponsorFormState
  type?: string
  autoComplete?: string
  required?: boolean
  multiline?: boolean
}

/** Ett skjemafelt med synlig label og feilmelding koblet til feltet for skjermlesere */
function Field({ name, label, state, type = 'text', autoComplete, required, multiline }: FieldProps) {
  const id = `field-${name}`
  const errorId = `${id}-error`
  const error = state.errors?.[name]

  const inputProps = {
    id,
    name,
    required,
    autoComplete,
    // Det brukeren skrev, kommer tilbake fra serveren ved feil, så det ikke forsvinner
    defaultValue: state.values?.[name],
    // aria-invalid + aria-describedby: skjermlesere sier at feltet er feil og leser feilmeldingen
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: styles.input,
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {!required && <span className={styles.optional}> (valgfritt)</span>}
      </label>

      {multiline ? <textarea rows={6} {...inputProps} /> : <input type={type} {...inputProps} />}

      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
