import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import { Reveal } from '@/components/Reveal'
import { SponsorItem } from '@/components/sponsors/SponsorItem'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Sponsorer | Tech Camp for jenter',
}

// Ferske data ved hvert besøk (byttes til caching før lansering)
export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayload({ config })

  // find = hent flere dokumenter fra en Collection
  const { docs: sponsors } = await payload.find({
    collection: 'sponsors',
    sort: 'order', // lavest rekkefølge-tall først
    depth: 1, // ta med hele logo-objektet
    pagination: false, // hent alle, ikke bare de første 10
  })

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Våre sponsorer</h1>

      {sponsors.length > 0 ? (
        <ul className={styles.list}>
          {sponsors.map((sponsor) => (
            <li key={sponsor.id}>
              <Reveal>
                <SponsorItem sponsor={sponsor} />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Sponsorer kommer snart.</p>
      )}

      <div className={styles.cta}>
        <Link href="/bli-sponsor" className="button">
          Vil du også bli sponsor?
        </Link>
      </div>
    </div>
  )
}
