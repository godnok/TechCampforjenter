import type { Metadata } from 'next'
import { Inter, Poppins, Russo_One } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import './styles.css'

// next/font laster ned fontene ved bygging og serverer dem fra vår egen side
// (ingen kall til Google når noen besøker siden). "variable" lager en CSS-variabel
// som vi bruker i styles.css. Vi laster bare vektene designet faktisk bruker.
const russoOne = Russo_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-russo',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '500', '600'], // 600 = SemiBold, brukes til «go'nok» i sitatet på Om oss
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  weight: ['300'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Tittel og beskrivelse vises i nettleserfanen og i søkeresultater
export const metadata: Metadata = {
  title: "Tech Camp for jenter | Go'nok",
  description:
    'Tech Camp er en møteplass for jenter som vil utforske teknologi på sine egne premisser.',
  icons: {
    icon: '/logo.png', // liten logo i nettleserfanen
  },
}

// Layouten pakker inn ALLE sider under (frontend): header øverst, footer nederst,
// og selve sideinnholdet (children) i midten.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={`${russoOne.variable} ${poppins.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
