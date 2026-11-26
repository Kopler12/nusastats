/* NusaStats data — every figure below is a published national statistic for */
/* Indonesia. Each record carries its source and reference year so the site */
/* can show the provenance next to the number it displays. */

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

/* Population, millions of people (BPS, annual projection; 2020 is the census). */
export const POPULATION = {
  source: 'BPS',
  unit: 'million people',
  values: { 2019: 268.1, 2020: 270.2, 2021: 272.5, 2022: 275.8, 2023: 278.7, 2024: 283.5 },
  note2020: '2020 figure is the Population Census count.',
};

/* Population of the ten largest provinces, 2024 projection, millions (BPS). */
export const PROVINCES = [
  { name: 'Jawa Barat', pop: 49.9 },
  { name: 'Jawa Timur', pop: 41.8 },
  { name: 'Jawa Tengah', pop: 37.9 },
  { name: 'Sumatera Utara', pop: 15.6 },
  { name: 'Banten', pop: 12.4 },
  { name: 'DKI Jakarta', pop: 10.6 },
  { name: 'Sulawesi Selatan', pop: 9.4 },
  { name: 'Lampung', pop: 9.3 },
  { name: 'Sumatera Selatan', pop: 9.0 },
  { name: 'Riau', pop: 6.9 },
];

export const DEMOGRAPHICS = {
  medianAge2024: { value: 30.7, unit: 'years', source: 'BPS', year: 2024 },
  urbanShare2024: { value: 58.6, unit: '% of population', source: 'World Bank', year: 2024 },
  ruralShare2024: { value: 41.4, unit: '% of population', source: 'World Bank', year: 2024 },
  areaKm2: { value: 1916907, unit: 'km²', source: 'BPS', year: 2024 },
  provinceCount: { value: 38, unit: 'provinces', source: 'BPS', year: 2024 },
  districtCount: { value: 514, unit: 'districts / cities', source: 'BPS', year: 2024 },
  islandCount: { value: 17508, unit: 'islands', source: 'BPS', year: 2024 },
  internetUsers2024: { value: 79.5, unit: '% of population', source: 'APJII', year: 2024 },
};

/* Gross domestic product (BPS). */
export const GDP = {
  total2024: { value: 22139, unit: 'Rp trillion', usd: '≈ US$1,396 billion', source: 'BPS', year: 2024 },
  perCapita2024: { value: 78.6, unit: 'Rp million', usd: '≈ US$4,919', source: 'BPS', year: 2024 },
  /* Real GDP growth, percent year on year (BPS). */
  growth: {
    source: 'BPS',
    unit: '% yoy',
    values: { 2019: 5.02, 2020: -2.07, 2021: 3.70, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
  },
  /* Share of GDP by sector, 2024, percent (BPS). "Other services" is the */
  /* residual so the six shares add to 100. */
  sectors2024: [
    { label: 'Manufacturing', share: 18.7 },
    { label: 'Trade', share: 12.8 },
    { label: 'Agriculture', share: 12.5 },
    { label: 'Construction', share: 9.9 },
    { label: 'Mining', share: 8.1 },
    { label: 'Other services', share: 37.9 },
  ],
};

/* Consumer-price inflation, percent year on year (BPS). */
export const INFLATION = {
  source: 'BPS',
  unit: '% yoy',
  values: { 2019: 2.72, 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
};

/* Open unemployment rate, percent (BPS). 2025 is the February round. */
export const UNEMPLOYMENT = {
  source: 'BPS',
  unit: '%',
  values: { 2019: 5.28, 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.91 },
  feb2025: 4.76,
};

/* Poverty rate, percent of population (BPS, March rounds unless noted). */
export const POVERTY = {
  source: 'BPS',
  unit: '%',
  values: {
    'Mar 2019': 9.41, 'Mar 2020': 9.78, 'Mar 2021': 10.14, 'Mar 2022': 9.54,
    'Mar 2023': 9.36, 'Mar 2024': 9.03, 'Sep 2024': 8.57, 'Mar 2025': 8.47,
  },
};

/* Human Development Index (BPS). */
export const HDI = {
  source: 'BPS',
  unit: 'index (0–100)',
  values: { 2019: 71.92, 2020: 71.94, 2021: 72.29, 2022: 73.37, 2023: 74.39, 2024: 75.02 },
};

export const PEOPLE = {
  lifeExpectancy2024: { value: 74.0, unit: 'years', detail: '73.98 years', source: 'BPS', year: 2024 },
  literacy2024: { value: 96.1, unit: '% of people aged 15+', source: 'BPS', year: 2024 },
  meanSchooling2024: { value: 9.0, unit: 'years', source: 'BPS', year: 2024 },
  expectedSchooling2024: { value: 13.2, unit: 'years', source: 'BPS', year: 2024 },
};

/* Trade and inequality (BPS). */
export const TRADE = {
  exports2024: { value: 264.7, unit: 'US$ billion', source: 'BPS', year: 2024 },
  imports2024: { value: 233.7, unit: 'US$ billion', source: 'BPS', year: 2024 },
  giniMar2024: { value: 0.379, unit: 'Gini ratio', source: 'BPS', year: 2024 },
};

/* Headline releases shown on the overview page, newest first. */
export const RELEASES = [
  { title: 'Poverty rate falls to 8.47%', figure: 'March 2025', source: 'BPS', year: 2025 },
  { title: 'Unemployment at 4.76%', figure: 'February 2025', source: 'BPS', year: 2025 },
  { title: 'Economy grows 5.03% in 2024', figure: 'GDP growth, full year', source: 'BPS', year: 2024 },
  { title: 'Human Development Index reaches 75.02', figure: '2024', source: 'BPS', year: 2024 },
  { title: 'Inflation eases to 1.57%', figure: '2024, year on year', source: 'BPS', year: 2024 },
  { title: '79.5% of Indonesians are online', figure: 'Internet users, 2024', source: 'APJII', year: 2024 },
];

/* The full provenance table for the About page: one row per figure. */
export const SOURCES = [
  { figure: 'Population 2019–2024', source: 'BPS', year: '2019–2024', note: 'Annual projection; 2020 is the census count.' },
  { figure: 'Province populations', source: 'BPS', year: '2024', note: 'Projection for the ten largest provinces.' },
  { figure: 'Median age', source: 'BPS', year: '2024', note: 'Median age of the population.' },
  { figure: 'Urban / rural share', source: 'World Bank', year: '2024', note: 'Share of population living in urban / rural areas.' },
  { figure: 'Area, provinces, districts, islands', source: 'BPS', year: '2024', note: 'National geography counts.' },
  { figure: 'GDP and GDP per capita', source: 'BPS', year: '2024', note: 'Current prices; US$ at the year-average rate.' },
  { figure: 'GDP growth', source: 'BPS', year: '2019–2024', note: 'Real growth, percent year on year.' },
  { figure: 'GDP by sector', source: 'BPS', year: '2024', note: 'Share of GDP at current prices.' },
  { figure: 'Inflation (CPI)', source: 'BPS', year: '2019–2024', note: 'Consumer price index, percent year on year.' },
  { figure: 'Unemployment rate', source: 'BPS', year: '2019–2025', note: 'Open unemployment; 2025 is the February round.' },
  { figure: 'Poverty rate', source: 'BPS', year: '2019–2025', note: 'March rounds; September 2024 included.' },
  { figure: 'Human Development Index', source: 'BPS', year: '2019–2024', note: 'Composite index, 0–100.' },
  { figure: 'Life expectancy', source: 'BPS', year: '2024', note: '73.98 years at birth.' },
  { figure: 'Literacy (age 15+)', source: 'BPS', year: '2024', note: 'Share able to read and write.' },
  { figure: 'Years of schooling', source: 'BPS', year: '2024', note: 'Mean 9.0 years; expected 13.2 years.' },
  { figure: 'Exports and imports', source: 'BPS', year: '2024', note: 'Merchandise trade, US$ billion.' },
  { figure: 'Gini ratio', source: 'BPS', year: '2024', note: 'March 2024 income inequality measure.' },
  { figure: 'Internet users', source: 'APJII', year: '2024', note: 'Share of population using the internet.' },
];
