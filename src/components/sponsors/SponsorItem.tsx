import Image from 'next/image'

import type { Sponsor } from '@/payload-types'
import styles from './SponsorItem.module.css'

type Props = {
  sponsor: Sponsor
}

export function SponsorItem({ sponsor }: Props) {
  const logo = typeof sponsor.logo === 'object' ? sponsor.logo : null

  // Samme avsnittsregel som på Om oss: en tom linje = nytt avsnitt
  const paragraphs = (sponsor.description ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  const logoImage = logo?.url ? (
    <Image
      src={logo.url}
      alt={sponsor.name}
      width={logo.width ?? 260}
      height={logo.height ?? 70}
      sizes="260px"
      // Next.js kan ikke optimalisere SVG, så de vises som de er
      unoptimized={logo.mimeType === 'image/svg+xml'}
      className={styles.logo}
    />
  ) : null

  return (
    <article className={styles.sponsor}>
      {/* Usynlig overskrift: logoen viser navnet for øyet, h2 gir struktur for skjermlesere */}
      <h2 className="visually-hidden">{sponsor.name}</h2>

      {logoImage &&
        (sponsor.website ? (
          <a
            href={sponsor.website}
            target="_blank" // åpne i ny fane
            rel="noopener noreferrer" // sikkerhet: den nye fanen får ikke tilgang til vår side
            className={styles.logoLink}
          >
            {logoImage}
            {/* Skjermlesere leser f.eks. «Jotun (åpnes i ny fane)» */}
            <span className="visually-hidden">(åpnes i ny fane)</span>
          </a>
        ) : (
          logoImage
        ))}

      {paragraphs.map((paragraph, index) => (
        <p key={index} className={styles.description}>
          {paragraph}
        </p>
      ))}
    </article>
  )
}
