/**
 * ============================================================
 *  PORTFOLIO -- config.js
 *  Edit this file to configure every aspect of the site.
 * ============================================================
 */
const PORTFOLIO_CONFIG = {

  // -- ABOUT PAGE -----------------------------------------------
  about: {
    name:    "Luca Russo",
    favicon: "images/favicon.png",

    // Bio text shown on the about page.
    // Uses the same content block format as inline text boxes:
    //   { text: "...", style: "bodyText" | "pageTitle" | "caption" | "infoQuote" | ... }
    //   bold: true forces bold on any style. pageTitle is always bold.
    content: [
      { text: "Write your bio here. Talk about your work and your photographic vision.", style: "bodyText" },
      { text: "You can use multiple blocks to separate paragraphs.", style: "bodyText" },
    ],

    // Quotes shown randomly below the bio. Leave empty [] to hide.
    // Each quote uses the same content block format as bio content.
    quotes: [
      { text: "Ciao.", style: "infoQuote", bold: true },
      { text: "Ciao.", style: "infoQuote", bold: true },
    ],

    // email uses mailto: -- leave "" to hide it.
    // Each link entry: label (config-only), displayLink (shown), link (full URL).
    email: "",
    links: [
      { label: "Instagram", displayLink: "Instagram", link: "https://instagram.com/lucarusso15" },
      { label: "YouTube",   displayLink: "Youtube",   link: "https://www.youtube.com/@lucarusso15" },
      // { label: "Website", displayLink: "lucarusso.com", link: "https://lucarusso.com" },
    ],

    marginTop: 50,
  },

  // -- PAGE LAYOUT ----------------------------------------------
  layout: {
    contentTopMargin: 0,     // space between the navbar and the content (px)
    pageSidePadding:  50,    // left/right outer padding of every page (px)

    // Font sizes used across the site.
    // These names are also used as the "style" value in content blocks.
    fontSize: {
      navLinks:  15,
      pageTitle: 20,   // style: "pageTitle" -- always bold
      bodyText:  14,   // style: "bodyText"
      caption:   12,   // style: "caption"
      infoLinks: 14,
      infoQuote: 20,
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

  // -- PHOTO PAGES ----------------------------------------------
  // The FIRST entry is the home page (index.html).
  // Each additional page needs its own HTML file (page-2.html, etc.).
  //
  // navLabel  -- text shown in the navigation bar for this page.
  //
  // CONTENT ALIGNMENT
  //   Horizontal layout -- controls vertical alignment of items:
  //     contentAlign: "top"     -- default, items align to the top
  //     contentAlign: "center"  -- items centered vertically
  //     contentAlign: "bottom"  -- items align to the bottom
  //
  //   Vertical and grid layouts -- controls horizontal position of the block:
  //     contentAlign: "left"    -- default, content starts from the left
  //     contentAlign: "center"  -- content centered in the page
  //     contentAlign: "right"   -- content pushed to the right
  //     When photos have no explicit w, they use defaults.photoWidth.
  //
  // LAYOUTS
  //   "horizontal" -- photos scroll left to right.
  //   "vertical"   -- photos stack top to bottom.
  //   "grid"       -- photos in explicit rows.
  //
  // MAX WIDTH (grid only)
  //   maxWidth: 1400   -- caps the grid width in px; omit for full-width.
  //
  // W PROPERTY
  //   In vertical and grid layouts, w accepts both pixels and fractions:
  //     w <= 1  fraction of available space  (e.g. 0.5 = 50% of column/row)
  //     w >  1  explicit pixel width         (e.g. 300 = 300px fixed)
  //   In horizontal layout, w on text boxes is always px.
  //   Omitting w: photos use defaults.photoWidth (vertical) or share equally (grid).
  //
  // TEXT COLUMN -- removed. Use inline text boxes in the photo/row sequence instead.
  //
  // CONTENT BLOCKS (used in inline text boxes and about.content)
  //   { text: "...", style: "pageTitle" | "bodyText" | "caption" | "navLinks" | "infoLinks" | "infoQuote" }
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
      contentAlign: "center",

      photos: [
        { src: "images/image_001.JPG", caption: "" },
        { src: "images/image_002.JPG", caption: "" },
        // Inline text box example -- remove // to activate:
        {
          content: [
            { text: "Title", style: "pageTitle" },
            { text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", style: "bodyText"  }, 
            { text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", style: "bodyText"  }
          ],
          align: "top",
          w: 624, 
          paddingLeft: 30,
          paddingRight: 30, 
          paddingTop: 0, 
          paddingBottom: 30
        },
        { src: "images/image_003.JPG", caption: "" },
        { src: "images/image_004.JPG", caption: "" },
        { src: "images/image_001.JPG", caption: "" },
        { src: "images/image_002.JPG", caption: "" },
        { src: "images/image_003.JPG", caption: "" },
        { src: "images/image_004.JPG", caption: ""},
      ],
    },
    {
      id:       "page-2",
      navLabel: "Page 2",
      layout:   "vertical",
      contentAlign: "center",

      photos: [
        {
          content: [
            { text: "Title", style: "pageTitle" },
            { text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", style: "bodyText" },
            { text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", style: "bodyText" }
          ],
          align: "center",
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 0,
          paddingBottom: 30,
        },
        { src: "images/image_001.JPG", caption: "" },
        { src: "images/image_002.JPG", caption: "" },
        { src: "images/image_003.JPG", caption: "" },
        { src: "images/image_004.JPG", caption: "" },
        { src: "images/image_001.JPG", caption: "" },
        { src: "images/image_002.JPG", caption: "" },
        { src: "images/image_003.JPG", caption: "" },
        { src: "images/image_004.JPG", caption: "" },
      ],
    },
    {
      id:       "page-3",
      navLabel: "Page 3",
      layout:   "grid",
      contentAlign: "center",

      rows: [
        [
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
        ],
        [
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
        ],
        [
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
        ],
        [
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
        ],
        [
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
        ],
        [
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
        ],
        [
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_002.JPG", caption: "" },
          { src: "images/image_003.JPG", caption: "" },
          { src: "images/image_001.JPG", caption: "" },
          { src: "images/image_004.JPG", caption: "" },
        ],
      ],
    },
  ],

};
