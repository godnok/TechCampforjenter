import Link from 'next/link'

import type { Camp } from '@/payload-types'
import { formatDate, formatDateRange } from '@/utilities/formatDateRange'
import { isRegistrationOpen } from '@/utilities/registration'
import styles from './CampCard.module.css'

type Props = {
  camp: Camp
  hasSpots: boolean // regnes ut på siden (antall påmeldte < antall plasser)
}

/** En stor, klikkbar knapp for én camp på /pamelding */
export function CampCard({ camp, hasSpots }: Props) {
  // Felles sjekk av fristen (samme regel som skjemaet bruker)
  const isOpen = isRegistrationOpen(camp)

  const content = (
    <>
      <h2 className={styles.name}>{camp.name}</h2>
      <p className={styles.date}>{formatDateRange(camp.startDate, camp.endDate)}</p>
      <p className={styles.location}>{camp.location}</p>
      {camp.description && <p className={styles.description}>{camp.description}</p>}
      <p className={styles.deadline}>Påmeldingsfrist: {formatDate(camp.registrationDeadline)}</p>
      {isOpen && (
        <p className={hasSpots ? styles.available : styles.full}>
          {hasSpots ? 'Ledige plasser' : 'Fullt – venteliste'}
        </p>
      )}
      <span className={styles.action}>
        {isOpen ? (
          <>
            Meld deg på <span aria-hidden="true">→</span>
          </>
        ) : (
          'Påmeldingen er stengt'
        )}
      </span>
    </>
  )

  if (!isOpen) {
    // Ikke en lenke når fristen er ute – da kan den heller ikke tabbes til
    return <div className={`${styles.card} ${styles.closed}`}>{content}</div>
  }

  return (
    <Link href={`/pamelding/${camp.slug}`} className={styles.card}>
      {content}
    </Link>
  )
}
