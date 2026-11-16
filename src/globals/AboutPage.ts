import type { GlobalConfig } from 'payload'
import {
  BoldFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/**
 * Om oss-siden. En Global, siden det bare finnes én slik side.
 * Globalen er ny, så her kan vi trygt bruke påkrevde felter.
 */
export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Om oss',
  admin: {
    group: 'Sider',
    preview: () => '/om-oss',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Om oss',
      label: 'Tittel',
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Seksjoner',
      labels: { singular: 'Seksjon', plural: 'Seksjoner' },
      minRows: 1,
      admin: {
        description: 'Bildet veksler automatisk mellom venstre og høyre side.',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
          label: 'Tekst',
          admin: {
            description: 'En tom linje gir nytt avsnitt.',
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
      name: 'quote',
      type: 'richText',
      label: 'Sitat (snakkeboble)',
      admin: {
        description:
          'Vises etter første seksjon. Marker tekst for å gjøre den fet. Shift+Enter gir ny linje.',
      },
      // Egen, enkel editor for sitatet: bare fet og kursiv, ingen overskrifter, lister osv.
      editor: lexicalEditor({
        features: [BoldFeature(), ItalicFeature(), InlineToolbarFeature()],
      }),
    },
  ],
}
