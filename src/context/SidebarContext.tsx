import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';

const StateCtx = createContext(undefined);
const DispatchCtx = createContext(undefined);

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeWord, setActiveWord] = useState(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  const activeLower = useMemo(() => 
    activeWord ? activeWord.normalize('NFC').toLocaleLowerCase() : null, 
  [activeWord]);

  const toggle = () => setIsOpen(prev => !prev);
  const select = (word) => { setActiveWord(word); setIsOpen(true); };

  return (
    <StateCtx.Provider value={{ isOpen, activeWord, activeLower }}>
      <DispatchCtx.Provider value={{ toggle, select, isOpenRef }}>
        {children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  );
};

export const useSidebarState = () => {
  const context = useContext(StateCtx);
  if (!context) throw new Error('useSidebarState must be used within SidebarProvider');
  return context;
};

export const useSidebarDispatch = () => {
  const context = useContext(DispatchCtx);
  if (!context) throw new Error('useSidebarDispatch must be used within SidebarProvider');
  return context;
};
