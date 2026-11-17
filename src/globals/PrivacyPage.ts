import type { GlobalConfig } from 'payload'

import { hasRole, isAdmin } from '@/access/roles'

/**
 * Personvernerklæringen på /personvern.
 * Et juridisk dokument – derfor kan bare administrator endre den.
 */
export const PrivacyPage: GlobalConfig = {
  slug: 'privacy-page',
  label: 'Personvern',
  admin: {
    group: 'Sider',
    preview: () => '/personvern',
    hidden: ({ user }) => !hasRole(user, 'admin'), // bare administrator ser den i menyen
  },
  access: {
    read: () => true, // vises på den offentlige nettsiden
    update: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true, // trygt: Globalen er ny og har ingen data ennå
      defaultValue: 'Personvernerklæring',
      label: 'Tittel',
    },
    {
      name: 'lastUpdated',
      type: 'date',
      label: 'Sist oppdatert',
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' },
        description: 'Vises øverst på siden. Oppdater datoen hver gang erklæringen endres.',
      },
    },
    {
      name: 'content',
      type: 'richText', // bruker standard-editoren: overskrifter, lister, lenker, fet skrift osv.
      label: 'Innhold',
    },
  ],
}
