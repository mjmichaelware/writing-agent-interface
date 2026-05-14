import React, { useEffect, useState } from 'react';
import { useSidebarState } from '@/context/SidebarContext';

export const ResonanceSidebar = () => {
  const { activeWord, activeLower, isOpen } = useSidebarState();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeLower && isOpen) {
      setLoading(true);
      fetch(`/api/search?term=${activeLower}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.results || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [activeLower, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="border-b border-zinc-800 pb-6">
        <h3 className="text-amber-500 text-[10px] uppercase tracking-[0.3em] mb-2 font-sans">Active Echo</h3>
        <p className="text-2xl font-bold italic text-white">"{activeWord}"</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-sans">182-Node Concordance</h3>
        {loading ? (
          <p className="text-zinc-600 animate-pulse italic">Scanning buffer...</p>
        ) : results.length > 0 ? (
          results.map((res, i) => (
            <div key={i} className="group cursor-default">
              <p className="text-[9px] text-amber-700 uppercase mb-2 truncate">{res.file}</p>
              <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-200 transition-colors">
                {res.snippet}
              </p>
            </div>
          ))
        ) : (
          <p className="text-zinc-600 italic text-sm">No echoes found.</p>
        )}
      </div>
    </div>
  );
};
