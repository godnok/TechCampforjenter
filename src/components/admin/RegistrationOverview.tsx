import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { formatDateRange } from '@/utilities/formatDateRange'
import { countRegistered } from '@/utilities/registration'
import styles from './RegistrationOverview.module.css'

/**
 * «Påmeldinger» på admin-dashboardet: én knapp per camp med antall påmeldte og på venteliste.
 * Knappen åpner listen over påmeldinger filtrert på den campen.
 * Registrert i payload.config.ts under admin.components.beforeDashboard
 *
 * Dette er en asynkron serverkomponent – den henter tallene direkte fra databasen.
 */
export async function RegistrationOverview() {
  const payload = await getPayload({ config })
  const { docs: camps } = await payload.find({
    collection: 'camps',
    sort: 'startDate',
    pagination: false,
    depth: 0,
  })

  if (camps.length === 0) return null

  // Hent tallene for alle campene samtidig
  const stats = await Promise.all(
    camps.map(async (camp) => {
      const [registered, waitlist] = await Promise.all([
        countRegistered(payload, camp.id),
        payload
          .count({
            collection: 'registrations',
            where: {
              and: [{ camp: { equals: camp.id } }, { status: { equals: 'waitlist' } }],
            },
          })
          .then((result) => result.totalDocs),
      ])
      return { camp, registered, waitlist }
    }),
  )

  return (
    <section className={styles.overview}>
      <h2>Påmeldinger</h2>
      <ul className={styles.list}>
        {stats.map(({ camp, registered, waitlist }) => (
          <li key={camp.id} className={styles.card}>
            {/* ?where[camp][equals]=… er Payloads eget filter i listevisningen */}
            <Link
              href={`/admin/collections/registrations?where[camp][equals]=${camp.id}`}
              className={styles.mainLink}
            >
              <span className={styles.name}>{camp.name}</span>
              <span className={styles.date}>{formatDateRange(camp.startDate, camp.endDate)}</span>
              <span className={styles.counts}>
                {registered} av {camp.capacity} påmeldt · {waitlist} på venteliste
              </span>
            </Link>

            {/* Ventelisten for campen, eldste påmelding først – den som står for tur øverst */}
            {waitlist > 0 && (
              <Link
                href={`/admin/collections/registrations?where[and][0][camp][equals]=${camp.id}&where[and][1][status][equals]=waitlist&sort=createdAt`}
                className={styles.waitlistLink}
              >
                Se ventelisten ({waitlist}) <span aria-hidden="true">→</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
