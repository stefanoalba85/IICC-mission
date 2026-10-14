# IICC Mission — sito web

Sito vetrina statico di **IICC Mission** (Inmate International Catholic Care): 131 pagine in inglese, costruite dai mockup definitivi del cliente.

- **Repo:** `git@github.com:stefanoalba85/IICC-mission.git`, branch di lavoro `develop`
- **Fonte dei contenuti** (fuori dal repo, nella cartella di progetto superiore):
  - `../../Struttura.csv` — elenco delle 131 pagine (gruppo di menu, nome pagina, PNG di riferimento)
  - `../../Materiali_definitivi/` — un mockup PNG per pagina + `IICC_Logo.png` (logo ufficiale)

**Stato (ottobre 2026):** tutte le 131 pagine sono realizzate e ottimizzate per mobile, con link verificati. Si attende il feedback del cliente e i materiali elencati più sotto.

## Avvio

```sh
nvm use 22            # Node >= 22 obbligatorio
npm install
npm run dev           # http://localhost:4321
npm run build         # genera dist/ (atteso: 131 pagine, zero errori)
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
- **Logo:** solo quello ufficiale (`IICC_Logo_main.png` / `IICC_Badge.png`), mai i loghi diversi presenti in alcuni mockup.
- **Menu:** per aggiungere una pagina, inserirla in `src/lib/nav.ts`, altrimenti resta irraggiungibile.
- **CSS mobile:**
  - Molte griglie hanno colonne inline (`style="grid-template-columns:…"`). Su mobile si ricompongono grazie alle regole in fondo a `global.css`: classi `camp-grid`, `m-cta`, `m-band`, `m-tab2`, `hero-quote`, `hero-logo`, `side-bg`, più selettori sugli attributi `style`. Una nuova griglia inline deve usare una di queste classi.
  - Le regole condivise vanno dentro `@layer components`: una regola fuori dai layer sovrascrive tutto il layer, compresi i `max-width` dei loghi.
  - Gli stili scoped di Astro non raggiungono gli svg di `Icon` né il contenuto passato via slot: usare `:global(...)`.

## Controlli qualità (`scripts/qa/`)

Da eseguire dopo `npm run build`. I risultati finiscono in `.qa/`, che è ignorata da git.

```sh
python3 scripts/qa/audit.py dist .qa/audit.json   # link interni, ancore, pagine orfane, form, contatti
npm run preview -- --port 4400                     # in un altro terminale, per i due script seguenti
node scripts/qa/mobile.mjs dist 390                # overflow orizzontale su tutte le pagine (anche 360/768/1280)
MAXH=1300 node scripts/qa/mshot.mjs nome /faq/ /news/   # screenshot mobile affiancati -> .qa/shots/nome.jpg
```

`mshot.mjs` richiede Python con Pillow (variabile `PYTHON`). Per gli screenshot mobile usare questi script basati su CDP: `--window-size` di Chrome headless non scende sotto circa 500px.

Ultimo esito: 0 link rotti, 0 ancore mancanti, 0 pagine orfane, 0 overflow a 360/390/430/768/1024/1280px.

## In attesa dal cliente

Oggi questi elementi sono segnaposto. I link relativi puntano provvisoriamente a `/contact` o `/resources/download-guides`.

**Necessari prima della pubblicazione**
- **URL dei profili social** (Facebook, Instagram, X, YouTube; i mockup mostrano anche LinkedIn e TikTok). Nel footer ora ci sono le home generiche dei social.
- **Ricezione dei moduli:** nessun modulo invia dati (`preventDefault`). Sono 6 moduli (Contact, Volunteer Application, Support Request, Prayer Request, Submit Your Story, Autism Support Request) più 12 iscrizioni newsletter/ricerca. Servono l'email di destinazione o un servizio (es. Formspree) e il fornitore newsletter (Mailchimp, Brevo…).
- **Donazioni:** la pagina Donate ha il modulo `DonationForm` (una tantum/mensile, €10/25/50/100 o importo libero; carta, PayPal, bonifico, GoFundMe). Finché `src/lib/donations.ts` è vuoto, carta e PayPal mostrano "in attivazione". Servono:
  - l'account PayPal Business (email o merchant ID in `paypal.business`), verificando che dall'Italia si possa pagare con carta senza conto PayPal, anche in modalità mensile; in alternativa i Payment Link Stripe (`stripe`);
  - i dati del bonifico (intestatario, IBAN, BIC, banca, causale);
  - gli URL delle campagne GoFundMe: vanno in `gofundme` per il modulo e nei 22 bottoni del sito che oggi puntano a `gofundme.com` generico.
- **Contatti coerenti:**
  - la pagina Contact riporta North Sydney PO Box 341, +61 2 8732 4555, +61 411 209 066 e orari AEST, mentre il resto del sito usa Via delle Milizie 34, Roma, +39 349 303 6235;
  - le email dei responsabili in Staff & Volunteers vengono dai mockup.
- **Dominio definitivo:** canonical e meta OG presumono `https://www.iiccmission.org`. Impostare `site` in `astro.config.mjs`.

**Contenuti da confermare o sostituire**
- **Persone:** nomi, ruoli e foto di leadership e staff vengono dai mockup (Father John Vespa, Francesco e Ilenia Dattilo, Fr. Anthony David, Maria Grazia, James Porter, Sr. Lucia Maria, Fr. Michael Tran, Elena Rossi, Daniel McCarthy). Va verificato che siano reali e che abbiano dato il consenso.
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
- Decidere se serve una versione italiana del sito.
- Approvare lo stesso footer su tutte le pagine (alcuni mockup indicano "Vatican City / Rome" e altri recapiti).
