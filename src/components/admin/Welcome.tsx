import Link from 'next/link'

import { hasRole, type Role } from '@/access/roles'

import styles from './Welcome.module.css'

// Snarveiene på dashboardet, og hvilke roller som ser dem. Adressene følger slug-ene i Payload.
const shortcuts: Array<{ href: string; label: string; roles: Role[] }> = [
  { href: '/admin/globals/home-page', label: 'Rediger forsiden', roles: ['admin', 'editor'] },
  { href: '/admin/globals/about-page', label: 'Rediger Om oss', roles: ['admin', 'editor'] },
  {
    href: '/admin/collections/sponsors/create',
    label: 'Legg til sponsor',
    roles: ['admin', 'editor'],
  },
  { href: '/admin/collections/media/create', label: 'Last opp bilde', roles: ['admin', 'editor'] },
  {
    href: '/admin/collections/registrations',
    label: 'Alle påmeldinger',
    roles: ['admin', 'registrationManager'],
  },
]

// Payload sender bl.a. den innloggede brukeren til komponenter på dashboardet
type Props = {
  user?: { role?: string | null } | null
}

/**
 * Velkomstboks øverst på admin-dashboardet.
 * Registrert i payload.config.ts under admin.components.beforeDashboard
 */
export function Welcome({ user }: Props) {
  const visibleShortcuts = shortcuts.filter((shortcut) => hasRole(user, ...shortcut.roles))

  return (
    <section className={styles.welcome}>
      <h2>Velkommen til Tech Camp-admin</h2>
      <p>
        Her redigerer du innholdet på nettsiden. Trykk <strong>Lagre</strong> når du er ferdig, så
        vises endringene på siden. Bruk <strong>Forhåndsvis</strong> for å se siden du redigerer.
      </p>

      <ul className={styles.shortcuts}>
        {visibleShortcuts.map((shortcut) => (
          <li key={shortcut.href}>
            <Link href={shortcut.href}>{shortcut.label}</Link>
          </li>
        ))}
        <li>
          {/* Vanlig <a> fordi nettsiden ligger utenfor admin, og den åpnes i ny fane */}
          <a href="/" target="_blank" rel="noopener noreferrer">
            Se nettsiden ↗
          </a>
        </li>
      </ul>
    </section>
  )
}
