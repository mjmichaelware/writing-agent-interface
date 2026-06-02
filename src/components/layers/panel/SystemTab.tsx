"use client";

import React, { useState, useEffect } from "react";
import { bus } from "@/core/runtimeEngine";

export default function SystemTab() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (unlocked) {
      fetch("/api/chapters")
        .then(res => res.json())
        .then(data => setChapters(data));
    }
  }, [unlocked]);

  const handleKey = (num: string) => {
    if (error) setError(false);
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === "9187") { // Password updated as requested
          setTimeout(() => setUnlocked(true), 300);
        } else {
          setError(true);
          setTimeout(() => { setPin(""); setError(false); }, 500);
        }
      }
    }
  };

  const handleAgentCall = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          chapterId: selectedChapter,
          context: "writing-agent-mode"
        })
      });
      const data = await res.json();
      setResponse(data.content || data.error);
    } catch (err: any) {
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (unlocked) {
    return (
      <div className="flex flex-col h-full animate-fade-in text-[#e8e4dc]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="panel-h2 m-0 text-left">Writing Agent Console</h2>
          <button 
            onClick={() => setUnlocked(false)} 
            className="text-[10px] uppercase tracking-widest text-[#8a857c] hover:text-[#c9a96e]"
          >
            Lock System
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Chapter Selector & Protocols */}
          <div className="space-y-4 overflow-y-auto pr-2 border-r border-white/5">
            <h3 className="panel-section-heading mt-0">Corpus Context</h3>
            <div className="space-y-1">
              {chapters.map(c => (
                <button 
                  key={c.id}
                  onClick={() => setSelectedChapter(c.id)}
                  className={`w-full text-left p-2 text-xs transition-colors ${selectedChapter === c.id ? 'bg-[#c9a96e]/10 text-[#c9a96e]' : 'hover:bg-white/5 text-[#8a857c]'}`}
                >
                  Ch {c.chapter_number}: {c.status}
                </button>
              ))}
            </div>
            
            <h3 className="panel-section-heading">Operational Protocols</h3>
            <ul className="text-[10px] text-[#8a857c] space-y-2">
              <li className="flex gap-2"><span>•</span> D-4.0 Law of Physical Substitution</li>
              <li className="flex gap-2"><span>•</span> Dahl Visceral Restraint</li>
              <li className="flex gap-2"><span>•</span> Rhetoric of Negation</li>
            </ul>
          </div>

          {/* Prompt & Editor Area */}
          <div className="md:col-span-2 flex flex-col space-y-4 overflow-hidden">
            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#8a857c]">Agent Instruction</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Instruct the agent to compose, edit, or compare..."
                className="gateway-textarea flex-1 bg-black/40 border-white/10"
              />
              <button 
                onClick={handleAgentCall}
                disabled={loading || !prompt}
                className="gateway-button self-end"
              >
                {loading ? "Orchestrating Swarm..." : "Execute Command"}
              </button>
            </div>

            {response && (
              <div className="h-1/2 flex flex-col space-y-2 overflow-hidden border-t border-white/10 pt-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">Agent Output</label>
                <div className="flex-1 overflow-y-auto p-4 bg-white/5 font-serif text-sm leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-[60vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="font-mono text-[10px] tracking-[0.4em] text-[#8a857c] mb-6">SECURE SYSTEM GATEWAY</h2>
        <div className="flex gap-6 justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                error 
                  ? "bg-[#6b2c2c] shadow-[0_0_15px_rgba(107,44,44,0.8)]" 
                  : i < pin.length 
                    ? "bg-[#c9a96e] shadow-[0_0_15px_rgba(201,169,110,0.6)]" 
                    : "bg-white/5"
              }`} 
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full max-w-[240px]">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "ENT"].map((key) => (
          <button 
            key={key} 
            onClick={() => { 
              if (key === "CLR") setPin(""); 
              else if (key === "ENT") { /* PIN handles ENT auto */ }
              else handleKey(key); 
            }} 
            className="aspect-square font-mono text-lg text-[#8a857c] border border-white/5 bg-black/40 hover:bg-white/10 hover:text-[#c9a96e] transition-all rounded-sm flex items-center justify-center"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
