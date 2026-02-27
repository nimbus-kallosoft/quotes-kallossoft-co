import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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
      <body className={`${playfair.variable} ${dmSans.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
