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
  baseColor: '#e4e4e7',
  descentColor: '#b91c1c',
  sacredColor: '#34d399',
  properColor: '#f59e0b',
  fontScale: 1,
  lineHeight: 2,
  letterSpacing: 0,
  characters: {
    Dan: { color: '#fbbf24', weight: '600', italic: false },
    Aviel: { color: '#a78bfa', weight: '600', italic: false },
    Sak: { color: '#34d399', weight: '700', italic: true },
    Megiddo: { color: '#dc2626', weight: '600', italic: false },
    Dagon: { color: '#7c3aed', weight: '700', italic: false },
    Izabel: { color: '#ec4899', weight: '600', italic: true },
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
