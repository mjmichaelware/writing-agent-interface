import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ReaderLayout } from "@/components/ReaderLayout";

export const metadata: Metadata = {
  title: "Narrative OS | The Weight of the Sky",
  description: "A 24-Chapter Sectional Cinema Experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark selection:bg-gold-low/30 selection:text-gold-high">
      <body className="antialiased min-h-screen">
        <SidebarProvider>
          {/* ReaderLayout provides the physical 25% HUD logic */}
          <ReaderLayout>
            {/* Global Branding / Minimalist HUD */}
            <header className="fixed top-10 left-12 z-[60] pointer-events-none mix-blend-difference">
              <div className="flex items-center space-x-6">
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.8em] uppercase text-white/40">Narrative OS</span>
                  <span className="text-[9px] tracking-[0.2em] text-gold-mid/60 mt-1 uppercase">24.1.E_V11.0</span>
                </div>
              </div>
            </header>

            {/* Global Progress Indicator */}
            <div className="fixed bottom-10 left-12 z-[60] text-white/20 text-[10px] uppercase tracking-widest pointer-events-none">
              SCENE_7 // THE_PIT
            </div>

            {children}
          </ReaderLayout>
        </SidebarProvider>
      </body>
    </html>
  );
}
