'use client'
// Klientkomponent: må kjøre i nettleseren for å se når elementet kommer inn på skjermen.

import { useEffect, useRef, useState, type ReactNode } from 'react'

import styles from './Reveal.module.css'

type Props = {
  children: ReactNode
  delay?: number // forsinkelse i millisekunder – brukes for å la elementer komme etter hverandre
  className?: string
}

/**
 * Får innholdet til å gli inn og tones frem når det scrolles inn på skjermen.
 * Bruker nettleserens innebygde IntersectionObserver – ingen ekstra pakker.
 * Animasjonen skrus av for brukere som har valgt «redusert bevegelse» (se CSS).
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // animer bare første gang
        }
      },
      {
        threshold: 0.15, // 15 % av elementet må være synlig
        rootMargin: '0px 0px -40px 0px', // start litt før bunnen av skjermen
      },
    )

    observer.observe(element)
    return () => observer.disconnect() // rydd opp når komponenten fjernes
  }, [])

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ''} ${className ?? ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
