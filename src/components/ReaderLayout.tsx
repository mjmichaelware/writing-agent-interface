"use client";
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useSidebarState, useSidebarDispatch } from '@/context/SidebarContext';

export const ReaderLayout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebarState();
  const { toggle, isOpenRef, triggerRef } = useSidebarDispatch();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
    else if (triggerRef.current?.isConnected) triggerRef.current.focus();
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpenRef.current) toggle(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [toggle, isOpenRef]);

  return (
    <div className="grid h-screen w-full bg-black transition-[grid-template-columns] duration-300" style={{ gridTemplateColumns: isOpen ? '1fr 25%' : '1fr 0%' }}>
      <main className="h-full overflow-y-auto px-6 py-20 relative">
        <div className="max-w-prose mx-auto">{children}</div>
        {!isOpen && <button onClick={(e) => toggle(e.currentTarget)} className="fixed right-0 top-1/2 -translate-y-1/2 w-3 h-24 bg-zinc-800 hover:bg-amber-600 rounded-l-md" />}
      </main>
      <aside {...(!isOpen ? { inert: '' } : {})} className="h-full bg-zinc-950 border-l border-zinc-900 overflow-y-auto">
        <div className="p-8 flex flex-col">
          <button ref={closeBtnRef} onClick={() => toggle()} className="mb-8 text-zinc-500 hover:text-white text-left">Close [Esc]</button>
          <h2 className="text-xs uppercase tracking-widest text-zinc-600">Resonance Hub</h2>
        </div>
      </aside>
    </div>
  );
};
