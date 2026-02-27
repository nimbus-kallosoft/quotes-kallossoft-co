"use client";

import { useState } from "react";
import { Category } from "@/types";
import { useRouter } from "next/navigation";

interface QuoteFormProps {
  categories: Category[];
}

export default function QuoteForm({ categories }: QuoteFormProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const colorFrom = selectedCategory?.color_from || "#8B5CF6";
  const colorTo = selectedCategory?.color_to || "#3B82F6";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, author, category_id: categoryId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit quote");
      }

      setSuccess(true);
      setText("");
      setAuthor("");
      setTimeout(() => {
        setSuccess(false);
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass rounded-2xl p-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colorFrom}11 0%, rgba(17,17,40,0.95) 60%, ${colorTo}11 100%)`,
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${colorFrom} 0%, transparent 70%)`,
        }}
      />

      <h2
        className="text-2xl font-bold text-white mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Share a Quote
      </h2>

      {success && (
        <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          Quote submitted successfully! ✨
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Category selector */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className="px-3 py-1.5 rounded-full text-sm transition-all"
                style={{
                  background:
                    categoryId === cat.id
                      ? `linear-gradient(135deg, ${cat.color_from}44, ${cat.color_to}44)`
                      : "rgba(255,255,255,0.05)",
                  border: `1px solid ${
                    categoryId === cat.id ? cat.color_from + "66" : "rgba(255,255,255,0.1)"
                  }`,
                  color: categoryId === cat.id ? cat.color_from : "#94a3b8",
                }}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quote text */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Quote <span className="text-slate-600">({text.length}/500)</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter an inspiring quote..."
            maxLength={500}
            rows={4}
            required
            className="w-full rounded-xl px-4 py-3 text-white placeholder-slate-600 resize-none focus:outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "var(--font-playfair)",
              fontSize: "1.05rem",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colorFrom + "66";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">Author</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Who said this?"
            required
            className="w-full rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colorFrom + "66";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !text || !author}
          className="mt-2 py-3 px-6 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
          }}
        >
          {loading ? "Submitting..." : "Share Quote ✨"}
        </button>
      </form>
    </div>
  );
}
