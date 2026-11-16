import Image from 'next/image'

import type { HomePage } from '@/payload-types'
import styles from './Expectations.module.css'

type Props = {
  expectations: HomePage['expectations']
}

export function Expectations({ expectations }: Props) {
  const cards = expectations?.cards ?? []
  if (!expectations?.title && cards.length === 0) return null

  return (
    <section className={styles.expectations}>
      {expectations?.title && <h2>{expectations.title}</h2>}

      <div className={styles.cards}>
        {cards.map((card) => {
          const image = typeof card.image === 'object' ? card.image : null

          return (
            // <article> = et selvstendig innholdselement, passer for et kort
            <article key={card.id} className={styles.card}>
              {image?.url && (
                <div className={styles.imageFrame}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="168px"
                    className={styles.image}
                  />
                </div>
              )}
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
