# Sito bilingue IT / EN

Decisioni del cliente (3 novembre 2026) e loro attuazione.

## Come funziona

- **Una sola versione da mantenere.** Le pagine si scrivono in inglese in `src/pages/`, come prima. Le versioni italiane vengono generate automaticamente a ogni `npm run build` dall'integrazione `src/i18n/integration.mjs`, che usa il catalogo delle traduzioni `src/i18n/it.json`. Ogni correzione grafica vale subito per entrambe le lingue.
- **Indirizzi italiani tradotti** sotto `/it/`, per esempio `/about-us` → `/it/chi-siamo`, `/about-us/our-mission` → `/it/chi-siamo/la-nostra-missione`, `/donate` → `/it/dona`, `/contact` → `/it/contatti`. La tabella dei segmenti è in `src/i18n/routes.mjs` (`SEGMENTS`). Gli indirizzi inglesi non cambiano, quindi non servono redirect per i link esistenti.
- **Pagine pubblicate in italiano:** elenco `IT_READY` in `src/i18n/routes.mjs`. Una pagina non in elenco resta solo in inglese; dalle pagine italiane i link verso di lei puntano alla versione inglese.
- **Catalogo (`src/i18n/it.json`):** a ogni testo inglese corrisponde quello italiano.
  - Un "testo" è un titolo, un paragrafo, un pulsante, una voce di menu o un attributo (testo alternativo delle immagini, segnaposto dei moduli, descrizione per Google).
  - I tag dentro una frase diventano segnaposto numerati: `Donate[1/][2]Today[/2]` → `Dona[1/][2]oggi[/2]`. La traduzione deve mantenere gli stessi segnaposto; il controllo nel flusso di lavoro qui sotto lo verifica.
  - Uno stesso testo usato in più pagine si traduce una volta sola.
- **Testi negli script:** vanno messi in attributi `data-t-*` (es. `data-t-done="Subscribed"` sui moduli, le etichette del modulo donazioni), che vengono tradotti come gli altri attributi.
- **Cosa fa la build sulle pagine italiane:**
  - `lang="it"`, canonical e `og:url` sull'indirizzo italiano;
  - link interni verso le pagine italiane già pubblicate;
  - selettore con IT attivo.
  - Genera inoltre `sitemap.xml` (entrambe le lingue, con `hreflang`) e `robots.txt`.
  - Le pagine inglesi hanno `hreflang` en/it/x-default quando esiste la versione italiana.
- **In sviluppo:** `npm run dev` mostra solo l'inglese. Per vedere l'italiano: `npm run build` e `npm run preview`.

## Lingua al primo ingresso

Script `#lang-redirect` nella homepage inglese (`src/layouts/Layout.astro`). Si attiva solo all'ingresso dalla homepage; i link diretti a una pagina non vengono mai reindirizzati.

1. Se il visitatore ha già scelto con il selettore IT / EN (`localStorage` `iicc-lang` e cookie `iicc_lang`, 1 anno): vale la sua scelta.
2. Altrimenti, **paese**: il fuso orario del browser Europe/Rome, Europe/Vatican o Europe/San_Marino indica l'Italia → italiano.
3. **Criterio secondario**: browser in lingua italiana (anche all'estero) → italiano.
4. Tutti gli altri → inglese.

Sull'hosting attuale non si può leggere il paese dall'indirizzo IP, quindi il fuso orario è un'approssimazione che non richiede servizi esterni. Con l'hosting definitivo:
- **dietro Cloudflare:** una regola sulla homepage può usare il paese reale (`ip.src.country eq "IT"`), lasciando la precedenza al cookie `iicc_lang`;
- **su hosting Apache senza CDN** (es. Aruba): resta lo script.

Il cookie `iicc_lang` è tecnico (preferenza di lingua) e non richiede consenso, ma va citato nell'informativa privacy/cookie.

Scenari verificati nel browser (3/11/2026):
- dall'Italia con browser inglese → italiano;
- dagli USA o dall'Australia con browser inglese → inglese;
- dall'Australia con browser italiano → italiano;
- scelta EN dall'Italia → resta inglese alle visite successive;
- scelta IT dagli USA → resta italiano;
- link diretto a una pagina inglese → nessun reindirizzamento.

## Pubblicare una pagina in entrambe le lingue

1. Creare la pagina inglese come sempre e aggiungerla a `src/lib/nav.ts`.
2. Se l'indirizzo usa parole nuove, aggiungere i segmenti a `SEGMENTS` in `src/i18n/routes.mjs`.
3. `npm run build`, poi `npm run i18n:extract -- /percorso-della-pagina`: aggiunge al catalogo i testi nuovi con valore vuoto.
4. Tradurre i valori vuoti in `src/i18n/it.json`.
5. Aggiungere il percorso inglese a `IT_READY` (se l'impaginazione non è ancora verificata, aggiungerlo anche a `LAYOUT_CHECK`, che è solo un promemoria).
6. `npm run build`. La build segnala i testi ancora da tradurre: questi restano in inglese, ma la build non si blocca.
7. Controlli: `scripts/qa/overlap.mjs` e `mobile.mjs` anche sulle pagine `/it/` (i testi italiani sono più lunghi).

## Revisione da parte del cliente

`npm run i18n:export -- percorso.csv` produce un foglio (Google Sheets / Excel) con le colonne:
- **Pagine:** "tutte le pagine" per menu, footer e testi comuni;
- **Revisione legale:** "sì" per i testi presenti solo in pagine legali (`LEGAL_REVIEW`);
- **Testo inglese** e **Traduzione italiana**;
- **Correzione** e **Note**, da compilare a cura del revisore.

Le correzioni ricevute si riportano in `src/i18n/it.json`.

- Testi istituzionali, missione, programmi: revisione coordinata dal cliente con Ilenia.
- **Privacy Policy, Terms & Conditions, Cookie Policy e informazioni legali delle donazioni:** verifica di Irene Strangis o di un altro legale prima della pubblicazione definitiva.
- La **Cookie Policy** oggi non esiste come pagina separata: va creata.

## Glossario (proposto, da confermare con il cliente)

| Inglese | Italiano |
|---|---|
| Prison Ministry | Pastorale carceraria |
| Immigration Detention | Detenzione dei migranti |
| Immigration Detention Ministry | Pastorale per i migranti trattenuti |
| detainees (immigration) / inmates | migranti trattenuti / detenuti |
| Head Office | Sede centrale |
| Ambassador & Founder | Ambasciatore e Fondatore |
| Advocacy | Advocacy |
| Restoration | Rinascita |
| Faith. Hope. Justice. Restoration. | Fede. Speranza. Giustizia. Rinascita. |
| Accompanying. Empowering. Restoring Hope. | Accompagnare. Rafforzare. Restituire speranza. |
| Hope Companion, Pet Companions Program, Francis Bakery of Hope, Hope Media Channel | invariati (nomi propri dei programmi; mai "Pet Rescue") |
| Citazioni bibliche | testo CEI, riferimenti all'italiana (Matteo 25,35-36) |

## Stato

- **Fase 1 (3/11/2026):**
  - struttura bilingue, selettore IT / EN, lingua al primo ingresso, SEO (hreflang, canonical, sitemap);
  - menu, footer e testi comuni tradotti;
  - pagine pilota Home, Chi siamo, Contatti, Dona.
- **Fase 2 (3/11/2026): tutte le 131 pagine tradotte e pubblicate in italiano.**
  - Catalogo di circa 6.360 testi (traduzione automatica di partenza, da rivedere).
  - 101 pagine sono verificate a 360, 390, 768, 1024, 1440 e 1920 px (aggiornato il 4/11/2026).
  - Le altre 30 sono online ma elencate in `LAYOUT_CHECK` (`src/i18n/routes.mjs`): i testi italiani, più lunghi, spezzano ancora parole o si sovrappongono in alcune impaginazioni. Si sistemano a piccoli gruppi; ogni pagina esce dall'elenco quando `scripts/qa/overlap.mjs` e `mobile.mjs` non segnalano più nulla a tutte le larghezze.
  - Foglio di revisione completo: `npm run i18n:export -- .qa/traduzioni-it-completo.csv`.
  - Sono contrassegnate per la revisione legale (`LEGAL_REVIEW`) Privacy Policy, Termini e condizioni, Dichiarazione di accessibilità, Dona e Lasciti.
  - Pubblicate sull'anteprima in attesa della verifica legale prima della pubblicazione definitiva.
- **Scelte di traduzione da confermare:**
  - Le citazioni bibliche seguono il testo CEI 2008, con la numerazione italiana dei Salmi (es. Salmo 34,19 dove l'inglese ha 34:18).
  - Dove l'inglese parafrasa il versetto, è tradotta la parafrasi.
  - Ruoli delle persone in forma neutra: Referente nazionale, Referente legale, Responsabile delle finanze e della tesoreria, Presidente.
  - Titoli dei libri: edizione italiana quando esiste (L'imitazione di Cristo, Le lettere di Berlicche, Le Confessioni, Catechismo della Chiesa Cattolica); gli altri restano in inglese.
  - Le linee di ascolto australiane (Lifeline, Beyond Blue…) restano invariate, con la nota «Australia».
- **Possibili errori nel testo inglese (tradotti fedelmente, da verificare con il cliente):**
  - Pope Francis: la Porta Santa di Rebibbia è stata aperta nel Giubileo della Speranza (26/12/2024), non in quello «straordinario della Misericordia».
  - UN Human Rights Advocacy: la frase sulla dignità come «fondamento della libertà, della giustizia e della pace» viene dal Preambolo della Dichiarazione universale dei diritti umani, non della Carta delle Nazioni Unite.
  - Domande frequenti della pagina Phone & Communication Support: citano le pagine «Prison Visit» e «Adopt a Prisoner»; la seconda non esiste nel sito.
- **Prossime fasi:**
  1. revisione dei testi da parte del cliente con Ilenia e revisione legale;
  2. Cookie Policy;
  3. lingua per paese sull'hosting definitivo.
- **Restano in inglese:**
  - le scritte dentro alcune immagini (es. il furgone di Pet Companions, la copertina della newsletter);
  - le pagine esterne (GoFundMe, PayPal: per i visitatori italiani PayPal si apre in italiano con `lc=IT`).
