import type { Metadata } from 'next'

import { SponsorForm } from '@/components/sponsors/SponsorForm'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Bli sponsor | Tech Camp for jenter',
}

export default function Page() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Vil du også bli sponsor?</h1>
      <p className={styles.intro}>
        Vil bedriften din bidra til at flere jenter oppdager teknologi? Send oss en melding, så tar
        vi kontakt.
      </p>
      <SponsorForm />
    </div>
  )
}
