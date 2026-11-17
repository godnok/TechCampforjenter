import Link from 'next/link'
import { FaArrowRightFromBracket } from 'react-icons/fa6'

import styles from './LogoutButton.module.css'

/**
 * Tydelig «Logg ut»-knapp nederst i admin-menyen (erstatter Payloads lille ikon).
 * Registrert i payload.config.ts under admin.components.logout.Button
 *
 * prefetch={false}: <Link> henter ellers sider i forkant for å gjøre dem raskere –
 * det vil vi ikke for en utloggingsside.
 */
export function LogoutButton() {
  return (
    <Link href="/admin/logout" prefetch={false} className={styles.button}>
      <FaArrowRightFromBracket aria-hidden className={styles.icon} />
      Logg ut
    </Link>
  )
}
