/* NusaStats views — one render function per page. Each function writes its */
/* page's HTML into the #view container, draws its charts, and wires up its */
/* own controls (selects, search, sorting, tabs, dropdowns). */

import {
  YEARS, POPULATION, PROVINCES, DEMOGRAPHICS, GDP, INFLATION,
  UNEMPLOYMENT, POVERTY, HDI, PEOPLE, TRADE, RELEASES, SOURCES,
} from './data.js';
import { drawLineChart, drawBarChart, drawDonutChart } from './charts.js';

const $ = (sel, root = document) => root.querySelector(sel);
const fmtMillions = (v) => v.toFixed(1) + 'm';
const fmtPct = (v) => v.toFixed(2) + '%';
const src = (source, year) => `<p class="src">Source: ${source} · ${year}</p>`;

function kpiCard(label, value, unit, source, year, extra = '') {
  return `<article class="kpi">
    <p class="kpi-label">${label}</p>
    <p class="kpi-value">${value}<span class="kpi-unit"> ${unit}</span></p>
    ${extra}
    <p class="src">Source: ${source} · ${year}</p>
  </article>`;
}

function chartCard(title, canvasId, source, year, note = '') {
  return `<section class="card chart-card">
    <h3>${title}</h3>
    <canvas id="${canvasId}" role="img" aria-label="${title}"></canvas>
    ${note ? `<p class="note">${note}</p>` : ''}
    ${src(source, year)}
  </section>`;
}

function provinceRows(list) {
  return list.map((p, i) => {
    const share = ((p.pop / POPULATION.values[2024]) * 100).toFixed(1);
    return `<tr><td>${i + 1}</td><td>${p.name}</td><td class="num">${p.pop.toFixed(1)}</td><td class="num">${share}%</td></tr>`;
  }).join('');
}

/* ---------- Overview ---------- */

export function renderOverview(root) {
  const top5 = [...PROVINCES].slice(0, 5);
  root.innerHTML = `
  <section class="hero">
    <p class="eyebrow">National statistics · Indonesia</p>
    <h1>Indonesia in numbers</h1>
    <p class="lede">The country's people, economy and wellbeing — the latest published
    figures, each with its source and year, in one place.</p>
    <p class="hero-facts"><strong>283.5 million</strong> people · <strong>38</strong> provinces ·
    <strong>17,508</strong> islands · <strong>Rp22,139 trillion</strong> economy</p>
    ${src('BPS', '2024')}
  </section>

  <section class="kpi-grid" aria-label="Key indicators">
    ${kpiCard('Population', '283.5', 'million', 'BPS', '2024')}
    ${kpiCard('GDP', 'Rp22,139', 'trillion', 'BPS', '2024', '<p class="kpi-sub">≈ US$1,396 billion</p>')}
    ${kpiCard('GDP per capita', 'Rp78.6', 'million', 'BPS', '2024', '<p class="kpi-sub">≈ US$4,919</p>')}
    ${kpiCard('Life expectancy', '74.0', 'years', 'BPS', '2024')}
    ${kpiCard('Unemployment', '4.91', '%', 'BPS', '2024', '<p class="kpi-sub">4.76% in Feb 2025</p>')}
    ${kpiCard('Poverty rate', '9.03', '%', 'BPS', 'Mar 2024', '<p class="kpi-sub">8.47% in Mar 2025</p>')}
  </section>

  <div class="chart-grid">
    ${chartCard('Population, 2019–2024', 'ov-pop', 'BPS', '2019–2024', '2020 is the census count.')}
    ${chartCard('Real GDP growth, 2019–2024', 'ov-gdp', 'BPS', '2019–2024', '2020 contracted during the pandemic.')}
  </div>

  <div class="split">
    <section class="card">
      <h3>Largest provinces</h3>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>#</th><th>Province</th><th class="num">Population (m)</th><th class="num">Share</th></tr></thead>
        <tbody>${provinceRows(top5)}</tbody>
      </table></div>
      ${src('BPS', '2024')}
      <p><a class="text-link" href="#/population">See all provinces →</a></p>
    </section>
    <section class="card">
      <h3>Latest releases</h3>
      <ul class="releases">
        ${RELEASES.map((r) => `<li><strong>${r.title}</strong><span>${r.figure} · ${r.source}, ${r.year}</span></li>`).join('')}
      </ul>
    </section>
  </div>`;

  drawLineChart($('#ov-pop', root), YEARS.map(String), YEARS.map((y) => POPULATION.values[y]), {
    format: fmtMillions, highlight: 5,
  });
  drawBarChart($('#ov-gdp', root), YEARS.map(String), YEARS.map((y) => GDP.growth.values[y]), {
    format: fmtPct, highlight: 5,
  });
}

/* ---------- Population ---------- */

export function renderPopulation(root) {
  root.innerHTML = `
  <header class="page-head">
    <h2>Population</h2>
    <p class="lede">How many Indonesians there are, where they live, and how the
    population is changing.</p>
  </header>

  <section class="card controls-card">
    <label class="control-label" for="pop-year">Year</label>
    <select id="pop-year" class="control">
      ${YEARS.map((y) => `<option value="${y}"${y === 2024 ? ' selected' : ''}>${y}</option>`).join('')}
    </select>
    <p class="control-note" id="pop-year-note"></p>
  </section>

  <section class="kpi-grid" aria-label="Population indicators">
    <article class="kpi"><p class="kpi-label">Population in <span id="pop-year-label">2024</span></p>
      <p class="kpi-value"><span id="pop-value">283.5</span><span class="kpi-unit"> million</span></p>
      ${src('BPS', '2019–2024')}</article>
    ${kpiCard('Median age', '30.7', 'years', 'BPS', '2024')}
    ${kpiCard('Urban population', '58.6', '%', 'World Bank', '2024')}
    ${kpiCard('Rural population', '41.4', '%', 'World Bank', '2024')}
  </section>

  ${chartCard('Population, 2019–2024', 'pop-chart', 'BPS', '2019–2024', '2020 is the census count.')}

  <section class="card">
    <h3>Provinces by population, 2024</h3>
    <div class="table-tools">
      <label class="control-label" for="prov-search">Search provinces</label>
      <input id="prov-search" class="control" type="search" placeholder="Type a province name…" autocomplete="off">
      <p class="table-hint">Click a column header to sort.</p>
    </div>
    <div class="table-wrap"><table class="data-table" id="prov-table">
      <thead><tr>
        <th data-key="rank">#</th>
        <th data-key="name">Province ⇅</th>
        <th data-key="pop" class="num">Population (m) ⇅</th>
        <th data-key="share" class="num">Share ⇅</th>
      </tr></thead>
      <tbody id="prov-body"></tbody>
    </table></div>
    <p class="note" id="prov-count"></p>
    ${src('BPS', '2024')}
  </section>`;

  const yearSelect = $('#pop-year', root);
  const popChart = $('#pop-chart', root);
  const drawPopChart = (year) => drawLineChart(popChart, YEARS.map(String),
    YEARS.map((y) => POPULATION.values[y]), { format: fmtMillions, highlight: YEARS.indexOf(year) });
  const applyYear = () => {
    const year = Number(yearSelect.value);
    $('#pop-year-label', root).textContent = year;
    $('#pop-value', root).textContent = POPULATION.values[year].toFixed(1);
    $('#pop-year-note', root).textContent = year === 2020 ? POPULATION.note2020 : '';
    drawPopChart(year);
  };
  yearSelect.addEventListener('change', applyYear);
  applyYear();

  /* Sortable + searchable province table. */
  let sortKey = 'rank';
  let sortDir = 1;
  let query = '';
  const body = $('#prov-body', root);
  const countNote = $('#prov-count', root);
  const ranked = PROVINCES.map((p, i) => ({
    ...p, rank: i + 1, share: (p.pop / POPULATION.values[2024]) * 100,
  }));
  const paint = () => {
    let rows = ranked.filter((p) => p.name.toLowerCase().includes(query));
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return (typeof av === 'string' ? av.localeCompare(bv) : av - bv) * sortDir;
    });
    body.innerHTML = rows.map((p) => `<tr><td>${p.rank}</td><td>${p.name}</td>
      <td class="num">${p.pop.toFixed(1)}</td><td class="num">${p.share.toFixed(1)}%</td></tr>`).join('')
      || '<tr><td colspan="4">No province matches that search.</td></tr>';
    countNote.textContent = `Showing ${rows.length} of ${ranked.length} provinces.`;
  };
  $('#prov-search', root).addEventListener('input', (e) => {
    query = e.target.value.trim().toLowerCase();
    paint();
  });
  root.querySelectorAll('#prov-table th[data-key]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (sortKey === key) sortDir *= -1;
      else { sortKey = key; sortDir = key === 'name' ? 1 : -1; }
      paint();
    });
  });
  paint();
}

/* ---------- Economy ---------- */

export function renderEconomy(root) {
  root.innerHTML = `
  <header class="page-head">
    <h2>Economy</h2>
    <p class="lede">Growth, prices and trade — the size of the economy and where it is heading.</p>
  </header>

  <section class="kpi-grid" aria-label="Economic indicators">
    ${kpiCard('GDP', 'Rp22,139', 'trillion', 'BPS', '2024', '<p class="kpi-sub">≈ US$1,396 billion</p>')}
    ${kpiCard('GDP per capita', 'Rp78.6', 'million', 'BPS', '2024', '<p class="kpi-sub">≈ US$4,919</p>')}
    ${kpiCard('GDP growth', '5.03', '% in 2024', 'BPS', '2024')}
    ${kpiCard('Inflation', '1.57', '% in 2024', 'BPS', '2024')}
    ${kpiCard('Exports', 'US$264.7', 'billion', 'BPS', '2024')}
    ${kpiCard('Imports', 'US$233.7', 'billion', 'BPS', '2024')}
  </section>

  <div class="tabs" role="tablist" aria-label="Economy sections">
    <button class="tab active" role="tab" aria-selected="true" data-panel="growth">Growth</button>
    <button class="tab" role="tab" aria-selected="false" data-panel="prices">Prices</button>
    <button class="tab" role="tab" aria-selected="false" data-panel="trade">Trade</button>
  </div>

  <section class="tab-panel active" id="panel-growth">
    ${chartCard('Real GDP growth, 2019–2024', 'eco-growth', 'BPS', '2019–2024', '2020 contracted during the pandemic.')}
    <section class="card">
      <h3>What makes up GDP, 2024</h3>
      <div class="donut-wrap">
        <canvas id="eco-sectors" role="img" aria-label="GDP by sector donut chart"></canvas>
        <ul class="legend">
          ${GDP.sectors2024.map((s, i) => `<li><span class="swatch sw${i}"></span>${s.label} — <strong>${s.share.toFixed(1)}%</strong></li>`).join('')}
        </ul>
      </div>
      ${src('BPS', '2024')}
    </section>
  </section>

  <section class="tab-panel" id="panel-prices">
    ${chartCard('Inflation (CPI), 2019–2024', 'eco-inflation', 'BPS', '2019–2024', '2022 peaked at 5.51% as global prices surged.')}
    <section class="card">
      <h3>Reading the price picture</h3>
      <p>Inflation ran at 5.51% in 2022 — the highest in this six-year window — then
      eased to 2.61% in 2023 and 1.57% in 2024, the lowest of the period.</p>
      ${src('BPS', '2019–2024')}
    </section>
  </section>

  <section class="tab-panel" id="panel-trade">
    <section class="card">
      <h3>Trade in 2024</h3>
      <dl class="stat-list">
        <div><dt>Exports</dt><dd>US$264.7 billion</dd></div>
        <div><dt>Imports</dt><dd>US$233.7 billion</dd></div>
        <div><dt>Trade surplus</dt><dd>US$31.0 billion</dd></div>
        <div><dt>Gini ratio</dt><dd>0.379 (March 2024)</dd></div>
      </dl>
      ${src('BPS', '2024')}
      <p>Exports exceeded imports by US$31.0 billion in 2024. The Gini ratio of 0.379
      (March 2024) measures income inequality on a 0–1 scale.</p>
    </section>
  </section>`;

  const drawGrowth = () => {
    drawBarChart($('#eco-growth', root), YEARS.map(String), YEARS.map((y) => GDP.growth.values[y]), {
      format: fmtPct, highlight: 5,
    });
    drawDonutChart($('#eco-sectors', root), GDP.sectors2024, {
      centreTop: '100%', centreBottom: 'of GDP, 2024',
    });
  };
  const drawPrices = () => drawLineChart($('#eco-inflation', root), YEARS.map(String),
    YEARS.map((y) => INFLATION.values[y]), { format: fmtPct, highlight: 5 });
  drawGrowth();

  root.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      root.querySelectorAll('.tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      root.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      const panel = $('#panel-' + tab.dataset.panel, root);
      panel.classList.add('active');
      /* A canvas hidden while its tab was closed has no width; draw on reveal. */
      if (tab.dataset.panel === 'prices') drawPrices();
      if (tab.dataset.panel === 'growth') drawGrowth();
    });
  });
}

/* ---------- People ---------- */

export function renderPeople(root) {
  root.innerHTML = `
  <header class="page-head">
    <h2>People</h2>
    <p class="lede">Health and education — how long Indonesians live, how much they
    learn, and how developed the country is by the Human Development Index.</p>
  </header>

  <section class="kpi-grid" aria-label="People indicators">
    ${kpiCard('Life expectancy', '74.0', 'years', 'BPS', '2024', '<p class="kpi-sub">73.98 years at birth</p>')}
    ${kpiCard('Literacy (age 15+)', '96.1', '%', 'BPS', '2024')}
    ${kpiCard('Mean years of schooling', '9.0', 'years', 'BPS', '2024')}
    ${kpiCard('Expected years of schooling', '13.2', 'years', 'BPS', '2024')}
    ${kpiCard('Human Development Index', '75.02', '', 'BPS', '2024', '<p class="kpi-sub">Up from 71.92 in 2019</p>')}
    ${kpiCard('Internet users', '79.5', '%', 'APJII', '2024')}
  </section>

  ${chartCard('Human Development Index, 2019–2024', 'ppl-hdi', 'BPS', '2019–2024', 'The index rose every year in this window.')}

  <div class="split">
    <section class="card">
      <h3>Unemployment</h3>
      <p class="big-stat">4.91% <span>2024</span></p>
      <p>Open unemployment fell from a pandemic peak of 7.07% in 2020 to 4.91% in
      2024, and to 4.76% in February 2025.</p>
      ${src('BPS', '2019–2025')}
    </section>
    <section class="card">
      <h3>Poverty</h3>
      <p class="big-stat">8.47% <span>March 2025</span></p>
      <p>The poverty rate was 9.41% in March 2019, peaked at 10.14% in March 2021,
      and has fallen every round since — 9.03% in March 2024, 8.57% in September
      2024, and 8.47% in March 2025.</p>
      ${src('BPS', '2019–2025')}
    </section>
  </div>`;

  drawLineChart($('#ppl-hdi', root), YEARS.map(String), YEARS.map((y) => HDI.values[y]), {
    format: (v) => v.toFixed(2), highlight: 5,
  });
}

/* ---------- Regions ---------- */

export function renderRegions(root) {
  root.innerHTML = `
  <header class="page-head">
    <h2>Regions</h2>
    <p class="lede">Pick a province to see its population, its share of the whole
    country, and its rank among the ten largest.</p>
  </header>

  <section class="card controls-card">
    <label class="control-label" for="region-select">Province</label>
    <select id="region-select" class="control">
      ${PROVINCES.map((p, i) => `<option value="${i}">${p.name}</option>`).join('')}
    </select>
  </section>

  <section class="card" id="region-detail" aria-live="polite"></section>

  <section class="card">
    <h3>The country at a glance</h3>
    <dl class="stat-list">
      <div><dt>Land area</dt><dd>1,916,907 km²</dd></div>
      <div><dt>Provinces</dt><dd>38</dd></div>
      <div><dt>Districts / cities</dt><dd>514</dd></div>
      <div><dt>Islands</dt><dd>17,508</dd></div>
    </dl>
    ${src('BPS', '2024')}
  </section>`;

  const detail = $('#region-detail', root);
  const show = () => {
    const i = Number($('#region-select', root).value);
    const p = PROVINCES[i];
    const share = ((p.pop / POPULATION.values[2024]) * 100).toFixed(1);
    detail.innerHTML = `
      <h3>${p.name}</h3>
      <p class="big-stat">${p.pop.toFixed(1)}m <span>people, 2024</span></p>
      <dl class="stat-list">
        <div><dt>Share of Indonesia</dt><dd>${share}%</dd></div>
        <div><dt>Rank by population</dt><dd>#${i + 1} of the ten largest</dd></div>
        <div><dt>National population</dt><dd>283.5 million</dd></div>
      </dl>
      ${src('BPS', '2024')}`;
  };
  $('#region-select', root).addEventListener('change', show);
  show();
}

/* ---------- About ---------- */

export function renderAbout(root) {
  root.innerHTML = `
  <header class="page-head">
    <h2>About NusaStats</h2>
    <p class="lede">NusaStats is an independent, original statistics site for Indonesia.
    It is not affiliated with BPS, the World Bank or APJII; it republishes their
    published figures with the source and year shown next to every number.</p>
  </header>

  <section class="card">
    <h3>Sources &amp; methods</h3>
    <p>Figures come from the publications of the organisations below. Population
    figures are annual projections, except 2020, which is the census count.
    GDP is at current prices. The poverty and unemployment series use the
    March survey rounds unless a month is stated.</p>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Figure</th><th>Source</th><th>Year</th><th>Note</th></tr></thead>
      <tbody>
        ${SOURCES.map((s) => `<tr><td>${s.figure}</td><td>${s.source}</td><td>${s.year}</td><td>${s.note}</td></tr>`).join('')}
      </tbody>
    </table></div>
  </section>

  <section class="card">
    <h3>About the site</h3>
    <p>NusaStats is a static site: no accounts, no tracking, no network requests.
    All figures are stored in the site's own files and every chart is drawn in
    your browser. Figures are rounded for display; see the source publications
    for full precision.</p>
  </section>`;
}
