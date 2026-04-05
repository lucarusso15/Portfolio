/* portfolio.js — shared rendering functions */

/* -- HELPERS ------------------------------------------------ */

/* Returns the merged defaults object (config defaults + built-in fallbacks). */
function getDefaults() {
  return Object.assign(
    {
      photoHeight:  780, photoWidth: 800, photoGap: 18,
      marginTop:    0, marginBottom:  0, marginLeft:  0, marginRight:  0,
      paddingTop:   0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
    },
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
  if (fs.navLinks   !== undefined) r.setProperty('--fs-nav',        fs.navLinks   + 'px');
  if (fs.pageTitle  !== undefined) r.setProperty('--fs-title',      fs.pageTitle  + 'px');
  if (fs.bodyText   !== undefined) r.setProperty('--fs-body',       fs.bodyText   + 'px');
  if (fs.caption    !== undefined) r.setProperty('--fs-caption',    fs.caption    + 'px');
  if (fs.infoLinks  !== undefined) r.setProperty('--fs-info-links', fs.infoLinks  + 'px');
  if (fs.infoQuote  !== undefined) r.setProperty('--fs-info-quote', fs.infoQuote  + 'px');

  /* Compute --photo-h and --content-top-margin via JS so we use
     window.innerHeight -- the only reliable measure of actual visible
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
    const avail = window.innerHeight - HEADER_H - MARGIN_TOUCH - 10;
    r.setProperty('--photo-h',            Math.min(d.photoHeight, Math.max(avail, 50)) + 'px');
    r.setProperty('--content-top-margin', MARGIN_TOUCH + 'px');
    document.documentElement.classList.add('touch-landscape');
    document.documentElement.classList.remove('touch-portrait');
  } else if (isTouch) {
    r.setProperty('--photo-h',            d.photoHeight + 'px');
    r.setProperty('--content-top-margin', MARGIN_TOUCH + 'px');
    document.documentElement.classList.add('touch-portrait');
    document.documentElement.classList.remove('touch-landscape');
  } else {
    r.setProperty('--photo-h',            d.photoHeight + 'px');
    r.setProperty('--content-top-margin', (l.contentTopMargin ?? 150) + 'px');
    document.documentElement.classList.remove('touch-landscape', 'touch-portrait');
  }
}

/* -- HEADER ------------------------------------------------- */

function buildHeader(activePage) {
  const c  = PORTFOLIO_CONFIG;
  const el = document.querySelector('[data-header]');
  if (!el) return;

  if (c.photographer.favicon) {
    let fav = document.getElementById('site-favicon');
    if (!fav) { fav = document.createElement('link'); fav.rel = 'icon'; fav.id = 'site-favicon'; document.head.appendChild(fav); }
    fav.href = c.photographer.favicon;
  }
  const navLinks = c.pages.map((p, i) => {
    const href = i === 0 ? 'index.html' : p.id + '.html';
    const cls  = activePage === p.id ? ' class="active"' : '';
    return `<a href="${href}"${cls}>${p.navLabel}</a>`;
  });
  navLinks.push(`<a href="about.html"${activePage === 'about' ? ' class="active"' : ''}>Info</a>`);
  el.innerHTML = `
    <div class="site-name"><a href="index.html">${c.photographer.name}</a></div>
    <nav>${navLinks.join('')}</nav>`;
}

/* -- TEXT COLUMN --------------------------------------------
 * Builds the left column for a page. Returns HTML or "".
 *
 * page.textColumn:
 *   false
 *     Column not rendered. Photos fill full width.
 *
 *   { content: [...], width?, paddingRight?, paddingBottom? }
 *     Renders using the content block array (same format as
 *     inline text boxes). Geometry overrides are optional.
 *
 *   (omitted) | true | {} without content
 *     No content to show -- returns "" (column hidden).
 *
 * colClass: "text-col" (horizontal/vertical) or "text-col-grid" (grid).
 */
function _buildTextColumn(page, colClass) {
  const tc = page.textColumn;

  /* textColumn: false -- omit entirely */
  if (tc === false) return '';

  const opts = (tc !== null && typeof tc === 'object') ? tc : {};

  /* No content array -- nothing to render */
  if (!Array.isArray(opts.content)) return '';

  /* Inline style overrides for geometry */
  const styleRules = [];
  if (opts.width         !== undefined) styleRules.push(`flex-basis:${opts.width}px; width:${opts.width}px`);
  if (opts.paddingRight  !== undefined) styleRules.push(`padding-right:${opts.paddingRight}px`);
  if (opts.paddingBottom !== undefined) styleRules.push(`padding-bottom:${opts.paddingBottom}px`);
  const inlineStyle = styleRules.length ? ` style="${styleRules.join('; ')}"` : '';

  const innerHTML = _renderContentBlocks(opts.content);
  return `<div class="${colClass}"${inlineStyle}><div class="text-box-inner">${innerHTML}</div></div>`;
}

/* -- TEXT BOX -----------------------------------------------
 * Renders an inline text box that sits in the photo sequence.
 * No border, no background -- naked text on the page colour.
 *
 * item.content  array of block objects (see _renderContentBlocks)
 * item.align    "top" | "center" | "bottom". Default: "top"
 * item.padding* inner spacing in px (per-item or from defaults)
 *
 * Size properties (w, h, margins) are resolved by each layout
 * builder and passed in via extraStyle.
 *
 * Backward compat: { text: "...", fontSize: N } still works.
 */
function buildTextBox(item, extraStyle) {
  const d = getDefaults();

  const justifyMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
  const justify    = justifyMap[item.align || 'top'] || 'flex-start';
  const paddingStyle = _paddingStyle(item, d);

  let blocks;
  if (Array.isArray(item.content)) {
    blocks = item.content;
  } else {
    /* Legacy flat string */
    const legacyFontSize = item.fontSize !== undefined ? `font-size:${item.fontSize}px;` : '';
    blocks = [{ text: item.text || '', _legacyStyle: legacyFontSize }];
  }

  const innerHTML = _renderContentBlocks(blocks);

  return `
    <div class="text-box" style="justify-content:${justify};${paddingStyle}${extraStyle || ''}">
      <div class="text-box-inner">${innerHTML}</div>
    </div>`;
}

/* -- CONTENT BLOCK RENDERER ---------------------------------
 * Shared by buildTextBox() and _buildTextColumn().
 * Converts an array of block objects into HTML strings.
 *
 * Each block:
 *   text          string  (required) -- use \n for line breaks
 *   style         "pageTitle" | "bodyText" | "caption" | "navLinks"
 *                 Maps to CSS font-size variables. Default: "bodyText".
 *                 "pageTitle" is always bold.
 *   bold          true | false -- force bold for any other style
 */
const TEXT_STYLE_MAP = {
  pageTitle: 'var(--fs-title)',
  bodyText:  'var(--fs-body)',
  caption:   'var(--fs-caption)',
  navLinks:  'var(--fs-nav)',
};

function _renderContentBlocks(blocks) {
  return blocks.map(block => {
    const fsVar       = TEXT_STYLE_MAP[block.style] || TEXT_STYLE_MAP['bodyText'];
    const fontSizeCSS = block._legacyStyle || `font-size:${fsVar};`;
    const isBold      = block.style === 'pageTitle' || block.bold === true;
    const weightCSS   = isBold ? 'font-weight:700;' : 'font-weight:400;';

    const linesHTML = (block.text || '').split('\n')
      .map(line => `<span>${line}</span>`)
      .join('<br>');

    return `<div class="text-box-block" style="${fontSizeCSS}${weightCSS}">${linesHTML}</div>`;
  }).join('');
}

/* -- SPACING HELPERS ---------------------------------------- */

function _marginStyle(item, d) {
  const ml = item.marginLeft   !== undefined ? item.marginLeft   : d.marginLeft;
  const mr = item.marginRight  !== undefined ? item.marginRight  : d.marginRight;
  const mt = item.marginTop    !== undefined ? item.marginTop    : d.marginTop;
  const mb = item.marginBottom !== undefined ? item.marginBottom : d.marginBottom;
  return [
    ml ? `margin-left:${ml}px`   : '',
    mr ? `margin-right:${mr}px`  : '',
    mt ? `margin-top:${mt}px`    : '',
    mb ? `margin-bottom:${mb}px` : '',
  ].filter(Boolean).join('; ');
}

function _paddingStyle(item, d) {
  const pt = item.paddingTop    !== undefined ? item.paddingTop    : d.paddingTop;
  const pb = item.paddingBottom !== undefined ? item.paddingBottom : d.paddingBottom;
  const pl = item.paddingLeft   !== undefined ? item.paddingLeft   : d.paddingLeft;
  const pr = item.paddingRight  !== undefined ? item.paddingRight  : d.paddingRight;
  if (!pt && !pb && !pl && !pr) return '';
  return `padding:${pt}px ${pr}px ${pb}px ${pl}px;`;
}

/* -- PAGE DISPATCHER ---------------------------------------- */

function buildPage(page) {
  if (page.layout === 'grid')     return buildGridPage(page);
  if (page.layout === 'vertical') return buildVerticalPage(page);
  return buildHorizontalPage(page);
}

/* -- HORIZONTAL LAYOUT --------------------------------------
 * Desktop: text column fixed left, photos scroll left to right.
 * Touch portrait: collapses to vertical stack via CSS.
 * Touch landscape: photos fill the visible viewport height.
 */
function buildHorizontalPage(page) {
  const d = getDefaults();
  const textColHTML = _buildTextColumn(page, 'text-col');

  const itemsHTML = page.photos.map(item => {
    const marginStyle = _marginStyle(item, d);

    if (item.content !== undefined || (item.text !== undefined && !item.src)) {
      const widthStyle = item.w !== undefined ? `width:${item.w}px;` : '';
      return buildTextBox(item, `${widthStyle}${marginStyle ? marginStyle + ';' : ''}`);
    }

    const paddingStyle = _paddingStyle(item, d);
    const wrapStyle    = [marginStyle, paddingStyle].filter(Boolean).join('; ');
    const imgStyle     = item.h !== undefined ? `height:${item.h}px;` : '';
    return `
      <div class="photo-wrap"${wrapStyle ? ` style="${wrapStyle}"` : ''}>
        <img src="${item.src}" alt="${item.caption || ''}" loading="lazy"
             ${imgStyle ? `style="${imgStyle}"` : ''}
             onerror="this.style.background='#e0e0e0';this.removeAttribute('src')">
        ${item.caption ? `<div class="photo-caption">${item.caption}</div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="page-row">
      ${textColHTML}
      <div class="photos-horizontal">${itemsHTML}</div>
    </div>`;
}

/* -- VERTICAL LAYOUT ----------------------------------------
 * Desktop: text column fixed left, photos stack top to bottom.
 * Touch portrait: text above, all items fill full width.
 * Touch landscape: items fill screen width.
 */
function buildVerticalPage(page) {
  const d = getDefaults();
  const textColHTML = _buildTextColumn(page, 'text-col');

  const itemsHTML = page.photos.map(item => {
    const marginStyle = _marginStyle(item, d);

    if (item.content !== undefined || (item.text !== undefined && !item.src)) {
      const wStyle = item.w !== undefined
        ? `width:${(item.w * 100).toFixed(2)}%;`
        : `width:${d.photoWidth}px; max-width:100%;`;
      const hStyle = item.h !== undefined ? `height:${item.h}px;` : '';
      return buildTextBox(item, `${wStyle}${hStyle}${marginStyle ? marginStyle + ';' : ''}`);
    }

    const paddingStyle = _paddingStyle(item, d);
    const wrapStyle    = [marginStyle, paddingStyle].filter(Boolean).join('; ');
    const wStyle   = item.w !== undefined
      ? `width:${(item.w * 100).toFixed(2)}%`
      : `width:${d.photoWidth}px; max-width:100%`;
    const hRule    = item.h !== undefined ? `height:${item.h}px; object-fit:cover;` : 'height:auto;';
    const imgStyle = `${wStyle}; ${hRule} display:block; background:#e8e8e8;`;

    return `
      <div class="photo-wrap vertical-photo"${wrapStyle ? ` style="${wrapStyle}"` : ''}>
        <img src="${item.src}" alt="${item.caption || ''}" loading="lazy"
             style="${imgStyle}"
             onerror="this.style.background='#e0e0e0';this.removeAttribute('src')">
        ${item.caption ? `<div class="photo-caption">${item.caption}</div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="page-vertical-wrap">
      ${textColHTML}
      <div class="photos-vertical">${itemsHTML}</div>
    </div>`;
}

/* -- GRID LAYOUT --------------------------------------------
 * Desktop: text column fixed left, photos in explicit rows.
 * Touch landscape: text above, rows side-by-side, fills width.
 * Touch portrait: text above, 2 items per row.
 * Phone portrait (<= 640px): 1 item per row.
 */
function buildGridPage(page) {
  const rowsHTML    = (page.rows || []).map(row => buildGridRow(row)).join('');
  const textColHTML = _buildTextColumn(page, 'text-col-grid');

  return `
    <div class="page-grid-wrap">
      ${textColHTML}
      <div class="photos-grid">${rowsHTML}</div>
    </div>`;
}

function buildGridRow(row) {
  const d     = getDefaults();
  const SCALE = 100;

  const wItems    = row.filter(p => p.w !== undefined);
  const autoItems = row.filter(p => p.w === undefined && p.h === undefined);
  const explicitW = wItems.reduce((s, p) => s + p.w, 0);
  const remaining = Math.max(0, 1 - explicitW);
  const autoShare = autoItems.length > 0 ? remaining / autoItems.length : 0;

  const itemsHTML = row.map(item => {
    const marginStyle = _marginStyle(item, d);

    if (item.content !== undefined || (item.text !== undefined && !item.src)) {
      const g          = (item.w !== undefined ? item.w : autoShare) * SCALE;
      const flexStyle  = `flex: ${g.toFixed(2)} ${g.toFixed(2)} 0; min-width:0`;
      const hStyle     = item.h !== undefined ? `height:${item.h}px;` : '';
      const extraStyle = [flexStyle, marginStyle].filter(Boolean).join('; ');
      return buildTextBox(item, `${extraStyle};${hStyle}width:100%;`);
    }

    let outerFlex, imgStyle;
    if (item.h !== undefined && item.w === undefined) {
      outerFlex = 'flex: 0 0 auto';
      imgStyle  = `height:${item.h}px; width:auto; display:block; background:#e8e8e8;`;
    } else if (item.w !== undefined && item.h === undefined) {
      const g   = (item.w * SCALE).toFixed(2);
      outerFlex = `flex: ${g} ${g} 0; min-width:0`;
      imgStyle  = 'width:100%; height:auto; display:block; background:#e8e8e8;';
    } else if (item.w !== undefined && item.h !== undefined) {
      const g   = (item.w * SCALE).toFixed(2);
      outerFlex = `flex: ${g} ${g} 0; min-width:0`;
      imgStyle  = `height:${item.h}px; width:100%; object-fit:cover; display:block; background:#e8e8e8;`;
    } else {
      const g   = (autoShare * SCALE).toFixed(2);
      outerFlex = `flex: ${g} ${g} 0; min-width:0`;
      imgStyle  = 'width:100%; height:auto; display:block; background:#e8e8e8;';
    }

    const paddingStyle = _paddingStyle(item, d);
    const outerStyle   = [outerFlex, marginStyle, paddingStyle].filter(Boolean).join('; ');

    return `
      <div class="photo-wrap grid-photo" style="${outerStyle}">
        <img src="${item.src}" alt="${item.caption || ''}" loading="lazy"
             style="${imgStyle}"
             onerror="this.style.background='#e0e0e0';this.removeAttribute('src')">
        ${item.caption ? `<div class="photo-caption">${item.caption}</div>` : ''}
      </div>`;
  }).join('');

  return `<div class="grid-row">${itemsHTML}</div>`;
}

/* -- INIT --------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  applyLayoutSettings();
});
