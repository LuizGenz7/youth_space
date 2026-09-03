import { Search } from "lucide-react";

export default function EmptySearch() {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <Search
        size={24}
        className="mx-auto text-slate-400"
      />

      <p className="mt-3 text-sm font-bold text-slate-700">
        No matching categories
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Try searching for another service or skill.
      </p>
    </div>
  );
}