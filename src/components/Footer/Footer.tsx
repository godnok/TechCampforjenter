import styles from './Footer.module.css'

export function Footer() {
  // Årstallet regnes ut automatisk, så footeren slipper å oppdateres hvert nyttår
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <p>Go&apos;nok sin Tech camp for jenter © {year}</p>
    </footer>
  )
}
