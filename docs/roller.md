# Roller og tilgang i admin

| Rolle | Kan |
| --- | --- |
| **Administrator** | Alt: brukere og roller, camper, påmeldinger og nettsideinnhold |
| **Påmeldingsansvarlig** | Påmeldinger og ventelister: se, endre status og laste ned deltakerlister |
| **Redaktør** | Nettsiden (Forside, Om oss, Sponsorer, Bilder, Sosiale medier) og sponsorhenvendelser |

- Bare administratorer kan gi roller. Alle kan endre sitt eget passord.
- Menyen viser bare det rollen har tilgang til, og reglene gjelder også API-et.
- Rollen lagres i innloggingen. Endres en rolle, må brukeren logge ut og inn igjen.
- Reglene ligger i `src/access/roles.ts`.

## Hvor innholdet redigeres

| Meny | Innhold |
| --- | --- |
| Sider | Forside, Om oss |
| Innhold | Sponsorer, Sponsorhenvendelser |
| Bilder | Alle bilder og videoer (lagres i Supabase Storage) |
| Påmelding | Camper, Påmeldinger |
| Administrasjon | Brukere, Sosiale medier |

Velg gjerne et **fokuspunkt** når du laster opp et bilde, så beskjæres det riktig på mobil.
