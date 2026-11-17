# Påmelding og e-post

## Slik fungerer påmeldingen

1. Hver camp (navn, adresse som `sandefjord`, datoer, frist og antall plasser) legges inn under **Påmelding → Camper**.
2. Skjemaet ligger på `/pamelding/<adresse>`. Serveren sjekker alle felt, alder 13–16 på campens startdato, frist og duplikater (samme e-post, eller samme navn og fødselsdato, på samme camp).
3. Er campen full, havner deltakeren på **venteliste**. Etter lagring telles det på nytt, så det aldri blir flere påmeldte enn plasser.
4. Deltaker og foresatt får bekreftelse på e-post. Go'nok får et varsel uten helseopplysninger.
5. Endres status fra **Venteliste** til **Påmeldt** i admin, sendes «Du har fått plass» – men bare hvis det er ledig plass. Settes status til **Avmeldt**, sendes bekreftelse på avmelding.
6. Deltakerlister og ventelister lastes ned som Excel fra dashboardet. Ingenting lagres på serveren.

Feltene i en påmelding kan ikke endres etter innsending – bare status.

## E-post under utvikling

Før `gonok.no` er verifisert i Resend, kan Resend **bare sende fra `onboarding@resend.dev` og bare til e-postadressen Resend-kontoen er registrert med**. Bruk den adressen som deltaker, foresatt og `EMAIL_NOTIFY_ADDRESS` når du tester.

Feiler en e-post, er påmeldingen likevel lagret, og feilen står i terminalen.
