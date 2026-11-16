import Link from 'next/link'

import styles from './Welcome.module.css'

// Snarveiene på dashboardet. Adressene følger slug-ene i Payload.
const shortcuts = [
  { href: '/admin/globals/home-page', label: 'Rediger forsiden' },
  { href: '/admin/globals/about-page', label: 'Rediger Om oss' },
  { href: '/admin/collections/sponsors/create', label: 'Legg til sponsor' },
  { href: '/admin/collections/media/create', label: 'Last opp bilde' },
]

/**
 * Velkomstboks øverst på admin-dashboardet.
 * Registrert i payload.config.ts under admin.components.beforeDashboard
 */
export function Welcome() {
  return (
    <section className={styles.welcome}>
      <h2>Velkommen til Tech Camp-admin</h2>
      <p>
        Her redigerer du innholdet på nettsiden. Trykk <strong>Lagre</strong> når du er ferdig, så
        vises endringene på siden. Bruk <strong>Forhåndsvis</strong> for å se siden du redigerer.
      </p>

      <ul className={styles.shortcuts}>
        {shortcuts.map((shortcut) => (
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
