import Link from "next/link";
import { ChevronRight } from "lucide-react";

import CategoryIcon from "./CategoryIcon";

export default function CategoryListItem({ category }) {
  return (
    <Link
      href={`/talents?category=${encodeURIComponent(category.name)}`}
      className="group flex items-center gap-3 p-4 transition hover:bg-slate-50 sm:p-5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <CategoryIcon
          icon={category.icon}
          size={17}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-black">
          {category.name}
        </h4>

        <p className="mt-0.5 text-[11px] text-slate-400">
          {category.count}{" "}
          {category.count === 1 ? "provider" : "providers"}
        </p>
      </div>

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-950"
      />
    </Link>
  );
}