# Mappestruktur og konvensjoner

```
src/
├─ payload.config.ts          ← database, collections, globals, e-post og admin
├─ payload-types.ts           ← genereres automatisk – ikke rediger
├─ access/roles.ts            ← rollene og tilgangsreglene
├─ collections/               ← Users, Media, Sponsors, SponsorInquiries, Camps, Registrations
├─ globals/                   ← HomePage (Forside), AboutPage (Om oss), SiteSettings (Sosiale medier)
├─ hooks/registrationHooks.ts ← sperre mot overbooking og e-post ved statusendring
├─ endpoints/                 ← /api/registrations/export (deltakerliste som Excel)
├─ emails/                    ← e-postmal og alle e-postene
├─ utilities/                 ← datoformatering, påmeldingsregler, fokuspunkt for bilder
├─ components/                ← Header, Footer, Reveal og komponenter per side
│  ├─ admin/                  ← egne komponenter i admin
│  └─ forms/                  ← felles skjemafelt og feiloppsummering
└─ app/
   ├─ (frontend)/             ← nettsiden: /, /om-oss, /sponsorer, /bli-sponsor, /pamelding
   └─ (payload)/              ← admin og API (genereres – ikke rediger, unntatt custom.scss)
public/                       ← logo.png (logo, favicon og robot)
```

## Konvensjoner

- All kode (variabler, funksjoner, klassenavn, filnavn) er på **engelsk**. Kommentarer og tekst som vises for brukerne, er på **norsk**.
- Styling med **CSS Modules** (`.module.css` per komponent). Felles farger og fonter ligger som CSS-variabler i `src/app/(frontend)/styles.css`.
- Skriftstørrelser i `rem`, avstander i `px`.
- Versjonene av pakkene er låst (`save-exact=true` i `.npmrc`). Alle `@payloadcms/*`-pakker skal ha samme versjon som `payload`.
