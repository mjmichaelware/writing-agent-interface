import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import GraphView from '@/components/ui/graph-view';

export default function GraphPage() {
  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 flex flex-col font-sans overflow-hidden">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="text-cyan-600 hover:text-cyan-400 flex items-center gap-2 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="uppercase tracking-[0.2em] text-xs font-semibold">Return to Hub</span>
        </Link>
      </div>
      
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <h1 className="text-3xl font-light tracking-[0.3em] uppercase text-white drop-shadow-lg">Narrative Matrix</h1>
      </div>

      <div className="flex-1 w-full h-full">
        <GraphView />
      </div>
    </div>
  );
}
