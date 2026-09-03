"use client";

import { useMemo, useState } from "react";

import CategoriesHero from "./CategoriesHero";
import CategoriesContent from "./CategoriesContent";

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default function CategoriesClient({ categories }) {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = normalize(search);

    if (!query) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        normalize(category.name).includes(query) ||
        normalize(category.description).includes(query)
      );
    });
  }, [search, categories]);

  return (
    <>
      <CategoriesHero
        search={search}
        setSearch={setSearch}
      />

      <CategoriesContent
        categories={filteredCategories}
        isSearching={Boolean(search.trim())}
      />
    </>
  );
}