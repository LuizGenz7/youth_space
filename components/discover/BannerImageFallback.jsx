import { Users } from "lucide-react";

export default function BannerImageFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/40 backdrop-blur">
        <Users size={30} strokeWidth={1.5} />
      </div>
    </div>
  );
}