# Portfolio

A minimal static portfolio site -- no server, no build tools, no dependencies.
Works on any static host (Netlify, Vercel, Cloudflare Pages, shared hosting, etc.).

---

## File structure

```
portfolio/
├── index.html       <- Home = Page 1
├── page-2.html      <- Page 2
├── page-3.html      <- Page 3  (duplicate for more)
├── about.html       <- Info / Bio page
├── config.js        <- EDIT THIS -- all configuration lives here
├── css/style.css
├── js/portfolio.js
└── images/
    ├── favicon.png     <- Browser tab icon (replace freely)
    ├── portrait.jpg    <- Your portrait on the Info page (optional)
    └── ...             <- Your photos go here
```

---

## config.js structure

```
PORTFOLIO_CONFIG
├── photographer  -- name, bio, favicon, email, links[]
├── layout        -- page structure, text column defaults, font sizes
├── defaults      -- photo height/width, gap, margins, paddings
├── quotes        -- random phrases shown on the Info page
└── pages         -- your photo pages, each with layout + photos/rows
```

---

## `photographer` -- personal info

```js
photographer: {
  name:    "Your Name",
  favicon: "images/favicon.png",
  bio:     `Your bio. Separate paragraphs with a blank line.`,
  email:   "",   // mailto: link -- leave "" to hide
  links: [
    { label: "Instagram", displayLink: "@handle", link: "https://instagram.com/handle" },
  ],
},
```

---

## `layout` -- page structure

```js
layout: {
  contentTopMargin: 150,  // space between navbar and content (px) -- desktop only
  pageSidePadding:  50,   // left/right outer padding (px)
  textColumnWidth:  200,  // default left column width (px)
  textMarginRight:  40,   // default gap between column and photos (px)
  textMarginBottom: 0,    // default bottom spacing of column (px)

  // Font sizes -- also used as "style" values in content blocks.
  fontSize: {
    navLinks:  15,
    pageTitle: 20,   // style: "pageTitle" -- always bold
    bodyText:  14,   // style: "bodyText"
    caption:   12,   // style: "caption"
    infoLinks: 14,
    infoQuote: 22,
  },
},
```

---

## `defaults` -- global item settings

Applied to every photo and text box unless overridden per-item.

```js
defaults: {
  photoHeight: 780,   // height (px) for horizontal layout
  photoWidth:  624,   // width  (px) for vertical layout
  photoGap:    10,    // gap between items (px) -- all layouts

  // Outer spacing -- moves the item relative to its neighbours.
  marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,

  // Inner spacing for text boxes only (no effect on photos).
  paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
},
```

---

## Content blocks

Both the text column and inline text boxes use the same **content block** format:

```js
content: [
  { text: "Page title",         style: "pageTitle" },  // bold
  { text: "Body text.\nLine 2", style: "bodyText"  },
  { text: "A small note.",      style: "caption"   },
]
```

| Property | Values | Default | Description |
|---|---|---|---|
| `text` | string | required | Text to display. Use `\n` for line breaks within a block. |
| `style` | `pageTitle` / `bodyText` / `caption` / `navLinks` | `bodyText` | Maps to `layout.fontSize`. `pageTitle` is always bold. |
| `bold` | true / false | false | Force bold weight on any style. |

---

## Page properties

| Property | Type | Description |
|---|---|---|
| `navLabel` | string | Text shown in the navigation bar. |
| `id` | string | Page identifier -- must match the HTML filename (`page-2` -> `page-2.html`). |
| `layout` | string | `"horizontal"` / `"vertical"` / `"grid"` |
| `textColumn` | object / false | Left column configuration (see below). |

---

## Text column (left column per page)

Each page has a left column. Control it with `textColumn`.

**Hide the column** -- photos fill the full width from the left edge:
```js
textColumn: false
```

**Structured content** -- full control using content blocks:
```js
textColumn: {
  content: [
    { text: "Page title",   style: "pageTitle" },
    { text: "Description.", style: "bodyText"  },
    { text: "A note.",      style: "caption"   },
  ],
  width:         200,   // override column width for this page (px)
  paddingRight:   40,   // override gap between column and photos (px)
  paddingBottom:   0,   // override bottom spacing (px)
}
```

**No column** (omit `textColumn` or `{}` without `content`):
Column is hidden -- same as `false`.

---

## Horizontal page

Photos scroll left to right. Text column on the left.

**Responsive:** touch portrait stacks vertically; touch landscape fills viewport height.

```js
layout: "horizontal",
photos: [
  { src: "images/photo.jpg", caption: "" },
  { src: "images/photo.jpg", h: 600, marginRight: 40 },
]
```

Per-photo overrides: `h`, `marginTop/Bottom/Left/Right`, `paddingTop/Bottom/Left/Right`.

---

## Vertical page

Photos stack top to bottom. Page scrolls normally.

**Responsive:** touch portrait = full-width photos; touch landscape = full-screen width.

```js
layout: "vertical",
photos: [
  { src: "images/photo.jpg" },
  { src: "images/photo.jpg", w: 0.6 },         // 60% column width
  { src: "images/photo.jpg", w: 0.8, h: 400 }, // 80% wide, cropped to 400px
]
```

| Property | Type | Default | Description |
|---|---|---|---|
| `w` | 0-1 | 1 | Width as fraction of photos column |
| `h` | px | auto | Height in px -- crops the image |
| `marginTop/Bottom/Left/Right` | px | from `defaults` | Outer spacing |

---

## Grid page

Photos placed in rows you define. Page scrolls vertically.

**Responsive:** touch portrait = 2 per row; phone portrait = 1 per row.

```js
layout: "grid",
rows: [
  [ photo, photo, photo ],
  [ photo, photo ],
]
```

| Properties set | Behaviour |
|---|---|
| `h` only | Fixed height, width auto -- no crop |
| `w` only | Fills `w` fraction of row, height auto -- no crop |
| `h` + `w` | Fills `w` fraction, cropped to `h` |
| neither | Equal share, height auto -- no crop |

`w` is 0-1 (`0.5` = 50%, `0.33` = 33%).

---

## Inline text boxes

Any item with a `content` array in `photos` or `rows` is rendered as an inline
text box -- no border, no background, naked text in the photo flow.

```js
{
  content: [
    { text: "A title",   style: "pageTitle" },
    { text: "Body text", style: "bodyText"  },
  ],
  align: "center",           // "top" | "center" | "bottom"
  paddingLeft: 20,           // inner spacing overrides
  w: 280,                    // width (meaning depends on layout)
}
```

**Horizontal** -- `w` is explicit width in px:
```js
{ content: [...], align: "bottom", w: 300 }
```

**Vertical** -- `w` is fraction (0-1); `h` sets fixed height in px:
```js
{ content: [...], align: "top", w: 0.5, h: 400 }
```

**Grid** -- `w` (fraction) and `h` (px) to match adjacent photos:
```js
[
  { content: [...], align: "center", w: 0.4, h: 780 },
  { src: "images/photo.jpg",         w: 0.6, h: 780 },
]
```

---

## Responsive behaviour

The site adapts to three scenarios, detected at runtime by JavaScript and CSS.

**Desktop / laptop** (mouse, any screen width)

The text column sits fixed on the left. Photos have the full configured top margin (`layout.contentTopMargin`, default 150px). Each layout works as designed: horizontal scrolls left-to-right, vertical scrolls normally, grid respects the rows you defined.

**Touch portrait** -- phone or tablet held upright

Detected via `pointer: coarse` (CSS) and `navigator.maxTouchPoints > 0` (JS). Top margin reduces to 10px. The text column moves above the photos at full width. All three layouts collapse to a vertical single-column flow:
- Horizontal: photos stack top-to-bottom, full width, height auto (the `h` value is ignored).
- Vertical: identical to desktop but without the fixed left column.
- Grid: 2 photos per row (flex-wrap). On phones with width ≤ 640px: 1 photo per row.

Inline text boxes become full-width with auto height (min 80px).

**Touch landscape** -- phone or tablet held sideways

Detected via `pointer: coarse` + `orientation: landscape` (CSS), plus a JS class `touch-landscape` on `<html>` that catches iPads with Apple Pencil (which report `pointer: fine` despite being touch devices). Top margin is 10px.
- Horizontal: text column stays left. Photo height is calculated by JS as `window.innerHeight - header - 10px` so they fill the visible viewport exactly with no vertical scroll and no overflow.
- Vertical: text column moves above, photos fill full screen width (the `w` fraction is overridden).
- Grid: text column moves above, rows stay side-by-side with `flex: 1 1 0` so each item takes an equal share of the width.

**Navbar**

Fixed at the top on all devices, always 42px tall. On phones ≤ 640px portrait the font shrinks to 12px and nav link gaps tighten to prevent overflow.

---

## Adding a new page

1. Add an entry to `pages` in `config.js`
2. Duplicate `page-2.html`, rename it (e.g. `page-4.html`)
3. Update the page ID inside: `const PAGE_ID = 'page-4'`

---

## Deployment

Upload the `portfolio/` folder to any static host.
No server-side processing required -- pure HTML, CSS, JavaScript.
