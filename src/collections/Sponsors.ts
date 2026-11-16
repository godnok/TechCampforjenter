import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

/**
 * Hook som kjører rett før en sponsor lagres.
 * Når en NY sponsor opprettes uten rekkefølge-tall, finner vi høyeste tall
 * og gir den nye sponsoren tallet etter – så den havner sist på siden.
 */
const setOrderOnCreate: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  const orderIsEmpty = data.order === undefined || data.order === null

  if (operation === 'create' && orderIsEmpty) {
    const { docs } = await req.payload.find({
      collection: 'sponsors',
      // Hopp over sponsorer uten tall (Postgres sorterer tomme verdier først ved synkende sortering)
      where: { order: { exists: true } },
      sort: '-order', // minus = synkende, høyeste tall først
      limit: 1, // vi trenger bare den med høyest tall
      depth: 0,
      req, // samme databasetransaksjon som selve lagringen
    })

    data.order = (docs[0]?.order ?? 0) + 1
  }

  return data
}

/**
 * Sponsorer er en Collection, fordi det finnes mange dokumenter av samme type.
 * Hver sponsor blir én rad i databasen.
 */
export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: { singular: 'Sponsor', plural: 'Sponsorer' },
  admin: {
    group: 'Innhold',
    preview: () => '/sponsorer',
    useAsTitle: 'name', // navnet vises som tittel i admin-listen
    defaultColumns: ['name', 'order', 'website'], // kolonnene i admin-listen
  },
  defaultSort: 'order',
  hooks: {
    beforeChange: [setOrderOnCreate],
  },
  access: {
    // Alle kan lese. Opprette/endre/slette krever innlogging (Payloads standard).
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Navn',
      admin: {
        description: 'Brukes også som alt-tekst for logoen.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beskrivelse',
      admin: {
        description: 'En tom linje gir nytt avsnitt.',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Nettside',
      admin: {
        description: 'Valgfritt. Full adresse, f.eks. https://www.jotun.no',
      },
      // Enkel sjekk så lenken faktisk fungerer
      validate: (value: null | string | undefined) => {
        if (!value) return true
        return /^https?:\/\//.test(value) || 'Adressen må starte med https://'
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Rekkefølge',
      // Ingen defaultValue: et tomt felt betyr «legg sist» (se hooken over)
      admin: {
        position: 'sidebar', // vises i høyre kolonne i admin
        description:
          'Lavest tall vises først. La feltet stå tomt for å legge sponsoren sist – tallet fylles inn automatisk.',
      },
    },
  ],
}
