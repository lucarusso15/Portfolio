/**
 * ============================================================
 *  PORTFOLIO — config.js
 *  Edit this file to configure every aspect of the site.
 * ============================================================
 */
const PORTFOLIO_CONFIG = {

  // ── PERSONAL INFO ────────────────────────────────────────────
  photographer: {
    name:    "Luca Russo",
    city:    "Bologna, Italy",
    favicon: "images/favicon.png",   // browser tab icon — path to any image file

    bio: `Write your bio here. Talk about your work and your photographic vision.

You can use multiple paragraphs separated by a blank line.`,

    // Contact & social links shown on the Info page.
    // email uses mailto: — leave "" to hide it.
    // links: each entry has label (config-only), displayLink (text shown), link (full URL).
    // Comment out or remove entries to hide them.
    email: "",
    links: [
      { label: "Instagram", displayLink: "Instagram",  link: "https://instagram.com/lucarusso15" },
      { label: "YouTube",   displayLink: "Youtube",  link: "https://www.youtube.com/@lucarusso15" },
      // { label: "Website",   displayLink: "lucarusso.com", link: "https://lucarusso.com" },
    ],
  },

  // ── PAGE LAYOUT ──────────────────────────────────────────────
  layout: {
    contentTopMargin: 150,   // space between the navbar and the content (px)
    pageSidePadding:  50,    // left/right outer padding of every page (px)

    textColumnWidth:  200,   // width of the text column (px)
    textMarginRight:  40,    // space between text column and photos (px)
    textMarginBottom: 0,     // extra space below the text block (px)

    fontSize: {
      navLinks:    15,
      seriesTitle: 20,
      bodyText:    14,
      caption:     12,
      infoLinks:   14,
      infoQuote:   14,   // font size of the random phrase on the Info page (px)
    },
  },

  // ── PHOTO DEFAULTS ───────────────────────────────────────────
  // Applied to every photo in every layout unless overridden per-photo.
  defaults: {
    photoHeight: 780,   // height (px) for horizontal layout
    photoWidth:  624,   // width (px) for vertical layout photos — like photoHeight
    photoGap:    10,    // gap between photos (px) — all layouts
    marginTop:    0,
    marginBottom: 0,
    marginLeft:   0,
    marginRight:  0,
  },

  // ── INFO PAGE QUOTES ─────────────────────────────────────────
  // One of these is picked at random and shown centered on the Info page.
  // You can add or remove entries freely.
  quotes: [
    "Photography is the art of frozen time.",
    "Light is the photographer's paintbrush.",
    "Every photograph is a certificate of presence.",
    "A photograph is a secret about a secret.",
  ],

  // ── PHOTO SERIES ─────────────────────────────────────────────
  // The FIRST series is the home page (index.html).
  // Each additional series needs its own HTML file (series-2.html, etc.).
  //
  // layout: "horizontal"
  //   Desktop: text left, photos scroll left → right.
  //   Mobile/tablet portrait (≤ 900px): automatically stacks vertically.
  //   Per-photo: h, marginTop, marginBottom, marginLeft, marginRight.
  //
  // layout: "vertical"
  //   Text left, photos stack top → bottom, normal vertical scroll.
  //   Works well on all screen sizes without changes.
  //   Per-photo:
  //     w  — width as fraction of the photos column (0–1). Default: 1 (full width).
  //     h  — height in px, crops the image. Omit for natural ratio.
  //     marginTop, marginBottom, marginLeft, marginRight.
  //
  // layout: "grid"
  //   Text left, photos placed in rows you define manually.
  //   Tablet (≤ 900px): 2 photos per row. Mobile (≤ 767px): 1 photo per row.
  //   Per-photo:
  //     w  — fraction of the row (0–1). Photos without w share remaining space.
  //     h  — height in px. With w: cropped. Without w: auto width from ratio.
  //     marginTop, marginBottom, marginLeft, marginRight.
  //
  series: [
    {
      id:     "series-1",
      title:  "Series 1",
      layout: "horizontal",
      intro: `Introductory text for the first series. Describe the project: where, when and why.

You can write multiple paragraphs. The text stays on the left, photos scroll to the right.`,
      photos: [
        { src: "images/DSCF0223.JPG",  caption: "" },
        { src: "images/DSCF0333.JPG", caption: "" },
        { src: "images/DSCF0275.JPG", caption: "" },
        { src: "images/DSCF0379.JPG",  caption: "" } 
      ],
    },
    {
      id:     "series-2",
      title:  "Series 2",
      layout: "vertical",
      intro: `Introductory text for the second series. The photos are stacked vertically and the page scrolls normally.`,
      photos: [
        { src: "images/DSCF0223.JPG",  caption: "" },
        { src: "images/DSCF0333.JPG", caption: "" },
        { src: "images/DSCF0275.JPG", caption: "" },
        { src: "images/DSCF0379.JPG",  caption: "" }
      ],
    },
    {
      id:     "series-3",
      title:  "Series 3",
      layout: "grid",
      intro: `Introductory text for the third series.`, 
      rows: [
        [
          { src: "images/DSCF0223.JPG",  caption: "", h: 780 },
          { src: "images/DSCF0333.JPG", caption: "", h: 780 }
        ],
        [
          { src: "images/DSCF0275.JPG", caption: "", h: 780 },
          { src: "images/DSCF0379.JPG",  caption: "", h: 780 }
        ]
      ],
    },
  ],

};
