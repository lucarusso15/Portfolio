/**
 * ============================================================
 *  PORTFOLIO -- config.js
 *  Edit this file to configure every aspect of the site.
 * ============================================================
 */
const PORTFOLIO_CONFIG = {

  // -- PERSONAL INFO --------------------------------------------
  photographer: {
    name:    "Luca Russo",
    city:    "Bologna, Italy",
    favicon: "images/favicon.png",

    bio: `Write your bio here. Talk about your work and your photographic vision.

You can use multiple paragraphs separated by a blank line.`,

    // email uses mailto: -- leave "" to hide it.
    // Each link entry: label (config-only), displayLink (shown), link (full URL).
    email: "",
    links: [
      { label: "Instagram", displayLink: "Instagram", link: "https://instagram.com/lucarusso15" },
      { label: "YouTube",   displayLink: "Youtube",   link: "https://www.youtube.com/@lucarusso15" },
      // { label: "Website", displayLink: "lucarusso.com", link: "https://lucarusso.com" },
    ],
  },

  // -- PAGE LAYOUT ----------------------------------------------
  layout: {
    contentTopMargin: 150,   // space between the navbar and the content (px)
    pageSidePadding:  50,    // left/right outer padding of every page (px)

    textColumnWidth:  200,   // default width of the left text column (px)
    textMarginRight:  40,    // default space between text column and photos (px)
    textMarginBottom: 0,     // default space below the text block (px)

    // Font sizes used across the site.
    // These names are also used as the "style" value in content blocks.
    fontSize: {
      navLinks:  15,
      pageTitle: 20,   // style: "pageTitle" -- always bold
      bodyText:  14,   // style: "bodyText"
      caption:   12,   // style: "caption"
      infoLinks: 14,
      infoQuote: 14,
    },
  },

  // -- ITEM DEFAULTS --------------------------------------------
  // Applied to every photo and text box unless overridden per-item.
  defaults: {
    photoHeight: 780,   // height (px) for horizontal layout photos
    photoWidth:  624,   // width  (px) for vertical layout photos
    photoGap:    10,    // gap between items (px) -- all layouts

    // Outer spacing -- moves the item relative to its neighbours.
    marginTop:    0,
    marginBottom: 0,
    marginLeft:   0,
    marginRight:  0,

    // Inner spacing for text boxes -- moves text away from box edges.
    // Has no effect on photos.
    paddingTop:    0,
    paddingBottom: 0,
    paddingLeft:   0,
    paddingRight:  0,
  },

  // -- INFO PAGE QUOTES -----------------------------------------
  quotes: [
    "Photography is the art of frozen time.",
    "Light is the photographer's paintbrush.",
    "Every photograph is a certificate of presence.",
    "A photograph is a secret about a secret.",
  ],

  // -- PHOTO PAGES ----------------------------------------------
  // The FIRST entry is the home page (index.html).
  // Each additional page needs its own HTML file (page-2.html, etc.).
  //
  // navLabel  -- text shown in the navigation bar for this page.
  //
  // LAYOUTS
  //   "horizontal" -- photos scroll left to right; text column on the left.
  //   "vertical"   -- photos stack top to bottom; text column on the left.
  //   "grid"       -- photos in explicit rows;     text column on the left.
  //
  // TEXT COLUMN
  //   textColumn: false
  //     Hides the column. Photos fill the full width from the left edge.
  //
  //   textColumn: { content: [...], width?, paddingRight?, paddingBottom? }
  //     Renders a content block array in the left column.
  //     width / paddingRight / paddingBottom override the global defaults.
  //
  //   textColumn: (omitted) | {}
  //     No content -- column is hidden (same as false).
  //
  // CONTENT BLOCKS (used in textColumn.content and inline text boxes)
  //   { text: "...", style: "pageTitle" | "bodyText" | "caption" | "navLinks" }
  //   style maps to layout.fontSize values. pageTitle is always bold.
  //   Add bold: true to force bold on any other style.
  //   Use \n for line breaks within a block.
  //
  // INLINE TEXT BOXES (inside photos / rows)
  //   Any item with a "content" array is an inline text box in the photo flow.
  //   align: "top" | "center" | "bottom"
  //   padding* overrides defaults; w / h / margin* work like photos.
  //
  pages: [
    {
      id:       "page-1",
      navLabel: "Page 1",
      layout:   "horizontal",

      //textColumn: {
        //content: [
          //{ text: "Page 1",                style: "pageTitle" },
          //{ text: "Introductory text here.\nDescribe the project.", style: "bodyText" },
          //{ text: "Test caption", style: "caption" },
        //],
        // width:         200,   // override column width for this page (px)
        // paddingRight:   40,   // override gap between column and photos (px)
        // paddingBottom:   0,   // override bottom spacing (px)
      //},

      photos: [
        { src: "images/image_001.JPG", caption: "" },
        { src: "images/image_002.JPG", caption: "" },
        // Inline text box example -- remove // to activate:
        {
          content: [
            { text: "Page 1",         style: "pageTitle" },
            { text: "Introductory text here.", style: "bodyText"  },
            { text: "Describe the project.", style: "bodyText"   },
          ],
          align: "top",
          w: 200, 
          paddingLeft: 30,
          paddingRight: 30, 
          paddingTop:30, 
          paddingBottom: 30
        },
        { src: "images/image_003.JPG", caption: "" },
        { src: "images/image_004.JPG", caption: "" },
      ],
    },
    {
      id:       "page-2",
      navLabel: "Page 2",
      layout:   "vertical",

      textColumn: {
        content: [
          { text: "Page 2",      style: "pageTitle" },
          { text: "Photos stack vertically.", style: "bodyText" },
        ],
      },

      photos: [
        { src: "images/image_001.JPG", caption: "" },
        { src: "images/image_002.JPG", caption: "" },
        // Inline text box example:
        // {
        //   content: [{ text: "A note here.", style: "bodyText" }],
        //   align: "top", w: 0.5, paddingTop: 20,
        // },
        { src: "images/image_003.JPG", caption: "" },
        { src: "images/image_004.JPG", caption: "" },
      ],
    },
    {
      id:       "page-3",
      navLabel: "Page 3",
      layout:   "grid",

      textColumn: {
        content: [
          { text: "Page 3", style: "pageTitle" },
          { text: "Photos stack vertically.", style: "bodyText" },
        ],
      },

      rows: [
        [
          { src: "images/image_001.JPG", caption: "", h: 780 },
          { src: "images/image_002.JPG", caption: "", h: 780 },
        ],
        // Inline text box next to a photo:
        // [
        //   {
        //     content: [{ text: "A note.", style: "bodyText" }],
        //     align: "bottom", w: 0.4, h: 780, paddingLeft: 20,
        //   },
        //   { src: "images/image_003.JPG", caption: "", w: 0.6, h: 780 },
        // ],
        [
          { src: "images/image_003.JPG", caption: "", h: 780 },
          { src: "images/image_004.JPG", caption: "", h: 780 },
        ],
      ],
    },
  ],

};
