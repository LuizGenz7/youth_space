// works_data.js

import { talents } from "./talents_data";

const WORK_TITLES = {
  barbers: [
    "Classic Fade",
    "Low Fade",
    "Premium Haircut",
    "Beard Styling",
    "Modern Cut",
  ],

  "hair-beauty": [
    "Natural Hair Styling",
    "Braiding",
    "Hair Treatment",
    "Protective Styling",
    "Hair Transformation",
  ],

  dressmakers: [
    "African Dress",
    "Custom Suit",
    "Traditional Outfit",
    "Wedding Dress",
    "Custom Design",
  ],

  cakes: [
    "Birthday Cake",
    "Wedding Cake",
    "Custom Cake",
    "Chocolate Cake",
    "Celebration Cake",
  ],

  photography: [
    "Portrait Session",
    "Wedding Photography",
    "Event Photography",
    "Outdoor Portraits",
    "Creative Photography",
  ],

  technology: [
    "Business Website",
    "Mobile App",
    "Web Application",
    "School System",
    "Business System",
  ],

  creative: [
    "Creative Project",
    "Digital Creation",
    "Creative Concept",
    "Brand Creation",
    "Creative Artwork",
  ],

  beauty: [
    "Makeup Look",
    "Bridal Makeup",
    "Natural Makeup",
    "Beauty Session",
    "Professional Makeup",
  ],

  "home-services": [
    "Home Improvement",
    "Plumbing Project",
    "Electrical Work",
    "Home Installation",
    "Home Repair",
  ],

  "food-baking": [
    "Fresh Pastries",
    "Custom Baking",
    "Food Presentation",
    "Pastry Collection",
    "Baking Project",
  ],

  design: [
    "Brand Identity",
    "Poster Design",
    "Logo Design",
    "Social Media Design",
    "Graphic Design",
  ],

  marketing: [
    "Marketing Campaign",
    "Social Media Campaign",
    "Brand Promotion",
    "Marketing Strategy",
    "Business Promotion",
  ],

  events: [
    "Event Setup",
    "Birthday Event",
    "Wedding Setup",
    "Corporate Event",
    "Event Decoration",
  ],

  fitness: [
    "Fitness Training",
    "Workout Program",
    "Personal Training",
    "Fitness Session",
    "Transformation Program",
  ],

  sports: [
    "Football Training",
    "Sports Coaching",
    "Team Training",
    "Sports Event",
    "Athletic Performance",
  ],

  fashion: [
    "Fashion Collection",
    "Streetwear",
    "Custom Outfit",
    "Fashion Shoot",
    "Style Collection",
  ],

  music: [
    "Music Performance",
    "Studio Session",
    "Live Performance",
    "Music Production",
    "Artist Project",
  ],

  "photography-video": [
    "Wedding Shoot",
    "Music Video",
    "Event Coverage",
    "Creative Video",
    "Commercial Shoot",
  ],

  "interior-design": [
    "Living Room Design",
    "Modern Interior",
    "Bedroom Design",
    "Office Interior",
    "Interior Makeover",
  ],

  automotive: [
    "Car Detailing",
    "Vehicle Restoration",
    "Custom Vehicle",
    "Auto Repair",
    "Car Modification",
  ],

  writing: [
    "Article Writing",
    "Business Copy",
    "Creative Writing",
    "Blog Project",
    "Content Writing",
  ],

  art: [
    "Portrait Artwork",
    "Digital Art",
    "Pencil Drawing",
    "Creative Artwork",
    "Original Painting",
  ],

  education: [
    "Tutoring Project",
    "Study Material",
    "Educational Project",
    "Learning Program",
    "Academic Support",
  ],

  electronics: [
    "Electronics Project",
    "Device Repair",
    "Circuit Project",
    "Electronic Installation",
    "Custom Electronics",
  ],

  "flowers-decor": [
    "Flower Arrangement",
    "Wedding Decoration",
    "Event Decoration",
    "Floral Design",
    "Custom Decoration",
  ],

  woodwork: [
    "Custom Furniture",
    "Wooden Table",
    "Cabinet Design",
    "Wooden Chair",
    "Furniture Project",
  ],

  "content-creation": [
    "Social Media Content",
    "Content Campaign",
    "Creative Content",
    "Brand Content",
    "Creator Project",
  ],

  dance: [
    "Dance Performance",
    "Dance Training",
    "Choreography",
    "Traditional Dance",
    "Creative Dance",
  ],

  "cleaning-services": [
    "Home Cleaning",
    "Deep Cleaning",
    "Office Cleaning",
    "Move-in Cleaning",
    "Professional Cleaning",
  ],

  "cakes-baking": [
    "Custom Birthday Cake",
    "Wedding Cake",
    "Cupcake Collection",
    "Dessert Collection",
    "Custom Baking",
  ],

  business: [
    "Business Project",
    "Business Branding",
    "Business Setup",
    "Business Campaign",
    "Business Solution",
  ],
};

const IMAGES = [
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
  "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
];

const descriptions = [
  "A recent project created for a client.",
  "One of my latest creative projects.",
  "A project showcasing my skills and experience.",
  "A custom project completed for a client.",
  "One of the projects I am most proud of.",
];

/**
 * Create a deterministic date for test data.
 */
function createDate(index) {
  const date = new Date("2026-01-01T00:00:00Z");

  date.setDate(date.getDate() + (index % 240));
  date.setHours(8 + (index % 10));

  return date.toISOString();
}

/**
 * Get a title for a talent's category.
 */
function getTitle(categoryId, index) {
  const titles = WORK_TITLES[categoryId] || [
    "Featured Project",
    "Recent Work",
    "Client Project",
    "Creative Project",
    "Latest Work",
  ];

  return titles[index % titles.length];
}

/**
 * Generate works for one talent.
 *
 * workCount is respected but capped at 10 because
 * the Youth Space MVP allows a maximum of 10 works
 * per talent.
 */
function generateWorksForTalent(talent, talentIndex) {
  const count = Math.min(Number(talent.workCount) || 0, 10);

  return Array.from({ length: count }, (_, workIndex) => {
    const globalIndex = talentIndex * 10 + workIndex;

    const createdAt = createDate(globalIndex);

    return {
      id: `test-work-${globalIndex + 1}`,

      talentId: talent.id,

      title: getTitle(talent.categoryId, workIndex),

      categoryId: talent.categoryId,

      category: talent.category,

      description:
        descriptions[globalIndex % descriptions.length],

      image: `${IMAGES[globalIndex % IMAGES.length]}?auto=format&fit=crop&w=1200&q=80`,

      likes: 5 + ((globalIndex * 17) % 196),

      createdAt,

      updatedAt: createdAt,
    };
  });
}

/**
 * Generate all test works from test talents.
 */
export const works = talents.flatMap((talent, talentIndex) =>
  generateWorksForTalent(talent, talentIndex)
);

/**
 * Get all works.
 */
export function getAllWorks() {
  return works;
}

/**
 * Get a work by ID.
 */
export function getWorkById(workId) {
  if (!workId) return null;

  return (
    works.find((work) => work.id === workId) || null
  );
}

/**
 * Get works belonging to a talent.
 */
export function getWorksByTalent(talentId) {
  if (!talentId) return [];

  return works
    .filter((work) => work.talentId === talentId)
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
}

/**
 * Get trending works.
 *
 * Highest likes first.
 */
export function getTrendingWorks(limit = 10) {
  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 10, 50)
  );

  return [...works]
    .sort((a, b) => {
      if (b.likes !== a.likes) {
        return b.likes - a.likes;
      }

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    })
    .slice(0, safeLimit);
}

/**
 * Get newest works.
 */
export function getNewWorks(limit = 10) {
  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 10, 50)
  );

  return [...works]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, safeLimit);
}

/**
 * Get works by category.
 */
export function getWorksByCategory(categoryId) {
  if (!categoryId) return [];

  return works
    .filter((work) => work.categoryId === categoryId)
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
}

/**
 * Get the owner of a work.
 */
export function getWorkTalent(workId) {
  const work = getWorkById(workId);

  if (!work) return null;

  return (
    talents.find(
      (talent) =>
        talent.id === work.talentId ||
        talent.uid === work.talentId
    ) || null
  );
}

/**
 * Search works.
 */
export function searchWorks(query) {
  if (!query?.trim()) return [];

  const normalizedQuery = query
    .trim()
    .toLowerCase();

  return works.filter((work) => {
    return (
      work.title.toLowerCase().includes(normalizedQuery) ||
      work.category.toLowerCase().includes(normalizedQuery) ||
      work.description
        .toLowerCase()
        .includes(normalizedQuery)
    );
  });
}