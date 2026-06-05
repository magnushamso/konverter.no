# konverter.no

Norsk konverteringsverktøy for valuta og enheter.

## Innhold

- **Valuta** – konverter mellom 170+ fiat-valutaer og topp 20 kryptovalutaer
- **Enheter** – kommer

## Teknologi

- Ren HTML/CSS/JS – ingen rammeverk
- Zeppelin 32 (Storm Type Foundry) – Movon merkevare
- Hostet på [Vercel](https://vercel.com)

## API-er

| Kilde | Bruk | Nøkkel |
|---|---|---|
| [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) | Fiat-kurser (200+ valutaer) | Nei |
| [CoinGecko](https://www.coingecko.com/en/api) | Kryptokurser (topp 20) | Nei |

Kurser caches i sessionStorage i 1 time for å minimere API-kall.

## Utvikling

Ingen byggsteg nødvendig. Åpne `valuta.html` direkte i nettleseren, eller bruk en lokal server:

```bash
npx serve .
```

## Tilgjengelighet

Bygget etter WCAG 2.1 AA-standard.
