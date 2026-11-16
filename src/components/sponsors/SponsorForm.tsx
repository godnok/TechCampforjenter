'use client'
// Klientkomponent: viser feilmeldinger, «Sender …» og takkemelding uten å laste siden på nytt.

import { useActionState } from 'react'

import {
  submitSponsorInquiry,
  type SponsorFormState,
} from '@/app/(frontend)/bli-sponsor/actions'
import { ErrorSummary } from '@/components/forms/ErrorSummary'
import { FormField } from '@/components/forms/FormField'
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
      {/* Feiloppsummering: skjermen rulles hit, og hver feil lenker til feltet */}
      {state.status === 'error' && (
        <ErrorSummary message={state.message} errors={state.errors ?? {}} />
      )}

      <FormField
        name="name"
        label="Navn"
        autoComplete="name"
        required
        error={state.errors?.name}
        defaultValue={state.values?.name}
      />
      <FormField
        name="company"
        label="Bedrift"
        autoComplete="organization"
        required
        error={state.errors?.company}
        defaultValue={state.values?.company}
      />
      <FormField
        name="email"
        label="E-post"
        type="email"
        autoComplete="email"
        required
        error={state.errors?.email}
        defaultValue={state.values?.email}
      />
      <FormField
        name="phone"
        label="Telefon"
        type="tel"
        autoComplete="tel"
        error={state.errors?.phone}
        defaultValue={state.values?.phone}
      />
      <FormField
        name="message"
        label="Melding"
        multiline
        required
        error={state.errors?.message}
        defaultValue={state.values?.message}
      />

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
