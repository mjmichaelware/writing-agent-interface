import type { Metadata } from "next";
import { Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";
import { RuntimeProvider } from "@/runtime/runtimeContext";

/**
 * Loading both subsets to ensure Hebrew passages and English 
 * narrative context render with the same weights.
 */
const frankRuhl = Frank_Ruhl_Libre({ 
  subsets: ["hebrew", "latin"],
  variable: '--font-hebrew' 
});

export const metadata: Metadata = {
  title: "Singularity Narrative OS",
  description: "The Weight of the Sky - Michael Alonza P. Ware",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={frankRuhl.className}>
        <RuntimeProvider>
          {children}
        </RuntimeProvider>
      </body>
    </html>
  );
}
