import type { GlobalConfig } from 'payload'

/**
 * Forsiden er en Global: det finnes bare ett forside-dokument.
 * Feltene legges til seksjon for seksjon (hero → slagord → intro → kort).
 */
export const HomePage: GlobalConfig = {
  slug: 'home-page', // brukes i koden og i API-adressen
  label: 'Forside', // det som vises i admin
  access: {
    read: () => true, // forsideinnholdet er offentlig
  },
  fields: [
    {
      name: 'hero',
      type: 'group', // samler feltene for hero-seksjonen i admin
      label: 'Hero',
      fields: [
        {
          name: 'image',
          type: 'upload', // velg et bilde fra Media, eller last opp et nytt
          relationTo: 'media',
          required: true,
          label: 'Hero-bilde',
        },
      ],
    },
    {
      name: 'slogans',
      type: 'array', // en liste der redaktøren kan legge til, fjerne og sortere rader
      label: 'Slagord',
      labels: { singular: 'Slagord', plural: 'Slagord' },
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Tekst',
        },
      ],
    },
    {
      name: 'intro',
      type: 'group',
      label: 'Intro («Teknologi er mer enn du tror»)',
      fields: [
        {
          name: 'title',
          type: 'text',
          // Ikke required: Forside finnes allerede i databasen, og en påkrevd (NOT NULL)
          // kolonne kan ikke legges til på en eksisterende rad uten å slette den.
          label: 'Tittel',
        },
        {
          name: 'text',
          type: 'textarea', // flerlinjet tekst – hver linje blir et eget avsnitt på siden
          label: 'Tekst',
          admin: {
            description: 'Hver linje blir et eget avsnitt.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Bilde',
        },
      ],
    },
    {
      name: 'expectations',
      type: 'group',
      label: 'Forventninger («Hva kan du forvente av Tech Camp?»)',
      fields: [
        {
          name: 'title',
          type: 'text',
          // Ikke required – samme grunn som i Intro (Forside finnes allerede i databasen)
          label: 'Tittel',
        },
        {
          name: 'cards',
          type: 'array',
          label: 'Kort',
          labels: { singular: 'Kort', plural: 'Kort' },
          // Designet har nøyaktig tre kort ved siden av hverandre
          minRows: 3,
          maxRows: 3,
          // Kortene lagres i en egen tabell, så her er påkrevde felter trygt
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Bilde',
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Tittel',
            },
            {
              name: 'text',
              type: 'textarea',
              required: true,
              label: 'Tekst',
            },
          ],
        },
      ],
    },
  ],
}
