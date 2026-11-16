import type { CollectionConfig } from 'payload'

/**
 * Henvendelser fra skjemaet på /bli-sponsor.
 * Inneholder personopplysninger, så bare innloggede admin-brukere kan se dem.
 */
export const SponsorInquiries: CollectionConfig = {
  slug: 'sponsor-inquiries',
  labels: { singular: 'Sponsorhenvendelse', plural: 'Sponsorhenvendelser' },
  admin: {
    group: 'Innhold',
    useAsTitle: 'company',
    defaultColumns: ['company', 'name', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt', // nyeste først
  access: {
    // Det offentlige API-et kan ikke opprette henvendelser – bare skjemaet (Server Action) kan,
    // fordi Local API-et i actions.ts hopper over disse reglene. Admin-brukere kan også opprette.
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    // Feltene fra skjemaet kan ikke endres etter innsending (update: () => false).
    // Regelen gjelder både admin og API. Opprettelse er fortsatt mulig (manuell registrering).
    // Utseendet på de låste feltene justeres i src/app/(payload)/custom.scss.
    { name: 'name', type: 'text', required: true, label: 'Navn', access: { update: () => false } },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: 'Bedrift',
      access: { update: () => false },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-post',
      access: { update: () => false },
    },
    { name: 'phone', type: 'text', label: 'Telefon', access: { update: () => false } },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Melding',
      access: { update: () => false },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: 'Status',
      options: [
        { label: 'Ny', value: 'new' },
        { label: 'Besvart', value: 'answered' },
        { label: 'Arkivert', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
