import type { Metadata } from "next";
import {
  Frank_Ruhl_Libre,
  EB_Garamond
} from "next/font/google";

import "./globals.css";

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-hebrew"
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-prose"
});

export const metadata: Metadata = {
  title: "The Weight of the Sky",
  description:
    "An Archetypal Tale by Michael Alonza Prentice Ware"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${frankRuhl.variable} ${ebGaramond.variable}`}
    >
      <body className="bg-[var(--bg-void)] text-[var(--text-body)] antialiased selection:bg-[var(--accent-gold)]/30">
        {children}
      </body>
    </html>
  );
}
