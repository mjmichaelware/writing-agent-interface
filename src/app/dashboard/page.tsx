import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-200 p-8 flex flex-col items-center justify-center font-sans">
      <Link href="/" className="absolute top-8 left-8 text-cyan-600 hover:text-cyan-400 flex items-center gap-2 transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="uppercase tracking-[0.2em] text-xs font-semibold">Return to Hub</span>
      </Link>
      <h1 className="text-3xl font-light tracking-[0.3em] uppercase text-white mb-4">dashboard</h1>
      <p className="text-slate-500 tracking-widest text-sm animate-pulse uppercase">Module Offline / Awaiting Component Injection...</p>
    </div>
  );
}
