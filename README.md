# IICC Mission — sito web

Sito vetrina statico di **IICC Mission** (Inmate International Catholic Care): 132 pagine in inglese, costruite dai mockup definitivi del cliente (le 131 di `Struttura.csv` più Pet Companions Program, aggiunta su richiesta del cliente).

- **Repo:** `git@github.com:stefanoalba85/IICC-mission.git`, branch di lavoro `develop`
- **Fonte dei contenuti** (fuori dal repo, nella cartella di progetto superiore):
  - `../Struttura.csv` — elenco delle 131 pagine (gruppo di menu, nome pagina, PNG di riferimento)
  - `../Materiali_definitivi/` — un mockup PNG per pagina + `IICC_Logo.png` (logo ufficiale)
  - `../Aggiornamenti/` — materiali inviati dal cliente dopo la consegna (nuovi mockup, foto approvate)

**Stato (19 ottobre 2026):**
- Sito completo: 132 pagine, ottimizzate per mobile, link verificati.
- Prima fase delle correzioni del cliente completata; seconda fase in corso.
- In attesa di decisione: sito bilingue IT/EN e passaggio a hosting italiano.

**Documentazione**
- [docs/correzioni-cliente.md](docs/correzioni-cliente.md) — registro delle richieste del cliente e del loro stato.
- [docs/proposte-tecniche.md](docs/proposte-tecniche.md) — proposte su bilingue, hosting/domini/email in Italia, manutenzione e sicurezza.

## Avvio

```sh
nvm use 22            # Node >= 22 obbligatorio
npm install
npm run dev           # http://localhost:4321
npm run build         # genera dist/ (atteso: 132 pagine, zero errori)
npm run preview -- --port 4400
```

## Stack

- Astro 6 (output statico), Tailwind CSS 4 via `@tailwindcss/vite`. I design token sono nel blocco `@theme` di `src/styles/global.css`.
- Font: Cinzel (display), Playfair Display (titoli), Source Sans 3 (testo), Great Vibes (`--font-script`, firme).
- Icone: `src/components/Icon.astro` mostra qualsiasi icona Font Awesome solid dal nome kebab-case (`<Icon name="hands-praying" />`), più alcuni alias; se il nome non esiste tra le solid usa le icone dei marchi (`cc-visa`, `paypal`…). Un nome sconosciuto blocca la build, quindi una build pulita conferma che tutte le icone esistono.
- JavaScript lato client minimo: i dropdown usano `<details>` e il menu mobile un checkbox. L'unico script è quello del modulo donazioni.

## Struttura

```text
src/
  layouts/Layout.astro      head, meta OG, favicon, Header + Footer
  components/               Header, Footer e i template condivisi delle pagine
  lib/nav.ts                mega-menu: elenca TUTTE le pagine del CSV
  pages/                    una pagina .astro per voce del CSV
  styles/global.css         token, classi componente, regole mobile (in fondo)
public/
  IICC_Logo_main.png        logo ufficiale completo (hero)
  IICC_Logo_transparent.png lo stesso logo con sfondo trasparente, da usare sopra le foto
  IICC_Badge.png            stemma (header e footer); favicon e og-default.jpg derivano da qui
  images/<sezione>/         foto ritagliate dai PNG dei mockup
scripts/qa/                 script di controllo (vedi sotto)
```

### Sezioni e URL

| Menu | Cartella |
|---|---|
| About Us | `about-us/` (+ `our-people/`) |
| Our Services | `our-services/{who-we-serve,prison-ministry,immigration-detention,mental-health,advocacy}/` |
| Programs | `programs/hope-companion/`, `programs/bakery-of-hope` |
| Get Involved | `get-involved/`, `donate/` |
| Partnerships | `partnerships/` |
| Resources | `resources/` (+ `autism/`) |
| News & Events | `news/` |
| Solo nel footer | `faq`, `privacy-policy`, `terms-conditions`, `accessibility-statement`, `404` |

Note sulla corrispondenza con i mockup:
- "Pet Companions Program" (`programs/hope-companion/pet-companions-program`) è fuori da `Struttura.csv`. Il cliente chiede di non usare mai la dicitura "Pet Rescue" presente nel suo mockup.
- "Phone & Communication Support" usa il PNG *Prison Ministry – FAQ*.
- "Prison Education & Skills" è una pagina "Coming Soon".
- Il PNG di "Our Mission" è un duplicato di quello di About Us.

### Template condivisi principali

| Uso | Componenti |
|---|---|
| Hero ministeri / servizi | `MinHero`, `MinistryTemplate`, `SupportLanding`, `ServeTemplate` |
| Persone | `PeopleHero`, `FaithLeader`, `PellStory`, `AboutTemplate` |
| Advocacy | `CampBand`, `IconCards`, `CampCards`, `ActionBox`, `CheckPanel`, `StatsRow`, `JoinCta` |
| Hope Companion | `HcHero`, `HcOr`, `HcStart`, `HcIcons`, `HcJourneys` |
| Resources / Get Involved / Partnerships | `ResHero`, `ResCards`, `NewsBar`, `GiHero`, `GmHero`, `GmCta` |
| News | `NewsCard`, `SideBox`, `ColorCards` |
| Donazioni | `DonationForm` (configurato in `src/lib/donations.ts`) |
| Pagine legali e FAQ | `LegalTemplate` (hero, tab, Quick Links, slot `sidetop`/`side`), `LegalCard`, `QuoteBand` |

## Convenzioni

- **Fedeltà ai mockup:** il corpo di ogni pagina replica il proprio PNG (sezioni, layout, immagini); header e footer sono unici per tutto il sito. Le foto vengono ritagliate dal PNG e non devono mai mostrare testo del mockup.
- **Logo:** solo quello ufficiale (`IICC_Logo_main.png`, `IICC_Logo_transparent.png`, `IICC_Badge.png`), mai i loghi diversi presenti in alcuni mockup o nelle foto.
- **Foto delle persone:** usare solo le foto individuali fornite dal cliente, mai i volti generati nei mockup. Si possono ritagliare e ridimensionare, senza alterare i lineamenti.
- **Diciture imposte dal cliente:**
  - "Pet Companions Program", mai "Pet Rescue";
  - "A Catholic Christian global mission";
  - indirizzo "Via delle Milizie 34, 00192 Rome, Italy";
  - copyright fisso "© 2026 IICC Mission. All Rights Reserved.".
- **Menu:** per aggiungere una pagina, inserirla in `src/lib/nav.ts`, altrimenti resta irraggiungibile.
- **CSS mobile:**
  - Molte griglie hanno colonne inline (`style="grid-template-columns:…"`). Su mobile si ricompongono grazie alle regole in fondo a `global.css`: classi `camp-grid`, `m-cta`, `m-band`, `m-tab2`, `hero-quote`, `hero-logo`, `side-bg`, più selettori sugli attributi `style`. Una nuova griglia inline deve usare una di queste classi.
  - Le regole condivise vanno dentro `@layer components`: una regola fuori dai layer sovrascrive tutto il layer, compresi i `max-width` dei loghi.
  - Gli stili scoped di Astro non raggiungono gli svg di `Icon` né il contenuto passato via slot: usare `:global(...)`.
- **Schermi larghi (1440–2560px):** per allineare un testo al contenitore da 1200px si usa `padding-left: calc((100vw - 1200px) / 2 …)`. Se l'elemento ha una larghezza fissa o in percentuale, quel padding gli toglie spazio e oltre i 1440px il testo si schiaccia o il logo sconfina. Va sommata la variabile `--gutter` alla larghezza (`width: calc(min(560px, 46%) + var(--gutter))`), oppure logo e testo vanno messi in un unico blocco (vedi `GiHero`). Controllare sempre anche a 1920px.
- **Griglie fitte di schede:** `ResCards` usa una container query (classe `.rc`) e passa a 3 per riga quando ogni scheda scenderebbe sotto i 170px circa. Altre griglie fitte usano `m-mid3` tra 901 e 1100px.

## Controlli qualità (`scripts/qa/`)

Da eseguire dopo `npm run build`. I risultati finiscono in `.qa/`, che è ignorata da git.

```sh
python3 scripts/qa/audit.py dist .qa/audit.json   # link interni, ancore, pagine orfane, form, contatti
npm run preview -- --port 4400                     # in un altro terminale, per i due script seguenti
node scripts/qa/mobile.mjs dist 390                # overflow orizzontale su tutte le pagine (anche 360/768/1280)
node scripts/qa/overlap.mjs dist 1920              # testi o logo sovrapposti e parole spezzate a metà (provare 390/1024/1280/1440/1920)
MAXH=1300 node scripts/qa/mshot.mjs nome /faq/ /news/   # screenshot mobile affiancati -> .qa/shots/nome.jpg
```

`mshot.mjs` richiede Python con Pillow, indicato con la variabile `PYTHON`. Per esempio: `python3 -m venv /tmp/qa-venv && /tmp/qa-venv/bin/pip install pillow`, poi `PYTHON=/tmp/qa-venv/bin/python`. Per caricare tutte le foto prima dello screenshot: `JS="document.querySelectorAll('img').forEach(i=>i.loading='eager')"`. Per gli screenshot mobile usare questi script basati su CDP: `--window-size` di Chrome headless non scende sotto circa 500px.

Ultimo esito (19/10/2026, 132 pagine): 0 link rotti, 0 ancore mancanti, 0 pagine orfane, 0 overflow da 360 a 1920px; nessuna sovrapposizione né parola spezzata da 768 a 1920px. `overlap.mjs` segnala anche alcuni falsi positivi noti: l'occhiello sopra i titoli degli hero ("Prison Ministry", "Support & Funding"), che è solo molto vicino al titolo. A 390px restano 43 parole lunghe spezzate per stare nello schermo, una situazione già presente prima e accettata dal cliente.

## In attesa dal cliente

Oggi questi elementi sono segnaposto. I link relativi puntano provvisoriamente a `/contact` o `/resources/download-guides`.

**Necessari prima della pubblicazione**
- **URL dei profili social** (Facebook, Instagram, X, YouTube; i mockup mostrano anche LinkedIn e TikTok). Nel footer ora ci sono le home generiche dei social.
- **Ricezione dei moduli:** nessun modulo invia dati (`preventDefault`). Sono 6 moduli (Contact, Volunteer Application, Support Request, Prayer Request, Submit Your Story, Autism Support Request) più 12 iscrizioni newsletter/ricerca. Servono l'email di destinazione o un servizio (es. Formspree) e il fornitore newsletter (Mailchimp, Brevo…).
- **Donazioni:** il cliente conferma PayPal Business (conto `PayPal@iiccmission.org`, da aprire), carte Visa/Mastercard, bonifico sul conto della Fondazione e GoFundMe per campagne specifiche. La pagina Donate ha il modulo `DonationForm` (una tantum/mensile, €10/25/50/100 o importo libero; carta, PayPal, bonifico, GoFundMe). Finché `src/lib/donations.ts` è vuoto, carta e PayPal mostrano "in attivazione". Servono:
  - l'account PayPal Business (email o merchant ID in `paypal.business`), verificando che dall'Italia si possa pagare con carta senza conto PayPal, anche in modalità mensile; in alternativa i Payment Link Stripe (`stripe`);
  - i dati del bonifico (intestatario, IBAN, BIC, banca, causale);
  - gli URL delle campagne GoFundMe: vanno in `gofundme` per il modulo e nei 22 bottoni del sito che oggi puntano a `gofundme.com` generico.
- **Contatti:** la sede è solo Roma (fatto). Restano da confermare il **telefono ufficiale**, oggi +39 349 303 6235 nel footer e in 5 pagine, e gli **orari** (fuso Europe/Rome). Le email dei responsabili in Staff & Volunteers vengono dai mockup.
- **Dominio definitivo:** canonical e meta OG presumono `https://www.iiccmission.org`. Impostare `site` in `astro.config.mjs`.

**Contenuti da confermare o sostituire**
- **Persone:**
  - Our Leadership è definitiva, salvo gli incarichi di Giorgio Di Martino e Irene Strangis, da confermare.
  - Staff & Volunteers e Our People usano ancora nomi e foto dei mockup (Fr. Anthony David, Maria Grazia, James Porter, Sr. Lucia Maria, Fr. Michael Tran, Elena Rossi, Daniel McCarthy). Staff & Volunteers sarà rifatta con i dati del cliente (vedi `docs/correzioni-cliente.md`).
- **Foto ancora da sostituire:** Mission News, Fondatore con Cardinal Pell (Inspired by Faith).
- **Foto in alta risoluzione:** le 827 immagini sono ritagliate dai mockup (mediana 192px di larghezza).
- **News ed eventi** (date di maggio–giugno 2025), **statistiche** (18.450+ persone, 92 missioni, 5.200+ volontari…), **testimonianze e storie** (Maria, John, Angela, Michael, Daniel, Ana, James, Sofia), **elenco delle sedi e mappe**.

**File e media**
- **PDF:**
  - guide scaricabili;
  - modulo di candidatura Hope Companion;
  - report di ricerca;
  - newsletter (numero corrente e archivio);
  - Vangelo del giorno;
  - Crisis Plan Template;
  - guida ai lasciti.
- **Video:** URL del canale YouTube "Hope Media Channel" e dei singoli video/playlist (13 link generici).
- **QR code:** quelli reali per le 5 schede colorate di `ColorCards`, oppure si rimuovono.
- **Altri contenuti:**
  - libri consigliati con link d'acquisto;
  - testi delle preghiere e piani di lettura biblica;
  - piattaforma per le petizioni e testi delle lettere;
  - modulo Ambassador;
  - iscrizione agli eventi.

**Legale e amministrativo**
- Ragione sociale e numero di registrazione dell'ente (la risposta FAQ "Is IICC Mission a registered charity?" è generica).
- Revisione legale di Privacy Policy e Terms (GDPR); banner cookie se si usano strumenti di analisi.
- Logo vettoriale (SVG/AI).
- Sito bilingue e hosting in Italia: proposte in `docs/proposte-tecniche.md`, in attesa di decisione.

## Sicurezza e manutenzione

- `npm audit` (19/10/2026): 11 vulnerabilità negli strumenti di build (1 critica in Astro). Non girano sul server perché il sito pubblicato è statico, ma vanno aggiornate con una verifica completa dei controlli qualità.
- I font sono caricati da Google Fonts: conviene ospitarli sul server, per la privacy.
- Calendario dei controlli periodici: `docs/proposte-tecniche.md`, sezione 3.
