/* ==========================================================================
   Edenseek — STORE PRODUCT CONFIGURATION (single source of truth for commerce)

   This is the ONE place store products and their purchase links are defined.
   Store cards and purchase buttons read from here (window.EDEN_STORE) — Stripe
   links must NEVER be hardcoded into page components. Loaded as a plain
   <script defer> (no fetch/CORS), like /data/edenseek-data.js.

   ---- HOW THE BUTTON BEHAVES ON THE CURRENT STATIC WEBSITE --------------------
   For each product, /js/edenseek.js decides the button as follows:
     • available === true  AND  stripePaymentLink is non-empty  → "Buy Now"
       (a real link that opens the Stripe-hosted checkout in the SAME tab).
     • available === true  but  stripePaymentLink is blank       → "Coming Soon".
     • available === false                                        → "Coming Soon".

   ---- FIELD NOTES ------------------------------------------------------------
     slug              Stable id. For issues it is "<series-slug>-<number>"
                       (e.g. "i-ride-for-them-1") so the renderer can match a
                       rendered issue to its product.
     title             Product name shown on the card.
     subtitle          Individual issue/book description (from the Stripe catalog).
     category          Top-level grouping, e.g. "Comics", "Children's Books".
     format            Product type / format, e.g. 'Printed Book (8.5" x 11" Hardcover)'.
     available         Whether the product is released/purchasable.
     priceLabel        Human-readable price shown on the card (e.g. "$21.99").
     coverImage        Path to an EXISTING cover asset (webp). "" if none yet.

     shipping          Manual-fulfillment metadata — shipping terms.
     fulfillment       Manual-fulfillment metadata — how the order is fulfilled.
                       These preserve the IngramSpark Print-on-Demand (POD) process:
                       orders are fulfilled manually via IngramSpark POD, NOT by an
                       automated backend. Kept in the config so the POD workflow
                       stays documented alongside each product.

     stripePaymentLink USED NOW. On the current static website this is the live
                       Stripe Payment Link the "Buy Now" button opens. Leave it
                       "" until a real Payment Link exists (button stays
                       "Coming Soon").
     stripeProductId   RESERVED FOR THE FUTURE Edenseek platform checkout.
     stripePriceId     RESERVED FOR THE FUTURE Edenseek platform checkout.
                       These two are NOT used by the static site today. They are
                       kept here so that when the Edenseek platform ships its
                       server-driven checkout (Stripe Checkout Sessions), the
                       product catalog is already wired — no schema change needed.

   Payment Links and per-item descriptions are taken verbatim from
   /payments/stripe_payment_links.txt. Store / purchase inquiries route to
   derek@edenseek.com.
   ========================================================================== */
window.EDEN_STORE = {
  contactEmail: "derek@edenseek.com",

  products: [
    /* ---------------------------- Comics: I Ride for Them -------------------- */
    {
      slug: "i-ride-for-them-1",
      title: "I Ride for Them #1",
      subtitle: "Ava, a brilliant but troubled tech founder, creates the Birthplace and its AI caretaker, Joy, to protect the children within it. But as Ava’s past resurfaces and the system begins to reveal its deeper purpose, a story of technology, trauma, and protection begins.",
      category: "Comics",
      format: "Printed Book (8.5\" x 11\" Hardcover)",
      available: true,
      priceLabel: "$5.99",
      coverImage: "/assets/covers/i-ride-for-them-01-cover-800w.webp",
      shipping: "Standard U.S. Shipping ($5.99)",
      fulfillment: "IngramSpark Print-on-Demand",
      stripePaymentLink: "https://buy.stripe.com/eVqdRbdxg2Ma8Sse4P1Nu07",
      stripeProductId: "",   // reserved for the future Edenseek platform checkout
      stripePriceId: ""      // reserved for the future Edenseek platform checkout
    },
    {
      slug: "i-ride-for-them-2",
      title: "I Ride for Them #2",
      subtitle: "Hunted through the virtual world, Joy fights for the children in her care.",
      category: "Comics",
      format: "Printed Book (8.5\" x 11\" Hardcover)",
      available: true,
      priceLabel: "$5.99",
      coverImage: "/assets/covers/i-ride-for-them-02-cover-800w.webp",
      shipping: "Standard U.S. Shipping ($5.99)",
      fulfillment: "IngramSpark Print-on-Demand",
      stripePaymentLink: "https://buy.stripe.com/4gM4gB0Ku5YmfgQ5yj1Nu08",
      stripeProductId: "",
      stripePriceId: ""
    },

    /* ---------------------------- Comics: Society of Killers ----------------- */
    {
      slug: "society-of-killers-1",
      title: "Society of Killers #1",
      subtitle: "The Society of Killers targets its newest round of recruits.",
      category: "Comics",
      format: "Printed Book (8.5\" x 11\" Hardcover)",
      available: true,
      priceLabel: "$5.99",
      coverImage: "/assets/covers/society-of-killers-01-cover-800w.webp",
      shipping: "Standard U.S. Shipping ($5.99)",
      fulfillment: "IngramSpark Print-on-Demand",
      stripePaymentLink: "https://buy.stripe.com/28EdRbeBkgD0ecMgcX1Nu09",
      stripeProductId: "",
      stripePriceId: ""
    },
    {
      slug: "society-of-killers-2",
      title: "Society of Killers #2",
      subtitle: "Inside the Kellerman Institute, a new class of subjects begins its training.",
      category: "Comics",
      format: "Printed Book (8.5\" x 11\" Hardcover)",
      available: true,
      priceLabel: "$5.99",
      coverImage: "/assets/covers/society-of-killers-02-cover-800w.webp",
      shipping: "Standard U.S. Shipping ($5.99)",
      fulfillment: "IngramSpark Print-on-Demand",
      stripePaymentLink: "https://buy.stripe.com/dRm8wR9h0fyW8Ss7Gr1Nu0a",
      stripeProductId: "",
      stripePriceId: ""
    },

    /* ---------------------- Children's Books: Egypt the Cat ------------------ */
    {
      slug: "egypt-the-cat-1",
      title: "Egypt the Cat in Magic! Magic! Magic!",
      subtitle: "Egypt is a cool cat, and he's a little bit different. He doesn't let that stop him from being who he is and seeing the world in his own wonderful way. In this first adventure, Egypt and Ness, accidently discover how to perform a very exciting magic trick together as a result of some very unexpected and surprising events.",
      category: "Children's Books",
      format: "Printed Book",
      available: true,
      priceLabel: "$21.99",
      coverImage: "/assets/covers/egypt-the-cat-01-cover-800w.webp",
      shipping: "Standard U.S. Shipping ($5.99)",
      fulfillment: "IngramSpark Print-on-Demand",
      stripePaymentLink: "https://buy.stripe.com/28E00l9h03Qe0lW2m71Nu00",
      stripeProductId: "prod_UpXmN6Ua3SZu6o",   // first live Stripe product
      stripePriceId: ""
    },
    {
      slug: "egypt-the-cat-2",
      title: "Egypt the Cat in Dance Maniac",
      subtitle: "In this adventure, Ness with Egypt's help, learns that a good attitude can transform even a boring chore into a magical experience.",
      category: "Children's Books",
      format: "Printed Book (8.5\" x 11\" Hardcover)",
      available: true,
      priceLabel: "$21.99",
      coverImage: "/assets/covers/egypt-the-cat-02-cover-800w.webp",
      shipping: "Standard U.S. Shipping ($5.99)",
      fulfillment: "IngramSpark Print-on-Demand",
      stripePaymentLink: "https://buy.stripe.com/bJe6oJal49ayfgQ0dZ1Nu02",
      stripeProductId: "",
      stripePriceId: ""
    },
    {
      slug: "egypt-the-cat-3",
      title: "Egypt the Cat Leaves Los Angeles",
      subtitle: "In this adventure, Ness and Egypt move across the country and experience their first plane trip and an incredible journey.",
      category: "Children's Books",
      format: "Printed Book (8.5\" x 11\" Hardcover)",
      available: true,
      priceLabel: "$21.99",
      coverImage: "/assets/covers/egypt-the-cat-03-cover-800w.webp",
      shipping: "Standard U.S. Shipping ($5.99)",
      fulfillment: "IngramSpark Print-on-Demand",
      stripePaymentLink: "https://buy.stripe.com/3cI9AV50K5Ym1q0f8T1Nu03",
      stripeProductId: "",
      stripePriceId: ""
    },
    {
      slug: "egypt-the-cat-4",
      title: "Egypt the Cat in Time",
      subtitle: "In this adventure, Ness and Egypt accidently travel through time and get to know themselves better than they could ever imagine.",
      category: "Children's Books",
      format: "Printed Book (8.5\" x 11\" Hardcover)",
      available: true,
      priceLabel: "$21.99",
      coverImage: "/assets/covers/egypt-the-cat-04-cover-800w.webp",
      shipping: "Standard U.S. Shipping ($5.99)",
      fulfillment: "IngramSpark Print-on-Demand",
      stripePaymentLink: "https://buy.stripe.com/fZudRbgJscmK1q04uf1Nu05",
      stripeProductId: "",
      stripePriceId: ""
    },
    {
      slug: "egypt-the-cat-5",
      title: "Egypt the Cat in the Future",
      subtitle: "The exciting sequel to Egypt the Cat in Time. A simple repair in the future becomes a thrilling adventure across time as Ness and Egypt race to stop history from unraveling. A heartwarming children's story about friendship, courage, and the power of every choice.",
      category: "Children's Books",
      format: "Printed Book (8.5\" x 11\" Hardcover)",
      available: true,
      priceLabel: "$21.99",
      coverImage: "/assets/covers/egypt-the-cat-05-cover-800w.webp",
      shipping: "Standard U.S. Shipping ($5.99)",
      fulfillment: "IngramSpark Print-on-Demand",
      stripePaymentLink: "https://buy.stripe.com/9B69AVbp8aeCgkU8Kv1Nu06",
      stripeProductId: "",
      stripePriceId: ""
    },

    /* ------------------------------- Comics: Caelaris ----------------------- */
    {
      slug: "caelaris-0-ashcan",
      title: "Caelaris #0 Ashcan",
      subtitle: "An early ashcan preview of the Caelaris series.",
      category: "Comics",
      format: "Ashcan",
      available: false,          // Coming Soon
      priceLabel: "",
      coverImage: "",            // no cover asset in the project yet
      shipping: "",
      fulfillment: "",
      stripePaymentLink: "",
      stripeProductId: "",
      stripePriceId: ""
    }
  ]
};
