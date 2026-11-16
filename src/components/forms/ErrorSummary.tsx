'use client'
// Klientkomponent: flytter fokus og skjerm til oppsummeringen når skjemaet har feil.

import { useEffect, useRef, type MouseEvent } from 'react'

import styles from './ErrorSummary.module.css'

type Props = {
  message?: string // overskrift, f.eks. «Noen av feltene må rettes.»
  errors: Partial<Record<string, string>> // feltnavn → feilmelding
}

/**
 * Feiloppsummering øverst i skjemaet:
 * – skjermen rulles hit og fokus flyttes hit automatisk
 * – hver feil er en lenke som tar deg rett til feltet
 * Feltene må ha id="field-<feltnavn>" (FormField gjør dette automatisk).
 */
export function ErrorSummary({ message, errors }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // Kjører hver gang skjemaet sendes inn med feil (errors er et nytt objekt hver gang)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
    element.focus({ preventScroll: true }) // fokus uten å rulle en gang til
  }, [message, errors])

  // Rekkefølgen følger valideringen i Server Action-en, som følger skjemaet ovenfra og ned
  const entries = Object.entries(errors).filter((entry): entry is [string, string] =>
    Boolean(entry[1]),
  )

  function goToField(event: MouseEvent<HTMLAnchorElement>, name: string) {
    // En vanlig #-lenke ruller til feltet, men setter ikke alltid fokus i feltet – det gjør vi selv
    const field = document.getElementById(`field-${name}`)
    if (!field) return
    event.preventDefault()
    field.scrollIntoView({ block: 'center' })
    field.focus({ preventScroll: true })
  }

  return (
    // tabIndex={-1}: kan få fokus fra koden, men er ikke et eget Tab-stopp
    <div
      ref={ref}
      tabIndex={-1}
      role="alert" // skjermlesere leser oppsummeringen med en gang
      aria-labelledby="error-summary-title"
      className={styles.summary}
    >
      <h2 id="error-summary-title" className={styles.title}>
        {message ?? 'Noe gikk galt'}
      </h2>
      {entries.length > 0 && (
        <ul className={styles.list}>
          {entries.map(([name, text]) => (
            <li key={name}>
              <a href={`#field-${name}`} onClick={(event) => goToField(event, name)}>
                {text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
