import React from 'react';
import { useSidebarState, useSidebarDispatch } from '@/context/SidebarContext';

export const ReaderLayout = ({ children }) => {
  const { isOpen } = useSidebarState();
  const { toggle } = useSidebarDispatch();

  return (
    <div 
      className="grid h-screen w-full transition-[grid-template-columns] duration-700 ease-in-out bg-black overflow-hidden" 
      style={{ gridTemplateColumns: isOpen ? '75% 25%' : '100% 0%' }}
    >
      <main className="h-full overflow-y-auto relative selection:bg-amber-900/30">
        <div className="max-w-prose mx-auto py-32 px-8">
          {children}
        </div>
        
        {!isOpen && (
          <button 
            onClick={() => toggle()} 
            className="fixed right-0 top-1/2 -translate-y-1/2 w-2 h-24 bg-zinc-800 hover:bg-amber-600 rounded-l-full transition-all z-50"
          />
        )}
      </main>

      <aside 
        {...(!isOpen ? { inert: '' } : {})} 
        className={`h-full bg-zinc-950 border-l border-zinc-900 overflow-y-auto z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="p-10 flex flex-col h-full">
          <button onClick={() => toggle()} className="self-start text-zinc-600 hover:text-white mb-12 text-[10px] uppercase tracking-widest border border-white/5 px-3 py-2">
            [ Close ]
          </button>
          <div className="space-y-8">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-sans">Resonance Hub</h2>
            {/* Search results for the 182-node buffer populate here */}
          </div>
        </div>
      </aside>
    </div>
  );
};
