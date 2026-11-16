import config from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { AboutSection } from '@/components/about/AboutSection'
import { QuoteBubble } from '@/components/about/QuoteBubble'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Om oss | Tech Camp for jenter',
}

// Samme som forsiden: ferske data ved hvert besøk (byttes til caching før lansering)
export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({
    slug: 'about-page',
    depth: 1,
  })

  // Første seksjon vises før snakkeboblen, resten etter – som i Figma
  const [firstSection, ...otherSections] = about.sections ?? []

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{about.title}</h1>

      {firstSection && <AboutSection section={firstSection} imagePosition="left" />}

      {about.quote && <QuoteBubble quote={about.quote} />}

      {otherSections.map((section, index) => (
        <AboutSection
          key={section.id}
          section={section}
          // Annenhver: høyre, venstre, høyre ... (første seksjon over var venstre)
          imagePosition={index % 2 === 0 ? 'right' : 'left'}
        />
      ))}
    </div>
  )
}
