# Proposte tecniche in attesa di decisione

Sintesi delle proposte fatte al cliente il 19 ottobre 2026. I prezzi e le caratteristiche dei provider sono quelli rilevati quel giorno: vanno riverificati al momento dell'ordine.

## 1. Sito bilingue italiano / inglese

**Richiesta del cliente:**
- versione italiana per chi arriva dall'Italia e inglese per gli altri;
- selettore IT / EN, con la lingua scelta ricordata alle visite successive;
- tradotti anche menu, moduli, FAQ e donazioni.

**Proposta**
- **Indirizzi:** inglese invariato (`/about-us`), italiano con prefisso (`/it/about-us`), con il routing multilingua nativo di Astro. All'inizio gli stessi nomi di pagina nelle due lingue; quelli tradotti (`/it/chi-siamo`) sono un'opzione successiva.
- **Una sola impaginazione:** i testi escono dal codice delle pagine e vanno in file per lingua. Sconsigliato duplicare le 132 pagine, perché ogni correzione andrebbe fatta due volte.
- **Selettore IT/EN** nell'intestazione, che porta alla stessa pagina nell'altra lingua. Scelta salvata nel browser.
- **Lingua automatica** solo alla prima visita della homepage, mai sui link diretti.
  - Con hosting italiano tradizionale (vedi punto 2): **lingua del browser**, gestita dall'hosting Apache con `.htaccess` (`Accept-Language`).
  - Il riconoscimento per **paese** richiederebbe Cloudflare davanti al dominio, perché Render e gli hosting tradizionali non lo offrono.
- **SEO:** `hreflang`, `lang` della pagina, sitemap con entrambe le versioni.
- **Restano in inglese:** le scritte dentro le immagini (es. il furgone di Pet Companions) e le pagine GoFundMe.

**Traduzione**
- Circa 55.000 parole nei corpi pagina.
- Prepariamo noi la prima versione italiana; il cliente la rivede su Google Sheets, un foglio per gruppo di pagine. Colonne: Pagina, Sezione, Codice, Testo EN, Proposta IT, Correzione del cliente, Note.
- I testi che il cliente ha già in italiano (storia e messaggi del Fondatore, eventuali testi legali) vanno chiesti in originale (Word/Google Docs) invece di tradurli dall'inglese.
- Privacy Policy e Terms in italiano richiedono la revisione di un legale.
- Glossario dei termini da concordare prima di iniziare.

**Fasi**
1. Fondamenta, con 4 pagine di prova (Home, About Us, Contatti, Donazioni).
2. Traduzione a gruppi di pagine, ciascuno consegnato per revisione.
3. Pagine legali e donazioni.
4. Lingua automatica sull'hosting definitivo e collaudo.

Da avviare dopo la seconda fase delle correzioni, per non tradurre pagine che stanno per cambiare. Il cliente deve impegnarsi a fornire in entrambe le lingue i contenuti futuri.

## 2. Hosting, domini ed email in Italia

**Richiesta del cliente:**
- server fisicamente in Italia;
- assistenza telefonica in italiano, possibilmente 24/7;
- domini `iiccmission.org` e `iiccmission.com` trasferiti da Crazy Domains (Australia) a un registrar italiano, con titolarità della Missione;
- continuità delle email e passaggio graduale.

**Provider**
- **Consigliato: Aruba.**
  - Data center ad Arezzo e Ponte San Pietro (BG), più un campus a Roma. Ne ha anche uno in Repubblica Ceca: scegliere esplicitamente l'Italia.
  - Telefono e ticket 24/7.
  - Domini, hosting, email e PEC in un unico posto.
- **Alternativa: Serverplan.** Data center a Milano, assistenza 24/7 secondo le recensioni (da confermare), prezzo stabile al rinnovo.
- **Esclusi:**
  - Register.it: telefono solo 9–18;
  - Seeweb: telefono 24/7 solo con i piani di assistenza a pagamento, sovradimensionato.

**Effetti sul sito**
- Basta un hosting Linux: le pagine sono statiche e non serve un database.
- La pubblicazione automatica da GitHub si mantiene con un deploy FTP/SFTP a ogni push (GitHub Actions).
- I moduli si possono gestire con PHP sullo stesso server: i dati restano in Italia.
- Lingua automatica in base alla lingua del browser (vedi punto 1).

**Domini**
- Il trasferimento richiede circa una settimana e aggiunge un anno di rinnovo. Servono:
  - sblocco del dominio e codice di trasferimento (EPP) da Crazy Domains;
  - email dell'intestatario attiva;
  - nessuna registrazione o cambio di intestatario negli ultimi 60 giorni.
- **Titolarità:** dominio e account del provider intestati a **IICC Mission** con email della Missione. Le credenziali principali restano al cliente; il referente tecnico ha accesso delegato.
- Prima del trasferimento va ricreata sul nuovo provider tutta la configurazione DNS, compresi i record di posta.

**Email**
- Va prima verificato dove sono oggi le caselle.
- **Google Workspace o Microsoft 365:** si copiano solo i record di posta, senza interruzioni.
- **Caselle presso Crazy Domains:**
  1. si creano le stesse caselle sul nuovo provider;
  2. si copiano i messaggi esistenti;
  3. solo dopo si sposta la ricezione;
  4. l'abbonamento vecchio resta attivo fino alla verifica.

**Passaggio graduale**
1. Inventario (domini, scadenze, DNS, caselle email, account).
2. Apertura dell'hosting italiano e prova del sito su un indirizzo temporaneo.
3. Configurazione DNS ed email sul nuovo provider.
4. Puntamento del dominio sui server italiani, tenendo Render come riserva per qualche settimana.
5. Trasferimento della registrazione dei domini.
6. Chiusura di Render e Crazy Domains.

**Costi annui indicativi (IVA esclusa, prezzi Aruba al rinnovo)**
- Domini `.com` + `.org`: circa €30.
- Hosting Linux: €35 (Basic), €60 (Easy, caselle email illimitate) oppure €80 (Advanced).
- Infrastruttura in totale: circa €100–150. L'assistenza e la manutenzione sono a parte.

**Domande aperte per il cliente**
1. Dove sono oggi le email e quante caselle ci sono.
2. Chi è l'intestatario dei domini e chi ha l'accesso a Crazy Domains.
3. Le date di scadenza dei domini.
4. Se `iiccmission.com` deve solo portare a `iiccmission.org`.

## 3. Manutenzione e sicurezza

Il sito ha poca superficie d'attacco: pagine statiche, nessun CMS né database, pagamenti su PayPal/Stripe, nessun dato di carta sul sito. Le parti da curare:
- moduli;
- correttezza dei link di donazione;
- account;
- email, DNS e HTTPS;
- strumenti di build.

**Situazione al 19/10/2026**
- `npm audit`: **11 vulnerabilità** negli strumenti di build (1 critica in Astro, 9 alte). Non girano sul server, ma vanno aggiornate.
- I font vengono caricati da Google Fonts: per la privacy conviene ospitarli sul server.

**Calendario**

| Frequenza | Attività | Tempo |
|---|---|---|
| Mensile | Sito e HTTPS attivi; link di donazione corretti (PayPal, Stripe, GoFundMe, IBAN); prova dei moduli; avvisi del provider | 30–45 min |
| Trimestrale | Aggiornamento di Astro e dipendenze con build e controlli `scripts/qa`; revisione accessi e 2FA; verifica backup (soprattutto email); SPF/DKIM/DMARC | 2–3 h |
| Annuale | Rinnovi di domini e hosting; prova di ripristino da GitHub; revisione delle informative privacy; aggiornamenti importanti di Astro | ½ giornata |
| A evento | Avvisi di sicurezza gravi; ogni modifica a pagamenti o moduli va testata; sospetti accessi non autorizzati | — |

In totale circa 15–20 ore l'anno, più gli interventi a evento.

**Interventi una tantum consigliati**
1. Font ospitati sul server.
2. Moduli PHP con protezione dallo spam.
3. Intestazioni di sicurezza via `.htaccess`.
4. 2FA su tutti gli account.
5. SPF, DKIM e DMARC.

## 4. Referente IT

Il cliente ha proposto a Stefano di diventare referente IT stabile (sito, aggiornamenti, sicurezza, coordinamento con il provider). Punti da definire per iscritto:
- **Cosa è incluso:**
  - manutenzione del punto 3;
  - rinnovi;
  - coordinamento con il provider;
  - piccole modifiche fino a un monte ore.

  Le nuove funzioni si preventivano a parte.
- **Tempi di risposta:** il 24/7 lo garantisce il provider per l'infrastruttura.
- **Account:** intestati alla Missione.
- **Privacy:** eventuale accordo per il trattamento dei dati raccolti dai moduli.
