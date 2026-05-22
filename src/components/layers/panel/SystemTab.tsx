"use client";

import React, { useState } from "react";
import { bus } from "@/core/runtimeEngine";

export default function SystemTab() {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [activeTool, setActiveTab] = useState<"AGENT" | "ANALYZER" | "RESOLVER" | "EDITOR">("AGENT");

  const handleKey = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === "1003") {
          setIsUnlocked(true);
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 1000);
        }
      }
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-12 py-20">
        <div className="flex flex-col items-center gap-4">
           <h3 className="font-hebrew text-[#c9a96e] text-xs uppercase tracking-[0.4em]">Authorization Required</h3>
           <div className="flex gap-4">
             {[0, 1, 2, 3].map((i) => (
               <div 
                 key={i} 
                 className={`w-3 h-3 rounded-full border border-[#c9a96e]/30 transition-all duration-300 ${
                   error ? "bg-red-900 border-red-500 shadow-[0_0_10px_red]" :
                   i < pin.length ? "bg-[#c9a96e] shadow-[0_0_15px_#c9a96e]" : "bg-transparent"
                 }`}
               />
             ))}
           </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-[240px]">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "DEL", "0", "ENT"].map((k) => (
            <button
              key={k}
              onClick={() => k === "DEL" ? setPin(pin.slice(0, -1)) : handleKey(k)}
              className="aspect-square border border-white/5 bg-white/[0.02] rounded-full flex items-center justify-center font-hebrew text-[#8a857c] hover:bg-[#c9a96e]/10 hover:text-[#e8e4dc] transition-all active:scale-90"
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Tool Navigation */}
      <nav className="flex justify-around border-b border-white/5 pb-4">
        {(["AGENT", "ANALYZER", "RESOLVER", "EDITOR"] as const).map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`font-hebrew text-[10px] tracking-widest transition-colors ${activeTool === t ? "text-[#c9a96e]" : "text-[#8a857c]"}`}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Tool Content */}
      <div className="flex flex-col gap-6">
        {activeTool === "AGENT" && (
            <div className="flex flex-col gap-4">
                <div className="bg-black/20 border border-white/5 p-4 rounded-sm h-64 overflow-y-auto font-serif italic text-sm text-[#8a857c]">
                    Awaiting prompt...
                </div>
                <input 
                    className="bg-white/[0.03] border border-white/10 p-4 rounded-sm font-serif text-[#e8e4dc] focus:outline-none focus:border-[#c9a96e]/30"
                    placeholder="Consult the Writing Agent..."
                />
            </div>
        )}

        {activeTool === "ANALYZER" && (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-sm">
                <span className="font-serif italic text-[#8a857c]">Drop manuscript file to analyze</span>
                <button className="mt-4 primary-button py-2 px-6 text-xs">Upload .txt</button>
            </div>
        )}

        {activeTool === "RESOLVER" && (
            <div className="flex flex-col gap-4 text-center py-20">
                 <span className="font-serif italic text-[#8a857c]">Awaiting semantic mapper run...</span>
                 <p className="text-[10px] text-[#6b2c2c] uppercase tracking-widest">No conflicts detected in current segment</p>
            </div>
        )}

        {activeTool === "EDITOR" && (
            <div className="flex flex-col gap-4 text-center py-20">
                 <span className="font-serif italic text-[#8a857c]">Select a paragraph to begin live editing</span>
                 <p className="text-[10px] text-[#8a857c] uppercase tracking-widest">Read-only mode disabled</p>
            </div>
        )}
      </div>
    </div>
  );
}