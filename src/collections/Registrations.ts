import type { CollectionConfig, FieldAccess } from 'payload'

import { canManageRegistrations, hasRole } from '@/access/roles'

import { exportRegistrations } from '@/endpoints/exportRegistrations'
import { preventOverbooking, sendStatusEmails } from '@/hooks/registrationHooks'

// Feltene fra skjemaet kan ikke endres etter innsending – verken i admin eller via API.
// Bare «Status» kan endres. Utseendet på låste felt justeres i src/app/(payload)/custom.scss.
const locked: { update: FieldAccess } = { update: () => false }

const dayOnly = { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } as const

/**
 * Påmeldinger til campene. Inneholder personopplysninger om barn og helseopplysninger
 * (matallergier), så bare innloggede admin-brukere har tilgang.
 */
export const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: { singular: 'Påmelding', plural: 'Påmeldinger' },
  admin: {
    group: 'Påmelding',
    hidden: ({ user }) => !hasRole(user, 'admin', 'registrationManager'),
    useAsTitle: 'participantName',
    defaultColumns: ['participantName', 'camp', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  endpoints: [exportRegistrations], // /api/registrations/export – deltakerliste som CSV
  hooks: {
    beforeChange: [preventOverbooking], // sperre: ikke flere påmeldte enn plasser
    afterChange: [sendStatusEmails], // e-post ved «fått plass» og avmelding
  },
  access: {
    // Skjemaet lagrer via Local API (Server Action), som hopper over disse reglene.
    // Bare administrator og påmeldingsansvarlig har tilgang til påmeldingene.
    create: canManageRegistrations,
    read: canManageRegistrations,
    update: canManageRegistrations,
    delete: canManageRegistrations,
  },
  fields: [
    {
      name: 'camp',
      type: 'relationship',
      relationTo: 'camps',
      required: true,
      label: 'Camp',
      access: locked,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'registered',
      label: 'Status',
      options: [
        { label: 'Påmeldt', value: 'registered' },
        { label: 'Venteliste', value: 'waitlist' },
        { label: 'Avmeldt', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'collapsible', // sammenleggbar seksjon i admin
      label: 'Deltaker',
      fields: [
        { name: 'participantName', type: 'text', required: true, label: 'Fullt navn', access: locked },
        {
          type: 'row',
          fields: [
            { name: 'participantPhone', type: 'text', required: true, label: 'Telefon', access: locked },
            { name: 'participantEmail', type: 'email', required: true, label: 'E-post', access: locked },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'birthDate',
              type: 'date',
              required: true,
              label: 'Fødselsdato',
              access: locked,
              admin: { date: dayOnly },
            },
            { name: 'school', type: 'text', required: true, label: 'Skole', access: locked },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Foresatt',
      fields: [
        { name: 'guardianName', type: 'text', required: true, label: 'Navn', access: locked },
        {
          type: 'row',
          fields: [
            { name: 'guardianPhone', type: 'text', required: true, label: 'Telefon', access: locked },
            { name: 'guardianEmail', type: 'email', required: true, label: 'E-post', access: locked },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Annet',
      fields: [
        {
          name: 'hasAllergies',
          type: 'radio',
          required: true,
          label: 'Matallergier',
          options: [
            { label: 'Nei', value: 'no' },
            { label: 'Ja', value: 'yes' },
          ],
          access: locked,
        },
        {
          name: 'allergies',
          type: 'textarea',
          label: 'Hvilke matallergier',
          access: locked,
          admin: {
            // Vises bare når «Ja» er valgt
            condition: (_, siblingData) => siblingData?.hasAllergies === 'yes',
          },
        },
        { name: 'referredBy', type: 'text', label: 'Vervet av', access: locked },
        {
          name: 'privacyConsent',
          type: 'checkbox',
          label: 'Samtykke til personvernerklæringen',
          access: locked,
          validate: (value: boolean | null | undefined) =>
            value === true || 'Samtykke må være gitt',
        },
      ],
    },
  ],
}
