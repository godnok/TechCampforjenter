import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { nb } from '@payloadcms/translations/languages/nb'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { SponsorInquiries } from './collections/SponsorInquiries'
import { Sponsors } from './collections/Sponsors'
import { AboutPage } from './globals/AboutPage'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' – Tech Camp admin', // legges til etter sidetittelen i fanen
      icons: [{ rel: 'icon', type: 'image/png', url: '/logo.png' }], // fanelogo
    },
    components: {
      // Stiene er relative til src/ (importMap.baseDir), og #Navn er den eksporterte komponenten
      graphics: {
        Logo: '/components/admin/Logo#Logo', // stor logo på innloggingssiden
        Icon: '/components/admin/Icon#Icon', // liten logo i menyen
      },
      beforeDashboard: ['/components/admin/Welcome#Welcome'], // velkomstboks øverst på dashboardet
      header: ['/components/admin/BackLink#BackLink'], // tilbakelenke øverst på admin-sidene
    },
  },
  // Admin-panelet på norsk (bokmål)
  i18n: {
    supportedLanguages: { nb },
    fallbackLanguage: 'nb',
  },
  collections: [Users, Media, Sponsors, SponsorInquiries],
  globals: [HomePage, AboutPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    // Lagrer opplastede filer i Supabase Storage i stedet for på disken.
    // Supabase Storage er S3-kompatibelt, så vi bruker Payloads S3-plugin.
    // Bildene hentes fortsatt via Payload (/api/media/file/...), så bucketen kan være privat.
    s3Storage({
      collections: {
        media: true, // gjelder Media-collectionen
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        // Supabase krever "path style": .../s3/media/fil.jpg i stedet for media.s3.../fil.jpg
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
