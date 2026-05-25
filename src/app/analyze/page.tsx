"use client";

import React, { useState } from 'react';
import ReaderLayout from '@/components/ReaderLayout';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/analyze-document', {
          method: 'POST',
          body: JSON.stringify({
            fileBase64: base64,
            mimeType: file.type,
          }),
        });
        const data = await res.json();
        setResult(data);
        setLoading(false);
      };
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <ReaderLayout>
      <div className="max-w-4xl mx-auto py-32 px-8 min-h-screen">
        <h1 className="title-display mb-16">Document Analyzer</h1>
        
        <div className="space-y-8 bg-[#0a0a0a] p-12 border border-[var(--accent-gold)]/20">
          <div className="flex flex-col space-y-4">
            <label className="section-label">Upload Intelligence</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-[var(--text-muted)] font-serif"
            />
            <button 
              onClick={handleUpload}
              disabled={loading || !file}
              className="primary-button w-fit disabled:opacity-30"
            >
              {loading ? "Analyzing..." : "Begin Synthesis"}
            </button>
          </div>

          {result && (
            <div className="mt-16 space-y-12 animate-fade-in">
              <div className="prose-paragraph whitespace-pre-wrap font-serif leading-[2]">
                {result.analysis}
              </div>
            </div>
          )}
        </div>
      </div>
    </ReaderLayout>
  );
}
