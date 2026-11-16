import Link from 'next/link'

import styles from './Header.module.css'
import { MobileMenu } from './MobileMenu'

// Menypunktene ligger ett sted og brukes både i desktop- og mobilmenyen.
const navLinks = [
  { href: '/', label: 'Hjem' },
  { href: '/sponsorer', label: 'Sponsorer' },
  { href: '/om-oss', label: 'Om oss' },
]

/**
 * Headeren vises øverst på alle sider (den legges inn i layout.tsx).
 * Dette er en serverkomponent: den rendres ferdig til HTML på serveren.
 * Bare hamburgermenyen (MobileMenu) trenger JavaScript i nettleseren.
 */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Tech Camp for jenter – til forsiden">
          {/* Vanlig <img> i stedet for next/image: next.config.ts tillater foreløpig
              bare bilder fra Payload (/api/media/...), og en liten logo trenger
              ikke bildeoptimalisering. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={66} height={59} />
        </Link>

        <div className={styles.actions}>
          {/* Desktop-meny – skjules på mobil via CSS */}
          <nav className={styles.desktopNav} aria-label="Hovedmeny">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* «Meld deg på» vises alltid – både på desktop og ved siden av hamburgeren på mobil */}
          <Link href="/pamelding" className={`button ${styles.cta}`}>
            Meld deg på
          </Link>

          {/* Hamburgermeny – vises bare på mobil */}
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  )
}
