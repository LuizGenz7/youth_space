import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";

export default function WorkShowcaseCard({
  talent,
  work,
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {work.image ? (
          <Image
            src={work.image}
            alt={
              work.title
                ? `${work.title} by ${talent.name}`
                : `${talent.name} portfolio work`
            }
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
            <Sparkles size={28} />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/50 to-transparent" />

        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-black text-slate-700 shadow-sm backdrop-blur">
          <Heart size={11} />
          {work.likes ?? 0}
        </div>
      </div>

      <div className="p-4">
        {work.category && (
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
            {work.category}
          </p>
        )}

        {work.title && (
          <h3 className="mt-1 text-base font-black tracking-tight">
            {work.title}
          </h3>
        )}

        {work.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
            {work.description}
          </p>
        )}
      </div>
    </article>
  );
}