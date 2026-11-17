# Fallgruver

- **Nye påkrevde felt på data som finnes fra før:** Et felt med `required: true` blir en «aldri tom»-kolonne i databasen. Finnes det allerede rader, feiler oppdateringen, eller Payload vil slette radene. Svar **N** på advarsler om datatap. Gjør feltet valgfritt, eller fyll inn verdier først.
- **Endringer vises ikke:** Prøv Ctrl+F5. Endringer i `.env` krever omstart av `npm run dev`.
- **Feil om manglende komponent i admin:** Kjør `npm run generate:importmap`.
- **TypeScript kjenner ikke nye felter:** Kjør `npm run generate:types`.
- **Genererte filer endret etter branch-bytte:** Dev-serveren skrev dem om. Stopp serveren før du bytter branch, og forkast endringene med `git restore`.
- **Linjeskift:** `.gitattributes` sørger for like linjeskift (LF) i git på tvers av Windows og andre systemer.
