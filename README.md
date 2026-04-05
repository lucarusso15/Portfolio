# Portfolio

A minimal static photography portfolio -- no server, no build tools, no dependencies.
Works on any static host (Netlify, Vercel, Cloudflare Pages, shared hosting, etc.).

---

## File structure

```
portfolio/
├── index.html        <- Home = Page 1
├── page-2.html       <- Page 2
├── page-3.html       <- Page 3 (duplicate for more pages)
├── about.html        <- About / Bio page
├── config.js         <- EDIT THIS -- all configuration lives here
├── css/style.css
├── js/portfolio.js
└── images/
    ├── favicon.png      <- Browser tab icon
    ├── portrait.jpg     <- Portrait photo on the About page (optional)
    └── ...              <- Your photos go here
```

---

## config.js structure

```
PORTFOLIO_CONFIG
├── about    -- name, favicon, bio content, quotes, email, links
├── layout   -- padding, font sizes
├── defaults -- photo dimensions, gap, margins, paddings
└── pages    -- your photo pages, each with layout + photos/rows
```

---

## `about` -- personal info and about page content

```js
about: {
  name:    "Your Name",
  favicon: "images/favicon.png",

  // Bio rendered on the about page. Uses content blocks (see below).
  content: [
    { text: "Your bio.", style: "bodyText" },
    { text: "Second paragraph.", style: "bodyText" },
  ],

  // Random quote shown below the bio. Leave [] to hide.
  quotes: [
    { text: "A quote.", style: "infoQuote" },
  ],

  // padding* and margin* control spacing of the bio block on the about page.
  paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
  marginTop:  0, marginBottom:  0, marginLeft:  0, marginRight:  0,

  email: "",   // mailto: link -- leave "" to hide
  links: [
    { label: "Instagram", displayLink: "@handle", link: "https://instagram.com/handle" },
  ],
},
```

---

## `layout` -- page structure

```js
layout: {
  contentTopMargin: 0,   // space between navbar and content (px)
  pageSidePadding: 50,   // left/right outer padding (px)

  // Font sizes -- also used as "style" values in content blocks.
  fontSize: {
    navLinks:  15,
    pageTitle: 20,   // style: "pageTitle" -- always bold
    bodyText:  14,   // style: "bodyText"
    caption:   12,   // style: "caption"
    infoLinks: 14,
    infoQuote: 14,
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

Content blocks are used in inline text boxes (`photos` / `rows`) and in `about.content` / `about.quotes`.

```js
content: [
  { text: "Page title",         style: "pageTitle" },  // always bold
  { text: "Body text.\nLine 2", style: "bodyText"  },
  { text: "A small note.",      style: "caption"   },
]
```

| Property | Values | Default | Description |
|---|---|---|---|
| `text` | string | required | Text. Use `\n` for line breaks within a block. |
| `style` | `pageTitle` / `bodyText` / `caption` / `navLinks` / `infoLinks` / `infoQuote` | `bodyText` | Maps to `layout.fontSize`. `pageTitle` is always bold. |
| `bold` | true / false | false | Force bold on any style. |

CSS variable convention: each style maps to `--fs-{style}` (e.g. `pageTitle` → `--fs-pageTitle`). Adding a new key to `layout.fontSize` makes it available as a style automatically.

---

## Page properties

| Property | Type | Description |
|---|---|---|
| `id` | string | Must match the HTML filename (`page-2` → `page-2.html`). |
| `navLabel` | string | Text shown in the navigation bar. |
| `layout` | string | `"horizontal"` / `"vertical"` / `"grid"` |
| `contentAlign` | string | Horizontal: `"top"` / `"center"` / `"bottom"` (vertical alignment of items). Vertical/Grid: `"left"` / `"center"` / `"right"` (horizontal position of the block). |
| `maxWidth` | px | Grid only. Caps the grid width. Useful on wide screens. Omit for full-width. |

---

## Horizontal page

Photos scroll left to right.

```js
layout: "horizontal",
contentAlign: "center",   // "top" | "center" | "bottom"
photos: [
  { src: "images/photo.jpg", caption: "" },
  { src: "images/photo.jpg", h: 600, marginRight: 40 },
]
```

Per-photo overrides: `h`, `marginTop/Bottom/Left/Right`, `paddingTop/Bottom/Left/Right`.

---

## Vertical page

Photos stack top to bottom. Page scrolls vertically.

```js
layout: "vertical",
contentAlign: "center",   // "left" | "center" | "right"
photos: [
  { src: "images/photo.jpg" },
  { src: "images/photo.jpg", w: 0.6 },          // 60% of defaults.photoWidth
  { src: "images/photo.jpg", w: 400, h: 300 },  // fixed 400px wide, 300px tall
]
```

| Property | Type | Default | Description |
|---|---|---|---|
| `w` | 0–1 or px | `defaults.photoWidth` | `<= 1` = fraction of available width; `> 1` = explicit px |
| `h` | px | auto | Fixed height in px |
| `margin*` / `padding*` | px | from `defaults` | Spacing overrides |

---

## Grid page

Photos placed in explicit rows. Page scrolls vertically.

```js
layout: "grid",
contentAlign: "center",
maxWidth: 1400,
rows: [
  [ photo, photo, photo ],
  [ photo, photo ],
]
```

| Properties set | Behaviour |
|---|---|
| neither | Equal share of remaining row width, height auto |
| `w <= 1` only | Fraction of row width, height auto |
| `w > 1` only | Fixed px width, height auto |
| `h` only | Fixed height, width auto |
| `w` + `h` | Fixed width and height |

---

## Inline text boxes

Any item with a `content` array inside `photos` or `rows` is an inline text box -- no border, no background, text flows in the photo sequence.

```js
{
  content: [
    { text: "A title",   style: "pageTitle" },
    { text: "Body text", style: "bodyText"  },
  ],
  align:        "top",   // "top" | "center" | "bottom"
  paddingLeft:  20,
  paddingRight: 20,
  w:            0.33,    // width (same semantics as photos in each layout)
}
```

In horizontal layout, `w` is always px. In vertical and grid, `w` follows the same fraction/px rules as photos.

---

## Responsive behaviour

**Desktop** (pointer: mouse)
All three layouts work as configured. Horizontal scrolls left-to-right, vertical and grid scroll top-to-bottom.

**Touch devices** (phone, tablet -- `pointer: coarse` or `maxTouchPoints > 0`)
All layouts collapse to a vertical single-column flow regardless of orientation:
- Horizontal: photos stack vertically, full width, height auto.
- Vertical: photos full width, `w` overridden.
- Grid: 2 photos per row. Phones ≤ 600px: 1 photo per row.

Inline text boxes become full-width with auto height.

---

## Adding a new page

1. Add an entry to `pages[]` in `config.js`
2. Duplicate `page-2.html`, rename it (e.g. `page-4.html`)
3. Inside the new file, update: `const PAGE_ID = 'page-4'`

---

## Deployment

Upload the folder to any static host. No server-side processing required.
