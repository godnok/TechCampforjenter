import type { GlobalConfig } from 'payload'

import { canEditContent, hasRole } from '@/access/roles'

/**
 * Innstillinger som gjelder hele nettsiden, f.eks. lenker til sosiale medier i footeren.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Sosiale medier', // det som vises i admin-menyen
  admin: {
    group: 'Administrasjon',
    hidden: ({ user }) => !hasRole(user, 'admin', 'editor'),
  },
  access: {
    read: () => true, // brukes i footeren på den offentlige nettsiden
    update: canEditContent,
  },
  fields: [
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Sosiale medier',
      labels: { singular: 'Lenke', plural: 'Lenker' },
      maxRows: 6,
      admin: {
        description: 'Vises som ikoner i footeren. Dra radene for å endre rekkefølgen.',
      },
      fields: [
        {
          name: 'platform',
          type: 'select', // nedtrekksliste
          required: true,
          label: 'Plattform',
          // value brukes i koden (Footer.tsx velger ikon ut fra den), label vises i admin
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Snapchat', value: 'snapchat' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Adresse',
          admin: {
            description: 'Full adresse, f.eks. https://www.instagram.com/gonok',
          },
          validate: (value: null | string | undefined) => {
            if (!value) return 'Adressen må fylles ut'
            return /^https?:\/\//.test(value) || 'Adressen må starte med https://'
          },
        },
      ],
    },
  ],
}
