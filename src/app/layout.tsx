import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quotes — Beautiful Quote Cards",
  description: "Discover, share, and create beautiful quote cards. Community-powered quote gallery with stunning shareable images.",
  openGraph: {
    title: "Quotes — Beautiful Quote Cards",
    description: "Discover, share, and create beautiful quote cards.",
    siteName: "Quotes by Kallossoft",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
