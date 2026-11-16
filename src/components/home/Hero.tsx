import Image from 'next/image'

import type { Media } from '@/payload-types'
import styles from './Hero.module.css'

type Props = {
  // Payload gir oss enten hele bildeobjektet, bare ID-en (tall) eller ingenting,
  // avhengig av "depth" i spørringen og om bildet er valgt i admin.
  image?: Media | number | null
}

export function Hero({ image }: Props) {
  // Vis ingenting hvis bildet ikke er valgt ennå
  if (!image || typeof image === 'number' || !image.url) return null

  return (
    <section className={styles.hero}>
      <Image
        src={image.url}
        alt={image.alt}
        fill // fyller hele .hero-boksen
        sizes="100vw" // bildet er alltid like bredt som skjermen
        priority // første bildet på siden – last det med en gang
        className={styles.image}
      />
    </section>
  )
}
