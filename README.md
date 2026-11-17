# Tech Camp for jenter

Nettsiden til **Tech Camp for jenter**, arrangert av [Go'nok](https://gonok.no). Siden informerer om campen, viser sponsorene og har påmelding med e-postbekreftelse. Alt innhold redigeres i et eget admin-panel.

## Innhold

- [Teknologi](#teknologi)
- [Kom i gang](#kom-i-gang)
- [Miljøvariabler (.env)](#miljøvariabler-env)
- [Nyttige kommandoer](#nyttige-kommandoer)
- [Mappestruktur](#mappestruktur)
- [Admin: innhold og roller](#admin-innhold-og-roller)
- [Påmelding](#påmelding)
- [E-post under utvikling](#e-post-under-utvikling)
- [Arbeidsflyt med git](#arbeidsflyt-med-git)
- [Fallgruver](#fallgruver)
- [Deploy](#deploy)

## Teknologi

| Del | Verktøy |
| --- | --- |
| Nettside | [Next.js](https://nextjs.org) (App Router) med TypeScript og CSS Modules |
| Innhold og admin | [Payload CMS](https://payloadcms.com/docs) 3 – kjører inne i Next.js-appen |
| Database | PostgreSQL hos [Supabase](https://supabase.com) |
| Bilder og video | Supabase Storage (via `@payloadcms/storage-s3`) |
| E-post | [Resend](https://resend.com) (via `@payloadcms/email-resend`) |
| Excel-eksport | [exceljs](https://github.com/exceljs/exceljs) |
| Hosting | [Vercel](https://vercel.com) |

Pakkene installeres med **npm**. Versjonene er låst (`save-exact=true` i `.npmrc`), og alle `@payloadcms/*`-pakker skal ha **samme versjon** som `payload`.

## Kom i gang

**Krav:** Node.js `22.23.5+`, `24.22.3+` eller `26.13.1+` (se `engines` i `package.json`).

```bash
git clone https://github.com/godnok/TechCampforjenter.git tech-camp
cd tech-camp
npm install
```

Lag `.env` ved å kopiere `.env.example`, og fyll inn verdiene (se under). Start så utviklingsserveren:

```bash
npm run dev
```

- Nettsiden: http://localhost:3000
- Admin: http://localhost:3000/admin

Første gang i en tom database ber Payload deg lage en bruker. **Den første brukeren blir automatisk administrator.**

## Miljøvariabler (.env)

`.env` inneholder passord og nøkler og skal **aldri** til git (den står i `.gitignore`). `.env.example` viser hvilke variabler som trengs, uten verdier.

| Variabel | Hva den er |
| --- | --- |
| `DATABASE_URL` | Tilkobling til Postgres. Supabase → **Connect** → **Session pooler** → URI, med databasepassordet satt inn. |
| `PAYLOAD_SECRET` | Hemmelig nøkkel Payload bruker til innlogging. En lang, tilfeldig tekst. |
| `S3_BUCKET` | Navnet på bucketen i Supabase Storage (`media`). Bucketen skal være privat. |
| `S3_ENDPOINT` | Supabase → Project Settings → Storage → S3 Connection → Endpoint |
| `S3_REGION` | Samme sted → Region |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | S3-nøkler fra samme sted. Secret vises bare én gang. |
| `RESEND_API_KEY` | API-nøkkel fra Resend (Sending access) |
| `EMAIL_FROM_ADDRESS` | Avsender, `info@gonok.no`. Under testing: `onboarding@resend.dev` (se [E-post under utvikling](#e-post-under-utvikling)). |
| `EMAIL_FROM_NAME` | Avsendernavn, `Tech Camp for jenter` |
| `EMAIL_NOTIFY_ADDRESS` | Hvor varsler om påmeldinger og sponsorhenvendelser sendes, og hvor svar på e-poster havner (`info@gonok.no`) |
| `NEXT_PUBLIC_SERVER_URL` | Nettsidens adresse, brukes i lenker i e-poster. Lokalt: `http://localhost:3000` |

`.env` leses bare når serveren starter – start `npm run dev` på nytt etter endringer.

## Nyttige kommandoer

| Kommando | Når |
| --- | --- |
| `npm run dev` | Starter nettside og admin lokalt |
| `npm run generate:types` | Etter endring av felter i collections eller globals. Oppdaterer `src/payload-types.ts`. |
| `npm run generate:importmap` | Etter at en egen komponent er lagt til i admin (f.eks. i `payload.config.ts` under `admin.components`) |
| `npx tsc --noEmit` | Sjekker TypeScript-feil |
| `npm run lint` | Sjekker kodefeil med ESLint. Kjør før hver Pull Request. |
| `npm run build` | Bygger produksjonsversjonen (det Vercel kjører) |

## Mappestruktur

```
src/
├─ payload.config.ts          ← hjernen: database, collections, globals, e-post, admin
├─ payload-types.ts           ← genereres automatisk – ikke rediger
├─ access/roles.ts            ← rollene og tilgangsreglene
├─ collections/               ← Users, Media, Sponsors, SponsorInquiries, Camps, Registrations
├─ globals/                   ← HomePage (Forside), AboutPage (Om oss), SiteSettings (Sosiale medier)
├─ hooks/registrationHooks.ts ← sperre mot overbooking + e-post ved statusendring
├─ endpoints/                 ← /api/registrations/export (deltakerliste som Excel)
├─ emails/                    ← e-postmal og alle e-postene
├─ utilities/                 ← datoformatering, påmeldingsregler, fokuspunkt for bilder
├─ components/                ← Header, Footer, Reveal (animasjon) og komponenter per side
│  ├─ admin/                  ← egne komponenter i admin (logo, velkomst, oversikt, tilbake, logg ut)
│  └─ forms/                  ← felles skjemafelt og feiloppsummering
└─ app/
   ├─ (frontend)/             ← nettsiden: /, /om-oss, /sponsorer, /bli-sponsor, /pamelding, /pamelding/[slug]
   └─ (payload)/              ← admin og API (genereres av Payload – ikke rediger, unntatt custom.scss)
public/                       ← logo.png (logo, favicon og robot)
```

**Konvensjoner:** All kode (variabler, funksjoner, klassenavn, filnavn) er på engelsk. Kommentarer og tekst som vises på siden eller i admin, er på norsk. Skriftstørrelser skrives i `rem`, avstander i `px`. Felles farger og fonter ligger som CSS-variabler i `src/app/(frontend)/styles.css`.

## Admin: innhold og roller

| Rolle | Kan |
| --- | --- |
| **Administrator** | Alt: brukere og roller, camper, påmeldinger, nettsideinnhold |
| **Påmeldingsansvarlig** | Påmeldinger og ventelister: se, endre status og laste ned deltakerlister |
| **Redaktør** | Nettsiden (Forside, Om oss, Sponsorer, Bilder, Sosiale medier) og sponsorhenvendelser |

- Bare administratorer kan gi roller. Alle kan endre sitt eget passord.
- Menyen viser bare det rollen har tilgang til, og reglene gjelder også API-et.
- Rollen lagres i innloggingen. Endres en rolle, må brukeren logge ut og inn igjen.

**Hvor innholdet redigeres:** Sider → Forside / Om oss · Innhold → Sponsorer / Sponsorhenvendelser · Bilder · Påmelding → Camper / Påmeldinger · Administrasjon → Brukere / Sosiale medier.

Bilder lastes opp under **Bilder** og lagres i Supabase Storage. Velg gjerne et **fokuspunkt**, så beskjæres bildet riktig på mobil.

## Påmelding

1. Hver camp (navn, adresse som `sandefjord`, datoer, frist, antall plasser) legges inn under **Påmelding → Camper**.
2. Skjemaet ligger på `/pamelding/<adresse>`. Serveren sjekker alle felt, alder 13–16 på campens startdato, frist og duplikater (samme e-post, eller samme navn og fødselsdato, på samme camp).
3. Er campen full, havner deltakeren på **venteliste**. Etter lagring telles det på nytt, så det aldri blir flere påmeldte enn plasser.
4. Deltaker og foresatt får bekreftelse på e-post, og Go'nok får et varsel (uten helseopplysninger).
5. I admin: endres status fra **Venteliste** til **Påmeldt**, sendes «Du har fått plass» – men bare hvis det er ledig plass. Settes status til **Avmeldt**, sendes bekreftelse på avmelding.
6. Deltakerlister og ventelister lastes ned som Excel fra dashboardet. Ingenting lagres på serveren.

Feltene i en påmelding kan ikke endres etter innsending – bare status.

## E-post under utvikling

Før `gonok.no` er verifisert i Resend, kan Resend **bare sende fra `onboarding@resend.dev` og bare til e-postadressen Resend-kontoen er registrert med**. Bruk den adressen som deltaker, foresatt og `EMAIL_NOTIFY_ADDRESS` når du tester. Feiler en e-post, er påmeldingen likevel lagret, og feilen står i terminalen.

## Arbeidsflyt med git

- `main` er versjonen som publiseres. Ingen jobber direkte på `main`.
- Lag én branch per oppgave fra en oppdatert `main`: `feature/...` for nye ting, `docs/...` for dokumentasjon.
- Kjør `npx tsc --noEmit` og `npm run lint` før du lager en **Pull Request** til `main`.
- **Stopp dev-serveren før du bytter branch eller puller**, ellers kan den skrive om genererte filer midt i byttet.

## Fallgruver

- **Nye påkrevde felt på data som finnes fra før:** Et felt med `required: true` blir en «aldri tom»-kolonne i databasen. Finnes det allerede rader, feiler oppdateringen, eller Payload vil slette radene. Svar **N** på advarsler om datatap. Gjør feltet valgfritt, eller fyll inn verdier først.
- **Endringer vises ikke:** Prøv Ctrl+F5. Endringer i `.env` krever omstart av `npm run dev`.
- **Feil om manglende komponent i admin:** Kjør `npm run generate:importmap`.
- **TypeScript kjenner ikke nye felter:** Kjør `npm run generate:types`.
- **Linjeskift:** `.gitattributes` sørger for like linjeskift (LF) i git på tvers av Windows og andre systemer.

## Deploy

Kommer. Før lansering må dette på plass:

- [ ] Migrasjoner i stedet for automatisk databaseoppdatering
- [ ] Caching som oppdateres når innhold lagres i admin
- [ ] Direkte opplasting til Supabase for store filer (Vercels grense er ca. 4,5 MB)
- [ ] Vercel i EU-region, med miljøvariablene over
- [ ] `gonok.no` verifisert i Resend
- [ ] Personvernerklæring på `/personvern`, og automatisk sletting av påmeldinger ett år etter campen
- [ ] Gjennomgang av `npm audit`
