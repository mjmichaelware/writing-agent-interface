"use client";
import React from 'react';
import { useSidebarState, useSidebarDispatch } from '@/context/SidebarContext';

export const ReaderLayout = ({ children, activeEntry }: { children: React.ReactNode, activeEntry?: any }) => {
  const { isOpen } = useSidebarState();
  const { toggle } = useSidebarDispatch();

  return (
    <div className="grid h-screen w-full transition-[grid-template-columns] duration-500 bg-black overflow-hidden" 
         style={{ gridTemplateColumns: isOpen ? '1fr 25%' : '1fr 0%' }}>
      <main className="h-full overflow-y-auto relative">
        <div className="max-w-prose mx-auto">{children}</div>
        {!isOpen && <button onClick={() => toggle()} className="fixed right-0 top-1/2 -translate-y-1/2 w-2 h-24 bg-zinc-800 hover:bg-amber-600 rounded-l-full z-50" />}
      </main>
      <aside className={`h-full bg-zinc-950 border-l border-zinc-900 overflow-y-auto z-40 ${!isOpen ? 'hidden' : 'block'}`}>
        <div className="p-8 flex flex-col space-y-12">
          <button onClick={() => toggle()} className="text-zinc-500 text-left text-xs uppercase tracking-widest">[ Close ]</button>
          <div className="space-y-6">
            <h2 className="text-amber-500 text-[10px] uppercase tracking-[0.3em] font-sans">Archetypal Context</h2>
            {activeEntry ? (
              <div className="animate-reveal space-y-4">
                <h3 className="text-2xl font-serif italic text-white">{activeEntry.archetype}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{activeEntry.historicalContext}</p>
              </div>
            ) : <p className="text-zinc-700 italic text-sm text-center">Selecting active purview...</p>}
          </div>
        </div>
      </aside>
    </div>
  );
};
