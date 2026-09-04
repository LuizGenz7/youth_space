import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CategoryIcon from "./CategoryIcon";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/talents?category=${encodeURIComponent(category.name)}`}
      className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg sm:p-5"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
        <CategoryIcon icon={category.icon} size={19} />
      </div>

      <h3 className="mt-4 text-sm font-black sm:text-base">{category.name}</h3>

      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
        {category.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400">
          {category.totalTalents}{" "}
          {category.totalTalents === 1 ? "talent" : "talents"}
        </span>

        <ChevronRight
          size={15}
          className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-950"
        />
      </div>
    </Link>
  );
}
