/* ==========================================================================
   Edenseek — STORE PRODUCT CONFIGURATION (single source of truth for commerce)

   This is the ONE place store products and their purchase links are defined.
   Store cards and purchase buttons read from here (window.EDEN_STORE) — Stripe
   links must NEVER be hardcoded into page components. Loaded as a plain
   <script defer> (no fetch/CORS), like /data/edenseek-data.js.

   ---- HOW THE BUTTON BEHAVES ON THE CURRENT STATIC WEBSITE --------------------
   For each product, /js/edenseek.js decides the button as follows:
     • available === true  AND  stripePaymentLink is non-empty  → "Buy Now"
       (a real link that opens the Stripe-hosted checkout in a new, secure tab).
     • available === true  but  stripePaymentLink is blank       → "Coming Soon".
     • available === false                                        → "Coming Soon".

   ---- FIELD NOTES ------------------------------------------------------------
     slug              Stable id. For issues it is "<series-slug>-<number>"
                       (e.g. "i-ride-for-them-1") so the renderer can match a
                       rendered issue to its product.
     title             Product name shown on the card.
     subtitle          Short description / one-line hook.
     category          Top-level grouping, e.g. "Comics", "Children's Books".
     format            Physical/digital format, e.g. "Digital Comic".
     available         Whether the product is released/purchasable.
     priceLabel        Human-readable price shown on the card (e.g. "$5.99").
     coverImage        Path to an EXISTING cover asset (webp). "" if none yet.

     stripePaymentLink USED NOW. On the current static website this is the live
                       Stripe Payment Link the "Buy Now" button opens. Leave it
                       "" until a real Payment Link exists (button stays
                       "Coming Soon"). No links exist yet, so all are blank.

     stripeProductId   RESERVED FOR THE FUTURE Edenseek platform checkout.
     stripePriceId     RESERVED FOR THE FUTURE Edenseek platform checkout.
                       These two are NOT used by the static site today. They are
                       kept here so that when the Edenseek platform ships its
                       server-driven checkout (Stripe Checkout Sessions), the
                       product catalog is already wired — no schema change needed.

   Store / purchase inquiries route to derek@edenseek.com.
   ========================================================================== */
window.EDEN_STORE = {
  contactEmail: "derek@edenseek.com",

  products: [
    /* ---------------------------- Comics: I Ride for Them -------------------- */
    {
      slug: "i-ride-for-them-1",
      title: "I Ride for Them #1",
      subtitle: "The program, and the AI midwife Joy who watches over the children within it.",
      category: "Comics",
      format: "Digital Comic",
      available: true,
      priceLabel: "$5.99",
      coverImage: "/assets/covers/i-ride-for-them-01-cover-800w.webp",
      stripePaymentLink: "",   // used now — set to a live Stripe Payment Link to enable "Buy Now"
      stripeProductId: "",     // reserved for the future Edenseek platform checkout
      stripePriceId: ""        // reserved for the future Edenseek platform checkout
    },
    {
      slug: "i-ride-for-them-2",
      title: "I Ride for Them #2",
      subtitle: "Hunted through the virtual world, Joy fights for the children in her care.",
      category: "Comics",
      format: "Digital Comic",
      available: true,
      priceLabel: "$5.99",
      coverImage: "/assets/covers/i-ride-for-them-02-cover-800w.webp",
      stripePaymentLink: "",
      stripeProductId: "",
      stripePriceId: ""
    },

    /* ---------------------------- Comics: Society of Killers ----------------- */
    {
      slug: "society-of-killers-1",
      title: "Society of Killers #1",
      subtitle: "Inside the Kellerman Institute, a new class of subjects begins its training.",
      category: "Comics",
      format: "Digital Comic",
      available: true,
      priceLabel: "$9.99",
      coverImage: "/assets/covers/society-of-killers-01-cover-800w.webp",
      stripePaymentLink: "",
      stripeProductId: "",
      stripePriceId: ""
    },
    {
      slug: "society-of-killers-2",
      title: "Society of Killers #2",
      subtitle: "The subjects are tested against one another, and rivalries sharpen.",
      category: "Comics",
      format: "Digital Comic",
      available: true,
      priceLabel: "$9.99",
      coverImage: "/assets/covers/society-of-killers-02-cover-800w.webp",
      stripePaymentLink: "",
      stripeProductId: "",
      stripePriceId: ""
    },

    /* ---------------------- Children's Books: Egypt the Cat ------------------ */
    {
      slug: "egypt-the-cat-1",
      title: "Egypt the Cat in Magic! Magic! Magic!",
      subtitle: "Ness makes his cat Egypt \"disappear\" — then sets off on a worried search to find him.",
      category: "Children's Books",
      format: "Picture Book",
      available: true,
      priceLabel: "",
      coverImage: "/assets/covers/egypt-the-cat-01-cover-800w.webp",
      stripePaymentLink: "https://buy.stripe.com/28E00l9h03Qe0lW2m71Nu00",  // LIVE — first Stripe Payment Link
      stripeProductId: "prod_UpXmN6Ua3SZu6o",                                 // reserved for future platform checkout
      stripePriceId: ""                                                       // reserved (add Price ID when known)
    },
    {
      slug: "egypt-the-cat-2",
      title: "Egypt the Cat in Dance Maniac",
      subtitle: "Stuck cleaning his room on a sunny day, Ness is coaxed out of his funk by a little razzle dazzle.",
      category: "Children's Books",
      format: "Picture Book",
      available: true,
      priceLabel: "",
      coverImage: "/assets/covers/egypt-the-cat-02-cover-800w.webp",
      stripePaymentLink: "",
      stripeProductId: "",
      stripePriceId: ""
    },
    {
      slug: "egypt-the-cat-3",
      title: "Egypt the Cat Leaves Los Angeles",
      subtitle: "Coming soon.",
      category: "Children's Books",
      format: "Picture Book",
      available: false,
      priceLabel: "",
      coverImage: "/assets/covers/egypt-the-cat-03-cover-800w.webp",
      stripePaymentLink: "",
      stripeProductId: "",
      stripePriceId: ""
    },
    {
      slug: "egypt-the-cat-4",
      title: "Egypt the Cat in Time",
      subtitle: "Coming soon.",
      category: "Children's Books",
      format: "Picture Book",
      available: false,
      priceLabel: "",
      coverImage: "/assets/covers/egypt-the-cat-04-cover-800w.webp",
      stripePaymentLink: "",
      stripeProductId: "",
      stripePriceId: ""
    },
    {
      slug: "egypt-the-cat-5",
      title: "Egypt the Cat in the Future",
      subtitle: "Coming soon.",
      category: "Children's Books",
      format: "Picture Book",
      available: false,
      priceLabel: "",
      coverImage: "/assets/covers/egypt-the-cat-05-cover-800w.webp",
      stripePaymentLink: "",
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
      stripePaymentLink: "",
      stripeProductId: "",
      stripePriceId: ""
    }
  ]
};
