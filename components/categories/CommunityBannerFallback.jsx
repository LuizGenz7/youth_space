import { Users } from "lucide-react";

export default function CommunityBannerFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

      <div className="absolute left-[15%] top-[25%] h-3 w-3 rounded-full bg-white/10" />

      <div className="absolute right-[25%] top-[30%] h-2 w-2 rounded-full bg-white/10" />

      <div className="absolute bottom-[25%] left-[35%] h-2 w-2 rounded-full bg-white/10" />

      <div className="relative flex h-full min-h-[340px] items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/40 backdrop-blur">
          <Users size={30} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
