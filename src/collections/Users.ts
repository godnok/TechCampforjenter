import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Bruker', plural: 'Brukere' },
  admin: {
    group: 'Administrasjon',
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
