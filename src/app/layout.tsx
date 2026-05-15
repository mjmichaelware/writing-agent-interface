import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RuntimeProvider } from "@/runtime/runtimeContext";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <RuntimeProvider>
          {children}
        </RuntimeProvider>
      </body>
    </html>
  );
}
