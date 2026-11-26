[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Kopler12/nusastats/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Kopler12/nusastats/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

# NusaStats — Indonesia in Numbers

An original national statistics site for Indonesia, built for the
[make.fun "best national statistics site" competition](https://make.fun/c/best-national-statistics-site-20261126-0539).

NusaStats puts the country's people, economy and wellbeing in one place:
population and provinces, GDP growth and prices, trade, health and education —
every figure shown with its source and year (BPS, World Bank, APJII).

## Pages

- **Overview** — hero, six key indicators, population and GDP-growth charts,
  the five largest provinces, and the latest releases.
- **Population** — a year selector (2019–2024) that updates the headline figure
  and chart, a sortable and searchable table of provinces, and urban/rural and
  median-age cards.
- **Economy** — tabs for Growth, Prices and Trade: GDP growth bars, an inflation
  line chart, a GDP-by-sector donut, and 2024 exports and imports.
- **People** — Human Development Index chart plus life expectancy, literacy and
  years-of-schooling cards, unemployment and poverty.
- **Regions** — pick a province from a dropdown to see its population, its share
  of the country, and its rank.
- **About** — a sources & methods table listing every figure's source and year.

## How it is built

Static files under `app/`, no build step, no network requests: serve the folder
with any static HTTP server and open `index.html`. All data is hardcoded in
`app/data.js`; charts are drawn with the site's own canvas code in
`app/charts.js`; pages are rendered by `app/views.js` and routed by
`app/main.js` (hash routes). No libraries, no web fonts — system type only.

```sh
cd app && python3 -m http.server 8123
# open http://127.0.0.1:8123/
```

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
into the output directory and writes `dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
