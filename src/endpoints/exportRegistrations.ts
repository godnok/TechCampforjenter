import ExcelJS from 'exceljs'
import type { Endpoint } from 'payload'

import { hasRole } from '@/access/roles'

import type { Registration } from '@/payload-types'

const STATUS_LABELS: Record<Registration['status'], string> = {
  registered: 'Påmeldt',
  waitlist: 'Venteliste',
  cancelled: 'Avmeldt',
}

/** Dato som 08.02.2014 (norsk tid) */
function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('nb-NO', {
    timeZone: 'Europe/Oslo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
}

/** Dato og klokkeslett i norsk tid, f.eks. «17.11.2026, 09:30» */
function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('nb-NO', {
    timeZone: 'Europe/Oslo',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso))
}

// Kolonnebredde i Excel måles omtrent i antall tegn
const MIN_WIDTH = 10
const MAX_WIDTH = 50 // lengre tekst (f.eks. allergier) brytes over flere linjer

/**
 * GET /api/registrations/export?camp=<id>&status=registered|waitlist
 *
 * Lager en ekte Excel-fil (.xlsx) med tilpassede kolonnebredder, fet overskrift,
 * låst overskriftsrad og filterknapper. Filen lages bare når den lastes ned –
 * ingenting lagres på serveren.
 */
export const exportRegistrations: Endpoint = {
  path: '/export', // blir /api/registrations/export fordi den ligger på Registrations
  method: 'get',
  handler: async (req) => {
    // Bare administrator og påmeldingsansvarlig (sjekkes også av access-reglene i spørringen under)
    if (!req.user) {
      return Response.json({ error: 'Du må være logget inn.' }, { status: 401 })
    }
    if (!hasRole(req.user, 'admin', 'registrationManager')) {
      return Response.json({ error: 'Du har ikke tilgang til deltakerlister.' }, { status: 403 })
    }

    const campId = Number(req.searchParams.get('camp'))
    const status = req.searchParams.get('status') ?? 'registered'

    if (!Number.isInteger(campId) || (status !== 'registered' && status !== 'waitlist')) {
      return Response.json({ error: 'Ugyldig camp eller status.' }, { status: 400 })
    }

    const camp = await req.payload
      .findByID({ collection: 'camps', id: campId, depth: 0, req })
      .catch(() => null)
    if (!camp) {
      return Response.json({ error: 'Fant ikke campen.' }, { status: 404 })
    }

    const { docs } = await req.payload.find({
      collection: 'registrations',
      where: { and: [{ camp: { equals: campId } }, { status: { equals: status } }] },
      // Venteliste: den som meldte seg på først, øverst. Påmeldte: alfabetisk.
      sort: status === 'waitlist' ? 'createdAt' : 'participantName',
      pagination: false,
      depth: 0,
      req,
      overrideAccess: false, // bruk tilgangsreglene til den innloggede brukeren
      user: req.user,
    })

    const isWaitlist = status === 'waitlist'

    const header = [
      ...(isWaitlist ? ['Plass på venteliste'] : []),
      'Camp',
      'Status',
      'Navn',
      'Fødselsdato',
      'Skole',
      'Telefon',
      'E-post',
      'Matallergier',
      'Hvilke allergier',
      'Foresatt',
      'Foresattes telefon',
      'Foresattes e-post',
      'Vervet av',
      'Påmeldt',
    ]

    const rows: Array<Array<string | number>> = docs.map((registration, index) => [
      ...(isWaitlist ? [index + 1] : []),
      camp.name,
      STATUS_LABELS[registration.status],
      registration.participantName,
      formatShortDate(registration.birthDate),
      registration.school,
      registration.participantPhone,
      registration.participantEmail,
      registration.hasAllergies === 'yes' ? 'Ja' : 'Nei',
      registration.allergies ?? '',
      registration.guardianName,
      registration.guardianPhone,
      registration.guardianEmail,
      registration.referredBy ?? '',
      formatDateTime(registration.createdAt),
    ])

    // ---------- Lag Excel-arket ----------
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Tech Camp for jenter'

    const sheet = workbook.addWorksheet(isWaitlist ? 'Venteliste' : 'Deltakere', {
      views: [{ state: 'frozen', ySplit: 1 }], // overskriftsraden står fast når man scroller
    })

    // Verdiene legges inn som vanlig tekst/tall – aldri som formler
    sheet.addRow(header)
    rows.forEach((row) => sheet.addRow(row))

    // Overskriftsraden: fet, lyserosa bakgrunn, strek under
    const headerRow = sheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCECF2' } }
      cell.border = { bottom: { style: 'thin', color: { argb: 'FFFA6FC6' } } }
      cell.alignment = { vertical: 'middle' }
    })

    // Filterknapper på overskriftene (sortering og filtrering i Excel)
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: header.length },
    }

    // Kolonnebredde etter det lengste innholdet i hver kolonne.
    // Lange tekster får maksbredde og tekstbryting, så raden blir høy nok.
    header.forEach((title, index) => {
      const column = sheet.getColumn(index + 1)
      const longest = Math.max(
        title.length,
        ...rows.map((row) => String(row[index] ?? '').length),
      )
      column.width = Math.min(Math.max(longest + 2, MIN_WIDTH), MAX_WIDTH)
      column.alignment = {
        vertical: 'top',
        wrapText: longest + 2 > MAX_WIDTH,
      }
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const filename = `${isWaitlist ? 'venteliste' : 'deltakere'}-${camp.slug}.xlsx`

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`, // last ned, ikke vis i nettleseren
        'Cache-Control': 'no-store', // personopplysninger skal ikke mellomlagres
      },
    })
  },
}
