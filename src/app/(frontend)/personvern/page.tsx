import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { formatDate } from '@/utilities/formatDateRange'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Personvern | Tech Camp for jenter',
}

// Ferske data ved hvert besøk (byttes til caching før lansering)
export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayload({ config })
  const privacy = await payload.findGlobal({ slug: 'privacy-page' })

  return (
    <article className={styles.page}>
      <h1 className={styles.title}>{privacy.title || 'Personvernerklæring'}</h1>

      {privacy.lastUpdated && (
        <p className={styles.updated}>Sist oppdatert: {formatDate(privacy.lastUpdated)}</p>
      )}

      {privacy.content ? (
        // RichText gjør innholdet fra editoren om til HTML (overskrifter, avsnitt, lister, lenker)
        <div className={styles.content}>
          <RichText data={privacy.content} />
        </div>
      ) : (
        // Plassholder til teksten er godkjent og lagt inn i admin
        <p className={styles.placeholder}>
          Personvernerklæringen er under arbeid. Har du spørsmål om hvordan vi behandler
          personopplysninger, kontakt oss på{' '}
          <a href="mailto:info@gonok.no">info@gonok.no</a>.
        </p>
      )}
    </article>
  )
}
