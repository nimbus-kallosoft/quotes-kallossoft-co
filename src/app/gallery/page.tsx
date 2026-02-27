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
    <main className="min-h-screen py-16" style={{ backgroundColor: "#0a0a1a" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Quote Gallery
          </h1>
          <p className="text-slate-400">
            Explore wisdom across all categories
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className="px-4 py-2 rounded-full text-sm transition-all"
            style={{
              background:
                activeCategory === "all"
                  ? "linear-gradient(135deg, #8B5CF644, #3B82F644)"
                  : "rgba(255,255,255,0.05)",
              border: `1px solid ${
                activeCategory === "all"
                  ? "#8B5CF666"
                  : "rgba(255,255,255,0.1)"
              }`,
              color: activeCategory === "all" ? "#a78bfa" : "#94a3b8",
            }}
          >
            ✨ All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-full text-sm transition-all"
              style={{
                background:
                  activeCategory === cat.id
                    ? `linear-gradient(135deg, ${cat.color_from}44, ${cat.color_to}44)`
                    : "rgba(255,255,255,0.05)",
                border: `1px solid ${
                  activeCategory === cat.id
                    ? cat.color_from + "66"
                    : "rgba(255,255,255,0.1)"
                }`,
                color:
                  activeCategory === cat.id ? cat.color_from : "#94a3b8",
              }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl h-48 shimmer"
              />
            ))}
          </div>
        ) : quotes.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <p className="text-slate-500 text-lg">
              No quotes in this category yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotes.map((quote, i) => (
                <div
                  key={quote.id}
                  className="fade-up"
                  style={{ animationDelay: `${(i % LIMIT) * 50}ms` }}
                >
                  <QuoteCard quote={quote} index={i} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF644, #3B82F644)",
                    border: "1px solid #8B5CF644",
                  }}
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
