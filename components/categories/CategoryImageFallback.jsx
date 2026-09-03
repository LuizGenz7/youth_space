import CategoryIcon from "./CategoryIcon";

export default function CategoryImageFallback({
  category,
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

      <div className="relative flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/50 backdrop-blur">
          <CategoryIcon
            icon={category.icon}
            size={32}
          />
        </div>

        <p className="mt-4 max-w-[180px] truncate text-xs font-black uppercase tracking-[0.16em] text-white/30">
          {category.name}
        </p>
      </div>
    </div>
  );
}