import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { Expectations } from '@/components/home/Expectations'
import { Hero } from '@/components/home/Hero'
import { Intro } from '@/components/home/Intro'
import { Slogans } from '@/components/home/Slogans'
import { Reveal } from '@/components/Reveal'
import styles from './page.module.css'

// Hent ferske data ved hvert besøk, så endringer i admin vises med en gang.
// Før lansering bytter vi til caching som oppdateres når innholdet lagres.
export const dynamic = 'force-dynamic'

export default async function Page() {
  // Payloads "Local API": henter data direkte fra databasen, uten HTTP-kall
  const payload = await getPayload({ config })
  const homePage = await payload.findGlobal({
    slug: 'home-page',
    depth: 1, // ta med hele bildeobjektet, ikke bare ID-en
  })

  return (
    <>
      {/* Sidens hovedoverskrift. Skjult visuelt (designet har ingen synlig tittel),
          men viktig for skjermlesere og søkemotorer. Seksjonene under bruker h2/h3. */}
      <h1 className="visually-hidden">Tech Camp for jenter</h1>
      <Hero image={homePage.hero?.image} video={homePage.hero?.video} />
      <Slogans slogans={homePage.slogans} />
      <Reveal className={styles.cta}>
        <Link href="/pamelding" className="button">
          Meld deg på
        </Link>
      </Reveal>
      <Intro intro={homePage.intro} />
      <Expectations expectations={homePage.expectations} />
    </>
  )
}
