export const categories = [
    {
        id: "barbers",
        name: "Barbers",
        icon: "scissors",
        description: "Haircuts, grooming and barbering services.",
        totalTalents: 42,
    },
    {
        id: "hair-beauty",
        name: "Hair & Beauty",
        icon: "sparkles",
        description: "Hair styling, beauty and personal care.",
        totalTalents: 68,
    },
    {
        id: "dressmakers",
        name: "Dressmakers",
        icon: "shirt",
        description: "Custom clothing, tailoring and alterations.",
        totalTalents: 35,
    },
    {
        id: "cakes",
        name: "Cakes",
        icon: "cake",
        description: "Custom cakes and cake decorating.",
        totalTalents: 27,
    },
    {
        id: "photography",
        name: "Photography",
        icon: "camera",
        description: "Photography for events, products and people.",
        totalTalents: 51,
    },
    {
        id: "technology",
        name: "Technology",
        icon: "code",
        description: "Web, mobile, software and technology services.",
        totalTalents: 24,
    },
    {
        id: "creative",
        name: "Creative",
        icon: "palette",
        description: "Creative services and digital creativity.",
        totalTalents: 31,
    },
    {
        id: "beauty",
        name: "Beauty",
        icon: "heart",
        description: "Beauty, makeup and personal care services.",
        totalTalents: 56,
    },
    {
        id: "home-services",
        name: "Home Services",
        icon: "home",
        description: "Services for homes and residential spaces.",
        totalTalents: 19,
    },
    {
        id: "food-baking",
        name: "Food & Baking",
        icon: "cake",
        description: "Food preparation, baking and catering.",
        totalTalents: 47,
    },
    {
        id: "design",
        name: "Design",
        icon: "pen-tool",
        description: "Graphic, UI, branding and visual design.",
        totalTalents: 38,
    },
    {
        id: "marketing",
        name: "Marketing",
        icon: "store",
        description: "Marketing, promotion and brand services.",
        totalTalents: 22,
    },
    {
        id: "events",
        name: "Events",
        icon: "accessibility",
        description: "Event planning, decoration and event services.",
        totalTalents: 29,
    },
    {
        id: "fitness",
        name: "Fitness",
        icon: "dumbbell",
        description: "Fitness training and wellness services.",
        totalTalents: 18,
    },
    {
        id: "sports",
        name: "Sports",
        icon: "bike",
        description: "Sports coaching, training and activities.",
        totalTalents: 34,
    },
    {
        id: "fashion",
        name: "Fashion",
        icon: "shirt",
        description: "Fashion, styling and clothing services.",
        totalTalents: 41,
    },
    {
        id: "music",
        name: "Music",
        icon: "music",
        description: "Music production, performance and lessons.",
        totalTalents: 26,
    },
    {
        id: "photography-video",
        name: "Photography & Video",
        icon: "video",
        description: "Photography, videography and media production.",
        totalTalents: 33,
    },
    {
        id: "interior-design",
        name: "Interior Design",
        icon: "home",
        description: "Interior styling, decoration and space design.",
        totalTalents: 14,
    },
    {
        id: "automotive",
        name: "Automotive",
        icon: "car",
        description: "Vehicle repair, maintenance and automotive services.",
        totalTalents: 37,
    },
    {
        id: "writing",
        name: "Writing",
        icon: "pen-tool",
        description: "Writing, editing and content services.",
        totalTalents: 21,
    },
    {
        id: "art",
        name: "Art",
        icon: "palette",
        description: "Drawing, painting and creative artwork.",
        totalTalents: 17,
    },
    {
        id: "education",
        name: "Education",
        icon: "graduation-cap",
        description: "Tutoring, lessons and educational support.",
        totalTalents: 44,
    },
    {
        id: "electronics",
        name: "Electronics",
        icon: "laptop",
        description: "Electronics repair, setup and technical services.",
        totalTalents: 28,
    },
    {
        id: "flowers-decor",
        name: "Flowers & Decor",
        icon: "flower",
        description: "Flowers, decorations and event styling.",
        totalTalents: 16,
    },
    {
        id: "woodwork",
        name: "Woodwork",
        icon: "hammer",
        description: "Furniture, carpentry and woodwork.",
        totalTalents: 23,
    },
    {
        id: "content-creation",
        name: "Content Creation",
        icon: "mic",
        description: "Social media, video and digital content.",
        totalTalents: 39,
    },
    {
        id: "dance",
        name: "Dance",
        icon: "accessibility",
        description: "Dance training, performances and choreography.",
        totalTalents: 15,
    },
    {
        id: "cleaning-services",
        name: "Cleaning Services",
        icon: "spray-can",
        description: "Home, office and commercial cleaning.",
        totalTalents: 32,
    },
    {
        id: "cakes-baking",
        name: "Cakes & Baking",
        icon: "cake",
        description: "Cakes, pastries and baked goods.",
        totalTalents: 36,
    },
    {
        id: "business",
        name: "Business",
        icon: "store",
        description: "Business support, consulting and entrepreneurship.",
        totalTalents: 25,
    },
];

const TOP_CATEGORIES_LIMIT = 10;
const RANDOM_CATEGORIES_LIMIT = 10;

/*
 * --------------------------------------------------
 * CATEGORIES
 * --------------------------------------------------
 */

export async function getCategories() {
    return categories;
}

export async function getAllCategories() {
    return getCategories();
}

/*
 * --------------------------------------------------
 * TOP CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get categories with the highest number of talents.
 *
 * totalTalents is already stored on each category,
 * so there is no need to load the talents collection.
 */
export async function getTopCategories(
    limit = TOP_CATEGORIES_LIMIT
) {
    const allCategories = await getCategories();

    const safeLimit = Math.min(
        Math.max(Number(limit) || TOP_CATEGORIES_LIMIT, 1),
        TOP_CATEGORIES_LIMIT
    );

    return [...allCategories]
        .sort(
            (a, b) =>
                Number(b.totalTalents || 0) -
                Number(a.totalTalents || 0)
        )
        .slice(0, safeLimit);
}

/*
 * --------------------------------------------------
 * RANDOM CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get a random selection of categories.
 */
export async function getRandomCategories(
    limit = RANDOM_CATEGORIES_LIMIT
) {
    const allCategories = await getCategories();

    const safeLimit = Math.min(
        Math.max(Number(limit) || RANDOM_CATEGORIES_LIMIT, 1),
        RANDOM_CATEGORIES_LIMIT
    );

    return [...allCategories]
        .sort(() => Math.random() - 0.5)
        .slice(0, safeLimit);
}