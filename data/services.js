/* =========================================================
   SAMPLE SERVICES
   Replace with Firebase later.
   
   Each service belongs to a talent through `talentId`.
   `price` is stored as a number in ZMW.
========================================================= */

export const services = [
  /* =======================================================
     JOHN MWALE — Talent 1
  ======================================================= */

  {
    id: "service-1-1",
    talentId: 1,
    name: "Haircut",
    description: "Clean and professional everyday haircuts.",
    price: 80,
  },
  {
    id: "service-1-2",
    talentId: 1,
    name: "Skin Fade",
    description: "Sharp modern skin fades with clean finishing.",
    price: 100,
  },
  {
    id: "service-1-3",
    talentId: 1,
    name: "Beard Grooming",
    description: "Professional beard trimming and grooming.",
    price: 50,
  },

  /* =======================================================
     BRIAN PHIRI — Talent 2
  ======================================================= */

  {
    id: "service-2-1",
    talentId: 2,
    name: "Classic Haircut",
    description: "Professional classic cuts for men.",
    price: 80,
  },
  {
    id: "service-2-2",
    talentId: 2,
    name: "Fade",
    description: "Clean fades with detailed finishing.",
    price: 100,
  },
  {
    id: "service-2-3",
    talentId: 2,
    name: "Hair Styling",
    description: "Personalised styling for your preferred look.",
    price: 120,
  },

  /* =======================================================
     MOSES BANDA — Talent 3
  ======================================================= */

  {
    id: "service-3-1",
    talentId: 3,
    name: "Modern Fade",
    description: "Modern fades with sharp and clean finishing.",
    price: 120,
  },
  {
    id: "service-3-2",
    talentId: 3,
    name: "Hair Styling",
    description: "Professional styling for different occasions.",
    price: 100,
  },
  {
    id: "service-3-3",
    talentId: 3,
    name: "Full Grooming",
    description: "Haircut, styling and complete grooming.",
    price: 180,
  },

  /* =======================================================
     PETER CHANDA — Talent 4
  ======================================================= */

  {
    id: "service-4-1",
    talentId: 4,
    name: "Haircut",
    description: "Sharp and professional haircuts.",
    price: 80,
  },
  {
    id: "service-4-2",
    talentId: 4,
    name: "Fade",
    description: "Clean fades designed around your style.",
    price: 100,
  },
  {
    id: "service-4-3",
    talentId: 4,
    name: "Styling",
    description: "Personalised hair styling and finishing.",
    price: 120,
  },

  /* =======================================================
     DAVID ZULU — Talent 5
  ======================================================= */

  {
    id: "service-5-1",
    talentId: 5,
    name: "Professional Haircut",
    description: "Clean professional cuts for everyday wear.",
    price: 100,
  },
  {
    id: "service-5-2",
    talentId: 5,
    name: "Skin Fade",
    description: "Detailed skin fades with professional finishing.",
    price: 130,
  },
  {
    id: "service-5-3",
    talentId: 5,
    name: "Complete Grooming",
    description: "Haircut and beard grooming package.",
    price: 180,
  },

  /* =======================================================
     MARTHA BANDA — Talent 6
  ======================================================= */

  {
    id: "service-6-1",
    talentId: 6,
    name: "Hair Styling",
    description: "Creative hairstyles for different occasions.",
    price: 200,
  },
  {
    id: "service-6-2",
    talentId: 6,
    name: "Beauty Treatment",
    description: "Personalised beauty care and treatments.",
    price: 250,
  },
  {
    id: "service-6-3",
    talentId: 6,
    name: "Hair Treatment",
    description: "Hair care treatments for healthier-looking hair.",
    price: 180,
  },

  /* =======================================================
     RUTH MWANSA — Talent 7
  ======================================================= */

  {
    id: "service-7-1",
    talentId: 7,
    name: "Braiding",
    description: "Creative braiding and protective hairstyles.",
    price: 250,
  },
  {
    id: "service-7-2",
    talentId: 7,
    name: "Natural Hair Styling",
    description: "Styling services for natural hair.",
    price: 180,
  },
  {
    id: "service-7-3",
    talentId: 7,
    name: "Protective Hairstyle",
    description: "Protective styles designed for natural hair.",
    price: 300,
  },

  /* =======================================================
     GRACE PHIRI — Talent 8
  ======================================================= */

  {
    id: "service-8-1",
    talentId: 8,
    name: "Natural Hair Care",
    description: "Professional natural hair care services.",
    price: 180,
  },
  {
    id: "service-8-2",
    talentId: 8,
    name: "Braiding",
    description: "Neat and creative braiding styles.",
    price: 250,
  },
  {
    id: "service-8-3",
    talentId: 8,
    name: "Hair Treatment",
    description: "Hair treatments focused on healthy natural hair.",
    price: 200,
  },

  /* =======================================================
     ALICE CHANDA — Talent 9
  ======================================================= */

  {
    id: "service-9-1",
    talentId: 9,
    name: "Custom Dress",
    description: "Custom dresses made to your measurements.",
    price: 600,
  },
  {
    id: "service-9-2",
    talentId: 9,
    name: "Alterations",
    description: "Professional clothing alterations and adjustments.",
    price: 150,
  },
  {
    id: "service-9-3",
    talentId: 9,
    name: "Custom Outfit",
    description: "Complete custom outfits designed to your style.",
    price: 900,
  },

  /* =======================================================
     MARY PHIRI — Talent 10
  ======================================================= */

  {
    id: "service-10-1",
    talentId: 10,
    name: "Custom Dressmaking",
    description: "Custom women's clothing made to your measurements.",
    price: 600,
  },
  {
    id: "service-10-2",
    talentId: 10,
    name: "Fashion Alterations",
    description: "Adjustments and alterations for existing outfits.",
    price: 150,
  },
  {
    id: "service-10-3",
    talentId: 10,
    name: "Custom Outfit",
    description: "Complete outfits designed for special occasions.",
    price: 850,
  },

  /* =======================================================
     CHILESHE BANDA — Talent 11
  ======================================================= */

  {
    id: "service-11-1",
    talentId: 11,
    name: "Custom Clothing",
    description: "Clothing designed and made to your measurements.",
    price: 700,
  },
  {
    id: "service-11-2",
    talentId: 11,
    name: "African Fashion",
    description: "Modern African-inspired custom fashion.",
    price: 900,
  },
  {
    id: "service-11-3",
    talentId: 11,
    name: "Tailoring",
    description: "Professional tailoring and clothing adjustments.",
    price: 200,
  },

  /* =======================================================
     MARY NGOMA — Talent 12
  ======================================================= */

  {
    id: "service-12-1",
    talentId: 12,
    name: "Birthday Cake",
    description: "Beautiful custom cakes for birthday celebrations.",
    price: 450,
  },
  {
    id: "service-12-2",
    talentId: 12,
    name: "Custom Cake",
    description: "Personalised cakes designed for your occasion.",
    price: 600,
  },
  {
    id: "service-12-3",
    talentId: 12,
    name: "Dessert Box",
    description: "Custom dessert selections for celebrations.",
    price: 250,
  },

  /* =======================================================
     GIFT BANDA — Talent 13
  ======================================================= */

  {
    id: "service-13-1",
    talentId: 13,
    name: "Birthday Cake",
    description: "Creative cakes for birthdays and celebrations.",
    price: 400,
  },
  {
    id: "service-13-2",
    talentId: 13,
    name: "Cupcakes",
    description: "Freshly made cupcakes for events and celebrations.",
    price: 150,
  },
  {
    id: "service-13-3",
    talentId: 13,
    name: "Dessert Box",
    description: "Creative dessert boxes for special occasions.",
    price: 250,
  },

  /* =======================================================
     JOHN PHIRI — Talent 14
  ======================================================= */

  {
    id: "service-14-1",
    talentId: 14,
    name: "Portrait Photography",
    description: "Professional portraits for individuals and creatives.",
    price: 500,
  },
  {
    id: "service-14-2",
    talentId: 14,
    name: "Brand Photography",
    description: "Professional photography for brands and businesses.",
    price: 800,
  },
  {
    id: "service-14-3",
    talentId: 14,
    name: "Photo Editing",
    description: "Professional editing and retouching of photographs.",
    price: 150,
  },

  /* =======================================================
     BRIAN ZULU — Talent 15
  ======================================================= */

  {
    id: "service-15-1",
    talentId: 15,
    name: "Event Photography",
    description: "Professional photography coverage for events.",
    price: 1000,
  },
  {
    id: "service-15-2",
    talentId: 15,
    name: "Birthday Photography",
    description: "Photography coverage for birthday celebrations.",
    price: 700,
  },
  {
    id: "service-15-3",
    talentId: 15,
    name: "Photo Editing",
    description: "Professional editing and enhancement of photographs.",
    price: 150,
  },

  /* =======================================================
     BRIAN MWALE — Talent 16
  ======================================================= */

  {
    id: "service-16-1",
    talentId: 16,
    name: "Flutter App Development",
    description: "Cross-platform mobile applications built with Flutter.",
    price: 3000,
  },
  {
    id: "service-16-2",
    talentId: 16,
    name: "Firebase Integration",
    description: "Firebase authentication, database and cloud integration.",
    price: 1200,
  },
  {
    id: "service-16-3",
    talentId: 16,
    name: "Mobile App UI",
    description: "Clean and responsive interfaces for mobile applications.",
    price: 1000,
  },

  /* =======================================================
     DAVID BANDA — Talent 17
  ======================================================= */

  {
    id: "service-17-1",
    talentId: 17,
    name: "Website Development",
    description: "Modern responsive websites for individuals and businesses.",
    price: 2500,
  },
  {
    id: "service-17-2",
    talentId: 17,
    name: "Next.js Development",
    description: "Modern web applications built with Next.js.",
    price: 3500,
  },
  {
    id: "service-17-3",
    talentId: 17,
    name: "Website UI",
    description: "Clean and responsive interfaces using React and Tailwind.",
    price: 1200,
  },

  /* =======================================================
     MARTHA PHIRI — Talent 18
  ======================================================= */

  {
    id: "service-18-1",
    talentId: 18,
    name: "UI Design",
    description: "Clean and modern interfaces for digital products.",
    price: 800,
  },
  {
    id: "service-18-2",
    talentId: 18,
    name: "UX Design",
    description: "User-focused experiences and product flows.",
    price: 1000,
  },
  {
    id: "service-18-3",
    talentId: 18,
    name: "Figma Prototypes",
    description: "Interactive prototypes for web and mobile products.",
    price: 600,
  },

  /* =======================================================
     ADDITIONAL TALENTS
     Add the remaining talent services below.
  ======================================================= */
];