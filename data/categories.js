import {
    cacheLife,
    cacheTag,
} from "next/cache";

/*
 * --------------------------------------------------
 * TEST DATA
 * --------------------------------------------------
 */


 export const categories = [
    {
        id: "barbers",
        name: "Barbers",
        icon: "scissors",
        description:
            "Haircuts, grooming and barbering services.",
        totalTalents: 42,
    },
    {
        id: "hair-beauty",
        name: "Hair & Beauty",
        icon: "sparkles",
        description:
            "Hair styling, beauty and personal care.",
        totalTalents: 68,
    },
    {
        id: "dressmakers",
        name: "Dressmakers",
        icon: "shirt",
        description:
            "Custom clothing, tailoring and alterations.",
        totalTalents: 35,
    },
    {
        id: "cakes",
        name: "Cakes",
        icon: "cake",
        description:
            "Custom cakes and cake decorating.",
        totalTalents: 27,
    },
    {
        id: "photography",
        name: "Photography",
        icon: "camera",
        description:
            "Photography for events, products and people.",
        totalTalents: 51,
    },
    {
        id: "technology",
        name: "Technology",
        icon: "code",
        description:
            "Web, mobile, software and technology services.",
        totalTalents: 38,
    },
    {
        id: "creative",
        name: "Creative",
        icon: "palette",
        description:
            "Creative services and digital creativity.",
        totalTalents: 31,
    },
    {
        id: "beauty",
        name: "Beauty",
        icon: "heart",
        description:
            "Beauty, makeup and personal care services.",
        totalTalents: 46,
    },
    {
        id: "home-services",
        name: "Home Services",
        icon: "home",
        description:
            "Services for homes and residential spaces.",
        totalTalents: 29,
    },
    {
        id: "food-baking",
        name: "Food & Baking",
        icon: "cake",
        description:
            "Food preparation, baking and catering.",
        totalTalents: 44,
    },
    {
        id: "design",
        name: "Design",
        icon: "pen-tool",
        description:
            "Graphic, UI, branding and visual design.",
        totalTalents: 36,
    },
    {
        id: "marketing",
        name: "Marketing",
        icon: "store",
        description:
            "Marketing, promotion and brand services.",
        totalTalents: 24,
    },
    {
        id: "events",
        name: "Events",
        icon: "accessibility",
        description:
            "Event planning, decoration and event services.",
        totalTalents: 33,
    },
    {
        id: "fitness",
        name: "Fitness",
        icon: "dumbbell",
        description:
            "Fitness training and wellness services.",
        totalTalents: 21,
    },
    {
        id: "sports",
        name: "Sports",
        icon: "bike",
        description:
            "Sports coaching, training and activities.",
        totalTalents: 26,
    },
    {
        id: "fashion",
        name: "Fashion",
        icon: "shirt",
        description:
            "Fashion, styling and clothing services.",
        totalTalents: 39,
    },
    {
        id: "music",
        name: "Music",
        icon: "music",
        description:
            "Music production, performance and lessons.",
        totalTalents: 32,
    },
    {
        id: "photography-video",
        name: "Photography & Video",
        icon: "video",
        description:
            "Photography, videography and media production.",
        totalTalents: 28,
    },
    {
        id: "interior-design",
        name: "Interior Design",
        icon: "home",
        description:
            "Interior styling, decoration and space design.",
        totalTalents: 17,
    },
    {
        id: "automotive",
        name: "Automotive",
        icon: "car",
        description:
            "Vehicle repair, maintenance and automotive services.",
        totalTalents: 34,
    },
    {
        id: "writing",
        name: "Writing",
        icon: "pen-tool",
        description:
            "Writing, editing and content services.",
        totalTalents: 19,
    },
    {
        id: "art",
        name: "Art",
        icon: "palette",
        description:
            "Drawing, painting and creative artwork.",
        totalTalents: 23,
    },
    {
        id: "education",
        name: "Education",
        icon: "graduation-cap",
        description:
            "Tutoring, lessons and educational support.",
        totalTalents: 41,
    },
    {
        id: "electronics",
        name: "Electronics",
        icon: "laptop",
        description:
            "Electronics repair, setup and technical services.",
        totalTalents: 25,
    },
    {
        id: "flowers-decor",
        name: "Flowers & Decor",
        icon: "flower",
        description:
            "Flowers, decorations and event styling.",
        totalTalents: 18,
    },
    {
        id: "woodwork",
        name: "Woodwork",
        icon: "hammer",
        description:
            "Furniture, carpentry and woodwork.",
        totalTalents: 22,
    },
    {
        id: "content-creation",
        name: "Content Creation",
        icon: "mic",
        description:
            "Social media, video and digital content.",
        totalTalents: 37,
    },
    {
        id: "dance",
        name: "Dance",
        icon: "accessibility",
        description:
            "Dance training, performances and choreography.",
        totalTalents: 16,
    },
    {
        id: "cleaning-services",
        name: "Cleaning Services",
        icon: "spray-can",
        description:
            "Home, office and commercial cleaning.",
        totalTalents: 20,
    },
    {
        id: "cakes-baking",
        name: "Cakes & Baking",
        icon: "cake",
        description:
            "Cakes, pastries and baked goods.",
        totalTalents: 30,
    },
    {
        id: "business",
        name: "Business",
        icon: "store",
        description:
            "Business support, consulting and entrepreneurship.",
        totalTalents: 27,
    },
];

/*
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

const TOP_CATEGORIES_LIMIT = 10;
const RANDOM_CATEGORIES_LIMIT = 10;

const CATEGORIES_CACHE_TAG =
    "categories";

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

/**
 * Normalize a category into the exact
 * public shape used by the application.
 *
 * IMPORTANT:
 *
 * We intentionally select fields one by one.
 */
function normalizeCategory(
    category
) {
    if (!category) {
        return null;
    }

    return {
        id:
            typeof category.id === "string"
                ? category.id
                : "",

        name:
            typeof category.name === "string"
                ? category.name
                : "",

        icon:
            typeof category.icon === "string"
                ? category.icon
                : "circle",

        description:
            typeof category.description ===
            "string"
                ? category.description
                : "",

        totalTalents:
            Number(
                category.totalTalents || 0
            ),
    };
}

/**
 * Normalize and validate a category limit.
 */
function normalizeLimit(
    limit,
    defaultLimit
) {
    const value = Number(limit);

    if (!Number.isFinite(value)) {
        return defaultLimit;
    }

    return Math.min(
        Math.max(
            Math.floor(value),
            1
        ),
        10
    );
}

/*
 * --------------------------------------------------
 * ALL CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get all categories.
 *
 * Public test data.
 *
 * Cached for one day.
 *
 * Only the normalized category fields
 * are returned.
 */
export async function getCategories() {
    "use cache";

    cacheLife("days");

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    return categories
        .map(normalizeCategory)
        .filter(Boolean);
}

/**
 * Alias kept for existing actions.
 */
export async function getAllCategories() {
    return getCategories();
}

/*
 * --------------------------------------------------
 * CATEGORY BY ID
 * --------------------------------------------------
 */

/**
 * Get a single category.
 *
 * Public test data.
 */
export async function getCategoryById(
    categoryId
) {
    "use cache";

    cacheLife("days");

    if (!categoryId) {
        return null;
    }

    const normalizedCategoryId =
        String(categoryId).trim();

    if (!normalizedCategoryId) {
        return null;
    }

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    const category =
        categories.find(
            (category) =>
                category.id ===
                normalizedCategoryId
        );

    return normalizeCategory(
        category
    );
}

/*
 * --------------------------------------------------
 * TOP CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get the most popular categories.
 *
 * Ordered by totalTalents.
 *
 * Public test data.
 */
export async function getTopCategories(
    limit = TOP_CATEGORIES_LIMIT
) {
    "use cache";

    cacheLife("days");

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    const safeLimit =
        normalizeLimit(
            limit,
            TOP_CATEGORIES_LIMIT
        );

    return [...categories]
        .sort(
            (a, b) =>
                Number(
                    b.totalTalents || 0
                ) -
                Number(
                    a.totalTalents || 0
                )
        )
        .slice(
            0,
            safeLimit
        )
        .map(normalizeCategory)
        .filter(Boolean);
}

/*
 * --------------------------------------------------
 * RANDOM CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get random categories.
 *
 * NOTE:
 *
 * Because this function uses "use cache",
 * the random result is cached for the
 * cache lifetime.
 */
export async function getRandomCategories(
    limit = RANDOM_CATEGORIES_LIMIT
) {
    "use cache";

    cacheLife("days");

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    const safeLimit =
        normalizeLimit(
            limit,
            RANDOM_CATEGORIES_LIMIT
        );

    const allCategories =
        await getCategories();

    return [...allCategories]
        .sort(
            () =>
                Math.random() - 0.5
        )
        .slice(
            0,
            safeLimit
        );
}

/*
 * --------------------------------------------------
 * EXPORTS
 * --------------------------------------------------
 */

export {
    CATEGORIES_CACHE_TAG,
    TOP_CATEGORIES_LIMIT,
    RANDOM_CATEGORIES_LIMIT,
};