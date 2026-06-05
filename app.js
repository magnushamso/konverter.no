/* =====================
   API & Cache
   ===================== */
const FIAT_API   = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/nok.json';
const CRYPTO_API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=nok&order=market_cap_desc&per_page=20&page=1&sparkline=false';
const CACHE_KEY_FIAT   = 'konverter_fiat_v2';
const CACHE_KEY_CRYPTO = 'konverter_crypto_v2';
const CACHE_TTL = 60 * 60 * 1000;

/* =====================
   Data: land, flagg, valuta
   ===================== */
const FIAT_INFO = {
  NOK: { land: 'Norge',           flagg: '🇳🇴', navn: 'Norske kroner' },
  SEK: { land: 'Sverige',         flagg: '🇸🇪', navn: 'Svenske kroner' },
  DKK: { land: 'Danmark',         flagg: '🇩🇰', navn: 'Danske kroner' },
  ISK: { land: 'Island',          flagg: '🇮🇸', navn: 'Islandske kronur' },
  EUR: { land: 'Euroområdet',     flagg: '🇪🇺', navn: 'Euro' },
  GBP: { land: 'Storbritannia',   flagg: '🇬🇧', navn: 'Britiske pund' },
  USD: { land: 'USA',             flagg: '🇺🇸', navn: 'Amerikanske dollar' },
  CAD: { land: 'Canada',          flagg: '🇨🇦', navn: 'Kanadiske dollar' },
  AUD: { land: 'Australia',       flagg: '🇦🇺', navn: 'Australske dollar' },
  NZD: { land: 'New Zealand',     flagg: '🇳🇿', navn: 'New Zealand-dollar' },
  CHF: { land: 'Sveits',          flagg: '🇨🇭', navn: 'Sveitsiske franc' },
  JPY: { land: 'Japan',           flagg: '🇯🇵', navn: 'Japanske yen' },
  CNY: { land: 'Kina',            flagg: '🇨🇳', navn: 'Kinesiske yuan' },
  HKD: { land: 'Hongkong',        flagg: '🇭🇰', navn: 'Hongkong-dollar' },
  SGD: { land: 'Singapore',       flagg: '🇸🇬', navn: 'Singapore-dollar' },
  KRW: { land: 'Sør-Korea',       flagg: '🇰🇷', navn: 'Sørkoreanske won' },
  TWD: { land: 'Taiwan',          flagg: '🇹🇼', navn: 'Taiwanske dollar' },
  INR: { land: 'India',           flagg: '🇮🇳', navn: 'Indiske rupier' },
  IDR: { land: 'Indonesia',       flagg: '🇮🇩', navn: 'Indonesiske rupiah' },
  MYR: { land: 'Malaysia',        flagg: '🇲🇾', navn: 'Malaysiske ringgit' },
  THB: { land: 'Thailand',        flagg: '🇹🇭', navn: 'Thailandske baht' },
  PHP: { land: 'Filippinene',     flagg: '🇵🇭', navn: 'Filippinske pesos' },
  VND: { land: 'Vietnam',         flagg: '🇻🇳', navn: 'Vietnamesiske dong' },
  PKR: { land: 'Pakistan',        flagg: '🇵🇰', navn: 'Pakistanske rupier' },
  BDT: { land: 'Bangladesh',      flagg: '🇧🇩', navn: 'Bangladeshiske taka' },
  LKR: { land: 'Sri Lanka',       flagg: '🇱🇰', navn: 'Srilankesiske rupier' },
  AED: { land: 'De forente arabiske emirater', flagg: '🇦🇪', navn: 'Emiratiske dirham' },
  SAR: { land: 'Saudi-Arabia',    flagg: '🇸🇦', navn: 'Saudiarabiske rial' },
  QAR: { land: 'Qatar',           flagg: '🇶🇦', navn: 'Qatarsk riyal' },
  KWD: { land: 'Kuwait',          flagg: '🇰🇼', navn: 'Kuwaitisk dinar' },
  BHD: { land: 'Bahrain',         flagg: '🇧🇭', navn: 'Bahrainsk dinar' },
  OMR: { land: 'Oman',            flagg: '🇴🇲', navn: 'Omansk rial' },
  ILS: { land: 'Israel',          flagg: '🇮🇱', navn: 'Israelske shekel' },
  TRY: { land: 'Tyrkia',          flagg: '🇹🇷', navn: 'Tyrkiske lira' },
  EGP: { land: 'Egypt',           flagg: '🇪🇬', navn: 'Egyptiske pund' },
  NGN: { land: 'Nigeria',         flagg: '🇳🇬', navn: 'Nigerianske naira' },
  KES: { land: 'Kenya',           flagg: '🇰🇪', navn: 'Kenyanske shilling' },
  GHS: { land: 'Ghana',           flagg: '🇬🇭', navn: 'Ghanesiske cedi' },
  MAD: { land: 'Marokko',         flagg: '🇲🇦', navn: 'Marokkanske dirham' },
  ZAR: { land: 'Sør-Afrika',      flagg: '🇿🇦', navn: 'Sørafrikanske rand' },
  MXN: { land: 'Mexico',          flagg: '🇲🇽', navn: 'Meksikanske pesos' },
  BRL: { land: 'Brasil',          flagg: '🇧🇷', navn: 'Brasilianske realer' },
  ARS: { land: 'Argentina',       flagg: '🇦🇷', navn: 'Argentinske pesos' },
  CLP: { land: 'Chile',           flagg: '🇨🇱', navn: 'Chilenske pesos' },
  COP: { land: 'Colombia',        flagg: '🇨🇴', navn: 'Colombianske pesos' },
  PEN: { land: 'Peru',            flagg: '🇵🇪', navn: 'Peruanske sol' },
  UYU: { land: 'Uruguay',         flagg: '🇺🇾', navn: 'Uruguayanske pesos' },
  PLN: { land: 'Polen',           flagg: '🇵🇱', navn: 'Polske zloty' },
  CZK: { land: 'Tsjekkia',        flagg: '🇨🇿', navn: 'Tsjekkiske koruna' },
  HUF: { land: 'Ungarn',          flagg: '🇭🇺', navn: 'Ungarske forint' },
  RON: { land: 'Romania',         flagg: '🇷🇴', navn: 'Rumenske leu' },
  BGN: { land: 'Bulgaria',        flagg: '🇧🇬', navn: 'Bulgarske lev' },
  RUB: { land: 'Russland',        flagg: '🇷🇺', navn: 'Russiske rubler' },
  HRK: { land: 'Kroatia',         flagg: '🇭🇷', navn: 'Kroatiske kuna' },
};

/* Norden + store valutaer øverst i dropdown */
const PRIORITERT_FIAT = ['NOK','SEK','DKK','ISK','EUR','GBP','USD','CHF','JPY','CAD','AUD'];

/* =====================
   Tilstand
   ===================== */
let fiatKurser = {};
const cryptoData = [];
let søkStreng = '';

/* =====================
   Cache
   ===================== */
function fraCache(k) {
  try {
    const r = sessionStorage.getItem(k);
    if (!r) return null;
    const { tid, data } = JSON.parse(r);
    if (Date.now() - tid > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}
function tilCache(k, data) {
  try { sessionStorage.setItem(k, JSON.stringify({ tid: Date.now(), data })); } catch {}
}

/* =====================
   Hent data
   ===================== */
async function hentFiat() {
  const c = fraCache(CACHE_KEY_FIAT);
  if (c) { fiatKurser = c; return; }
  const res  = await fetch(FIAT_API);
  const json = await res.json();
  fiatKurser = { NOK: 1 };
  for (const [k, v] of Object.entries(json.nok)) {
    if (v > 0) fiatKurser[k.toUpperCase()] = 1 / v;
  }
  tilCache(CACHE_KEY_FIAT, fiatKurser);
}

async function hentCrypto() {
  const c = fraCache(CACHE_KEY_CRYPTO);
  if (c) { cryptoData.length = 0; cryptoData.push(...c); return; }
  const res  = await fetch(CRYPTO_API);
  const json = await res.json();
  cryptoData.length = 0;
  cryptoData.push(...json);
  tilCache(CACHE_KEY_CRYPTO, json);
}

/* =====================
   Formater
   ===================== */
function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '–';
  const abs = Math.abs(n);
  let d = 2;
  if (abs < 0.0001) d = 8;
  else if (abs < 0.01) d = 6;
  else if (abs < 1)    d = 4;
  else if (abs > 1000) d = 0;
  return new Intl.NumberFormat('nb-NO', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}

/* =====================
   Bygg <select> med <optgroup>
   ===================== */
function byggSelect(elId, defaultVerdi) {
  const el = document.getElementById(elId);
  el.innerHTML = '';

  /* --- FIAT-gruppe --- */
  const grp1 = document.createElement('optgroup');
  grp1.label = '— Fiat-valuta';

  // Prioriterte øverst
  const prioritert = PRIORITERT_FIAT.filter(k => fiatKurser[k] && FIAT_INFO[k]);
  const resten = Object.keys(fiatKurser)
    .filter(k => !PRIORITERT_FIAT.includes(k) && FIAT_INFO[k])
    .sort((a, b) => {
      const la = FIAT_INFO[a]?.land || a;
      const lb = FIAT_INFO[b]?.land || b;
      return la.localeCompare(lb, 'nb');
    });

  [...prioritert, ...resten].forEach(kode => {
    const info = FIAT_INFO[kode];
    const flagg = info?.flagg || '';
    const land  = info?.land  || kode;
    const navn  = info?.navn  || kode;
    const opt = new Option(`${flagg} ${land} – ${kode} – ${navn}`, `fiat:${kode}`);
    grp1.appendChild(opt);
  });

  el.appendChild(grp1);

  /* --- Krypto-gruppe --- */
  const grp2 = document.createElement('optgroup');
  grp2.label = '— Kryptovaluta (topp 20)';

  cryptoData.forEach(c => {
    const symbol = c.symbol.toUpperCase();
    const opt = new Option(`${symbol} – ${c.name}`, `crypto:${symbol}`);
    grp2.appendChild(opt);
  });

  el.appendChild(grp2);

  // Sett default
  if (defaultVerdi && el.querySelector(`option[value="${defaultVerdi}"]`)) {
    el.value = defaultVerdi;
  } else {
    el.value = el.options[0]?.value;
  }
}

/* =====================
   Løs opp verdi til kurs i NOK
   ===================== */
function kursINok(verdi) {
  if (!verdi) return null;
  const [type, kode] = verdi.split(':');
  if (type === 'fiat') return fiatKurser[kode] ?? null;
  if (type === 'crypto') {
    const c = cryptoData.find(x => x.symbol.toUpperCase() === kode);
    return c?.current_price ?? null;
  }
  return null;
}

function visNavn(verdi) {
  if (!verdi) return '';
  const [type, kode] = verdi.split(':');
  if (type === 'fiat') return kode;
  return kode;
}

/* =====================
   Konverter
   ===================== */
function konverter() {
  const beløp   = parseFloat(document.getElementById('belop-input').value) || 0;
  const fraVal  = document.getElementById('fra-valuta').value;
  const tilVal  = document.getElementById('til-valuta').value;

  const fraNOK  = kursINok(fraVal);
  const tilNOK  = kursINok(tilVal);

  const resultatEl = document.getElementById('resultat-verdi');
  const kursEl     = document.getElementById('kurs-info');

  if (!fraNOK || !tilNOK) { resultatEl.textContent = '–'; kursEl.textContent = ''; return; }

  const kurs    = fraNOK / tilNOK;
  const resultat = beløp * kurs;

  resultatEl.textContent = `${fmt(resultat)} ${visNavn(tilVal)}`;
  kursEl.textContent     = `1 ${visNavn(fraVal)} = ${fmt(kurs)} ${visNavn(tilVal)}`;
}

/* =====================
   Render valuta-grid
   ===================== */
function renderGrid() {
  const grid = document.getElementById('valuta-grid');
  const søk  = søkStreng.toLowerCase();

  // Fiat-rader
  const fiatRader = Object.keys(fiatKurser)
    .filter(k => {
      if (!FIAT_INFO[k]) return false; // skjul valutaer uten fullstendig info
      if (!søk) return true;
      const info = FIAT_INFO[k];
      return k.toLowerCase().includes(søk)
        || (info?.land || '').toLowerCase().includes(søk)
        || (info?.navn || '').toLowerCase().includes(søk);
    })
    .sort((a, b) => {
      const pi = PRIORITERT_FIAT.indexOf(a);
      const pj = PRIORITERT_FIAT.indexOf(b);
      if (pi !== -1 && pj !== -1) return pi - pj;
      if (pi !== -1) return -1;
      if (pj !== -1) return 1;
      return (FIAT_INFO[a]?.land || a).localeCompare(FIAT_INFO[b]?.land || b, 'nb');
    });

  // Krypto-rader
  const cryptoRader = cryptoData.filter(c => {
    if (!søk) return true;
    return c.symbol.toLowerCase().includes(søk) || c.name.toLowerCase().includes(søk);
  });

  if (fiatRader.length === 0 && cryptoRader.length === 0) {
    grid.innerHTML = `<div class="ingen-treff" role="status">Ingen valutaer matcher søket.</div>`;
    return;
  }

  grid.innerHTML = '';

  // Fiat-seksjon
  if (fiatRader.length > 0) {
    const heading = document.createElement('div');
    heading.className = 'grid-gruppe-tittel';
    heading.textContent = 'Fiat-valuta';
    heading.setAttribute('role', 'heading');
    heading.setAttribute('aria-level', '3');
    grid.appendChild(heading);

    fiatRader.forEach(kode => {
      const info = FIAT_INFO[kode];
      const div = document.createElement('div');
      div.className = 'valuta-rad';
      div.setAttribute('role', 'listitem');
      div.setAttribute('tabindex', '0');
      div.setAttribute('aria-label',
        `${info?.flagg || ''} ${info?.land || kode} – ${kode} – ${fmt(fiatKurser[kode])} NOK`);
      div.innerHTML = `
        <span class="valuta-flagg" aria-hidden="true">${info?.flagg || '🏳'}</span>
        <span class="valuta-land">${info?.land || kode}</span>
        <span class="valuta-kode">${kode}</span>
        <span class="valuta-kurs">${fmt(fiatKurser[kode])}</span>
      `;
      div.addEventListener('click', () => {
        document.getElementById('fra-valuta').value = `fiat:${kode}`;
        konverter();
      });
      div.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); div.click(); }
      });
      grid.appendChild(div);
    });
  }

  // Krypto-seksjon
  if (cryptoRader.length > 0) {
    const heading = document.createElement('div');
    heading.className = 'grid-gruppe-tittel';
    heading.textContent = 'Kryptovaluta';
    heading.setAttribute('role', 'heading');
    heading.setAttribute('aria-level', '3');
    grid.appendChild(heading);

    cryptoRader.forEach(c => {
      const symbol = c.symbol.toUpperCase();
      const endring = c.price_change_percentage_24h;
      const div = document.createElement('div');
      div.className = 'valuta-rad';
      div.setAttribute('role', 'listitem');
      div.setAttribute('tabindex', '0');
      div.setAttribute('aria-label',
        `${symbol} – ${c.name} – ${fmt(c.current_price)} NOK`);
      div.innerHTML = `
        <span class="valuta-flagg crypto-ikon" aria-hidden="true">₿</span>
        <span class="valuta-land">${c.name}</span>
        <span class="valuta-kode">${symbol}</span>
        <span class="valuta-kurs">
          ${fmt(c.current_price)}
          <span class="endring" style="color:${endring >= 0 ? 'var(--gronn)' : 'var(--burgunder)'}">
            ${endring >= 0 ? '▲' : '▼'}${Math.abs(endring).toFixed(1)}%
          </span>
        </span>
      `;
      div.addEventListener('click', () => {
        document.getElementById('fra-valuta').value = `crypto:${symbol}`;
        konverter();
      });
      div.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); div.click(); }
      });
      grid.appendChild(div);
    });
  }
}

/* =====================
   Status
   ===================== */
function settStatus(tilstand, tekst) {
  const dot = document.getElementById('status-dot');
  const el  = document.getElementById('status-tekst');
  dot.className = `status-dot ${tilstand}`;
  el.textContent = tekst;
}

/* =====================
   Init
   ===================== */
async function init() {
  settStatus('laster', 'Henter kurser…');
  document.getElementById('valuta-grid').innerHTML =
    `<div class="laster-melding" aria-busy="true" role="status">Henter kurser…</div>`;

  try {
    await Promise.all([hentFiat(), hentCrypto()]);

    byggSelect('fra-valuta', 'fiat:USD');
    byggSelect('til-valuta', 'fiat:NOK');

    renderGrid();
    konverter();

    const nå = new Date().toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
    settStatus('ok', `Oppdatert ${nå} – fiat: Exchange API · krypto: CoinGecko`);

  } catch (feil) {
    console.error(feil);
    settStatus('feil', 'Kunne ikke hente kurser – prøv igjen');
    document.getElementById('valuta-grid').innerHTML =
      `<div class="ingen-treff" role="alert">Kunne ikke hente data. Sjekk internettforbindelsen.</div>`;
  }
}

/* =====================
   Lyttere
   ===================== */
document.getElementById('belop-input').addEventListener('input', konverter);
document.getElementById('fra-valuta').addEventListener('change', konverter);
document.getElementById('til-valuta').addEventListener('change', konverter);

document.getElementById('bytt-knapp').addEventListener('click', () => {
  const fra = document.getElementById('fra-valuta');
  const til = document.getElementById('til-valuta');
  [fra.value, til.value] = [til.value, fra.value];
  konverter();
});

document.getElementById('sok-input').addEventListener('input', e => {
  søkStreng = e.target.value;
  renderGrid();
});

init();
