import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { hasRole, isAdmin, isAdminField, isAdminOrSelf } from '@/access/roles'

/**
 * Den aller første brukeren som opprettes (f.eks. i en ny database) blir
 * automatisk administrator – ellers ville ingen kunnet gi roller.
 */
const makeFirstUserAdmin: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  const { totalDocs } = await req.payload.count({ collection: 'users', req })
  if (totalDocs === 1 && doc.role !== 'admin') {
    // Local API hopper over tilgangsreglene, så rollen kan settes her
    return req.payload.update({ collection: 'users', id: doc.id, data: { role: 'admin' }, req })
  }
  return doc
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Bruker', plural: 'Brukere' },
  admin: {
    group: 'Administrasjon',
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
    // Bare administratorer ser «Brukere» i menyen (alle kan likevel endre egen konto)
    hidden: ({ user }) => !hasRole(user, 'admin'),
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [makeFirstUserAdmin],
  },
  fields: [
    // E-post og passord legges til automatisk av auth: true
    {
      name: 'role',
      type: 'select',
      label: 'Rolle',
      // Ikke required i databasen: eksisterende brukere har ingen rolle ennå
      defaultValue: 'editor',
      saveToJWT: true, // rollen ligger i innloggingen, så tilgangssjekker slipper databaseoppslag
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Påmeldingsansvarlig', value: 'registrationManager' },
        { label: 'Redaktør', value: 'editor' },
      ],
      access: {
        // Bare administratorer kan gi eller endre roller – ingen kan gi seg selv mer tilgang
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        position: 'sidebar',
        description:
          'Administrator: alt. Påmeldingsansvarlig: påmeldinger og ventelister. Redaktør: nettsiden og sponsorhenvendelser.',
      },
    },
  ],
}
