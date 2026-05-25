"use client";

import { useState, useEffect } from 'react';

export type CharacterStyle = {
  color: string;
  weight: '400' | '500' | '600' | '700';
  italic: boolean;
};

export type ControlPanelState = {
  baseColor: string;
  descentColor: string;
  sacredColor: string;
  properColor: string;
  fontScale: number;
  lineHeight: number;
  letterSpacing: number;
  characters: Record<string, CharacterStyle>;
};

const DEFAULTS: ControlPanelState = {
  baseColor: '#e8e4dc',
  descentColor: '#6b2c2c',
  sacredColor: '#e8d4a0',
  properColor: '#c9a96e',
  fontScale: 1.125,
  lineHeight: 1.7,
  letterSpacing: 0,
  characters: {
    Dan:     { color: '#d4a574', weight: '600', italic: false },
    Aviel:   { color: '#a89bb5', weight: '500', italic: false },
    Sak:     { color: '#9ab28a', weight: '600', italic: true  },
    Megiddo: { color: '#8c3a3a', weight: '600', italic: false },
    Dagon:   { color: '#6b4a7a', weight: '700', italic: false },
    Izabel:  { color: '#b88a9a', weight: '500', italic: true  },
  },
};

const KEY = 'singularity:controlPanel';

export function useControlPanel() {
  const [state, setState] = useState<ControlPanelState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const update = (patch: Partial<ControlPanelState>) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const updateCharacter = (name: string, patch: Partial<CharacterStyle>) => {
    setState(prev => {
      const next = {
        ...prev,
        characters: {
          ...prev.characters,
          [name]: { ...(prev.characters[name] || DEFAULTS.characters.Dan), ...patch },
        },
      };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return { state, update, updateCharacter };
}

// Rule-based word classifier for the reader
const DESCENT = new Set(['blood','pit','dark','fallen','descent','death','shadow','cold','old','bruised','staining','silent','heavy','sluggish','recoiled','buried']);
const SACRED = new Set(['lord','sky','sun','light','rays','gates','sacred','rise','ascent','holy']);

export function classifyWord(raw: string, state: ControlPanelState): CharacterStyle {
  const clean = raw.replace(/[^a-zA-Z]/g, '');
  if (state.characters[clean]) return state.characters[clean];
  const lower = clean.toLowerCase();
  if (DESCENT.has(lower)) return { color: state.descentColor, weight: '500', italic: false };
  if (SACRED.has(lower))  return { color: state.sacredColor,  weight: '500', italic: false };
  return { color: state.baseColor, weight: '400', italic: false };
}
