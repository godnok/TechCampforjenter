import type { CollectionConfig } from 'payload'

import { canEditContent, hasRole } from '@/access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Bilde', plural: 'Bilder' },
  admin: {
    group: 'Bilder',
    hidden: ({ user }) => !hasRole(user, 'admin', 'editor'), // vises bare for admin og redaktør
  },
  access: {
    read: () => true, // bildene vises på den offentlige nettsiden
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt-tekst',
      admin: {
        description:
          'Beskriv kort hva bildet viser, for de som ikke kan se det (skjermlesere). F.eks. «To jenter bygger en robot».',
      },
    },
  ],
  upload: {
    // Fokuspunkt: i admin kan man klikke på den viktigste delen av bildet,
    // og nettsiden beskjærer bildet rundt det punktet (se getObjectPosition)
    focalPoint: true,
  },
}
