import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, EB_Garamond } from "next/font/google";
import "./globals.css";
import Layer4Panel from "@/components/layers/Layer4Panel";
import RuntimeInitializer from "@/components/RuntimeInitializer";
import BookOpeningSequence from "@/components/BookOpeningSequence";

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-hebrew",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-prose",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "The Weight of the Sky",
  description: "An Archetypal Tale by Michael Alonza Prentice Ware",
  authors: [{ name: "Michael Alonza Prentice Ware" }],
  openGraph: {
    title: "The Weight of the Sky",
    description: "In Hebron in 1003 BCE, sixteen-year-old Dan, a dreamwalker, is cast out and forced to trek toward Mount Hermon to find the ultimate source of reality.",
    type: "book",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${frankRuhl.variable} ${ebGaramond.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[var(--bg-void)] text-[var(--text-body)] antialiased selection:bg-[var(--accent-gold)]/25">
        <BookOpeningSequence />
        <RuntimeInitializer />
        {children}
        <Layer4Panel />
      </body>
    </html>
  );
}
