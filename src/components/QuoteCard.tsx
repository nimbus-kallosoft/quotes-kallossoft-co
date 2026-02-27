"use client";

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
    <Link href={`/quote/${quote.id}`} className="block group h-full">
      <article
        className="relative h-full rounded-2xl overflow-hidden transition-all duration-500 ease-out"
        style={{
          animationDelay: `${index * 60}ms`,
          transform: "translateZ(0)",
        }}
      >
        {/* Animated gradient border on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"
          style={{
            background: `linear-gradient(135deg, ${colorFrom}80, ${colorTo}80)`,
            filter: "blur(8px)",
            transform: "scale(0.95) translateY(4px)",
          }}
        />

        {/* Main card container */}
        <div
          className="relative h-full rounded-2xl p-6 flex flex-col gap-4 transition-all duration-400 ease-out group-hover:-translate-y-1"
          style={{
            background: `
              linear-gradient(135deg, 
                ${colorFrom}08 0%, 
                rgba(15, 15, 25, 0.95) 30%,
                rgba(15, 15, 25, 0.98) 70%, 
                ${colorTo}08 100%
              )
            `,
            border: "1px solid rgba(255, 255, 255, 0.06)",
            boxShadow: `
              0 1px 2px rgba(0, 0, 0, 0.3),
              0 4px 16px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.04)
            `,
          }}
        >
          {/* Top highlight line */}
          <div
            className="absolute top-0 left-4 right-4 h-px opacity-30 group-hover:opacity-60 transition-opacity duration-400"
            style={{
              background: `linear-gradient(90deg, transparent, ${colorFrom}, ${colorTo}, transparent)`,
            }}
          />

          {/* Category badge */}
          {category && (
            <div className="flex items-center gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${colorFrom}20, ${colorTo}15)`,
                  border: `1px solid ${colorFrom}30`,
                  color: colorFrom,
                  boxShadow: `0 2px 8px ${colorFrom}15`,
                }}
              >
                <span className="text-sm">{category.emoji}</span>
                <span className="tracking-wide">{category.name}</span>
              </div>
            </div>
          )}

          {/* Quote text - ENHANCED TYPOGRAPHY */}
          <blockquote
            className="flex-1 text-slate-200 leading-relaxed line-clamp-4 transition-colors duration-300 group-hover:text-white"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.125rem",
              lineHeight: "1.7",
              letterSpacing: "-0.01em",
            }}
          >
            &ldquo;{quote.text}&rdquo;
          </blockquote>

          {/* Author - ENHANCED HIERARCHY */}
          <div className="flex items-center gap-3 pt-2">
            <div
              className="h-px flex-1 opacity-60"
              style={{
                background: `linear-gradient(90deg, ${colorFrom}60, transparent)`,
              }}
            />
            <span 
              className="text-slate-400 text-sm font-medium tracking-wide transition-colors duration-300 group-hover:text-slate-300"
              style={{
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {quote.author}
            </span>
          </div>

          {/* Bottom ambient glow on hover */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-b-2xl"
            style={{
              background: `linear-gradient(to top, ${colorFrom}12, transparent)`,
            }}
          />
        </div>
      </article>
    </Link>
  );
}
