"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NarrativeState {
  focusedParagraphId: string | null;
  archetypalWeights: any;
  dualismMap: any;
}

interface NarrativeContextType {
  state: NarrativeState;
  setFocus: (id: string | null, weights: any, dualisms: any) => void;
}

const NarrativeContext = createContext<NarrativeContextType | undefined>(undefined);

export function NarrativeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NarrativeState>({
    focusedParagraphId: null,
    archetypalWeights: {},
    dualismMap: {},
  });

  const setFocus = (id: string | null, weights: any, dualisms: any) => {
    setState({
      focusedParagraphId: id,
      archetypalWeights: weights || {},
      dualismMap: dualisms || {},
    });
  };

  return (
    <NarrativeContext.Provider value={{ state, setFocus }}>
      {children}
    </NarrativeContext.Provider>
  );
}

export function useNarrative() {
  const context = useContext(NarrativeContext);
  if (context === undefined) {
    throw new Error('useNarrative must be used within a NarrativeProvider');
  }
  return context;
}