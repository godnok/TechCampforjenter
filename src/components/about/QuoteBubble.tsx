import { RichText } from '@payloadcms/richtext-lexical/react'

import type { AboutPage } from '@/payload-types'
import styles from './QuoteBubble.module.css'

type Props = {
  quote: NonNullable<AboutPage['quote']>
}

export function QuoteBubble({ quote }: Props) {
  return (
    // <figure> + <blockquote> er den semantisk riktige måten å markere et sitat på
    <figure className={styles.quote}>
      <blockquote className={styles.bubble}>
        {/* RichText gjør innholdet fra Lexical-editoren om til HTML (<p>, <strong> osv.) */}
        <RichText data={quote} />
      </blockquote>
      {/* Roboten er pynt (alt=""), samme bilde som logoen.
          Vanlig <img> av samme grunn som i Header. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" width={183} height={165} className={styles.robot} />
    </figure>
  )
}
