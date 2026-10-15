/* =========================================================
   KARAJILLO & CO. — SITE DATA
   Everything the page shows lives here. Edit this file to
   change copy, menu items, links, or to ADD GALLERY PHOTOS.
   ========================================================= */

window.SITE = {
  name: "Karajillo & Co.",
  tagline: "Coffee & Cantina",
  description:
    "A Latin-inspired coffee and cocktail lounge in downtown Reno. Handcrafted espresso by day, Carajillos and craft cocktails by night.",
  address: {
    line1: "50 N Sierra Street, Suite 102A",
    city: "Reno",
    state: "NV",
    zip: "89501",
    note: "On the Truckee Riverwalk, downtown Reno"
  },
  phone: "775-221-7598",
  hours: { label: "Open daily, 7am to 11pm", open: 7, close: 23, tz: "America/Los_Angeles" },
  // The hour the site flips from Café (day) to Cantina (night) by default.
  nightStartsAt: 17,
  links: {
    website: "https://karajillocafe.com/",
    instagram: "https://www.instagram.com/karajillocafe/",
    instagramHandle: "@karajillocafe",
    yelp: "https://www.yelp.com/biz/karajillo-and-co-reno",
    yelpWriteReview: "https://www.yelp.com/writeareview/biz/karajillo-and-co-reno",
    maps: "https://www.google.com/maps/search/?api=1&query=Karajillo+%26+Co+50+N+Sierra+St+Reno+NV+89501",
    mapsEmbed: "https://maps.google.com/maps?q=50%20N%20Sierra%20St%2C%20Reno%2C%20NV%2089501&z=16&output=embed"
  }
};

/* ---------------- MENU ----------------
   Source: karajillocafe.com/menu (October 2026).
   No prices are published on the current site, so none are shown.
   Add  price: "$6"  to any item and it will render automatically. */
window.MENU = {
  cafe: {
    title: "Café",
    intro: "Handcrafted coffee and espresso, poured from 7am.",
    groups: [
      { name: "K-Brewed", items: [{ name: "Drip Coffee" }, { name: "Cold Brew", tags: ["bold", "bright"] }] },
      {
        name: "Espresso based",
        items: [
          { name: "Espresso Shot", tags: ["bold"] },
          { name: "Bold Americano", tags: ["bold"] },
          { name: "Cortado Fuerte", tags: ["bold"] },
          { name: "Macchiato Cafe" },
          { name: "Foamy Cappuccino" }
        ]
      },
      {
        name: "Especiales de Karajillo",
        featured: true,
        items: [
          { name: "Karajillo Picante Mocha", tags: ["spicy", "sweet"] },
          { name: "Mexican Piloncillo Latte", tags: ["sweet"] },
          { name: "Dulce de Leche Latte", tags: ["sweet"] }
        ]
      },
      {
        name: "Café con crema",
        items: [
          { name: "Cafe Latte" },
          { name: "Vanilla Latte", tags: ["sweet"] },
          { name: "Caramel Macchiato", tags: ["sweet"] },
          { name: "Dark Chocolate Mocha", tags: ["sweet", "bold"] },
          { name: "White Chocolate Mocha", tags: ["sweet"] }
        ]
      }
    ]
  },
  cantina: {
    title: "Cantina",
    intro: "Espresso cocktails and Latin-inspired drinks into the night.",
    groups: [
      {
        name: "Cocktails",
        items: [
          { name: "Karajillo", detail: "Licor 43, espresso, tequila, banana foam", signature: true, tags: ["bold", "sweet"] },
          { name: "Carajillo", detail: "Licor 43, espresso", signature: true, tags: ["bold"] },
          { name: "Leche Clara", detail: "Diplomático, toasted rice, cinnamon, anise, almond milk", tags: ["sweet"] },
          { name: "Maíz y Sol", detail: "Bourbon, nixta, cinnamon, masa, lemon", tags: ["bold", "bright"] },
          { name: "Coco Margarita", detail: "Tequila, coconut, orange, lime", tags: ["bright"] },
          { name: "Flor de Jamaica", detail: "Tequila, jamaica, guava, Ramazzotti, lime", tags: ["bright"] }
        ]
      }
    ]
  }
};

/* ---------------- GALLERY ----------------
   To add a photo:
   1. Drop the file in /images  (WebP or JPG, ~1600px on the long side is ideal)
   2. Add a line below.
      shape: "tall" | "wide" | "square" | "big"  (controls the grid span)
      tag:   "drinks" | "bar" | "room"           (controls the filter chips)
   ------------------------------------------ */
window.GALLERY = [
  { src: "images/backbar-gold.webp", alt: "Gold-lit back bar lined with tequila, mezcal and whiskey bottles, with a library ladder", shape: "big", tag: "bar" },
  { src: "images/iced-karajillo-foam.webp", alt: "Iced espresso cocktail in a rocks glass topped with thick foam", shape: "tall", tag: "drinks" },
  { src: "images/cortado-rosetta.webp", alt: "Cortado with tulip latte art in a black-rimmed glass", shape: "tall", tag: "drinks" },
  { src: "images/golden-ram-wall.webp", alt: "Golden ram head mounted beside the Karajillo & Co. Coffee & Cantina sign", shape: "tall", tag: "room" },
  { src: "images/two-lattes.webp", alt: "Two lattes with rosetta art in sage-green ceramic cups", shape: "wide", tag: "drinks" },
  { src: "images/lounge-window-seats.webp", alt: "Leather lounge chairs by tall windows over a black and white checkered floor", shape: "tall", tag: "room" },
  { src: "images/latte-at-the-bar.webp", alt: "Latte with leaf art on the wooden bar, cinnamon sticks and the backbar behind", shape: "tall", tag: "drinks" },
  { src: "images/baristas-behind-bar.webp", alt: "Baristas working behind the bar under floor-to-ceiling bottle shelves", shape: "tall", tag: "bar" },
  { src: "images/iced-latte-hobnail.webp", alt: "Iced latte in a hobnail glass in front of a mustard leather chair", shape: "tall", tag: "drinks" },
  { src: "images/counter-and-poster.webp", alt: "Sage cabinet counter, hexagon tile and a skull artwork beside the espresso bar", shape: "tall", tag: "room" },
  { src: "images/work-from-the-lounge.webp", alt: "Laptops on a long table with an iced latte, lounge shelves in the background", shape: "wide", tag: "room" }
];

/* ---------------- DRINK FINDER ----------------
   Rule-based matcher. It only recommends real menu items. */
window.FINDER = {
  when: [
    { id: "morning", label: "Morning" },
    { id: "afternoon", label: "Afternoon" },
    { id: "night", label: "Night out" }
  ],
  mood: [
    { id: "sweet", label: "Something sweet" },
    { id: "bold", label: "Strong and bold" },
    { id: "spicy", label: "A little heat" },
    { id: "bright", label: "Bright and fresh" }
  ]
};
