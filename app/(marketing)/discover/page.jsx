import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DiscoverHero from "@/components/discover/DiscoverHero";
import DiscoverContent from "@/components/discover/DiscoverContent";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <DiscoverHero />

      <DiscoverContent />

      <Footer />
    </main>
  );
}