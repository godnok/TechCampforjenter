/**
 * Gjør datoer fra Payload om til norsk tekst:
 *   én dag:            «10. august 2027»
 *   samme måned:       «11.–12. august 2027»
 *   ulike måneder:     «30. juli–2. august 2027»
 *
 * Viktig: Payload lagrer datoer som tidspunkt i UTC. «11. august» i admin lagres
 * som 10. august kl. 22:00 UTC. Derfor formaterer vi alltid i norsk tidssone.
 */
const TIME_ZONE = 'Europe/Oslo'

function format(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('nb-NO', { timeZone: TIME_ZONE, ...options }).format(date)
}

export function formatDate(iso: string): string {
  return format(new Date(iso), { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatDateRange(startIso: string, endIso?: string | null): string {
  const start = new Date(startIso)
  const fullStart = formatDate(startIso)

  if (!endIso) return fullStart

  const end = new Date(endIso)
  const fullEnd = formatDate(endIso)

  if (fullStart === fullEnd) return fullStart // samme dag

  const sameYear = format(start, { year: 'numeric' }) === format(end, { year: 'numeric' })
  const sameMonth = sameYear && format(start, { month: 'numeric' }) === format(end, { month: 'numeric' })

  if (sameMonth) return `${format(start, { day: 'numeric' })}–${fullEnd}` // «11.–12. august 2027»
  if (sameYear) return `${format(start, { day: 'numeric', month: 'long' })}–${fullEnd}`
  return `${fullStart}–${fullEnd}`
}
