import Link from "next/link";
import { Quote } from "@/types";

interface QuoteCardProps {
  quote: Quote;
  index?: number;
}

export default function QuoteCard({ quote, index = 0 }: QuoteCardProps) {
  const category = quote.categories;
  const colorFrom = category?.color_from || "#8B5CF6";
  const colorTo = category?.color_to || "#3B82F6";

  return (
    <Link href={`/quote/${quote.id}`} className="block group">
      <div
        className="relative rounded-2xl overflow-hidden card-hover"
        style={{
          animationDelay: `${index * 50}ms`,
        }}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${colorFrom}66, ${colorTo}66)`,
            padding: "1px",
          }}
        />

        <div
          className="relative glass rounded-2xl p-6 h-full flex flex-col gap-4"
          style={{
            background: `linear-gradient(135deg, ${colorFrom}11 0%, rgba(17,17,40,0.9) 60%, ${colorTo}11 100%)`,
          }}
        >
          {/* Category badge */}
          {category && (
            <div className="flex items-center gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `linear-gradient(135deg, ${colorFrom}33, ${colorTo}33)`,
                  border: `1px solid ${colorFrom}44`,
                  color: colorFrom,
                }}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </div>
            </div>
          )}

          {/* Quote text */}
          <blockquote
            className="flex-1 text-slate-200 leading-relaxed line-clamp-4"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.05rem",
            }}
          >
            &ldquo;{quote.text}&rdquo;
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${colorFrom}66, transparent)`,
              }}
            />
            <span className="text-slate-400 text-sm">— {quote.author}</span>
          </div>

          {/* Hover glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, ${colorFrom}22 0%, transparent 70%)`,
            }}
          />
        </div>
      </div>
    </Link>
  );
}
