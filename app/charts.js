/* NusaStats charts — small canvas chart helpers written for this site only. */
/* No chart library is used: each function draws axes, gridlines, labels and */
/* the data itself on a <canvas> element sized to its container. */

const TEAL = '#0f5f5c';
const TEAL_LIGHT = '#2a8a84';
const AMBER = '#e8a317';
const AMBER_DARK = '#c07f04';
const INK = '#1d2b2a';
const MUTED = '#5c6f6d';
const GRID = '#dfe7e5';
const NEGATIVE = '#b4452f';

/* Size a canvas to its displayed width at the device pixel ratio so lines */
/* stay crisp on phones and retina screens. Returns the 2d context. */
function prepareCanvas(canvas, height) {
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const size = nice * mag;
  const start = Math.floor(min / size) * size;
  const ticks = [];
  for (let v = start; v <= max + size * 0.001; v += size) ticks.push(v);
  return ticks;
}

function formatTick(v) {
  const r = Math.round(v * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/0$/, '');
}

/* Line chart with dots, value labels and an optional highlighted index. */
export function drawLineChart(canvas, labels, values, options = {}) {
  const height = options.height || 260;
  const { ctx, width } = prepareCanvas(canvas, height);
  const pad = { left: 48, right: 16, top: 18, bottom: 30 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = options.floorZero ? Math.min(0, min) : min - (max - min) * 0.12;
  const hi = max + (max - min) * 0.18;
  const x = (i) => pad.left + (i / Math.max(1, values.length - 1)) * plotW;
  const y = (v) => pad.top + (1 - (v - lo) / (hi - lo)) * plotH;

  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const t of niceTicks(lo, hi, 4)) {
    const ty = y(t);
    ctx.strokeStyle = GRID;
    ctx.beginPath(); ctx.moveTo(pad.left, ty); ctx.lineTo(width - pad.right, ty); ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(formatTick(t), pad.left - 8, ty);
  }

  /* Area fill under the line. */
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
  grad.addColorStop(0, 'rgba(15, 95, 92, 0.22)');
  grad.addColorStop(1, 'rgba(15, 95, 92, 0.02)');
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.lineTo(x(values.length - 1), pad.top + plotH);
  ctx.lineTo(x(0), pad.top + plotH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  values.forEach((v, i) => {
    const isHi = i === options.highlight;
    ctx.beginPath();
    ctx.arc(x(i), y(v), isHi ? 6 : 4, 0, Math.PI * 2);
    ctx.fillStyle = isHi ? AMBER : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = isHi ? AMBER_DARK : TEAL;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.font = (isHi ? 'bold 12px' : '11px') + ' system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(options.format ? options.format(v) : String(v), x(i), y(v) - 9);
  });

  ctx.textBaseline = 'top';
  ctx.fillStyle = MUTED;
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  labels.forEach((label, i) => ctx.fillText(label, x(i), height - pad.bottom + 8));
}

/* Vertical bar chart, with a distinct colour for negative bars. */
export function drawBarChart(canvas, labels, values, options = {}) {
  const height = options.height || 260;
  const { ctx, width } = prepareCanvas(canvas, height);
  const pad = { left: 48, right: 16, top: 24, bottom: 30 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const lo = min - (max - min) * 0.08;
  const hi = max + (max - min) * 0.18;
  const y = (v) => pad.top + (1 - (v - lo) / (hi - lo)) * plotH;
  const slot = plotW / values.length;
  const barW = Math.min(52, slot * 0.62);

  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const t of niceTicks(lo, hi, 4)) {
    const ty = y(t);
    ctx.strokeStyle = GRID;
    ctx.beginPath(); ctx.moveTo(pad.left, ty); ctx.lineTo(width - pad.right, ty); ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(formatTick(t), pad.left - 8, ty);
  }
  /* Zero line, slightly stronger. */
  ctx.strokeStyle = '#9fb3b0';
  ctx.beginPath(); ctx.moveTo(pad.left, y(0)); ctx.lineTo(width - pad.right, y(0)); ctx.stroke();

  values.forEach((v, i) => {
    const cx = pad.left + slot * i + slot / 2;
    const top = y(Math.max(0, v));
    const bottom = y(Math.min(0, v));
    const isHi = i === options.highlight;
    ctx.fillStyle = v < 0 ? NEGATIVE : isHi ? AMBER : TEAL;
    const r = 4;
    const bw = barW;
    const bh = Math.max(2, bottom - top);
    ctx.beginPath();
    ctx.moveTo(cx - bw / 2, top + r);
    ctx.arcTo(cx - bw / 2, top, cx - bw / 2 + r, top, r);
    ctx.arcTo(cx + bw / 2, top, cx + bw / 2, top + r, r);
    ctx.lineTo(cx + bw / 2, bottom);
    ctx.lineTo(cx - bw / 2, bottom);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.font = 'bold 12px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = v < 0 ? 'top' : 'bottom';
    ctx.fillText(options.format ? options.format(v) : String(v), cx, v < 0 ? bottom + 5 : top - 5);
  });

  ctx.textBaseline = 'top';
  ctx.fillStyle = MUTED;
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  labels.forEach((label, i) => {
    ctx.fillText(label, pad.left + slot * i + slot / 2, height - pad.bottom + 8);
  });
}

/* Donut chart with a colour key listed beside it in the DOM (see views.js). */
export function drawDonutChart(canvas, segments, options = {}) {
  const height = options.height || 240;
  const { ctx, width } = prepareCanvas(canvas, height);
  const cx = width / 2;
  const cy = height / 2;
  const outer = Math.min(width, height) / 2 - 14;
  const inner = outer * 0.58;
  const palette = [TEAL, TEAL_LIGHT, AMBER, '#7fb5ae', '#d98e32', '#b7cdc9'];
  const total = segments.reduce((s, seg) => s + seg.share, 0);
  let angle = -Math.PI / 2;
  segments.forEach((seg, i) => {
    const sweep = (seg.share / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.arc(cx, cy, inner, angle + sweep, angle, true);
    ctx.closePath();
    ctx.fillStyle = palette[i % palette.length];
    ctx.fill();
    angle += sweep;
  });
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 15px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(options.centreTop || '', cx, cy - 10);
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText(options.centreBottom || '', cx, cy + 10);
}
