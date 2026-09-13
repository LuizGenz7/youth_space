import { UserRound } from "lucide-react";

export default function TalentHeroFallback({
  initials,
  category,
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-700 via-slate-900 to-slate-950"
      aria-label={`${category || "Talent"} profile placeholder`}
    >
      {/* Ambient glow */}
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/[0.03] blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-500/[0.04] blur-3xl" />

      {/* Decorative rings */}
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[45px] border-white/[0.035]" />

      <div className="absolute -bottom-36 -left-24 h-80 w-80 rounded-full border-[45px] border-white/[0.035]" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />

      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Decorative dots */}
      <div className="absolute left-[16%] top-[27%] h-1.5 w-1.5 rounded-full bg-white/15" />
      <div className="absolute right-[23%] top-[22%] h-2 w-2 rounded-full bg-white/10" />
      <div className="absolute bottom-[23%] left-[31%] h-1.5 w-1.5 rounded-full bg-white/10" />
      <div className="absolute bottom-[31%] right-[17%] h-1 w-1 rounded-full bg-white/10" />

      {/* Center avatar */}
      <div className="relative flex h-full items-center justify-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20">
          <div className="absolute inset-2 rounded-[1.5rem] border border-white/[0.05]" />

          {initials ? (
            <span className="relative text-3xl font-black tracking-tight text-white/45">
              {initials}
            </span>
          ) : (
            <UserRound
              size={42}
              strokeWidth={1.25}
              className="relative text-white/35"
            />
          )}
        </div>
      </div>
    </div>
  );
}