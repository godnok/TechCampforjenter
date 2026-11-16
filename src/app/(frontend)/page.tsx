import config from '@payload-config'
import { getPayload } from 'payload'

import { Hero } from '@/components/home/Hero'

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

  return <Hero image={homePage.hero?.image} />
}
