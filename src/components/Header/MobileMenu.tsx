'use client'
// 'use client' gjør dette til en klientkomponent: koden sendes til nettleseren
// slik at knappen kan reagere på klikk. Uten denne linjen kan vi ikke bruke useState.

import Link from 'next/link'
import { useState } from 'react'

import styles from './Header.module.css'

type NavLink = { href: string; label: string }

export function MobileMenu({ links }: { links: NavLink[] }) {
  // open = om menyen er åpen. setOpen endrer verdien og tegner komponenten på nytt.
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.mobile}>
      <button
        type="button"
        className={styles.burger}
        onClick={() => setOpen(!open)}
        // aria-* forteller skjermlesere hva knappen gjør og om menyen er åpen
        aria-expanded={open}
        aria-controls="mobilmeny"
        aria-label={open ? 'Lukk meny' : 'Åpne meny'}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <nav id="mobilmeny" className={styles.mobileNav} aria-label="Hovedmeny">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                {/* Lukk menyen når man har valgt en side */}
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
