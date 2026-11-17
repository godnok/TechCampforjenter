# Tech Camp for jenter

Nettsiden til **Tech Camp for jenter**, arrangert av [Go'nok](https://gonok.no): informasjon om campen, sponsorer og påmelding med e-postbekreftelse. Innholdet redigeres i et eget admin-panel.

**Teknologi:** [Next.js](https://nextjs.org) · [Payload CMS](https://payloadcms.com/docs) · PostgreSQL og lagring hos [Supabase](https://supabase.com) · e-post med [Resend](https://resend.com) · hosting på [Vercel](https://vercel.com)

## Kom i gang

Krever Node.js `22.23.5+`, `24.22.3+` eller `26.13.1+`.

```bash
git clone https://github.com/godnok/TechCampforjenter.git tech-camp
cd tech-camp
npm install
```

Kopier `.env.example` til `.env`, fyll inn verdiene, og start:

```bash
npm run dev
```

Nettsiden: http://localhost:3000 · Admin: http://localhost:3000/admin. Første bruker i en tom database blir automatisk administrator.

## Miljøvariabler

`.env` skal **aldri** til git. Den leses bare ved oppstart, så start `npm run dev` på nytt etter endringer.

| Variabel | Hva |
| --- | --- |
| `DATABASE_URL` | Postgres fra Supabase (Connect → Session pooler) |
| `PAYLOAD_SECRET` | Lang, tilfeldig nøkkel for innlogging |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Supabase Storage (Project Settings → Storage → S3) |
| `RESEND_API_KEY` | Nøkkel fra Resend |
| `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` | Avsender: `info@gonok.no`, `Tech Camp for jenter` |
| `EMAIL_NOTIFY_ADDRESS` | Mottaker av varsler (`info@gonok.no`) |
| `NEXT_PUBLIC_SERVER_URL` | Nettsidens adresse, brukes i lenker i e-poster |

## Kommandoer

| Kommando | Når |
| --- | --- |
| `npm run dev` | Kjøre siden lokalt |
| `npm run generate:types` | Etter endringer i felter |
| `npm run generate:importmap` | Etter ny komponent i admin |
| `npx tsc --noEmit` og `npm run lint` | Før hver Pull Request |

## Arbeidsflyt

`main` er det som publiseres. Lag én branch per oppgave (`feature/...`, `docs/...`), og merge via Pull Request. Stopp dev-serveren før du bytter branch.

## Mer dokumentasjon

- [Mappestruktur og konvensjoner](docs/struktur.md)
- [Roller og tilgang i admin](docs/roller.md)
- [Påmelding og e-post](docs/pamelding.md)
- [Fallgruver](docs/fallgruver.md)
- [Deploy](docs/deploy.md)
