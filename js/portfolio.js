/* portfolio.js -- shared rendering functions */

/* ============================================================
   CONSTANTS
   ============================================================ */

/* Read from the DOM at init so it stays in sync with --header-h in CSS. */
let HEADER_H = 42;
function _readHeaderHeight() {
  const header = document.querySelector('header');
  if (header) HEADER_H = header.getBoundingClientRect().height;
}

/* ============================================================
   CONFIG HELPERS
   ============================================================ */

/* Returns the merged item defaults (config overrides built-in fallbacks). */
function getDefaults() {
  return Object.assign(
    {
      photoHeight:  780, photoWidth:  624, photoGap: 10,
      marginTop:    0,   marginBottom: 0,  marginLeft: 0, marginRight: 0,
      paddingTop:   0,   paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
    },
    PORTFOLIO_CONFIG.defaults || {}
  );
}

/* ============================================================
   LAYOUT INITIALISATION
   Called once at DOMContentLoaded.
   ============================================================ */

function applyLayoutSettings() {
  const layout   = PORTFOLIO_CONFIG.layout || {};
  const defaults = getDefaults();
  const root     = document.documentElement.style;

  /* Map config keys to CSS custom properties */
  if (layout.pageSidePadding  !== undefined) root.setProperty('--pad',               layout.pageSidePadding  + 'px');
  if (layout.textColumnWidth  !== undefined) root.setProperty('--text-col-w',        layout.textColumnWidth  + 'px');
  if (layout.textMarginRight  !== undefined) root.setProperty('--text-margin-right', layout.textMarginRight  + 'px');
  if (layout.textMarginBottom !== undefined) root.setProperty('--text-margin-bottom',layout.textMarginBottom + 'px');

  root.setProperty('--photo-gap', defaults.photoGap + 'px');

  const fontSize = layout.fontSize || {};
  if (fontSize.navLinks   !== undefined) root.setProperty('--fs-nav',        fontSize.navLinks   + 'px');
  if (fontSize.pageTitle  !== undefined) root.setProperty('--fs-title',      fontSize.pageTitle  + 'px');
  if (fontSize.bodyText   !== undefined) root.setProperty('--fs-body',       fontSize.bodyText   + 'px');
  if (fontSize.caption    !== undefined) root.setProperty('--fs-caption',    fontSize.caption    + 'px');
  if (fontSize.infoLinks  !== undefined) root.setProperty('--fs-info-links', fontSize.infoLinks  + 'px');
  if (fontSize.infoQuote  !== undefined) root.setProperty('--fs-info-quote', fontSize.infoQuote  + 'px');

  _applyViewportVars();
  window.addEventListener('resize', _applyViewportVars);

  /* Add .is-touch for iPad + Apple Pencil: pointer is "fine" but has touch */
  if (navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('is-touch');
  }
}

/* Updates CSS vars that depend on the live viewport size.
   Called on load and on every resize. */
function _applyViewportVars() {
  const defaults = getDefaults();
  const layout   = PORTFOLIO_CONFIG.layout || {};
  const root     = document.documentElement.style;
  const isTouch  = navigator.maxTouchPoints > 0;

  root.setProperty('--photo-h', defaults.photoHeight + 'px');
  root.setProperty(
    '--content-top-margin',
    isTouch ? '20px' : (layout.contentTopMargin ?? 150) + 'px'
  );
}

/* ============================================================
   W RESOLVER
   Normalises the "w" item property:
     w <= 1  -> fraction of available space  (e.g. 0.5 = 50%)
     w >  1  -> explicit pixel width         (e.g. 300 = 300px)
   Returns { mode: 'fraction'|'px', value } or null if w is unset.
   ============================================================ */

function _resolveW(w) {
  if (w === undefined || w === null) return null;
  return w > 1 ? { mode: 'px', value: w } : { mode: 'fraction', value: w };
}

/* ============================================================
   HEADER
   ============================================================ */

function buildHeader(activePage) {
  const config = PORTFOLIO_CONFIG;
  const el     = document.querySelector('[data-header]');
  if (!el) return;

  if (config.photographer.favicon) {
    let fav = document.getElementById('site-favicon');
    if (!fav) {
      fav     = document.createElement('link');
      fav.rel = 'icon';
      fav.id  = 'site-favicon';
      document.head.appendChild(fav);
    }
    fav.href = config.photographer.favicon;
  }

  const pageLinks = config.pages.map((page, i) => {
    const href      = i === 0 ? 'index.html' : page.id + '.html';
    const activeAttr = activePage === page.id ? ' class="active"' : '';
    return `<a href="${href}"${activeAttr}>${page.navLabel}</a>`;
  });
  pageLinks.push(
    `<a href="about.html"${activePage === 'about' ? ' class="active"' : ''}>Info</a>`
  );

  el.innerHTML = `
    <div class="site-name"><a href="index.html">${config.photographer.name}</a></div>
    <nav>${pageLinks.join('')}</nav>`;
}

/* ============================================================
   TEXT COLUMN
   Renders the left column for vertical and grid pages.
   Returns an HTML string, or "" if the column is hidden.

   page.textColumn:
     false | omitted | {} without content  -> hidden (returns "")
     { content, width?, paddingRight?, paddingBottom? }  -> rendered
   ============================================================ */

function _buildTextColumn(page, colClass) {
  const tc = page.textColumn;
  if (!tc || tc === false) return '';

  const opts = (typeof tc === 'object') ? tc : {};
  if (!Array.isArray(opts.content) || opts.content.length === 0) return '';

  const styles = [];
  if (opts.width         !== undefined) styles.push(`flex-basis:${opts.width}px; width:${opts.width}px`);
  if (opts.paddingRight  !== undefined) styles.push(`padding-right:${opts.paddingRight}px`);
  if (opts.paddingBottom !== undefined) styles.push(`padding-bottom:${opts.paddingBottom}px`);
  const styleAttr = styles.length ? ` style="${styles.join('; ')}"` : '';

  return `<div class="${colClass}"${styleAttr}><div class="text-box-inner">${_renderContentBlocks(opts.content)}</div></div>`;
}

/* ============================================================
   TEXT BOX
   Renders an inline text element that sits in the photo sequence.
   extraStyle: raw CSS string appended to the element's style attr.
   ============================================================ */

function buildTextBox(item, defaults, extraStyle) {
  const alignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
  const justify  = alignMap[item.align || 'top'] || 'flex-start';
  const padCSS   = _paddingStyle(item, defaults);

  const blocks = Array.isArray(item.content) ? item.content : [];

  return `
    <div class="text-box" style="justify-content:${justify};${padCSS}${extraStyle || ''}">
      <div class="text-box-inner">${_renderContentBlocks(blocks)}</div>
    </div>`;
}

/* ============================================================
   CONTENT BLOCK RENDERER
   Shared by buildTextBox() and _buildTextColumn().
   Each block: { text, style, bold? }
     style: "pageTitle" | "bodyText" | "caption" | "navLinks"
     pageTitle is always bold; bold: true forces bold on any style.
   ============================================================ */

const FONT_SIZE_VARS = {
  pageTitle: 'var(--fs-title)',
  bodyText:  'var(--fs-body)',
  caption:   'var(--fs-caption)',
  navLinks:  'var(--fs-nav)',
};

function _renderContentBlocks(blocks) {
  return blocks.map(block => {
    const sizeVar  = FONT_SIZE_VARS[block.style] || FONT_SIZE_VARS.bodyText;
    const isBold   = block.style === 'pageTitle' || block.bold === true;
    const weightCSS = isBold ? 'font-weight:700;' : 'font-weight:400;';
    const linesHTML = (block.text || '')
      .split('\n')
      .map(line => `<span>${line}</span>`)
      .join('<br>');
    return `<div class="text-box-block" style="font-size:${sizeVar};${weightCSS}">${linesHTML}</div>`;
  }).join('');
}

/* ============================================================
   SPACING HELPERS
   Build inline CSS strings from item margin/padding properties.
   ============================================================ */

function _marginStyle(item, defaults) {
  const ml = item.marginLeft   !== undefined ? item.marginLeft   : defaults.marginLeft;
  const mr = item.marginRight  !== undefined ? item.marginRight  : defaults.marginRight;
  const mt = item.marginTop    !== undefined ? item.marginTop    : defaults.marginTop;
  const mb = item.marginBottom !== undefined ? item.marginBottom : defaults.marginBottom;
  return [
    ml ? `margin-left:${ml}px`   : '',
    mr ? `margin-right:${mr}px`  : '',
    mt ? `margin-top:${mt}px`    : '',
    mb ? `margin-bottom:${mb}px` : '',
  ].filter(Boolean).join('; ');
}

function _paddingStyle(item, defaults) {
  const pt = item.paddingTop    !== undefined ? item.paddingTop    : defaults.paddingTop;
  const pb = item.paddingBottom !== undefined ? item.paddingBottom : defaults.paddingBottom;
  const pl = item.paddingLeft   !== undefined ? item.paddingLeft   : defaults.paddingLeft;
  const pr = item.paddingRight  !== undefined ? item.paddingRight  : defaults.paddingRight;
  if (!pt && !pb && !pl && !pr) return '';
  return `padding:${pt}px ${pr}px ${pb}px ${pl}px;`;
}

/* ============================================================
   LAYOUT HELPERS
   ============================================================ */

/* CSS width string for vertical layout items. */
function _widthCSS(rw, defaults) {
  if (!rw)              return `width:${defaults.photoWidth}px; max-width:100%;`;
  if (rw.mode === 'px') return `width:${rw.value}px; max-width:100%;`;
  return `width:${(rw.value * 100).toFixed(2)}%; max-width:100%;`;
}

/* CSS class for contentAlign page property. */
function _alignClass(contentAlign) {
  if (contentAlign === 'center') return 'align-center';
  if (contentAlign === 'right')  return 'align-right';
  return 'align-left';
}

/* Detects whether item is a text box (has content array) vs a photo. */
function _isTextBox(item) {
  return Array.isArray(item.content) || (item.text !== undefined && !item.src);
}

/* ============================================================
   PAGE DISPATCHER
   ============================================================ */

function buildPage(page) {
  if (page.layout === 'grid')     return buildGridPage(page);
  if (page.layout === 'vertical') return buildVerticalPage(page);
  return buildHorizontalPage(page);
}

/* ============================================================
   HORIZONTAL LAYOUT
   Photos scroll left to right. The body scrolls horizontally --
   JS adds .layout-horizontal to <html> so CSS enables overflow-x.
   Touch devices: CSS stacks everything vertically instead.
   ============================================================ */

function buildHorizontalPage(page) {
  document.documentElement.classList.add('layout-horizontal');

  const defaults    = getDefaults();
  const textColHTML = _buildTextColumn(page, 'text-col');

  const itemsHTML = page.photos.map(item => {
    const marginCSS = _marginStyle(item, defaults);

    if (_isTextBox(item)) {
      const widthCSS = item.w !== undefined ? `width:${item.w}px;` : '';
      return buildTextBox(item, defaults, `${widthCSS}${marginCSS ? marginCSS + ';' : ''}`);
    }

    const paddingCSS = _paddingStyle(item, defaults);
    const wrapStyle  = [marginCSS, paddingCSS].filter(Boolean).join('; ');
    const heightCSS  = item.h !== undefined ? `height:${item.h}px;` : '';
    return `
      <div class="photo-wrap"${wrapStyle ? ` style="${wrapStyle}"` : ''}>
        <img src="${item.src}" alt="${item.caption || ''}" loading="lazy"
             ${heightCSS ? `style="${heightCSS}"` : ''}
             onerror="this.style.background='#e0e0e0';this.removeAttribute('src')">
        ${item.caption ? `<div class="photo-caption">${item.caption}</div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="page-row-outer">
      <div class="page-row">
        ${textColHTML}
        <div class="photos-horizontal">${itemsHTML}</div>
      </div>
    </div>`;
}

/* ============================================================
   VERTICAL LAYOUT
   Photos stack top to bottom. Text column on the left.
   w semantics:  w <= 1 = fraction,  w > 1 = px,  omitted = photoWidth
   contentAlign: "left" (default) | "center" | "right"
   ============================================================ */

function buildVerticalPage(page) {
  const defaults    = getDefaults();
  const textColHTML = _buildTextColumn(page, 'text-col');
  const alignClass  = _alignClass(page.contentAlign);

  const itemsHTML = page.photos.map(item => {
    const marginCSS = _marginStyle(item, defaults);
    const rw        = _resolveW(item.w);
    const widthCSS  = _widthCSS(rw, defaults);

    if (_isTextBox(item)) {
      const heightCSS = item.h !== undefined ? `height:${item.h}px;` : '';
      return buildTextBox(item, defaults, `${widthCSS}${heightCSS}${marginCSS ? marginCSS + ';' : ''}`);
    }

    const paddingCSS = _paddingStyle(item, defaults);
    const wrapStyle  = [marginCSS, paddingCSS].filter(Boolean).join('; ');
    const heightRule = item.h !== undefined ? `height:${item.h}px; object-fit:cover;` : 'height:auto;';
    const imgStyle   = `${widthCSS} ${heightRule} display:block; background:#e8e8e8;`;

    return `
      <div class="photo-wrap vertical-photo"${wrapStyle ? ` style="${wrapStyle}"` : ''}>
        <img src="${item.src}" alt="${item.caption || ''}" loading="lazy"
             style="${imgStyle}"
             onerror="this.style.background='#e0e0e0';this.removeAttribute('src')">
        ${item.caption ? `<div class="photo-caption">${item.caption}</div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="page-vertical-wrap ${alignClass}">
      <div class="vertical-inner">
        ${textColHTML}
        <div class="photos-vertical">${itemsHTML}</div>
      </div>
    </div>`;
}

/* ============================================================
   GRID LAYOUT
   Photos in explicit rows defined in config.
   w semantics: same as vertical.
   contentAlign: same as vertical.
   ============================================================ */

function buildGridPage(page) {
  const rowsHTML    = (page.rows || []).map(buildGridRow).join('');
  const textColHTML = _buildTextColumn(page, 'text-col-grid');
  const alignClass  = _alignClass(page.contentAlign);

  return `
    <div class="page-grid-wrap ${alignClass}">
      <div class="grid-inner">
        ${textColHTML}
        <div class="photos-grid">${rowsHTML}</div>
      </div>
    </div>`;
}

function buildGridRow(row) {
  const defaults = getDefaults();

  /* Compute how much flex space auto items share.
     Fraction items declare their share (0-1); px items are fixed.
     Auto items split whatever fraction remains. */
  const fracItems  = row.filter(item => { const rw = _resolveW(item.w); return rw && rw.mode === 'fraction'; });
  const autoItems  = row.filter(item => !_resolveW(item.w) && item.h === undefined);
  const usedFrac   = fracItems.reduce((sum, item) => sum + _resolveW(item.w).value, 0);
  const autoShare  = autoItems.length > 0 ? Math.max(0, 1 - usedFrac) / autoItems.length : 0;

  const itemsHTML = row.map(item => {
    const marginCSS = _marginStyle(item, defaults);
    const rw        = _resolveW(item.w);

    /* Flex rule for the item's container div */
    let flexCSS;
    if (!rw) {
      flexCSS = item.h !== undefined
        ? 'flex: 0 0 auto'
        : `flex: ${autoShare.toFixed(4)} ${autoShare.toFixed(4)} 0; min-width:0`;
    } else if (rw.mode === 'px') {
      flexCSS = `flex: 0 0 ${rw.value}px; width:${rw.value}px; min-width:0`;
    } else {
      flexCSS = `flex: ${rw.value.toFixed(4)} ${rw.value.toFixed(4)} 0; min-width:0`;
    }

    if (_isTextBox(item)) {
      const heightCSS  = item.h !== undefined ? `height:${item.h}px;` : '';
      const widthRule  = (rw && rw.mode === 'px') ? '' : 'width:100%;';
      const containerStyle = [flexCSS, marginCSS].filter(Boolean).join('; ');
      return buildTextBox(item, defaults, `${containerStyle};${heightCSS}${widthRule}`);
    }

    const heightRule = item.h !== undefined ? `height:${item.h}px; object-fit:cover;` : 'height:auto;';
    const imgStyle   = item.h !== undefined && item.w === undefined
      ? `height:${item.h}px; width:auto; display:block; background:#e8e8e8;`
      : `width:100%; ${heightRule} display:block; background:#e8e8e8;`;

    const paddingCSS    = _paddingStyle(item, defaults);
    const containerStyle = [flexCSS, marginCSS, paddingCSS].filter(Boolean).join('; ');

    return `
      <div class="photo-wrap grid-photo" style="${containerStyle}">
        <img src="${item.src}" alt="${item.caption || ''}" loading="lazy"
             style="${imgStyle}"
             onerror="this.style.background='#e0e0e0';this.removeAttribute('src')">
        ${item.caption ? `<div class="photo-caption">${item.caption}</div>` : ''}
      </div>`;
  }).join('');

  return `<div class="grid-row">${itemsHTML}</div>`;
}

/* ============================================================
   KEYBOARD NAVIGATION
   Arrow keys scroll item by item.
   Horizontal layout: ArrowLeft / ArrowRight scroll the page horizontally.
   Vertical / Grid:   ArrowUp / ArrowDown scroll the page vertically.
   Ignored when focus is inside a form field.
   ============================================================ */

function _initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    const isHorizontal = document.documentElement.classList.contains('layout-horizontal');

    if (isHorizontal) {
      if (e.key === 'ArrowRight') { e.preventDefault(); _scrollToItem('right'); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); _scrollToItem('left');  }
    } else {
      if (e.key === 'ArrowDown')  { e.preventDefault(); _scrollToItem('down'); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); _scrollToItem('up');   }
    }
  });
}

/* Scrolls the page to the next or previous item in the sequence.
 *
 * Horizontal (right / left):
 *   Items are .photo-wrap and .text-box inside .photos-horizontal.
 *   "Next" = first item whose left edge is more than PAD + TOL px from
 *   the left of the viewport (i.e. not yet snapped to the content edge).
 *   Snap-to-end: if less than one item width remains after the target,
 *   scroll to the very end instead to avoid a micro-scroll.
 *   "Prev" = item immediately before the one currently at the left edge.
 *
 * Vertical (down / up):
 *   Items are .photo-wrap / .text-box in .photos-vertical, or .grid-row.
 *   SNAP line = HEADER_H + 8px. Items scroll to align their top there.
 */
function _scrollToItem(dir) {
  const PAD  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pad')) || 50;
  const TOL  = 12; /* px — prevents jitter from sub-pixel rendering */
  const SNAP = HEADER_H + 8;

  if (dir === 'right' || dir === 'left') {
    const container = document.querySelector('.photos-horizontal');
    if (!container) return;
    const items = Array.from(container.querySelectorAll(':scope > .photo-wrap, :scope > .text-box'));
    if (!items.length) return;

    const maxScrollX = document.body.scrollWidth - window.innerWidth;

    if (dir === 'right') {
      const next = items.find(el => el.getBoundingClientRect().left > PAD + TOL);
      if (!next) return;

      const targetX   = window.scrollX + next.getBoundingClientRect().left - PAD;
      const itemWidth = next.getBoundingClientRect().width;

      window.scrollTo({
        left: (maxScrollX - targetX < itemWidth) ? maxScrollX : targetX,
        behavior: 'smooth',
      });
    } else {
      /* Find the item currently at the left edge, then go one back. */
      const atEdge = items.slice().reverse().find(el => el.getBoundingClientRect().left < PAD + TOL);
      if (!atEdge) { window.scrollTo({ left: 0, behavior: 'smooth' }); return; }

      const atEdgeIdx = items.indexOf(atEdge);
      const target    = atEdgeIdx > 0 ? items[atEdgeIdx - 1] : null;

      if (target) {
        const targetX = window.scrollX + target.getBoundingClientRect().left - PAD;
        window.scrollTo({ left: targetX < TOL ? 0 : targetX, behavior: 'smooth' });
      } else {
        window.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
    return;
  }

  /* Vertical / Grid */
  const isGrid = !!document.querySelector('.photos-grid');
  const items  = isGrid
    ? Array.from(document.querySelectorAll('.grid-row'))
    : Array.from(document.querySelectorAll('.photos-vertical > .photo-wrap, .photos-vertical > .text-box'));
  if (!items.length) return;

  if (dir === 'down') {
    /* Skip item 0 only if it is already fully visible on load -- i.e. its
       bottom edge is above the viewport bottom. On short screens where
       the first photo is taller than the available space, don't skip it. */
    const firstBottom   = items[0].getBoundingClientRect().bottom;
    const firstVisible  = firstBottom < window.innerHeight - TOL;
    const searchFrom    = firstVisible ? 1 : 0;
    const next = items.slice(searchFrom).find(el => el.getBoundingClientRect().top > SNAP + TOL);
    if (next) {
      window.scrollTo({ top: window.scrollY + next.getBoundingClientRect().top - SNAP, behavior: 'smooth' });
    }
  } else {
    /* Find the item whose top is closest to SNAP -- that is the one
       currently visible at the top of the content area.
       Then go one item back. If we land on index 0, scroll to top
       so contentTopMargin + item 0 are shown together. */
    const snapped = items.reduce((closest, el) => {
      const dist   = Math.abs(el.getBoundingClientRect().top - SNAP);
      const cdist  = Math.abs(closest.getBoundingClientRect().top - SNAP);
      return dist < cdist ? el : closest;
    });
    const snappedIdx = items.indexOf(snapped);

    if (snappedIdx <= 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = items[snappedIdx - 1];
      window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - SNAP, behavior: 'smooth' });
    }
  }
}

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  _readHeaderHeight();
  applyLayoutSettings();
  _initKeyboard();
});
