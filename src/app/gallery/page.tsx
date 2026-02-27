"use client";

import { useEffect, useState, useCallback } from "react";
import { Category, Quote } from "@/types";
import QuoteCard from "@/components/QuoteCard";

const LIMIT = 12;

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetch("/api/quotes?limit=100")
      .then((r) => r.json())
      .then((data: Quote[]) => {
        const cats = data.reduce<Category[]>((acc, q) => {
          if (q.categories && !acc.find((c) => c.id === q.categories!.id)) {
            acc.push(q.categories);
          }
          return acc;
        }, []);
        setCategories(cats);
      });
  }, []);

  const loadQuotes = useCallback(
    async (cat: string, off: number, append: boolean) => {
      const params = new URLSearchParams({
        limit: String(LIMIT),
        offset: String(off),
      });
      if (cat !== "all") params.set("category", cat);

      const res = await fetch(`/api/quotes?${params}`);
      const data: Quote[] = await res.json();

      if (append) {
        setQuotes((prev) => [...prev, ...data]);
      } else {
        setQuotes(data);
      }
      setHasMore(data.length === LIMIT);
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    loadQuotes(activeCategory, 0, false).finally(() => setLoading(false));
  }, [activeCategory, loadQuotes]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const newOffset = offset + LIMIT;
    await loadQuotes(activeCategory, newOffset, true);
    setOffset(newOffset);
    setLoadingMore(false);
  };

  return (
    <main className="min-h-screen py-20 md:py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header - ENHANCED TYPOGRAPHY */}
        <div className="mb-14 md:mb-16">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Quote <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Explore wisdom across all categories. Discover quotes that inspire, motivate, and resonate.
          </p>
        </div>

        {/* Category filters - ENHANCED DESIGN */}
        <div className="flex flex-wrap gap-2.5 mb-12 md:mb-14">
          <button
            onClick={() => setActiveCategory("all")}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              background:
                activeCategory === "all"
                  ? "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.2))"
                  : "rgba(255,255,255,0.03)",
              border: `1px solid ${
                activeCategory === "all"
                  ? "rgba(139, 92, 246, 0.4)"
                  : "rgba(255,255,255,0.08)"
              }`,
              color: activeCategory === "all" ? "#A78BFA" : "#94a3b8",
              boxShadow: activeCategory === "all" 
                ? "0 4px 16px rgba(139, 92, 246, 0.15)" 
                : "none",
            }}
          >
            ✨ All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
              style={{
                background:
                  activeCategory === cat.id
                    ? `linear-gradient(135deg, ${cat.color_from}30, ${cat.color_to}25)`
                    : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  activeCategory === cat.id
                    ? `${cat.color_from}50`
                    : "rgba(255,255,255,0.08)"
                }`,
                color:
                  activeCategory === cat.id ? cat.color_from : "#94a3b8",
                boxShadow: activeCategory === cat.id 
                  ? `0 4px 16px ${cat.color_from}20` 
                  : "none",
              }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Grid - ENHANCED SPACING */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl h-56 shimmer"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.05))",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              />
            ))}
          </div>
        ) : quotes.length === 0 ? (
          <div 
            className="rounded-2xl p-16 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-slate-500 text-lg">
              No quotes in this category yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {quotes.map((quote, i) => (
                <div
                  key={quote.id}
                  className="fade-up h-full"
                  style={{ animationDelay: `${(i % LIMIT) * 60}ms` }}
                >
                  <QuoteCard quote={quote} index={i} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-16 md:mt-20 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-10 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.15))",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    boxShadow: "0 4px 16px rgba(139, 92, 246, 0.1)",
                  }}
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Load More Quotes"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
