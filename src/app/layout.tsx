import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { readDb } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const db = readDb();
  const settings = db.settings || { resortName: "Misty Heights Resort", tagline: "A luxury hillside sanctuary floating above the clouds." };
  return {
    title: {
      default: settings.resortName || "Misty Heights Resort",
      template: `%s | ${settings.resortName || "Misty Heights Resort"}`,
    },
    description: settings.tagline || "A luxury hillside sanctuary floating above the clouds.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const db = readDb();
  const settings = db.settings || { resortName: "Misty Heights Resort" };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100 font-sans selection:bg-emerald-800 selection:text-emerald-100">
        <Navbar settings={settings} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
