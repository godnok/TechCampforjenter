import Image from 'next/image'

import type { AboutPage } from '@/payload-types'
import { getObjectPosition } from '@/utilities/getObjectPosition'
import styles from './AboutSection.module.css'

// Typen til ett element i "sections"-listen
type Section = NonNullable<AboutPage['sections']>[number]

type Props = {
  section: Section
  imagePosition: 'left' | 'right'
}

export function AboutSection({ section, imagePosition }: Props) {
  // En tom linje (to linjeskift) skiller avsnittene.
  // Enkle linjeskift innenfor et avsnitt beholdes med CSS (white-space: pre-line).
  const paragraphs = section.text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  const image = typeof section.image === 'object' ? section.image : null

  return (
    <div
      className={`${styles.section} ${imagePosition === 'right' ? styles.imageRight : ''}`}
    >
      {image?.url && (
        <div className={styles.imageFrame}>
          <Image
            src={image.url}
            alt={image.alt}
            fill
            // Mobil: nesten hele skjermbredden. Desktop: 350 px.
            sizes="(max-width: 768px) 90vw, 350px"
            className={styles.image}
            style={{ objectPosition: getObjectPosition(image) }} // fokuspunkt fra admin
          />
        </div>
      )}
      <div className={styles.text}>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}
