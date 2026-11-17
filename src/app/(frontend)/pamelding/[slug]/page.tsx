import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { RegistrationForm } from '@/components/camps/RegistrationForm'
import { formatDateRange } from '@/utilities/formatDateRange'
import { countRegistered, isRegistrationOpen } from '@/utilities/registration'
import styles from './page.module.css'

// Ferske data ved hvert besøk – antall plasser og frist må alltid være riktig
export const dynamic = 'force-dynamic'

// [slug] i mappenavnet: samme side brukes for /pamelding/sandefjord og /pamelding/tonsberg
type Props = {
  params: Promise<{ slug: string }>
}

async function getCamp(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'camps',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return { payload, camp: docs[0] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { camp } = await getCamp(slug)
  return { title: camp ? `Påmelding ${camp.name} | Tech Camp for jenter` : 'Påmelding' }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const { payload, camp } = await getCamp(slug)

  if (!camp) notFound() // ukjent adresse → 404-side

  const open = isRegistrationOpen(camp)
  const hasSpots = (await countRegistered(payload, camp.id)) < camp.capacity

  return (
    <div className={styles.page}>
      <Link href="/pamelding" className={styles.back}>
        <span aria-hidden="true">←</span> Alle camper
      </Link>

      <h1 className={styles.title}>Påmelding: {camp.name}</h1>
      <p className={styles.meta}>
        {formatDateRange(camp.startDate, camp.endDate)} · {camp.location}
      </p>

      {open ? (
        <>
          <p className={hasSpots ? styles.available : styles.full}>
            {hasSpots
              ? 'Ledige plasser'
              : 'Campen er full – du kan melde deg på venteliste'}
          </p>
          <RegistrationForm campId={camp.id} campName={camp.name} />
        </>
      ) : (
        <p className={styles.closed}>Påmeldingen til denne campen er stengt.</p>
      )}
    </div>
  )
}
