// Bilingual routing: English pages live at their current URLs, Italian versions under /it/ with
// translated URL segments (e.g. /about-us/our-mission -> /it/chi-siamo/la-nostra-missione).
// Plain JS so it can be imported both by Astro components and by the build step (src/i18n/build.mjs).

export const SITE = 'https://www.iiccmission.org';

// English URL segment -> Italian URL segment. Every segment used by a page must be listed here.
export const SEGMENTS = {
  // About Us
  'about-us': 'chi-siamo',
  'our-mission': 'la-nostra-missione',
  'our-vision': 'la-nostra-visione',
  'our-story': 'la-nostra-storia',
  'our-leadership': 'la-nostra-leadership',
  'our-people': 'le-nostre-persone',
  'staff-volunteers': 'staff-e-volontari',
  'professional-partners': 'partner-professionali',
  'acknowledgements': 'ringraziamenti',
  'ambassador-founder': 'ambasciatore-e-fondatore',
  'founder-messages': 'messaggi-del-fondatore',
  'prison-didnt-break-me': 'il-carcere-non-mi-ha-spezzato',
  'inspired-by-faith': 'ispirati-dalla-fede',
  'pope-francis': 'papa-francesco',
  'pope-leo-xiv': 'papa-leone-xiv',
  'cardinal-george-pell': 'cardinale-george-pell',
  'peter-comensoli': 'peter-comensoli',
  // Our Services
  'our-services': 'i-nostri-servizi',
  'who-we-serve': 'chi-serviamo',
  'incarcerated-individuals': 'persone-detenute',
  'immigration-detainees': 'migranti-trattenuti',
  'families-affected-by-detention': 'famiglie-colpite-dalla-detenzione',
  'victims-of-abuse-domestic-violence': 'vittime-di-abusi-e-violenza-domestica',
  'vulnerable-communities': 'comunita-vulnerabili',
  'former-inmates-detainees': 'ex-detenuti',
  'restoration-reintegration': 'riscatto-e-reinserimento',
  'prison-ministry': 'pastorale-carceraria',
  'spiritual-pastoral-care': 'assistenza-spirituale-e-pastorale',
  'prison-visits': 'visite-in-carcere',
  'prisoner-support': 'sostegno-ai-detenuti',
  'letters-of-hope': 'lettere-di-speranza',
  'phone-communication-support': 'supporto-telefonico-e-comunicazione',
  'legal-support-referrals': 'supporto-legale-e-orientamento',
  'rights-awareness': 'conoscenza-dei-diritti',
  'prison-resources': 'risorse-per-il-carcere',
  'prison-education-skills': 'istruzione-e-competenze-in-carcere',
  'rehabilitation-programs': 'programmi-di-riabilitazione',
  'mental-health-support': 'supporto-alla-salute-mentale',
  'family-support': 'sostegno-alle-famiglie',
  'reintegration-support': 'sostegno-al-reinserimento',
  'former-prisoner-reintegration': 'reinserimento-degli-ex-detenuti',
  'restorative-justice': 'giustizia-riparativa',
  'immigration-detention': 'detenzione-dei-migranti',
  'immigration-detention-support': 'sostegno-nella-detenzione-dei-migranti',
  'preparing-for-detention': 'prepararsi-alla-detenzione',
  'support-for-detainees': 'sostegno-ai-trattenuti',
  'legal-referral-services': 'orientamento-legale',
  'humanitarian-assistance': 'assistenza-umanitaria',
  'faith-pastoral-care': 'fede-e-cura-pastorale',
  'community-integration': 'integrazione-nella-comunita',
  'immigration-detention-resources': 'risorse-sulla-detenzione-dei-migranti',
  'mental-health': 'salute-mentale',
  'mental-health-resources': 'risorse-per-la-salute-mentale',
  'mental-health-in-detention': 'salute-mentale-in-detenzione',
  'long-term-detention': 'detenzione-prolungata',
  'family-mental-health-support': 'salute-mentale-delle-famiglie',
  'crisis-support-resources': 'risorse-per-le-crisi',
  'advocacy': 'advocacy',
  'human-dignity-in-detention': 'dignita-umana-in-detenzione',
  'human-dignity-italian-prisons': 'dignita-umana-nelle-carceri-italiane',
  'prison-conditions-worldwide': 'condizioni-carcerarie-nel-mondo',
  'rehabilitation-for-every-prisoner': 'riabilitazione-per-ogni-detenuto',
  'international-human-rights-campaign': 'campagna-internazionale-diritti-umani',
  'un-human-rights-advocacy': 'advocacy-presso-le-nazioni-unite',
  'international-legal-advocacy': 'advocacy-legale-internazionale',
  'research-reports': 'ricerche-e-rapporti',
  'international-research': 'ricerca-internazionale',
  'article-41-bis-human-rights': 'articolo-41-bis-e-diritti-umani',
  'article-41-bis-reform': 'riforma-articolo-41-bis',
  'immigration-reform-campaign': 'campagna-riforma-immigrazione',
  'australia-section-501-campaign': 'campagna-sezione-501-australia',
  'mandatory-visa-cancellation': 'revoca-obbligatoria-del-visto',
  'petition-campaigns': 'petizioni',
  'support-justice-campaign': 'campagna-sostieni-la-giustizia',
  // Programs
  'programs': 'programmi',
  'hope-companion': 'hope-companion',
  'how-it-works': 'come-funziona',
  'training-safeguarding': 'formazione-e-tutela',
  'prison-companion-program': 'accompagnamento-in-carcere',
  'detainee-companion-program': 'accompagnamento-nei-centri-per-migranti',
  'become-a-companion': 'diventa-hope-companion',
  'stories': 'storie',
  '10000-companions': '10000-companions',
  'pet-companions-program': 'pet-companions-program',
  'bakery-of-hope': 'forno-della-speranza',
  // Get Involved / Donate
  'get-involved': 'partecipa',
  'volunteer-program': 'programma-volontari',
  'volunteer-application': 'candidatura-volontari',
  'ambassador-program': 'programma-ambasciatori',
  'prayer-request': 'richiesta-di-preghiera',
  'support-request': 'richiesta-di-supporto',
  'submit-your-story': 'racconta-la-tua-storia',
  'donate': 'dona',
  'impact': 'il-tuo-impatto',
  'monthly-giving': 'donazione-mensile',
  'corporate-giving': 'donazioni-aziendali',
  'legacy': 'lasciti',
  // Partnerships
  'partnerships': 'partnership',
  'international-branches': 'sedi-internazionali',
  'italian-branches': 'sedi-italiane',
  'australian-branches': 'sedi-australiane',
  'national-missions': 'missioni-nazionali',
  'state-missions': 'missioni-statali',
  'regional-missions': 'missioni-regionali',
  'usa-expansion': 'espansione-usa',
  'canada-expansion': 'espansione-canada',
  'rome-headquarters': 'sede-di-roma',
  'churches-parish-partners': 'chiese-e-parrocchie',
  // Resources
  'resources': 'risorse',
  'resource-centre': 'centro-risorse',
  'recommended-books': 'libri-consigliati',
  'articles': 'articoli',
  'videos': 'video',
  'download-guides': 'guide-da-scaricare',
  'bible-daily-gospel': 'bibbia-e-vangelo-del-giorno',
  'prayer-resources': 'risorse-per-la-preghiera',
  'family-resources': 'risorse-per-le-famiglie',
  'autism': 'autismo',
  'awareness': 'consapevolezza',
  'support': 'sostegno',
  // News, contact, legal
  'news': 'notizie',
  'mission-updates': 'aggiornamenti-dalla-missione',
  'newsletter': 'newsletter',
  'contact': 'contatti',
  'faq': 'domande-frequenti',
  'privacy-policy': 'informativa-privacy',
  'terms-conditions': 'termini-e-condizioni',
  'accessibility-statement': 'dichiarazione-di-accessibilita',
};

// English pages whose Italian version is published. Add a page here once its texts are in the catalog
// (src/i18n/it.json); pages not listed stay English-only and links to them from Italian pages keep
// pointing to the English page.
export const IT_READY = new Set([
  '/',
  '/about-us',
  '/contact',
  '/donate',
]);

// Pages whose Italian text must be checked by a legal professional before final publication.
export const LEGAL_REVIEW = new Set([
  '/privacy-policy',
  '/terms-conditions',
  '/accessibility-statement',
  '/donate',
]);

const REVERSE = Object.fromEntries(Object.entries(SEGMENTS).map(([en, it]) => [it, en]));

/** '/about-us/' -> '/about-us', '' -> '/', drops query and hash. */
export function normalize(path) {
  let p = (path || '/').split(/[?#]/)[0];
  if (!p.startsWith('/')) p = '/' + p;
  p = p.replace(/\/index\.html$/, '/').replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

/** English path -> Italian path ('/' -> '/it'). Returns null if a segment has no translation. */
export function toIt(enPath) {
  const p = normalize(enPath);
  if (p === '/') return '/it';
  const segs = p.slice(1).split('/').map(s => SEGMENTS[s]);
  return segs.every(Boolean) ? '/it/' + segs.join('/') : null;
}

/** Italian path -> English path. Returns null if the path is not an Italian path. */
export function toEn(itPath) {
  const p = normalize(itPath);
  if (p === '/it') return '/';
  if (!p.startsWith('/it/')) return null;
  const segs = p.slice(4).split('/').map(s => REVERSE[s]);
  return segs.every(Boolean) ? '/' + segs.join('/') : null;
}

/** True when the English page at `enPath` has a published Italian version. */
export function hasIt(enPath) {
  return IT_READY.has(normalize(enPath)) && toIt(enPath) !== null;
}
