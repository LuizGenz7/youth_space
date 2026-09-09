import { categories } from "./categories";

/*
 * --------------------------------------------------
 * TEST TALENT DATA
 * --------------------------------------------------
 *
 * This file generates test talents directly from
 * the categories test data.
 *
 * categories[].totalTalents determines how many
 * talents belong to each category.
 *
 * IMPORTANT:
 *
 * This is TEST DATA only.
 * No Firebase is used here.
 */

/*
 * --------------------------------------------------
 * TEST VALUES
 * --------------------------------------------------
 */

const firstNames = [
    "Lewis",
    "Michael",
    "Brian",
    "Blessings",
    "Gift",
    "Joshua",
    "Daniel",
    "Andrew",
    "David",
    "Emmanuel",
    "John",
    "Peter",
    "Martin",
    "Kelvin",
    "Samuel",
    "Isaac",
    "Matthew",
    "Benjamin",
    "Joseph",
    "Caleb",
];

const lastNames = [
    "Banda",
    "Phiri",
    "Mwansa",
    "Mulenga",
    "Chanda",
    "Tembo",
    "Zulu",
    "Mumba",
    "Lungu",
    "Bwalya",
    "Ngoma",
    "Sakala",
    "Chilufya",
    "Musonda",
    "Kabwe",
    "Daka",
    "Sampa",
    "Mbewe",
    "Chibwe",
    "Nkhoma",
];

const provinces = [
    "Lusaka",
    "Copperbelt",
    "Central",
    "Southern",
    "Eastern",
    "Northern",
    "Luapula",
    "Muchinga",
    "Western",
    "North-Western",
];

const districts = [
    "Lusaka",
    "Kitwe",
    "Ndola",
    "Kabwe",
    "Livingstone",
    "Chipata",
    "Mansa",
    "Kasama",
    "Chinsali",
    "Solwezi",
    "Mongu",
];

const sampleSkills = [
    "Creative",
    "Professional",
    "Experienced",
    "Reliable",
    "Affordable",
    "Quality Work",
    "Fast Service",
    "Modern",
];

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

function getItem(array, index) {
    return array[index % array.length];
}

function createId(index) {
    return `test-talent-${index + 1}`;
}

function createUsername(
    firstName,
    lastName,
    index
) {
    return `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${index + 1}`;
}

function createPhone(index) {
    const number = String(
        962000000 + index
    ).padStart(9, "0");

    return `0${number}`;
}

function createBio(
    category,
    index
) {
    return (
        `Professional ${category.name.toLowerCase()} talent providing quality services. ` +
        `Available for clients looking for reliable ${category.name.toLowerCase()} services. ` +
        `Test profile ${index + 1}.`
    );
}

/*
 * --------------------------------------------------
 * CREATE TALENT
 * --------------------------------------------------
 */

function createTalent(
    category,
    categoryIndex,
    talentIndex,
    globalIndex
) {
    const firstName = getItem(
        firstNames,
        globalIndex
    );

    const lastName = getItem(
        lastNames,
        globalIndex
    );

    const displayName =
        `${firstName} ${lastName}`;

    const id = createId(
        globalIndex
    );

    const username =
        createUsername(
            firstName,
            lastName,
            globalIndex
        );

    const province = getItem(
        provinces,
        globalIndex
    );

    const district = getItem(
        districts,
        globalIndex
    );

    return {
        /*
         * ------------------------------------------
         * IDENTITY
         * ------------------------------------------
         */

        id,

        uid: id,

        username,

        displayName,

        email:
            `${username}@example.com`,

        phone:
            createPhone(
                globalIndex
            ),

        whatsapp:
            createPhone(
                globalIndex
            ),

        avatar: null,

        bio:
            createBio(
                category,
                talentIndex
            ),

        /*
         * ------------------------------------------
         * CATEGORY
         * ------------------------------------------
         */

        category:
            category.name,

        categoryId:
            category.id,

        role:
            category.name,

        /*
         * ------------------------------------------
         * LOCATION
         * ------------------------------------------
         */

        province,

        district,

        /*
         * ------------------------------------------
         * TALENT INFORMATION
         * ------------------------------------------
         */

        skills: [
            category.name,

            getItem(
                sampleSkills,
                globalIndex
            ),

            getItem(
                sampleSkills,
                globalIndex + 2
            ),
        ],

        services: [
            {
                id:
                    `${category.id}-service-${talentIndex + 1}`,

                name:
                    `${category.name} Services`,

                description:
                    `Professional ${category.name.toLowerCase()} services.`,
            },
        ],

        /*
         * ------------------------------------------
         * STATS
         * ------------------------------------------
         */

        likes:
            (globalIndex * 7) % 250,

        workCount:
            1 +
            (globalIndex % 10),

        /*
         * ------------------------------------------
         * STATUS
         * ------------------------------------------
         */

        available:
            globalIndex % 5 !== 0,

        verified:
            globalIndex % 4 === 0,

        /*
         * ------------------------------------------
         * TIMESTAMPS
         * ------------------------------------------
         */

        createdAt:
            `2026-08-${String(
                (globalIndex % 28) + 1
            ).padStart(2, "0")}`,

        updatedAt:
            `2026-09-${String(
                (globalIndex % 9) + 1
            ).padStart(2, "0")}`,
    };
}

/*
 * --------------------------------------------------
 * GENERATE TALENTS
 * --------------------------------------------------
 */

function generateTalents() {
    const generatedTalents = [];

    let globalIndex = 0;

    categories.forEach(
        (
            category,
            categoryIndex
        ) => {
            const totalTalents =
                Number(
                    category.totalTalents || 0
                );

            for (
                let talentIndex = 0;
                talentIndex < totalTalents;
                talentIndex++
            ) {
                generatedTalents.push(
                    createTalent(
                        category,
                        categoryIndex,
                        talentIndex,
                        globalIndex
                    )
                );

                globalIndex++;
            }
        }
    );

    return generatedTalents;
}

/*
 * --------------------------------------------------
 * ALL TEST TALENTS
 * --------------------------------------------------
 */

export const talents =
    generateTalents();

/*
 * --------------------------------------------------
 * TALENTS BY CATEGORY
 * --------------------------------------------------
 */

export function getTalentsByCategory(
    categoryId
) {
    if (!categoryId) {
        return [];
    }

    const normalizedCategoryId =
        String(categoryId).trim();

    if (!normalizedCategoryId) {
        return [];
    }

    return talents.filter(
        (talent) =>
            talent.categoryId ===
            normalizedCategoryId
    );
}

/*
 * --------------------------------------------------
 * TALENT BY ID
 * --------------------------------------------------
 */

export function getTalentById(
    talentId
) {
    if (!talentId) {
        return null;
    }

    const normalizedTalentId =
        String(talentId).trim();

    if (!normalizedTalentId) {
        return null;
    }

    return (
        talents.find(
            (talent) =>
                talent.id ===
                normalizedTalentId ||
                talent.uid ===
                normalizedTalentId
        ) || null
    );
}

/*
 * --------------------------------------------------
 * TALENT BY USERNAME
 * --------------------------------------------------
 */

export function getTalentByUsername(
    username
) {
    if (!username) {
        return null;
    }

    const normalizedUsername =
        String(username)
            .trim()
            .toLowerCase();

    if (!normalizedUsername) {
        return null;
    }

    return (
        talents.find(
            (talent) =>
                talent.username
                    .toLowerCase() ===
                normalizedUsername
        ) || null
    );
}

/*
 * --------------------------------------------------
 * TOP TALENTS
 * --------------------------------------------------
 */

export function getTopTalents(
    limit = 10
) {
    const safeLimit =
        Math.min(
            Math.max(
                Math.floor(
                    Number(limit) || 10
                ),
                1
            ),
            50
        );

    return [...talents]
        .sort(
            (a, b) =>
                b.likes - a.likes
        )
        .slice(
            0,
            safeLimit
        );
}

/*
 * --------------------------------------------------
 * AVAILABLE TALENTS
 * --------------------------------------------------
 */

export function getAvailableTalents(
    limit = 10
) {
    const safeLimit =
        Math.min(
            Math.max(
                Math.floor(
                    Number(limit) || 10
                ),
                1
            ),
            50
        );

    return talents
        .filter(
            (talent) =>
                talent.available
        )
        .slice(
            0,
            safeLimit
        );
}

/*
 * --------------------------------------------------
 * VERIFIED TALENTS
 * --------------------------------------------------
 */

export function getVerifiedTalents(
    limit = 10
) {
    const safeLimit =
        Math.min(
            Math.max(
                Math.floor(
                    Number(limit) || 10
                ),
                1
            ),
            50
        );

    return talents
        .filter(
            (talent) =>
                talent.verified
        )
        .slice(
            0,
            safeLimit
        );
}

/*
 * --------------------------------------------------
 * SEARCH TALENTS
 * --------------------------------------------------
 */

export function searchTalents(
    query
) {
    if (!query) {
        return talents;
    }

    const normalizedQuery =
        String(query)
            .trim()
            .toLowerCase();

    if (!normalizedQuery) {
        return talents;
    }

    return talents.filter(
        (talent) =>
            talent.displayName
                .toLowerCase()
                .includes(
                    normalizedQuery
                ) ||

            talent.username
                .toLowerCase()
                .includes(
                    normalizedQuery
                ) ||

            talent.role
                .toLowerCase()
                .includes(
                    normalizedQuery
                ) ||

            talent.category
                .toLowerCase()
                .includes(
                    normalizedQuery
                ) ||

            talent.province
                .toLowerCase()
                .includes(
                    normalizedQuery
                ) ||

            talent.district
                .toLowerCase()
                .includes(
                    normalizedQuery
                )
    );
}

/*
 * --------------------------------------------------
 * EXPORTS
 * --------------------------------------------------
 */

export {
    createTalent,
    generateTalents,
};