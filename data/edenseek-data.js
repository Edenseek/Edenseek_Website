/* ==========================================================================
   Edenseek — generated render bundle.
   MIRRORS the canonical /data/*.json files into a global for zero-CORS,
   zero-server rendering (works when opened as a local file AND on Pages).
   SOURCE OF TRUTH = the .json files. Regenerate this bundle when they change
   (the future Website Agent automates this — see docs/Future_Website_Agent.md).
   ========================================================================== */
window.EDEN = {
  site: {
    name: "Edenseek Publishing",
    origin: "https://edenseek.com",
    tagline: "Stories Born Different.",
    description: "Edenseek Publishing is a comic and children's book publisher of cinematic, original worlds.",
    email: "hello@edenseek.com",
    social: []
  },

  series: [
    {
      slug: "i-ride-for-them", title: "I Ride for Them", imprint: "comics",
      accentClass: "accent-i-ride", rating: "Mature", genres: ["Sci-Fi", "Thriller"],
      tagline: "In a city that sold its future, one woman rides for the ones who have none.",
      synopsis: "In a near-future metropolis run on data and desperation, a nurse named Joy moves through the neon underlayer of the city carrying a secret worth more than her life. When the powerful come for the children no one else will protect, Joy becomes the only thing standing between them and the dark. A cinematic sci-fi thriller about sacrifice, motherhood, and the price of doing what's right.",
      draft: true, url: "/comics/i-ride-for-them/",
      og: "https://edenseek.com/assets/site/og/og-i-ride-for-them-1200x630.jpg",
      cover: { base: "i-ride-for-them-01", w: 800, h: 1238, lqip: "#514d3d", alt: "I Ride for Them #1 cover art by Giulia Gualazzi: a woman in scrubs cradles an infant while holding a pistol against a neon city." },
      credits: [
        { role: "Writer", creator: "chris-mosley" }, { role: "Artist", creator: "andrea-bormida" },
        { role: "Colorist", creator: "angelo-vecciarelli" }, { role: "Cover Artist", creator: "giulia-gualazzi" },
        { role: "Editor", creator: "bhumi-gupta" }, { role: "Editor", creator: "derek-uskert" }
      ],
      issues: [
        { number: 1, title: "I Ride for Them #1", price: "$5.99", status: "Available", draft: true, synopsis: "The first issue introduces Joy and the city that made her — and the impossible choice that sets everything in motion.", cover: { base: "i-ride-for-them-01", w: 800, h: 1238, lqip: "#514d3d", alt: "I Ride for Them #1 cover by Giulia Gualazzi." } },
        { number: 2, title: "I Ride for Them #2", price: "$5.99", status: "Available", draft: true, synopsis: "Hunted and haunted, Joy confronts the reflection of who she was — and decides who she must become.", cover: { base: "i-ride-for-them-02", w: 800, h: 1238, lqip: "#59748f", alt: "I Ride for Them #2 cover by Giulia Gualazzi: Joy at a sink facing a ghostly reflection." } }
      ]
    },
    {
      slug: "society-of-killers", title: "Society of Killers", imprint: "comics",
      accentClass: "accent-sok", rating: "Mature", genres: ["Crime", "Noir", "Dark Fantasy"],
      tagline: "They're going to make you an offer you should refuse.",
      synopsis: "A secret order of assassins operates in the shadows behind every city, bound by ritual, rivalry, and a code written in blood. When an invitation arrives — a single red card — refusing it may be the most dangerous thing you ever do. A stylish, noir-soaked descent into a world of elegant, monstrous killers.",
      draft: true, url: "/comics/society-of-killers/",
      og: "https://edenseek.com/assets/site/og/og-society-of-killers-1200x630.jpg",
      cover: { base: "society-of-killers-01", w: 800, h: 1214, lqip: "#4d262e", alt: "Society of Killers #1 cover: a gentleman in a bowler hat extends a red calling card across a desk." },
      credits: [
        { role: "Writer", creator: "perkins" }, { role: "Artist", creator: "andrea-bormida" },
        { role: "Cover Artist", creator: "giulia-gualazzi" }
      ],
      issues: [
        { number: 1, title: "Society of Killers #1", price: "$9.99", status: "Available", draft: true, synopsis: "An offer is extended. A red card changes hands. The Society opens its doors — and they do not close.", cover: { base: "society-of-killers-01", w: 800, h: 1214, lqip: "#4d262e", alt: "Society of Killers #1 cover by Giulia Gualazzi." } },
        { number: 2, title: "Society of Killers #2", price: "$9.99", status: "Available", draft: true, synopsis: "The players are revealed. In a gathering of the Society's deadliest members, allegiance is the only currency — and betrayal, the only certainty.", cover: { base: "society-of-killers-02", w: 800, h: 1188, lqip: "#b9b194", alt: "Society of Killers #2 cover: an ensemble of stylish, armed assassins." } }
      ]
    }
  ],

  books: [
    {
      slug: "egypt-the-cat", title: "Egypt the Cat", imprint: "books",
      accentClass: "accent-egypt", audience: "Children", genres: ["Picture Book", "Adventure", "All Ages"],
      tagline: "A magical little cat, a curious boy, and adventures that leap off the page.",
      synopsis: "Egypt the Cat is a bright, whimsical picture-book series for young readers, following a spirited orange cat and his best friend as they tumble through magic shows, dance floors, road trips, time itself, and the far-off future. Created by young storyteller Ness Uskert and brought to life by illustrator Michael Bryan Quiambao, Egypt the Cat celebrates wonder, friendship, and being born different.",
      draft: true, url: "/books/egypt-the-cat/",
      og: "https://edenseek.com/assets/site/og/og-egypt-the-cat-1200x630.jpg",
      cover: { base: "egypt-the-cat-01", w: 800, h: 644, lqip: "#715656", alt: "Egypt the Cat in Magic! Magic! Magic! cover: a boy and an orange cat perform a magic act." },
      credits: [
        { role: "Story", creator: "ness-uskert" }, { role: "Illustrator", creator: "michael-bryan-quiambao" },
        { role: "Cover Artist", creator: "alyssa-mao" }
      ],
      issues: [
        { number: 1, title: "Egypt the Cat in Magic! Magic! Magic!", status: "Available", draft: true, synopsis: "The show begins! Egypt and his friend take the stage for a magic act where absolutely nothing goes as planned — and everything turns out magical.", cover: { base: "egypt-the-cat-01", w: 800, h: 644, lqip: "#715656", alt: "Egypt the Cat in Magic! Magic! Magic! cover, cover art by Alyssa Mao." } },
        { number: 2, title: "Egypt the Cat in Dance Maniac", status: "Available", draft: true, synopsis: "Egypt discovers he simply cannot stop dancing — and neither will you.", cover: { base: "egypt-the-cat-02", w: 800, h: 640, lqip: "#63404c", alt: "Egypt the Cat in Dance Maniac cover." } },
        { number: 3, title: "Egypt the Cat Leaves Los Angeles", status: "Available", draft: true, synopsis: "It's time for a big adventure as Egypt packs up and sets off on the open road.", cover: { base: "egypt-the-cat-03", w: 800, h: 640, lqip: "#8e919c", alt: "Egypt the Cat Leaves Los Angeles cover." } },
        { number: 4, title: "Egypt the Cat in Time", status: "Available", draft: true, synopsis: "Tick, tock — Egypt tumbles through history in a race against the clock.", cover: { base: "egypt-the-cat-04", w: 800, h: 618, lqip: "#91827b", alt: "Egypt the Cat in Time cover." } },
        { number: 5, title: "Egypt the Cat in the Future", status: "Available", draft: true, synopsis: "To the future! Egypt rockets into a world of wonders yet to come.", cover: { base: "egypt-the-cat-05", w: 800, h: 618, lqip: "#c1c5b8", alt: "Egypt the Cat in the Future cover." } }
      ]
    }
  ],

  creators: [
    { slug: "chris-mosley", name: "Chris Mosley", roles: ["Writer", "Co-Creator"], featured: true, worksOn: ["i-ride-for-them"], photo: { base: "creator-chris-mosley", w: 400, h: 400, alt: "Chris Mosley, Writer and Co-Creator" }, bio: "A hybrid screenwriter and comic writer from Detroit, Chris brings a cinematic tone and snappy dialogue to every panel. A two-time winner and finalist in the prestigious PAGE Screenwriting Competition and a back-to-back regional Emmy–winning writer, he channels personal and often tragic experience into his work." },
    { slug: "andrea-bormida", name: "Andrea Bormida", roles: ["Artist"], featured: true, worksOn: ["i-ride-for-them", "society-of-killers"], photo: { base: "creator-andrea-bormida", w: 400, h: 400, alt: "Andrea Bormida, Artist" }, bio: "A professional comics artist based in Italy, Andrea began his career in 1995 and went on to work for Sergio Bonelli Editore on Legs Weaver, Nathan Never and Agenzia Alfa. Raised on Marvel and DC, he favors cinematic framing and dynamic staging, and inks his own pages for a unified look." },
    { slug: "angelo-vecciarelli", name: "Angelo Vecciarelli", roles: ["Colorist"], featured: true, worksOn: ["i-ride-for-them"], photo: { base: "creator-angelo-vecciarelli", w: 400, h: 400, alt: "Angelo Vecciarelli, Colorist" }, bio: "Born in 1989, Angelo graduated in comics from the International School of Comics in 2015 and colors for Editoriale Aurea. Since 2022 he has colored for independent publishers across America and Europe." },
    { slug: "giulia-gualazzi", name: "Giulia Gualazzi", roles: ["Cover Artist"], featured: true, worksOn: ["i-ride-for-them", "society-of-killers"], photo: { base: "creator-giulia-gualazzi", w: 400, h: 400, alt: "Giulia Gualazzi, Cover Artist" }, bio: "Giulia is a talented digital artist from Milan with a long history in comics and illustration. Working since 2016 for clients and publishers worldwide, she creates distinctive, standout designs." },
    { slug: "bhumi-gupta", name: "Bhumi Gupta", roles: ["Editor"], featured: true, worksOn: ["i-ride-for-them"], photo: { base: "creator-bhumi-gupta", w: 400, h: 400, alt: "Bhumi Gupta, Editor" }, bio: "An architect by profession and an enthusiastic writer, Bhumi brings a designer’s eye for structure and detail to her editorial work." },
    { slug: "derek-uskert", name: "Derek Uskert", roles: ["Editor", "Co-Creator"], featured: true, worksOn: ["i-ride-for-them", "egypt-the-cat"], photo: { base: "creator-derek-uskert", w: 400, h: 400, alt: "Derek Uskert, Editor" }, bio: "Derek is an award-winning luxury residential architect and a lifelong comic book enthusiast and collector. He co-created the children’s series Egypt the Cat with his son, Ness." },
    { slug: "ness-uskert", name: "Ness Uskert", roles: ["Story", "Creator"], featured: true, worksOn: ["egypt-the-cat"], photo: { base: "creator-ness-uskert", w: 400, h: 400, alt: "Ness Uskert, Story and Creator" }, bio: "Ness is the young creator and storyteller behind Egypt the Cat, a picture-book series he developed with his father, Derek. An eighth grader living in New York City, he dreams up Egypt’s magical adventures." },
    { slug: "michael-bryan-quiambao", name: "Michael Bryan Quiambao", roles: ["Illustrator"], featured: true, worksOn: ["egypt-the-cat"], photo: { base: "creator-michael-bryan-quiambao", w: 400, h: 400, alt: "Michael Bryan Quiambao, Illustrator" }, bio: "Michael is the illustrator who brings Egypt the Cat to life, pairing expressive, anime-influenced art with bright, playful storytelling made for young readers." },
    { slug: "alyssa-mao", name: "Alyssa Mao", roles: ["Cover Artist"], featured: false, worksOn: ["egypt-the-cat"], photo: null, bio: "Cover artist for Egypt the Cat in Magic! Magic! Magic!" },
    { slug: "perkins", name: "Perkins", roles: ["Writer"], featured: false, worksOn: ["society-of-killers"], photo: null, bio: "Writer of Society of Killers." }
  ],

  characters: [
    { slug: "egypt-the-cat-character", name: "Egypt", series: "egypt-the-cat", role: "Protagonist", draft: true, description: "A spirited, magical orange cat with a taste for adventure and a heart full of wonder." },
    { slug: "joy", name: "Joy", series: "i-ride-for-them", role: "Protagonist", draft: true, description: "A nurse navigating the neon underbelly of a near-future city, protecting the children no one else will." }
  ],

  news: [
    { slug: "edenseek-online", title: "Edenseek Publishing is now online", date: "2026-07-02", status: "published", draft: true, summary: "Welcome to the new home of Edenseek Publishing — a first look at our worlds, our books, and the creators behind them.", url: "/news/" },
    { slug: "society-of-killers-2", title: "Society of Killers #2 is available now", date: "2026-06-15", status: "published", draft: true, summary: "The Society's deadliest members step into the light. Issue #2 continues the noir-soaked saga.", url: "/comics/society-of-killers/" },
    { slug: "egypt-the-cat-series", title: "Meet Egypt the Cat", date: "2026-05-20", status: "published", draft: true, summary: "Our children's picture-book series follows a magical little cat through five wonder-filled adventures.", url: "/books/egypt-the-cat/" }
  ]
};
