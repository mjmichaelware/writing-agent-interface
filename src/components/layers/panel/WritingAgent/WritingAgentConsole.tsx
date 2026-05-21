"use client";

import React, { useState } from 'react';

const WritingAgentConsole: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'creative_writer', prompt }),
      });
      const data = await res.json();
      setOutput(data.result);
    } catch (err) {
      setOutput('Failed to generate prose.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-l border-[#c5a059] p-6 text-gray-300 font-mono text-sm">
      <h2 className="text-[#c5a059] text-lg mb-4 border-b border-[#c5a059] pb-2 uppercase tracking-widest">
        Writing Agent Cockpit
      </h2>
      
      <div className="flex-1 overflow-auto space-y-4 mb-4 scrollbar-hide">
        {output && (
          <div className="p-4 bg-black border border-gray-800 rounded leading-relaxed text-gray-200">
            {output}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prose instruction (e.g., 'Describe the descent into the pit using visceral imagery')"
          className="w-full h-32 bg-black border border-gray-800 p-3 text-white rounded focus:border-[#c5a059] outline-none transition-colors"
        />
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 bg-[#c5a059] text-black font-bold uppercase tracking-widest hover:bg-[#d4b57a] disabled:opacity-50 transition-colors"
        >
          {isGenerating ? 'ORCHESTRATING...' : 'EXECUTE GENERATION'}
        </button>
      </div>
    </div>
  );
};

export default WritingAgentConsole;