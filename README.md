# Portfolio

A minimal static portfolio site — no server, no build tools, no dependencies.
Works on any static host (Netlify, Vercel, Cloudflare Pages, shared hosting, etc.).

---

## File structure

```
portfolio/
├── index.html       ← Home = Series 1
├── series-2.html    ← Series 2
├── series-3.html    ← Series 3  (duplicate for more)
├── about.html       ← Info / Bio page
├── config.js        ← EDIT THIS — all configuration lives here
├── css/style.css
├── js/portfolio.js
└── images/
    ├── favicon.png                ← Browser tab icon (generated square, replace freely)
    ├── portrait.jpg               ← Your portrait on the Info page (optional)
    ├── placeholder-landscape.jpg  ← Grey placeholder 5:4
    ├── placeholder-portrait.jpg   ← Grey placeholder 4:5
    └── ...                        ← Your photos go here
```

---

## config.js structure

```
PORTFOLIO_CONFIG
├── photographer  — name, bio, favicon, email, links[]
├── layout        — page structure, text column, font sizes
├── defaults      — photo height/width, gap, margins (global, overridable per-photo)
├── quotes        — random phrases shown on the Info page
└── series        — your photo series, each with layout + photos/rows
```

---

## `photographer` — personal info

```js
photographer: {
  name:    "Your Name",
  city:    "City, Country",
  favicon: "images/favicon.png",   // browser tab icon — any image path

  bio: `Your bio here.

  Separate paragraphs with a blank line.`,

  email: "",   // shown as a mailto: link — leave "" to hide

  // Social / website links.
  // label   — for your reference in the config only (not displayed)
  // displayLink — the text shown as the clickable link
  // link    — the full URL (must start with https://)
  links: [
    { label: "Instagram", displayLink: "@yourhandle",  link: "https://instagram.com/yourhandle" },
    { label: "YouTube",   displayLink: "@yourhandle",  link: "https://www.youtube.com/@yourhandle" },
    { label: "Website",   displayLink: "yoursite.com", link: "https://yoursite.com" },
  ],
},
```

Each entry in `links` is only shown if it is present (not commented out). To hide a link, comment it out or delete the line.

---

## `layout` — page structure

```js
layout: {
  contentTopMargin: 150,   // space between navbar and content (px) — desktop only
  pageSidePadding:  50,    // left/right outer padding of every page (px)

  textColumnWidth:  200,   // width of the left text column (px)
  textMarginRight:  40,    // space between text column and photos (px)
  textMarginBottom: 0,     // extra space below the text block (px)

  fontSize: {
    navLinks:    15,   // navigation links (px)
    seriesTitle: 20,   // series title heading (px)
    bodyText:    14,   // intro / bio text (px)
    caption:     12,   // photo captions (px)
    infoLinks:   14,   // links on the Info page (px)
    infoQuote:   22,   // random phrase on the Info page (px)
  },
},
```

> `contentTopMargin` is automatically reduced to 10px on touch devices
> so photos fill the viewport without vertical scrolling.

---

## `defaults` — global photo settings

```js
defaults: {
  photoHeight: 780,  // height (px) for horizontal layout
  photoWidth: 1000,  // default width (px) for vertical layout photos
  photoGap:    18,   // gap between photos in all layouts (px)
  marginTop:    0,
  marginBottom: 0,
  marginLeft:   0,
  marginRight:  0,
},
```

---

## `quotes` — random phrase on the Info page

One phrase is picked at random each time the Info page loads.
It appears centered below the bio block.

```js
quotes: [
  "Photography is the art of frozen time.",
  "Light is the photographer's paintbrush.",
],
```

---

## Horizontal series

Photos scroll left → right. Text is fixed on the left.

**Responsive behaviour:**
- Touch portrait (phone/tablet upright): text above, photos stack vertically
- Touch landscape (phone/tablet sideways): photos scale to exactly fill viewport height

```js
layout: "horizontal",
photos: [
  { src: "images/photo.jpg", caption: "" },
  { src: "images/photo.jpg", h: 600, marginRight: 40 },
]
```

Per-photo overrides: `h`, `marginTop`, `marginBottom`, `marginLeft`, `marginRight`.

---

## Vertical series

Photos stack top → bottom. Page scrolls normally.

**Responsive behaviour:**
- Touch portrait: text above, photos fill full width
- Touch landscape: photos fill screen width

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
| `w` | 0–1 | 1 | Width as fraction of photos column |
| `h` | px | auto | Height in px — crops the image |
| `marginTop/Bottom/Left/Right` | px | from `defaults` | Spacing |

---

## Grid series

Photos placed in rows you define. Page scrolls vertically.

**Responsive behaviour:**
- Touch landscape: text above, rows fill screen width side-by-side
- Touch portrait: text above, 2 photos per row
- Phone portrait (≤ 640px): 1 photo per row

```js
layout: "grid",
rows: [
  [ photo, photo, photo ],
  [ photo, photo ],
]
```

| Properties set | Behaviour |
|---|---|
| `h` only | Fixed height, width auto — no crop |
| `w` only | Fills `w` fraction of row, height auto — no crop |
| `h` + `w` | Fills `w` fraction, cropped to `h` |
| neither | Equal share, height auto — no crop |

`w` is 0–1 (`0.5` = 50%, `0.33` = 33%).

---

## Adding a new series

1. Add an entry to `series` in `config.js`
2. Duplicate `series-2.html`, rename (e.g. `series-4.html`)
3. Inside the new file, update the series index:
   `PORTFOLIO_CONFIG.series[1]` → `PORTFOLIO_CONFIG.series[3]`

---

## Deployment

Upload the `portfolio/` folder to any static host.
No server-side processing required — pure HTML, CSS, JavaScript.
