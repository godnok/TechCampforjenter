import Image from 'next/image'

import type { Media } from '@/payload-types'
import { getObjectPosition } from '@/utilities/getObjectPosition'
import styles from './Hero.module.css'
import { HeroVideo } from './HeroVideo'

type Props = {
  // Payload gir oss enten hele objektet, bare ID-en (tall) eller ingenting,
  // avhengig av "depth" i spørringen og om noe er valgt i admin.
  image?: Media | number | null
  video?: Media | number | null
}

export function Hero({ image, video }: Props) {
  // Bruk bare objekter som faktisk har en adresse (url)
  const imageDoc = image && typeof image === 'object' && image.url ? image : null
  const videoDoc = video && typeof video === 'object' && video.url ? video : null

  if (!imageDoc && !videoDoc) return null

  return (
    <section className={styles.hero}>
      {videoDoc?.url ? (
        <HeroVideo
          src={videoDoc.url}
          type={videoDoc.mimeType ?? 'video/mp4'}
          // Hero-bildet vises mens videoen laster (poster)
          poster={imageDoc?.url ?? undefined}
        />
      ) : (
        imageDoc?.url && (
          <Image
            src={imageDoc.url}
            alt={imageDoc.alt}
            fill // fyller hele .hero-boksen
            sizes="100vw" // bildet er alltid like bredt som skjermen
            priority // første bildet på siden – last det med en gang
            className={styles.image}
            style={{ objectPosition: getObjectPosition(imageDoc) }} // fokuspunkt fra admin
          />
        )
      )}
    </section>
  )
}
