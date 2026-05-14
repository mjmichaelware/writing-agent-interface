"use client";
import React, { createContext, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';

const StateCtx = createContext<{ isOpen: boolean; activeWord: string | null; activeLower: string | null } | undefined>(undefined);
const DispatchCtx = createContext<{ toggle: (trigger?: HTMLElement) => void; select: (word: string) => void; isOpenRef: React.MutableRefObject<boolean>; triggerRef: React.MutableRefObject<HTMLElement | null> } | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const isOpenRef = useRef(isOpen);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  const activeLower = useMemo(() => 
    activeWord ? activeWord.normalize('NFC').toLocaleLowerCase() : null, 
  [activeWord]);

  const toggle = useCallback((trigger?: HTMLElement) => {
    setIsOpen(prev => {
      if (!prev && trigger) triggerRef.current = trigger;
      return !prev;
    });
  }, []);

  const select = useCallback((word: string) => {
    setActiveWord(word);
    setIsOpen(true);
  }, []);

  return (
    <StateCtx.Provider value={{ isOpen, activeWord, activeLower }}>
      <DispatchCtx.Provider value={{ toggle, select, isOpenRef, triggerRef }}>
        {children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  );
};

export const useSidebarState = () => { const c = useContext(StateCtx); if (!c) throw new Error('Err'); return c; };
export const useSidebarDispatch = () => { const c = useContext(DispatchCtx); if (!c) throw new Error('Err'); return c; };
