/* =====================
   Konfigurasjon
   ===================== */
const FIAT_API   = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/nok.json';
const CRYPTO_API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=nok&order=market_cap_desc&per_page=20&page=1&sparkline=false';

const CACHE_KEY_FIAT   = 'konverter_fiat_v1';
const CACHE_KEY_CRYPTO = 'konverter_crypto_v1';
const CACHE_TTL        = 60 * 60 * 1000; // 1 time i ms

const VALUTA_NAVN = {
  NOK: 'Norske kroner', USD: 'Amerikanske dollar', EUR: 'Euro',
  GBP: 'Britiske pund', SEK: 'Svenske kroner', DKK: 'Danske kroner',
  CHF: 'Sveitsiske franc', JPY: 'Japanske yen', CNY: 'Kinesiske yuan',
  AUD: 'Australske dollar', CAD: 'Kanadiske dollar', NZD: 'New Zealand-dollar',
  SGD: 'Singapore-dollar', HKD: 'Hongkong-dollar', INR: 'Indiske rupier',
  MXN: 'Meksikanske pesos', BRL: 'Brasilianske realer', ZAR: 'Sørafrikanske rand',
  RUB: 'Russiske rubler', TRY: 'Tyrkiske lira', PLN: 'Polske zloty',
  CZK: 'Tsjekkiske koruna', HUF: 'Ungarske forint', RON: 'Rumenske leu',
  BGN: 'Bulgarske lev', HRK: 'Kroatiske kuna', ISK: 'Islandske kronur',
  AED: 'Emiratiske dirham', SAR: 'Saudiarabiske rial', QAR: 'Qatarsk riyal',
  KWD: 'Kuwaitisk dinar', BHD: 'Bahrainsk dinar', OMR: 'Omansk rial',
  ILS: 'Israelske shekel', EGP: 'Egyptiske pund', NGN: 'Nigerianske naira',
  KES: 'Kenyanske shilling', GHS: 'Ghanesiske cedi', MAD: 'Marokkanske dirham',
  TWD: 'Taiwanske dollar', KRW: 'Sørkoreanske won', THB: 'Thailandske baht',
  IDR: 'Indonesiske rupiah', MYR: 'Malaysiske ringgit', PHP: 'Filippinske pesos',
  VND: 'Vietnamesiske dong', PKR: 'Pakistanske rupier', BDT: 'Bangladeshiske taka',
  LKR: 'Srilankesiske rupier', ARS: 'Argentinske pesos', CLP: 'Chilenske pesos',
  COP: 'Colombianske pesos', PEN: 'Peruanske sol', UYU: 'Uruguayanske pesos',
};

/* =====================
   Tilstand
   ===================== */
let aktivType    = 'fiat';
let fiatKurser   = {};   // NOK som base, kurser for alt annet
const cryptoData = [];
let søkStreng    = '';

/* =====================
   Cache-hjelper
   ===================== */
function fraCache(nøkkel) {
  try {
    const rå = sessionStorage.getItem(nøkkel);
    if (!rå) return null;
    const { tid, data } = JSON.parse(rå);
    if (Date.now() - tid > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function tilCache(nøkkel, data) {
  try {
    sessionStorage.setItem(nøkkel, JSON.stringify({ tid: Date.now(), data }));
  } catch {}
}

/* =====================
   Hent fiat-kurser
   ===================== */
async function hentFiat() {
  const cachet = fraCache(CACHE_KEY_FIAT);
  if (cachet) { fiatKurser = cachet; return; }

  // API gir NOK som base → inverter for å få "1 X = Y NOK"
  const res  = await fetch(FIAT_API);
  const json = await res.json();
  const nokRater = json.nok; // { usd: 0.087, eur: 0.08, ... }

  // Konverter: 1 USD i NOK = 1 / nokRater.usd
  fiatKurser = {};
  for (const [kode, rate] of Object.entries(nokRater)) {
    if (rate && rate > 0) {
      fiatKurser[kode.toUpperCase()] = 1 / rate;
    }
  }
  fiatKurser['NOK'] = 1;
  tilCache(CACHE_KEY_FIAT, fiatKurser);
}

/* =====================
   Hent krypto
   ===================== */
async function hentCrypto() {
  const cachet = fraCache(CACHE_KEY_CRYPTO);
  if (cachet) {
    cryptoData.length = 0;
    cryptoData.push(...cachet);
    return;
  }

  const res  = await fetch(CRYPTO_API);
  const json = await res.json();
  cryptoData.length = 0;
  cryptoData.push(...json);
  tilCache(CACHE_KEY_CRYPTO, json);
}

/* =====================
   Formater tall
   ===================== */
function formaterTall(n, valuta) {
  if (n === null || n === undefined || isNaN(n)) return '–';
  const abs = Math.abs(n);
  let desimaler = 2;
  if (abs < 0.01)  desimaler = 6;
  else if (abs < 1) desimaler = 4;
  else if (abs > 1000) desimaler = 0;

  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: desimaler,
    maximumFractionDigits: desimaler,
  }).format(n);
}

/* =====================
   Konverter
   ===================== */
function konverter() {
  const beløp  = parseFloat(document.getElementById('belop-input').value) || 0;
  const fraKode = document.getElementById('fra-valuta').value;
  const tilKode = document.getElementById('til-valuta').value;
  const resultatEl = document.getElementById('resultat-verdi');
  const kursEl     = document.getElementById('kurs-info');

  if (aktivType === 'fiat') {
    const fraNOK = fiatKurser[fraKode];
    const tilNOK = fiatKurser[tilKode];
    if (!fraNOK || !tilNOK) { resultatEl.textContent = '–'; return; }

    const kurs    = tilNOK / fraNOK;
    const resultat = beløp * kurs;
    resultatEl.textContent = `${formaterTall(resultat, tilKode)} ${tilKode}`;
    kursEl.textContent = `1 ${fraKode} = ${formaterTall(kurs, tilKode)} ${tilKode}`;

  } else {
    // Krypto
    const fra = cryptoData.find(c => c.symbol.toUpperCase() === fraKode);
    const til = cryptoData.find(c => c.symbol.toUpperCase() === tilKode);

    let fraVerdiNOK, tilVerdiNOK;

    if (fraKode === 'NOK') fraVerdiNOK = 1;
    else if (fra) fraVerdiNOK = fra.current_price;
    else { resultatEl.textContent = '–'; return; }

    if (tilKode === 'NOK') tilVerdiNOK = 1;
    else if (til) tilVerdiNOK = til.current_price;
    else { resultatEl.textContent = '–'; return; }

    const kurs = fraVerdiNOK / tilVerdiNOK;
    const resultat = beløp * kurs;
    resultatEl.textContent = `${formaterTall(resultat)} ${tilKode}`;
    kursEl.textContent = `1 ${fraKode} = ${formaterTall(kurs)} ${tilKode}`;
  }
}

/* =====================
   Fyll select-menyer
   ===================== */
function fyllSelecter() {
  const fraEl = document.getElementById('fra-valuta');
  const tilEl = document.getElementById('til-valuta');
  const gammelFra = fraEl.value;
  const gammelTil = tilEl.value;

  fraEl.innerHTML = '';
  tilEl.innerHTML = '';

  let alternativer = [];

  if (aktivType === 'fiat') {
    // Prioriter vanlige valutaer øverst
    const prioriterte = ['NOK','USD','EUR','GBP','SEK','DKK','CHF','JPY','CAD','AUD'];
    const alle = Object.keys(fiatKurser).sort();
    const sortert = [
      ...prioriterte.filter(k => fiatKurser[k]),
      ...alle.filter(k => !prioriterte.includes(k))
    ];
    alternativer = sortert.map(kode => ({
      verdi: kode,
      tekst: `${kode} – ${VALUTA_NAVN[kode] || kode}`
    }));
  } else {
    alternativer = cryptoData.map(c => ({
      verdi: c.symbol.toUpperCase(),
      tekst: `${c.symbol.toUpperCase()} – ${c.name}`
    }));
    alternativer.unshift({ verdi: 'NOK', tekst: 'NOK – Norske kroner' });
  }

  alternativer.forEach(({ verdi, tekst }) => {
    const opt1 = new Option(tekst, verdi);
    const opt2 = new Option(tekst, verdi);
    fraEl.appendChild(opt1);
    tilEl.appendChild(opt2);
  });

  // Gjenopprett valg om mulig
  if (gammelFra && fraEl.querySelector(`option[value="${gammelFra}"]`)) fraEl.value = gammelFra;
  else fraEl.value = aktivType === 'fiat' ? 'USD' : (cryptoData[0]?.symbol.toUpperCase() || 'BTC');

  if (gammelTil && tilEl.querySelector(`option[value="${gammelTil}"]`)) tilEl.value = gammelTil;
  else tilEl.value = 'NOK';
}

/* =====================
   Render valuta-grid
   ===================== */
function renderGrid() {
  const grid = document.getElementById('valuta-grid');
  const søk  = søkStreng.toLowerCase();

  let elementer = [];

  if (aktivType === 'fiat') {
    const prioriterte = ['USD','EUR','GBP','SEK','DKK','CHF','JPY','CAD','AUD','INR',
      'CNY','BRL','MXN','KRW','SGD','HKD','NZD','ZAR','TRY','PLN'];
    const alle = Object.keys(fiatKurser).sort();
    const sortert = [...prioriterte.filter(k => fiatKurser[k]), ...alle.filter(k => !prioriterte.includes(k) && k !== 'NOK')];

    elementer = sortert
      .filter(kode => {
        if (!søk) return true;
        return kode.toLowerCase().includes(søk) || (VALUTA_NAVN[kode] || '').toLowerCase().includes(søk);
      })
      .map(kode => ({
        kode,
        navn: VALUTA_NAVN[kode] || kode,
        kurs: fiatKurser[kode],
        erKrypto: false,
      }));

  } else {
    elementer = cryptoData
      .filter(c => {
        if (!søk) return true;
        return c.symbol.toLowerCase().includes(søk) || c.name.toLowerCase().includes(søk);
      })
      .map(c => ({
        kode: c.symbol.toUpperCase(),
        navn: c.name,
        kurs: c.current_price,
        erKrypto: true,
        endring: c.price_change_percentage_24h,
      }));
  }

  if (elementer.length === 0) {
    grid.innerHTML = `<div class="ingen-treff">Ingen valutaer matcher søket.</div>`;
    return;
  }

  grid.innerHTML = '';
  elementer.forEach(({ kode, navn, kurs, erKrypto, endring }) => {
    const div = document.createElement('div');
    div.className = 'valuta-rad';
    div.setAttribute('role', 'listitem');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `${navn}: ${formaterTall(kurs)} NOK`);

    const endringHTML = endring !== undefined
      ? `<span style="color:${endring >= 0 ? 'var(--gronn)' : 'var(--burgunder)'}">
           ${endring >= 0 ? '▲' : '▼'} ${Math.abs(endring).toFixed(2)}%
         </span>`
      : '';

    div.innerHTML = `
      <span class="valuta-kode">${kode}</span>
      <span class="valuta-navn">${navn}</span>
      ${erKrypto ? '<span class="crypto-badge">Krypto</span>' : ''}
      <span class="valuta-kurs">${formaterTall(kurs)} ${endringHTML}</span>
    `;

    // Klikk → sett som "Fra"-valuta
    div.addEventListener('click', () => {
      document.getElementById('fra-valuta').value = kode;
      konverter();
    });

    div.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.getElementById('fra-valuta').value = kode;
        konverter();
      }
    });

    grid.appendChild(div);
  });
}

/* =====================
   Sett status
   ===================== */
function settStatus(tilstand, tekst) {
  const dot = document.getElementById('status-dot');
  const el  = document.getElementById('status-tekst');
  dot.className = `status-dot ${tilstand}`;
  el.textContent = tekst;
}

/* =====================
   Oppdater liste-tittel
   ===================== */
function oppdaterTittel() {
  const el = document.getElementById('liste-tittel');
  el.textContent = aktivType === 'fiat' ? 'Alle kurser mot NOK' : 'Topp 20 kryptovalutaer (NOK)';
}

/* =====================
   Init
   ===================== */
async function init() {
  settStatus('laster', 'Henter kurser…');

  try {
    if (aktivType === 'fiat') {
      await hentFiat();
    } else {
      await hentCrypto();
    }

    fyllSelecter();
    renderGrid();
    oppdaterTittel();
    konverter();

    const nå = new Date().toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
    settStatus('ok', `Kurser oppdatert ${nå}`);
    document.getElementById('kilde-info').textContent =
      aktivType === 'fiat' ? 'Kilde: Exchange API' : 'Kilde: CoinGecko';

  } catch (feil) {
    console.error(feil);
    settStatus('feil', 'Kunne ikke hente kurser – prøv igjen');
    document.getElementById('valuta-grid').innerHTML =
      `<div class="ingen-treff">Kunne ikke hente data. Sjekk internettforbindelsen.</div>`;
  }
}

/* =====================
   Event-lyttere
   ===================== */
document.getElementById('belop-input').addEventListener('input', konverter);
document.getElementById('fra-valuta').addEventListener('change', konverter);
document.getElementById('til-valuta').addEventListener('change', konverter);

document.getElementById('bytt-knapp').addEventListener('click', () => {
  const fra = document.getElementById('fra-valuta');
  const til = document.getElementById('til-valuta');
  const temp = fra.value;
  fra.value = til.value;
  til.value = temp;
  konverter();
});

document.getElementById('sok-input').addEventListener('input', e => {
  søkStreng = e.target.value;
  renderGrid();
});

document.querySelectorAll('.type-knapp').forEach(knapp => {
  knapp.addEventListener('click', async () => {
    document.querySelectorAll('.type-knapp').forEach(k => {
      k.classList.remove('aktiv');
      k.setAttribute('aria-pressed', 'false');
    });
    knapp.classList.add('aktiv');
    knapp.setAttribute('aria-pressed', 'true');
    aktivType = knapp.dataset.type;
    søkStreng = '';
    document.getElementById('sok-input').value = '';
    await init();
  });
});

/* =====================
   Start
   ===================== */
init();
