'use client'
// Klientkomponent: må lese adressen i nettleseren (usePathname) for å vite hvor «tilbake» er.

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from './BackLink.module.css'

type BackTarget = { href: string; label: string }

/**
 * Regner ut siden ett nivå opp, ut fra adressen i admin:
 *  /admin/collections/sponsors/12  → listen over sponsorer
 *  /admin/collections/sponsors     → dashboardet
 *  /admin/globals/home-page        → dashboardet
 * Dashboardet, innlogging o.l. får ingen tilbakelenke (null).
 */
function getBackTarget(pathname: string): BackTarget | null {
  // "/admin/collections/sponsors/12" → ["admin", "collections", "sponsors", "12"]
  const [root, section, slug, id] = pathname.split('/').filter(Boolean)
  if (root !== 'admin') return null

  if (section === 'collections' && slug) {
    if (id) return { href: `/admin/collections/${slug}`, label: 'Tilbake til listen' }
    return { href: '/admin', label: 'Tilbake til dashboardet' }
  }

  if (section === 'globals' || section === 'account') {
    return { href: '/admin', label: 'Tilbake til dashboardet' }
  }

  return null
}

/**
 * Tilbakelenke øverst på admin-sidene.
 * Registrert i payload.config.ts under admin.components.header
 */
export function BackLink() {
  const pathname = usePathname()
  const target = getBackTarget(pathname)

  if (!target) return null

  return (
    <div className={styles.wrapper}>
      <Link href={target.href} className={styles.link}>
        <span aria-hidden="true" className={styles.arrow}>
          ←
        </span>
        {target.label}
      </Link>
    </div>
  )
}
