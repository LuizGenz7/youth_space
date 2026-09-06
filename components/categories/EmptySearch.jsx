import { FolderOpen, Search } from "lucide-react";

export default function EmptySearch({
  type = "search",
}) {
  const isCategoriesEmpty =
    type === "categories";

  const Icon = isCategoriesEmpty
    ? FolderOpen
    : Search;

  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <Icon
        size={24}
        className="mx-auto text-slate-400"
      />

      <p className="mt-3 text-sm font-bold text-slate-700">
        {isCategoriesEmpty
          ? "No categories available"
          : "No matching categories"}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {isCategoriesEmpty
          ? "There are no talent categories available yet."
          : "Try searching for another service or skill."}
      </p>
    </div>
  );
}