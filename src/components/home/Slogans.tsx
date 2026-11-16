import { Reveal } from '@/components/Reveal'
import type { HomePage } from '@/payload-types'
import styles from './Slogans.module.css'

type Props = {
  slogans: HomePage['slogans'] // samme type som feltet i Payload
}

export function Slogans({ slogans }: Props) {
  if (!slogans || slogans.length === 0) return null

  return (
    // aria-label gir seksjonen et navn for skjermlesere, siden den ikke har synlig overskrift
    <section className={styles.slogans} aria-label="Slagord">
      <ul>
        {slogans.map((slogan, index) => (
          // Payload gir hver rad en unik id – perfekt som React-key
          <li key={slogan.id}>
            {/* 150 ms mellom hvert slagord, så de kommer etter hverandre */}
            <Reveal delay={index * 150}>{slogan.text}</Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
