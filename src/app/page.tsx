import { supabase } from "@/lib/supabase";
import { Category, Quote } from "@/types";
import QuoteCard from "@/components/QuoteCard";
import QuoteForm from "@/components/QuoteForm";

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

async function getFeaturedQuotes(): Promise<Quote[]> {
  const { data } = await supabase
    .from("quotes")
    .select("*, categories(*)")
    .order("created_at", { ascending: false })
    .limit(12);
  return data || [];
}

export default async function HomePage() {
  const [categories, quotes] = await Promise.all([
    getCategories(),
    getFeaturedQuotes(),
  ]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0a0a1a" }}>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20 blur-3xl rounded-full"
            style={{ background: "#8B5CF6" }}
          />
          <div
            className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20 blur-3xl rounded-full"
            style={{ background: "#3B82F6" }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-slate-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Community Quote Gallery
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Words that
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              inspire
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
            Discover and share beautiful quotes. Each one becomes a stunning
            shareable card. Community-curated, always growing.
          </p>

          <div className="flex items-center justify-center flex-wrap gap-4 text-slate-500 text-sm">
            {categories.map((cat) => (
              <span key={cat.id} className="flex items-center gap-1">
                {cat.emoji} {cat.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <QuoteForm categories={categories} />
            </div>
          </div>

          {/* Quotes grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Latest Quotes
              </h2>
              <a
                href="/gallery"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                View all →
              </a>
            </div>

            {quotes.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-slate-500 text-lg">
                  No quotes yet. Be the first to share one!
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {quotes.map((quote, i) => (
                  <div key={quote.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <QuoteCard quote={quote} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
