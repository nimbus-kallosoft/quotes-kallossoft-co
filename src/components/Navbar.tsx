"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="glass-strong sticky top-0 z-50" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #2563EB)",
              boxShadow: "0 0 20px rgba(124, 58, 237, 0.45)",
            }}
          >
            ✦
          </div>
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === "/"
                ? "text-white"
                : "hover:text-white"
            }`}
            style={{
              background: pathname === "/" ? "rgba(255,255,255,0.1)" : "transparent",
              border: pathname === "/" ? "1px solid rgba(255,255,255,0.14)" : "1px solid transparent",
              color: pathname === "/" ? "#FFFFFF" : "#8B9DB5",
            }}
          >
            Home
          </Link>
          <Link
            href="/gallery"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all`}
            style={{
              background: pathname === "/gallery" ? "rgba(255,255,255,0.1)" : "transparent",
              border: pathname === "/gallery" ? "1px solid rgba(255,255,255,0.14)" : "1px solid transparent",
              color: pathname === "/gallery" ? "#FFFFFF" : "#8B9DB5",
            }}
          >
            Gallery
          </Link>
        </div>
      </div>
    </nav>
  );
}
