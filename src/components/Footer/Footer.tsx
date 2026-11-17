import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import type { IconType } from 'react-icons'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSnapchat,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa6'

import styles from './Footer.module.css'

// Kobler verdien fra nedtrekkslisten i admin (SiteSettings.ts) til navn og ikon
const platforms: Record<string, { label: string; Icon: IconType }> = {
  instagram: { label: 'Instagram', Icon: FaInstagram },
  facebook: { label: 'Facebook', Icon: FaFacebook },
  tiktok: { label: 'TikTok', Icon: FaTiktok },
  linkedin: { label: 'LinkedIn', Icon: FaLinkedin },
  youtube: { label: 'YouTube', Icon: FaYoutube },
  snapchat: { label: 'Snapchat', Icon: FaSnapchat },
}

/**
 * Footeren er en asynkron serverkomponent: den henter lenkene til sosiale medier
 * fra Payload («Innstillinger» i admin) før den rendres.
 */
export async function Footer() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const socialLinks = settings.socialLinks ?? []

  // Årstallet regnes ut automatisk, så footeren slipper å oppdateres hvert nyttår
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      {socialLinks.length > 0 && (
        // nav + aria-label: et eget, navngitt område for skjermlesere
        <nav aria-label="Sosiale medier">
          <ul className={styles.social}>
            {socialLinks.map((link) => {
              const platform = platforms[link.platform]
              if (!platform) return null
              const { label, Icon } = platform

              return (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Ikonet har ingen tekst, så aria-label forteller skjermlesere hvor lenken går
                    aria-label={`Go'nok på ${label} (åpnes i ny fane)`}
                  >
                    {/* aria-hidden: ikonet er pynt, navnet står i aria-label */}
                    <Icon aria-hidden className={styles.icon} />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}

      <p>Go&apos;nok sin Tech camp for jenter © {year}</p>
      <Link href="/personvern" className={styles.privacyLink}>
        Personvern
      </Link>
    </footer>
  )
}
