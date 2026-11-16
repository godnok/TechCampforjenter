'use client'
// Klientkomponent: viser/skjuler allergifeltet, «Sender …», feilmeldinger og takkemelding.

import Link from 'next/link'
import { useActionState, useState } from 'react'

import {
  submitRegistration,
  type RegistrationFormState,
} from '@/app/(frontend)/pamelding/[slug]/actions'
import { ErrorSummary } from '@/components/forms/ErrorSummary'
import { FormField } from '@/components/forms/FormField'
import type { Camp } from '@/payload-types'
import styles from './RegistrationForm.module.css'

const initialState: RegistrationFormState = { status: 'idle' }

type Props = {
  campId: Camp['id']
  campName: string
}

export function RegistrationForm({ campId, campName }: Props) {
  // .bind «låser» campId som første argument til Server Action-en
  const action = submitRegistration.bind(null, campId)
  const [state, formAction, pending] = useActionState(action, initialState)

  // Styrer om tekstfeltet for allergier vises. Kontrollert, så valget ikke nullstilles ved feil.
  const [hasAllergies, setHasAllergies] = useState(state.values?.hasAllergies ?? '')

  if (state.status === 'success') {
    return (
      <div className={styles.success} role="status">
        {state.result === 'waitlist' ? (
          <>
            <h2>Du står på venteliste</h2>
            <p>
              {campName} er dessverre full akkurat nå, så du er satt på ventelisten. Vi tar kontakt
              hvis det blir ledig plass.
            </p>
          </>
        ) : (
          <>
            <h2>Takk, du er påmeldt!</h2>
            <p>Vi har mottatt påmeldingen din til {campName}. Vi gleder oss til å se deg!</p>
          </>
        )}
      </div>
    )
  }

  const errors = state.errors ?? {}
  const values = state.values ?? {}

  return (
    <form action={formAction} className={styles.form} noValidate>
      {/* Feiloppsummering: skjermen rulles hit, og hver feil lenker til feltet */}
      {state.status === 'error' && (
        <ErrorSummary message={state.message} errors={state.errors ?? {}} />
      )}

      {/* fieldset + legend: grupperer feltene, og skjermlesere leser gruppens navn */}
      <fieldset className={styles.fieldset}>
        <legend>Om deg</legend>
        <FormField
          name="participantName"
          label="Fullt navn"
          autoComplete="name"
          required
          error={errors.participantName}
          defaultValue={values.participantName}
        />
        <FormField
          name="participantPhone"
          label="Telefonnummer"
          type="tel"
          autoComplete="tel"
          required
          error={errors.participantPhone}
          defaultValue={values.participantPhone}
        />
        <FormField
          name="participantEmail"
          label="E-postadresse"
          type="email"
          autoComplete="email"
          required
          error={errors.participantEmail}
          defaultValue={values.participantEmail}
        />
        <FormField
          name="birthDate"
          label="Fødselsdato"
          type="date"
          autoComplete="bday"
          required
          hint="Tech Camp er for deg mellom 13 og 16 år."
          error={errors.birthDate}
          defaultValue={values.birthDate}
        />
        <FormField
          name="school"
          label="Hvilken skole går du på?"
          required
          error={errors.school}
          defaultValue={values.school}
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Foresatt</legend>
        <FormField
          name="guardianName"
          label="Foresattes navn"
          required
          error={errors.guardianName}
          defaultValue={values.guardianName}
        />
        <FormField
          name="guardianPhone"
          label="Foresattes telefonnummer"
          type="tel"
          required
          error={errors.guardianPhone}
          defaultValue={values.guardianPhone}
        />
        <FormField
          name="guardianEmail"
          label="Foresattes e-post"
          type="email"
          required
          error={errors.guardianEmail}
          defaultValue={values.guardianEmail}
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Annet</legend>

        {/* Ja/Nei som radioknapper i egen gruppe */}
        <fieldset
          className={styles.radioGroup}
          aria-describedby={errors.hasAllergies ? 'hasAllergies-error' : undefined}
        >
          <legend>Har du noen matallergier?</legend>
          <label className={styles.choice}>
            <input
              id="field-hasAllergies" // lenkemål fra feiloppsummeringen
              type="radio"
              name="hasAllergies"
              value="no"
              checked={hasAllergies === 'no'}
              onChange={() => setHasAllergies('no')}
            />
            Nei
          </label>
          <label className={styles.choice}>
            <input
              type="radio"
              name="hasAllergies"
              value="yes"
              checked={hasAllergies === 'yes'}
              onChange={() => setHasAllergies('yes')}
            />
            Ja
          </label>
          {errors.hasAllergies && (
            <p id="hasAllergies-error" className={styles.error}>
              {errors.hasAllergies}
            </p>
          )}
        </fieldset>

        {hasAllergies === 'yes' && (
          <FormField
            name="allergies"
            label="Hvilke matallergier har du?"
            multiline
            required
            error={errors.allergies}
            defaultValue={values.allergies}
          />
        )}

        <FormField
          name="referredBy"
          label="Har du blitt vervet av en venn? Skriv hele navnet på den som vervet deg."
          error={errors.referredBy}
          defaultValue={values.referredBy}
        />
      </fieldset>

      {/* Samtykke */}
      <div className={styles.consent}>
        <label className={styles.choice}>
          <input
            id="field-privacyConsent" // lenkemål fra feiloppsummeringen
            type="checkbox"
            name="privacyConsent"
            defaultChecked={values.privacyConsent === 'on'}
            aria-invalid={errors.privacyConsent ? true : undefined}
            aria-describedby={errors.privacyConsent ? 'privacyConsent-error' : undefined}
          />
          <span>
            Foresatt samtykker til at opplysningene lagres og brukes til å gjennomføre campen.
            Opplysningene slettes ett år etter campen. Les{' '}
            <Link href="/personvern" target="_blank">
              personvernerklæringen
              <span className="visually-hidden"> (åpnes i ny fane)</span>
            </Link>
            .
          </span>
        </label>
        {errors.privacyConsent && (
          <p id="privacyConsent-error" className={styles.error}>
            {errors.privacyConsent}
          </p>
        )}
      </div>

      {/* Honeypot: skjult for mennesker og skjermlesere */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Ikke fyll ut dette feltet</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="button" disabled={pending}>
        {pending ? 'Sender …' : 'Send påmelding'}
      </button>
    </form>
  )
}
