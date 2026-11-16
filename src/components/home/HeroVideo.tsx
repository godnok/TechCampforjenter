'use client'
// Klientkomponent: trenger nettleseren for å starte/pause videoen og huske tilstanden.

import { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa6'

import styles from './Hero.module.css'

type Props = {
  src: string
  type: string // f.eks. "video/mp4"
  poster?: string // bilde som vises før videoen starter
}

export function HeroVideo({ src, type, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  // Start videoen når siden er lastet – men ikke hvis brukeren har valgt «redusert bevegelse»
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    video.muted = true // nettlesere tillater bare automatisk avspilling uten lyd
    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false)) // f.eks. strømsparemodus på mobil – posterbildet vises
  }, [])

  function togglePlay() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        muted
        loop
        playsInline // spill av i siden på iPhone, ikke i fullskjerm
        preload="auto"
        poster={poster}
        aria-hidden // videoen er pynt uten informasjon
      >
        <source src={src} type={type} />
      </video>

      {/* Pauseknapp: WCAG krever at bevegelse som varer over 5 sekunder kan stoppes */}
      <button
        type="button"
        className={styles.videoButton}
        onClick={togglePlay}
        aria-label={playing ? 'Pause video' : 'Spill av video'}
      >
        {playing ? <FaPause aria-hidden /> : <FaPlay aria-hidden />}
      </button>
    </>
  )
}
