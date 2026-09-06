import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import {
  FieldValue,
  getFirestore,
} from "firebase-admin/firestore";

import serviceAccount from "../secrets/firebase-service-account.json" with { type: "json" };

/*
 * --------------------------------------------------
 * FIREBASE ADMIN
 * --------------------------------------------------
 */

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

const db = getFirestore(adminApp);

/*
 * --------------------------------------------------
 * CATEGORIES
 * --------------------------------------------------
 */

const categories = [
  {
    id: "barbers",
    name: "Barbers",
    icon: "scissors",
    description:
      "Haircuts, grooming and barbering services.",
  },
  {
    id: "hair-beauty",
    name: "Hair & Beauty",
    icon: "sparkles",
    description:
      "Hair styling, beauty and personal care.",
  },
  {
    id: "dressmakers",
    name: "Dressmakers",
    icon: "shirt",
    description:
      "Custom clothing, tailoring and alterations.",
  },
  {
    id: "cakes",
    name: "Cakes",
    icon: "cake",
    description:
      "Custom cakes and cake decorating.",
  },
  {
    id: "photography",
    name: "Photography",
    icon: "camera",
    description:
      "Photography for events, products and people.",
  },
  {
    id: "technology",
    name: "Technology",
    icon: "code",
    description:
      "Web, mobile, software and technology services.",
  },
  {
    id: "creative",
    name: "Creative",
    icon: "palette",
    description:
      "Creative services and digital creativity.",
  },
  {
    id: "beauty",
    name: "Beauty",
    icon: "heart",
    description:
      "Beauty, makeup and personal care services.",
  },
  {
    id: "home-services",
    name: "Home Services",
    icon: "home",
    description:
      "Services for homes and residential spaces.",
  },
  {
    id: "food-baking",
    name: "Food & Baking",
    icon: "cake",
    description:
      "Food preparation, baking and catering.",
  },
  {
    id: "design",
    name: "Design",
    icon: "pen-tool",
    description:
      "Graphic, UI, branding and visual design.",
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "store",
    description:
      "Marketing, promotion and brand services.",
  },
  {
    id: "events",
    name: "Events",
    icon: "accessibility",
    description:
      "Event planning, decoration and event services.",
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: "dumbbell",
    description:
      "Fitness training and wellness services.",
  },
  {
    id: "sports",
    name: "Sports",
    icon: "bike",
    description:
      "Sports coaching, training and activities.",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "shirt",
    description:
      "Fashion, styling and clothing services.",
  },
  {
    id: "music",
    name: "Music",
    icon: "music",
    description:
      "Music production, performance and lessons.",
  },
  {
    id: "photography-video",
    name: "Photography & Video",
    icon: "video",
    description:
      "Photography, videography and media production.",
  },
  {
    id: "interior-design",
    name: "Interior Design",
    icon: "home",
    description:
      "Interior styling, decoration and space design.",
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: "car",
    description:
      "Vehicle repair, maintenance and automotive services.",
  },
  {
    id: "writing",
    name: "Writing",
    icon: "pen-tool",
    description:
      "Writing, editing and content services.",
  },
  {
    id: "art",
    name: "Art",
    icon: "palette",
    description:
      "Drawing, painting and creative artwork.",
  },
  {
    id: "education",
    name: "Education",
    icon: "graduation-cap",
    description:
      "Tutoring, lessons and educational support.",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "laptop",
    description:
      "Electronics repair, setup and technical services.",
  },
  {
    id: "flowers-decor",
    name: "Flowers & Decor",
    icon: "flower",
    description:
      "Flowers, decorations and event styling.",
  },
  {
    id: "woodwork",
    name: "Woodwork",
    icon: "hammer",
    description:
      "Furniture, carpentry and woodwork.",
  },
  {
    id: "content-creation",
    name: "Content Creation",
    icon: "mic",
    description:
      "Social media, video and digital content.",
  },
  {
    id: "dance",
    name: "Dance",
    icon: "accessibility",
    description:
      "Dance training, performances and choreography.",
  },
  {
    id: "cleaning-services",
    name: "Cleaning Services",
    icon: "spray-can",
    description:
      "Home, office and commercial cleaning.",
  },
  {
    id: "cakes-baking",
    name: "Cakes & Baking",
    icon: "cake",
    description:
      "Cakes, pastries and baked goods.",
  },
  {
    id: "business",
    name: "Business",
    icon: "store",
    description:
      "Business support, consulting and entrepreneurship.",
  },
];

/*
 * --------------------------------------------------
 * SEED
 * --------------------------------------------------
 */

async function seedCategories() {
  const batch = db.batch();

  for (const category of categories) {
    const ref = db
      .collection("categories")
      .doc(category.id);

    batch.set(
      ref,
      {
        id: category.id,
        name: category.name,
        icon: category.icon,
        description: category.description,

        // All categories start at zero.
        totalTalents: 0,

        createdAt:
          FieldValue.serverTimestamp(),

        updatedAt:
          FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      }
    );
  }

  await batch.commit();

  console.log(
    `Successfully seeded ${categories.length} categories.`
  );
}

/*
 * --------------------------------------------------
 * RUN
 * --------------------------------------------------
 */

seedCategories()
  .then(() => {
    console.log(
      "Category seeding complete."
    );

    process.exit(0);
  })
  .catch((error) => {
    console.error(
      "Category seeding failed:",
      error
    );

    process.exit(1);
  });