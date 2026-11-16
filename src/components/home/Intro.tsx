import Image from 'next/image'

import type { HomePage } from '@/payload-types'
import { getObjectPosition } from '@/utilities/getObjectPosition'
import styles from './Intro.module.css'

type Props = {
  intro: HomePage['intro']
}

export function Intro({ intro }: Props) {
  if (!intro?.title) return null

  // Del teksten opp i avsnitt: én linje i admin = ett <p> på siden.
  // filter fjerner tomme linjer, så ekstra linjeskift ikke gir tomme avsnitt.
  const paragraphs = (intro.text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  // Bildet kan være et objekt (med depth: 1), en ID eller tomt
  const image = typeof intro.image === 'object' ? intro.image : null

  return (
    <section className={styles.intro}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <h2>{intro.title}</h2>
          {paragraphs.map((paragraph, index) => (
            // index som key er greit her: avsnittene endrer ikke rekkefølge mens siden vises
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {image?.url && (
          <div className={styles.imageFrame}>
            <Image
              src={image.url}
              alt={image.alt}
              fill
              // Bildet er 280 px bredt på desktop og maks 280 px på mobil
              sizes="280px"
              className={styles.image}
              style={{ objectPosition: getObjectPosition(image) }} // fokuspunkt fra admin
            />
          </div>
        )}
      </div>
    </section>
  )
}
