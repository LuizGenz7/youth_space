import { UserRound } from "lucide-react";

export default function TalentHeroFallback({
  initials,
  category,
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-700 via-slate-900 to-slate-950">
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />

      <div className="absolute left-[15%] top-[30%] h-2 w-2 rounded-full bg-white/10" />

      <div className="absolute right-[25%] top-[25%] h-3 w-3 rounded-full bg-white/10" />

      <div className="absolute bottom-[25%] left-[35%] h-2 w-2 rounded-full bg-white/10" />

      <div className="relative flex h-full items-center justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 text-2xl font-black text-white/40 backdrop-blur">
          {initials || (
            <UserRound size={42} strokeWidth={1.3} />
          )}
        </div>
      </div>
    </div>
  );
}