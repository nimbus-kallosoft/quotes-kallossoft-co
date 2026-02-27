"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">✨</span>
          <span
            className="text-lg font-semibold text-white tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Quotes
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              pathname === "/"
                ? "text-white bg-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Home
          </Link>
          <Link
            href="/gallery"
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              pathname === "/gallery"
                ? "text-white bg-white/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Gallery
          </Link>
        </div>
      </div>
    </nav>
  );
}
