# Correzioni del cliente — stato

Registro delle richieste arrivate dopo la consegna delle 131 pagine. I materiali del cliente sono in `../Aggiornamenti/`, fuori dal repo: una cartella per pagina oppure i file sciolti.

## Blocco del 19 ottobre 2026 (documento "Correzioni", sezioni A–H)

Il cliente ha chiesto di procedere in due fasi.

### Prima fase — completata (`af5b2c4`, `0885aeb`)

| # | Richiesta | Esito |
|---|---|---|
| 1, 2, 4, G | "Catholic Christian" nella frase della Missione, nel valore Faith e nel testo del Fondatore | Fatto in homepage, footer, About Us, Our Story |
| 3, G | Indirizzo uniforme "Via delle Milizie 34, 00192 Rome, Italy" | Fatto ovunque, compresi footer, pagine legali, FAQ e le vecchie menzioni "Vatican City / Rome" |
| 5 | Canada colorato sulla mappa della homepage | Fatto (`public/images/home/map.jpg`) |
| 9 | Contatti solo Roma | Tolti PO Box, numeri +61 e orari AEST. **In attesa:** telefono ufficiale e orari (fuso Europe/Rome) |
| 13 | Foto di Pope Leo XIV coperta dal testo | Fatto (componente `FaithLeader`, vale anche per Pope Francis) |
| 14–24 | Logo grande sovrapposto in 11 pagine Get Involved / Donate (solo desktop) | Fatto nel componente comune `GiHero`; stesso difetto corretto anche in Bakery of Hope |
| 25 | Risposte FAQ in colonna stretta | Fatto |
| G | Copyright fisso "© 2026 IICC Mission. All Rights Reserved." | Fatto |
| — | Menu: un solo sottomenu aperto alla volta (richiesta successiva) | Fatto |

Corretti nello stesso giro, senza segnalazione del cliente:
- testi schiacciati sugli schermi larghi (Our Vision, Cardinal Pell, Founder Messages, fasce foto);
- citazioni che sconfinavano nelle pagine Advocacy;
- parole spezzate a metà nelle griglie di schede tra 1024 e 1280px;
- sovrapposizioni su mobile nelle pagine Hope Companion e in quelle dei Papi.

### Seconda fase — richiede materiale del cliente

| # | Richiesta | Stato |
|---|---|---|
| 6 | Our Leadership rifatta | ✅ `69f056d`. 6 membri: Antonio G. Dattilo, Chaplain Denis Fitzgerald, Giorgio Di Martino, Ilenia Dattilo, Francesco Dattilo, Irene Strangis. Father John Vespa rimosso. **Da confermare:** gli incarichi di Giorgio Di Martino e Irene Strangis |
| 7 | Staff & Volunteers rifatta (con Chaplain Denis Fitzgerald; distinzione organi direttivi / personale / volontari) | Da fare: servono foto, biografie e incarichi |
| 8 | Foto di Mission News pertinenti, in alta risoluzione e con proporzioni uniformi | Da fare |
| 10 | Foto di Cardinal Pell e Archbishop Comensoli (Ambassador & Founder) | ✅ `6a61e06` |
| 11 | Foto del Fondatore con Cardinal Pell (Inspired by Faith) | Da fare |
| 12 | Pope Francis: foto della Porta Santa | ✅ Sostituita il 20/10 con `Porta_Santa_def.jpeg`, che mostra l'iscrizione sopra la porta; immagine intera, senza ritagli |
| 12 | Pope Francis: foto del Papa (paragrafo "Pope Francis and Prison Ministry") | ✅ Sostituita il 20/10 con `Pope_Francis.jpeg` |
| F | Attivazione dei pagamenti | In attesa: Merchant ID PayPal (conto `PayPal@iiccmission.org` da aprire), coordinate bancarie della Fondazione, URL GoFundMe |

## Richieste aggiuntive

| Data | Richiesta | Esito |
|---|---|---|
| 19/10/2026 | Nuova pagina **Pet Companions Program** sotto Hope Companion Program, dal mockup *Pet Companions_Second Chances Together.png* | ✅ `0cb33b4`. Regola del cliente: **mai "Pet Rescue"**, sempre "Pet Companions Program". Il bottone GoFundMe resta "Coming soon" non cliccabile finché manca la campagna |
| 19/10/2026 | Sito bilingue IT/EN | Proposta in [proposte-tecniche.md](proposte-tecniche.md); in attesa di approvazione |
| 19/10/2026 | Hosting, domini e assistenza in Italia | Proposta in [proposte-tecniche.md](proposte-tecniche.md); in attesa di risposte |
