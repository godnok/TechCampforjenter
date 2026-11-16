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
  ],
}
