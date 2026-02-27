import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

interface Props {
  params: Promise<{ id: string }>;
}

async function getQuote(id: string) {
  const { data } = await supabase
    .from("quotes")
    .select("*, categories(*)")
    .eq("id", id)
    .single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const quote = await getQuote(id);

  if (!quote) return { title: "Quote Not Found" };

  return {
    title: `"${quote.text.slice(0, 60)}${quote.text.length > 60 ? "..." : ""}" — ${quote.author}`,
    description: quote.text,
    openGraph: {
      title: `"${quote.text.slice(0, 60)}..." — ${quote.author}`,
      description: quote.text,
      images: [
        {
          url: `/api/og/${id}`,
          width: 1200,
          height: 630,
          alt: `Quote by ${quote.author}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `"${quote.text.slice(0, 60)}..."`,
      description: `— ${quote.author}`,
      images: [`/api/og/${id}`],
    },
  };
}

export default async function QuotePage({ params }: Props) {
  const { id } = await params;
  const quote = await getQuote(id);

  if (!quote) notFound();

  const category = quote.categories;
  const colorFrom = category?.color_from || "#8B5CF6";
  const colorTo = category?.color_to || "#3B82F6";
  const shareUrl = `https://quotes.kallossoft.co/quote/${id}`;

  return (
    <main className="min-h-screen py-16" style={{ backgroundColor: "#0a0a1a" }}>
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 text-sm"
        >
          ← Back to Gallery
        </Link>

        {/* Quote card (large) */}
        <div
          className="relative rounded-3xl overflow-hidden mb-8"
          style={{
            background: `linear-gradient(135deg, ${colorFrom}22 0%, #111128 50%, ${colorTo}22 100%)`,
            border: `1px solid ${colorFrom}33`,
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse, ${colorFrom} 0%, transparent 70%)`,
            }}
          />

          <div className="relative p-10 sm:p-16">
            {/* Category */}
            {category && (
              <div className="flex items-center gap-2 mb-8">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${colorFrom}33, ${colorTo}33)`,
                    border: `1px solid ${colorFrom}55`,
                    color: colorFrom,
                  }}
                >
                  <span className="text-lg">{category.emoji}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
              </div>
            )}

            {/* Large quote mark */}
            <div
              className="text-8xl leading-none mb-4 opacity-30"
              style={{
                fontFamily: "var(--font-playfair)",
                color: colorFrom,
              }}
            >
              &ldquo;
            </div>

            {/* Quote */}
            <blockquote
              className="text-3xl sm:text-4xl text-white leading-relaxed mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {quote.text}
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div
                className="h-px w-16"
                style={{
                  background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
                }}
              />
              <span className="text-slate-300 text-lg">— {quote.author}</span>
            </div>
          </div>
        </div>

        {/* Share section */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm mb-4 uppercase tracking-widest">
            Share this quote
          </h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" — ${quote.author}`)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
              style={{ background: "linear-gradient(135deg, #1DA1F244, #1DA1F222)", border: "1px solid #1DA1F244" }}
            >
              𝕏 Twitter
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
              style={{ background: "linear-gradient(135deg, #0A66C244, #0A66C222)", border: "1px solid #0A66C244" }}
            >
              LinkedIn
            </a>

            <a
              href={`/api/og/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
              style={{
                background: `linear-gradient(135deg, ${colorFrom}44, ${colorTo}44)`,
                border: `1px solid ${colorFrom}55`,
              }}
            >
              🖼 View Card Image
            </a>

            <CopyButton url={shareUrl} />
          </div>
        </div>

        {/* OG image preview */}
        <div className="mt-6">
          <p className="text-slate-600 text-xs mb-3">Card preview (shared when link is posted)</p>
          <div className="rounded-xl overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/og/${id}`}
              alt="Quote card"
              className="w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
