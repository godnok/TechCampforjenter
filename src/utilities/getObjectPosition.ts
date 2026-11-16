import type { Media } from '@/payload-types'

/**
 * Gjør fokuspunktet fra admin (focalX/focalY, i prosent) om til CSS object-position.
 * Når bildet beskjæres med object-fit: cover, holdes dette punktet synlig.
 * Uten fokuspunkt brukes midten (50% 50%).
 */
export function getObjectPosition(image: Pick<Media, 'focalX' | 'focalY'>): string {
  const x = image.focalX ?? 50
  const y = image.focalY ?? 50
  return `${x}% ${y}%`
}
