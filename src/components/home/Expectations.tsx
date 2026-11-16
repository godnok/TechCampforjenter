import Image from 'next/image'

import { Reveal } from '@/components/Reveal'
import type { HomePage } from '@/payload-types'
import { getObjectPosition } from '@/utilities/getObjectPosition'
import styles from './Expectations.module.css'

type Props = {
  expectations: HomePage['expectations']
}

export function Expectations({ expectations }: Props) {
  const cards = expectations?.cards ?? []
  if (!expectations?.title && cards.length === 0) return null

  return (
    <section className={styles.expectations}>
      {expectations?.title && (
        <Reveal>
          <h2>{expectations.title}</h2>
        </Reveal>
      )}

      <div className={styles.cards}>
        {cards.map((card, index) => {
          const image = typeof card.image === 'object' ? card.image : null

          return (
            // <article> = et selvstendig innholdselement, passer for et kort
            <Reveal key={card.id} delay={index * 150}>
            <article className={styles.card}>
              {image?.url && (
                <div className={styles.imageFrame}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="168px"
                    className={styles.image}
                    style={{ objectPosition: getObjectPosition(image) }} // fokuspunkt fra admin
                  />
                </div>
              )}
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
