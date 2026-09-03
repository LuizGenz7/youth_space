import { Suspense } from "react";

import TalentsContent from "@/components/talents/TalentsContent";
import TalentsLoading from "@/components/talents/TalentsLoading";

export default function TalentsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Suspense fallback={<TalentsLoading />}>
        <TalentsContent />
      </Suspense>
    </main>
  );
}