/* NusaStats router — the entry point the browser loads. It maps each hash */
/* route to its page renderer, marks the active nav link, and re-renders on */
/* every hash change. */

import {
  renderOverview, renderPopulation, renderEconomy,
  renderPeople, renderRegions, renderAbout,
} from './views.js';

const ROUTES = {
  '': renderOverview,
  population: renderPopulation,
  economy: renderEconomy,
  people: renderPeople,
  regions: renderRegions,
  about: renderAbout,
};

const TITLES = {
  '': 'NusaStats — Indonesia in Numbers',
  population: 'Population — NusaStats',
  economy: 'Economy — NusaStats',
  people: 'People — NusaStats',
  regions: 'Regions — NusaStats',
  about: 'About — NusaStats',
};

const view = document.getElementById('view');

function route() {
  const name = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  const render = ROUTES[name] || ROUTES[''];
  const key = ROUTES[name] ? name : '';
  view.innerHTML = '';
  render(view);
  document.title = TITLES[key];
  document.querySelectorAll('.nav-link').forEach((link) => {
    const target = link.getAttribute('href').replace(/^#\/?/, '');
    const active = target === key;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
