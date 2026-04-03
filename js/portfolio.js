/* portfolio.js — shared rendering functions */

/* ── HELPERS ─────────────────────────────────────────────── */

/* Returns the merged defaults object (config defaults + built-in fallbacks). */
function getDefaults() {
  return Object.assign(
    { photoHeight: 780, photoWidth: 800, photoGap: 18, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 },
    PORTFOLIO_CONFIG.defaults || {}
  );
}

/* Applies layout + defaults settings to CSS variables on <html>. */
function applyLayoutSettings() {
  const l = PORTFOLIO_CONFIG.layout || {};
  const d = getDefaults();
  const r = document.documentElement.style;

  if (l.pageSidePadding  !== undefined) r.setProperty('--pad',               l.pageSidePadding  + 'px');
  if (l.textColumnWidth  !== undefined) r.setProperty('--text-col-w',        l.textColumnWidth  + 'px');
  if (l.textMarginRight  !== undefined) r.setProperty('--text-margin-right', l.textMarginRight  + 'px');
  if (l.textMarginBottom !== undefined) r.setProperty('--text-margin-bottom',l.textMarginBottom + 'px');

  r.setProperty('--photo-gap', d.photoGap + 'px');

  const fs = l.fontSize || {};
  if (fs.navLinks    !== undefined) r.setProperty('--fs-nav',        fs.navLinks    + 'px');
  if (fs.seriesTitle !== undefined) r.setProperty('--fs-title',      fs.seriesTitle + 'px');
  if (fs.bodyText    !== undefined) r.setProperty('--fs-body',       fs.bodyText    + 'px');
  if (fs.caption     !== undefined) r.setProperty('--fs-caption',    fs.caption     + 'px');
  if (fs.infoLinks   !== undefined) r.setProperty('--fs-info-links', fs.infoLinks   + 'px');
  if (fs.infoQuote   !== undefined) r.setProperty('--fs-info-quote', fs.infoQuote   + 'px');

  /* Compute --photo-h and --content-top-margin via JS so we use
     window.innerHeight — the only reliable measure of actual visible
     area on iOS Safari (100vh/100dvh both ignore the browser toolbar). */
  _applyViewportProps();
  window.addEventListener('resize', _applyViewportProps);
}

/* Updates --photo-h and --content-top-margin based on real viewport size.
   navigator.maxTouchPoints > 0 catches all iOS/iPadOS devices including
   those with Apple Pencil or Magic Keyboard (pointer: coarse misses those).
   window.innerHeight = actual visible area, always correct on Safari. */
function _applyViewportProps() {
  const d        = getDefaults();
  const l        = PORTFOLIO_CONFIG.layout || {};
  const r        = document.documentElement.style;
  const isTouch  = navigator.maxTouchPoints > 0;
  const isLandsc = window.innerWidth > window.innerHeight;
  const HEADER_H = 42;
  const MARGIN_TOUCH = 10;

  if (isTouch && isLandsc) {
    /* Touch landscape: constrain photo height to what actually fits on screen.
       Safety margin of 10px prevents sub-pixel rounding from causing overflow. */
    const avail = window.innerHeight - HEADER_H - MARGIN_TOUCH - 10;
    r.setProperty('--photo-h',            Math.min(d.photoHeight, Math.max(avail, 50)) + 'px');
    r.setProperty('--content-top-margin', MARGIN_TOUCH + 'px');
    /* Class used by CSS to also remove padding-bottom for fine-pointer touch devices
       (e.g. iPad with Apple Pencil) that don't match pointer:coarse. */
    document.documentElement.classList.add('touch-landscape');
    document.documentElement.classList.remove('touch-portrait');
  } else if (isTouch) {
    /* Touch portrait: photos stack (CSS handles it), restore desktop photo-h. */
    r.setProperty('--photo-h',            d.photoHeight + 'px');
    r.setProperty('--content-top-margin', MARGIN_TOUCH + 'px');
    document.documentElement.classList.add('touch-portrait');
    document.documentElement.classList.remove('touch-landscape');
  } else {
    /* Desktop/laptop: use configured values. */
    r.setProperty('--photo-h',            d.photoHeight + 'px');
    r.setProperty('--content-top-margin', (l.contentTopMargin ?? 150) + 'px');
    document.documentElement.classList.remove('touch-landscape', 'touch-portrait');
  }
}

/* ── HEADER ──────────────────────────────────────────────── */

function buildHeader(activePage) {
  const c  = PORTFOLIO_CONFIG;
  const el = document.querySelector('[data-header]');
  if (!el) return;

  /* Favicon — update from config if set */
  if (c.photographer.favicon) {
    let fav = document.getElementById('site-favicon');
    if (!fav) { fav = document.createElement('link'); fav.rel = 'icon'; fav.id = 'site-favicon'; document.head.appendChild(fav); }
    fav.href = c.photographer.favicon;
  }
  const navLinks = c.series.map((s, i) => {
    const href = i === 0 ? 'index.html' : s.id + '.html';
    const cls  = activePage === s.id ? ' class="active"' : '';
    return `<a href="${href}"${cls}>${s.title}</a>`;
  });
  navLinks.push(`<a href="about.html"${activePage === 'about' ? ' class="active"' : ''}>Info</a>`);
  el.innerHTML = `
    <div class="site-name"><a href="index.html">${c.photographer.name}</a></div>
    <nav>${navLinks.join('')}</nav>`;
}

/* ── SERIES DISPATCHER ───────────────────────────────────── */

function buildSerie(serie) {
  const paragraphs = serie.intro
    .split('\n').map(l => l.trim()).filter(Boolean)
    .map(l => `<p>${l}</p>`).join('');

  if (serie.layout === 'grid')     return buildGridSerie(serie, paragraphs);
  if (serie.layout === 'vertical') return buildVerticalSerie(serie, paragraphs);
  return buildHorizontalSerie(serie, paragraphs);
}

/* ── HORIZONTAL LAYOUT ───────────────────────────────────── */
/*
 * Desktop / laptop: text fixed left, photos scroll left → right.
 * Touch portrait (phone or tablet upright): collapses to vertical stack via CSS.
 * Touch landscape (phone or tablet sideways): photos fill the visible viewport
 *   height exactly (JS computes the height from window.innerHeight).
 * Per-photo overrides: h, marginTop, marginBottom, marginLeft, marginRight.
 */
function buildHorizontalSerie(serie, paragraphs) {
  const d = getDefaults();

  const photosHTML = serie.photos.map(p => {
    const ml = p.marginLeft   !== undefined ? p.marginLeft   : d.marginLeft;
    const mr = p.marginRight  !== undefined ? p.marginRight  : d.marginRight;
    const mt = p.marginTop    !== undefined ? p.marginTop    : d.marginTop;
    const mb = p.marginBottom !== undefined ? p.marginBottom : d.marginBottom;

    const style = [
      ml ? `margin-left:${ml}px`   : '',
      mr ? `margin-right:${mr}px`  : '',
      mt ? `margin-top:${mt}px`    : '',
      mb ? `margin-bottom:${mb}px` : '',
    ].filter(Boolean).join('; ');

    const imgStyle = p.h !== undefined ? `height:${p.h}px;` : '';

    return `
      <div class="photo-wrap"${style ? ` style="${style}"` : ''}>
        <img src="${p.src}" alt="${p.caption || ''}" loading="lazy"
             ${imgStyle ? `style="${imgStyle}"` : ''}
             onerror="this.style.background='#e0e0e0';this.removeAttribute('src')">
        ${p.caption ? `<div class="photo-caption">${p.caption}</div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="series-row">
      <div class="text-col">
        <h1>${serie.title}</h1>
        ${paragraphs}
      </div>
      <div class="photos-horizontal">${photosHTML}</div>
    </div>`;
}

/* ── VERTICAL LAYOUT ─────────────────────────────────────── */
/*
 * Desktop / laptop: text fixed left, photos stack top → bottom, page scrolls normally.
 * Touch portrait: text moves above photos, all photos fill full width.
 * Touch landscape: photos fill screen width (override inline w-fraction).
 *
 * Per-photo properties:
 *   w  — width as a fraction of the photos column (0 to 1). Default: 1 (full width).
 *   h  — height in px (crops the image). Omit for natural ratio.
 *   marginTop / marginBottom / marginLeft / marginRight — spacing overrides.
 */
function buildVerticalSerie(serie, paragraphs) {
  const d = getDefaults();

  const photosHTML = serie.photos.map(p => {
    const ml = p.marginLeft   !== undefined ? p.marginLeft   : d.marginLeft;
    const mr = p.marginRight  !== undefined ? p.marginRight  : d.marginRight;
    const mt = p.marginTop    !== undefined ? p.marginTop    : d.marginTop;
    const mb = p.marginBottom !== undefined ? p.marginBottom : d.marginBottom;

    const outerStyle = [
      ml ? `margin-left:${ml}px`   : '',
      mr ? `margin-right:${mr}px`  : '',
      mt ? `margin-top:${mt}px`    : '',
      mb ? `margin-bottom:${mb}px` : '',
    ].filter(Boolean).join('; ');

    const wStyle = p.w !== undefined
      ? `width:${(p.w * 100).toFixed(2)}%`
      : `width:${d.photoWidth}px; max-width:100%`;
    const hRule = p.h !== undefined ? `height:${p.h}px; object-fit:cover;` : 'height:auto;';
    const imgStyle = `${wStyle}; ${hRule} display:block; background:#e8e8e8;`;

    return `
      <div class="photo-wrap vertical-photo"${outerStyle ? ` style="${outerStyle}"` : ''}>
        <img src="${p.src}" alt="${p.caption || ''}" loading="lazy"
             style="${imgStyle}"
             onerror="this.style.background='#e0e0e0';this.removeAttribute('src')">
        ${p.caption ? `<div class="photo-caption">${p.caption}</div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="series-vertical-wrap">
      <div class="text-col">
        <h1>${serie.title}</h1>
        ${paragraphs}
      </div>
      <div class="photos-vertical">${photosHTML}</div>
    </div>`;
}

/* ── GRID LAYOUT ─────────────────────────────────────────── */
/*
 * Desktop / laptop: text fixed left, photos placed in explicit rows.
 * Touch landscape: text above, each row keeps photos side-by-side and fills screen width.
 * Touch portrait: text above, 2 photos per row.
 * Phone portrait (≤ 640px): 1 photo per row.
 *
 * Four photo modes (by h and w):
 *   h only   fixed height, width auto from ratio (no crop)
 *   w only   fills w fraction of row, height from ratio (no crop)
 *   h + w    fills w fraction, height CROPPED to h
 *   neither  equal share, height from ratio (no crop)
 */
function buildGridSerie(serie, paragraphs) {
  const rows     = serie.rows || [];
  const rowsHTML = rows.map(row => buildGridRow(row)).join('');

  return `
    <div class="series-grid-wrap">
      <div class="text-col-grid">
        <h1>${serie.title}</h1>
        ${paragraphs}
      </div>
      <div class="photos-grid">${rowsHTML}</div>
    </div>`;
}

function buildGridRow(row) {
  const d     = getDefaults();
  const SCALE = 100;

  const wPhotos    = row.filter(p => p.w !== undefined);
  const autoPhotos = row.filter(p => p.w === undefined && p.h === undefined);
  const explicitW  = wPhotos.reduce((s, p) => s + p.w, 0);
  const remaining  = Math.max(0, 1 - explicitW);
  const autoShare  = autoPhotos.length > 0 ? remaining / autoPhotos.length : 0;

  const photosHTML = row.map(p => {
    const ml = p.marginLeft   !== undefined ? p.marginLeft   : d.marginLeft;
    const mr = p.marginRight  !== undefined ? p.marginRight  : d.marginRight;
    const mt = p.marginTop    !== undefined ? p.marginTop    : d.marginTop;
    const mb = p.marginBottom !== undefined ? p.marginBottom : d.marginBottom;

    let outerFlex, imgStyle;

    if (p.h !== undefined && p.w === undefined) {
      outerFlex = 'flex: 0 0 auto';
      imgStyle  = `height:${p.h}px; width:auto; display:block; background:#e8e8e8;`;
    } else if (p.w !== undefined && p.h === undefined) {
      const g   = (p.w * SCALE).toFixed(2);
      outerFlex = `flex: ${g} ${g} 0; min-width:0`;
      imgStyle  = 'width:100%; height:auto; display:block; background:#e8e8e8;';
    } else if (p.w !== undefined && p.h !== undefined) {
      const g   = (p.w * SCALE).toFixed(2);
      outerFlex = `flex: ${g} ${g} 0; min-width:0`;
      imgStyle  = `height:${p.h}px; width:100%; object-fit:cover; display:block; background:#e8e8e8;`;
    } else {
      const g   = (autoShare * SCALE).toFixed(2);
      outerFlex = `flex: ${g} ${g} 0; min-width:0`;
      imgStyle  = 'width:100%; height:auto; display:block; background:#e8e8e8;';
    }

    const outerStyle = [
      outerFlex,
      ml ? `margin-left:${ml}px`   : '',
      mr ? `margin-right:${mr}px`  : '',
      mt ? `margin-top:${mt}px`    : '',
      mb ? `margin-bottom:${mb}px` : '',
    ].filter(Boolean).join('; ');

    return `
      <div class="photo-wrap grid-photo" style="${outerStyle}">
        <img src="${p.src}" alt="${p.caption || ''}" loading="lazy"
             style="${imgStyle}"
             onerror="this.style.background='#e0e0e0';this.removeAttribute('src')">
        ${p.caption ? `<div class="photo-caption">${p.caption}</div>` : ''}
      </div>`;
  }).join('');

  return `<div class="grid-row">${photosHTML}</div>`;
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applyLayoutSettings();
});
