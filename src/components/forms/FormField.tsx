import styles from './FormField.module.css'

type Props = {
  name: string
  label: string
  error?: string // feilmelding fra serveren
  defaultValue?: string // det brukeren skrev, så det ikke forsvinner ved feil
  hint?: string // hjelpetekst under label
  type?: string
  autoComplete?: string
  required?: boolean
  multiline?: boolean
}

/**
 * Ett skjemafelt med synlig label, valgfri hjelpetekst og feilmelding.
 * Brukes av både sponsorskjemaet og påmeldingsskjemaet.
 */
export function FormField({
  name,
  label,
  error,
  defaultValue,
  hint,
  type = 'text',
  autoComplete,
  required,
  multiline,
}: Props) {
  const id = `field-${name}`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  // aria-describedby kobler hjelpetekst og feilmelding til feltet, så skjermlesere leser dem
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  const inputProps = {
    id,
    name,
    required,
    autoComplete,
    defaultValue,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
    className: styles.input,
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {!required && <span className={styles.optional}> (valgfritt)</span>}
      </label>

      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}

      {multiline ? <textarea rows={6} {...inputProps} /> : <input type={type} {...inputProps} />}

      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
