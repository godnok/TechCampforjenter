import config from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { CampCard } from '@/components/camps/CampCard'
import { Reveal } from '@/components/Reveal'
import { countRegistered } from '@/utilities/registration'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Påmelding | Tech Camp for jenter',
}

// Ferske data ved hvert besøk – viktig når frister og plasser endrer seg
export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayload({ config })
  const { docs: camps } = await payload.find({
    collection: 'camps',
    sort: 'startDate',
    pagination: false,
  })

  // Tell påmeldte for alle campene samtidig (Promise.all) i stedet for én og én
  const registeredCounts = await Promise.all(
    camps.map((camp) => countRegistered(payload, camp.id)),
  )

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Meld deg på Tech Camp</h1>
      <p className={styles.intro}>Velg campen du vil være med på.</p>

      {camps.length > 0 ? (
        <ul className={styles.list}>
          {camps.map((camp, index) => (
            <li key={camp.id}>
              <Reveal delay={index * 150} className={styles.revealFill}>
                <CampCard camp={camp} hasSpots={registeredCounts[index] < camp.capacity} />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.intro}>Påmeldingen åpner snart.</p>
      )}
    </div>
  )
}
