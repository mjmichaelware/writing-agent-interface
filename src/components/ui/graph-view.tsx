"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';

interface Node {
  id: string;
  group: string;
  label: string;
  val: number;
  color?: string;
}

interface Link {
  source: string;
  target: string;
  type: string;
  value: number;
}

const GROUP_COLORS: Record<string, string> = {
  paragraph: '#1e293b', // slate-800
  archetype: '#eab308', // yellow-500
  dualism: '#ef4444',   // red-500
  biblical: '#3b82f6',  // blue-500
  theme: '#10b981',     // emerald-500
};

const GLOW_COLORS: Record<string, string> = {
  archetype: 'rgba(234, 179, 8, 0.6)',
  dualism: 'rgba(239, 68, 68, 0.6)',
  biblical: 'rgba(59, 130, 246, 0.6)',
  theme: 'rgba(16, 185, 129, 0.6)',
};

export default function GraphView() {
  const fgRef = useRef<ForceGraphMethods>();
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [hoverNode, setHoverNode] = useState<Node | null>(null);

  useEffect(() => {
    fetch('/api/graph')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Graph Load Error:', err);
        setLoading(false);
      });
  }, []);

  // Filter out singleton paragraphs for a cleaner "meaning" graph if desired
  // For now, show all to demonstrate the "Matrix" scale
  const graphData = useMemo(() => {
    return {
      nodes: data.nodes.map(n => ({ ...n })),
      links: data.links.map(l => ({ ...l }))
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 font-mono text-cyan-500">
        <div className="text-sm tracking-[0.5em] animate-pulse uppercase mb-4">Initializing Narrative Matrix</div>
        <div className="w-48 h-[1px] bg-cyan-900/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-cyan-500 animate-[loading-bar_2s_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#020617] overflow-hidden group">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#020617"
        nodeLabel={(node: any) => `${node.group.toUpperCase()}: ${node.label}`}
        nodeRelSize={6}
        nodeVal={(node: any) => node.val}
        nodeColor={(node: any) => GROUP_COLORS[node.group] || '#475569'}
        
        // Cinematic Node Canvas Painting
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.label;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px "Inter", sans-serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          // Glow effect for meaning nodes
          if (node.group !== 'paragraph') {
            ctx.shadowBlur = 15 / globalScale;
            ctx.shadowColor = GLOW_COLORS[node.group] || 'transparent';
          }

          // Node Circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val * 2 + 2, 0, 2 * Math.PI, false);
          ctx.fillStyle = GROUP_COLORS[node.group] || '#475569';
          ctx.fill();
          
          // Reset shadow for text
          ctx.shadowBlur = 0;

          // Label for meaningful nodes or hovered
          if (node.group !== 'paragraph' || node === hoverNode) {
             ctx.fillStyle = node === hoverNode ? '#fff' : 'rgba(255,255,255,0.7)';
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillText(label, node.x, node.y + (node.val * 2 + 8));
          }
        }}

        // Cinematic Link Painting
        linkWidth={(link: any) => Math.sqrt(link.value) * 1}
        linkColor={() => 'rgba(255,255,255,0.08)'}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={(d: any) => d.value * 0.005}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={(link: any) => {
          const targetNode = data.nodes.find(n => n.id === (typeof link.target === 'object' ? link.target.id : link.target));
          return targetNode ? GROUP_COLORS[targetNode.group] : '#fff';
        }}
        
        onNodeHover={setHoverNode}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
        <div className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-[0.3em]">Neural Topology Active</div>
        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
          Nodes: {data.nodes.length} | Links: {data.links.length}
        </div>
      </div>

      <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md p-6 rounded-sm border border-white/10 text-[10px] font-mono text-slate-400 pointer-events-none">
        <h3 className="text-white mb-4 font-bold tracking-[0.3em] uppercase border-b border-white/10 pb-2">Narrative Legend</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></div> ARCHETYPES</div>
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div> DUALISMS</div>
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div> BIBLICAL REFS</div>
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div> THEMES</div>
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-slate-800"></div> PARAGRAPHS</div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
