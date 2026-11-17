import type { CollectionConfig } from 'payload'

/**
 * Campene man kan melde seg på (f.eks. Sandefjord og Tønsberg).
 * Datoer, frist og antall plasser endres her – ingen kodeendring neste år.
 */
export const Camps: CollectionConfig = {
  slug: 'camps',
  labels: { singular: 'Camp', plural: 'Camper' },
  admin: {
    group: 'Påmelding',
    useAsTitle: 'name',
    defaultColumns: ['name', 'startDate', 'registrationDeadline', 'capacity'],
  },
  defaultSort: 'startDate', // tidligste camp først
  access: {
    read: () => true, // offentlig: vises på /pamelding
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Navn',
      admin: { description: 'F.eks. «Tech Camp Sandefjord»' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true, // to camper kan ikke ha samme adresse
      index: true, // raskere oppslag i databasen
      label: 'Adresse',
      admin: {
        position: 'sidebar',
        description: 'Brukes i lenken, f.eks. «sandefjord» → /pamelding/sandefjord',
      },
      validate: (value: null | string | undefined) => {
        if (!value) return 'Adressen må fylles ut'
        return (
          /^[a-z0-9-]+$/.test(value) ||
          'Bare små bokstaver (a–z), tall og bindestrek – ikke æ, ø, å eller mellomrom'
        )
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: 'Sted',
      admin: { description: 'F.eks. navnet på lokalet eller adressen' },
    },
    {
      type: 'row', // feltene vises ved siden av hverandre i admin
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Startdato',
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Sluttdato',
          admin: {
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' },
            description: 'La stå tom hvis campen bare varer én dag',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'registrationDeadline',
          type: 'date',
          required: true,
          label: 'Påmeldingsfrist',
          admin: {
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' },
            description: 'Påmeldingen er åpen ut denne dagen',
          },
        },
        {
          name: 'capacity',
          type: 'number',
          required: true,
          min: 1,
          label: 'Antall plasser',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Kort beskrivelse',
      admin: { description: 'Valgfritt. Vises på knappen på påmeldingssiden.' },
    },
  ],
}
