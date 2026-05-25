"use client";

import React, { useEffect, useState } from 'react';

interface Chapter {
  id: string;
  chapter_number: number;
  part_number: string;
  status: string;
}

const TableOfContents: React.FC<{ onSelect?: (id: string) => void }> = ({ onSelect }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    fetch('/api/chapters')
      .then(res => res.json())
      .then(data => setChapters(data));
  }, []);

  const parts = ['1', '2', '3', 'epilogue'];

  return (
    <section className="min-h-screen w-full bg-black py-20 px-8 flex flex-col items-center">
      <h2 className="text-3xl font-serif text-[#c5a059] mb-12 border-b border-[#c5a059] pb-2 px-4">
        MATRIX INDEX
      </h2>
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {parts.map(part => (
          <div key={part} className="space-y-4">
            <h3 className="text-xl font-serif text-gray-500 uppercase tracking-widest border-l-2 border-[#c5a059] pl-4">
              Part {part === 'epilogue' ? 'Ω' : part}
            </h3>
            <ul className="space-y-2 pl-4">
              {chapters.filter(c => c.part_number === part).map(chapter => (
                <li 
                  key={chapter.id}
                  onClick={() => chapter.status === 'drafted' && onSelect?.(chapter.id)}
                  className={`text-lg font-serif transition-all duration-500 cursor-pointer ${
                    chapter.status === 'drafted' 
                      ? 'text-white hover:text-[#c5a059] hover:translate-x-2' 
                      : 'text-gray-700 italic'
                  }`}
                >
                  Chapter {chapter.chapter_number}
                  {chapter.status !== 'drafted' && ' (unwritten)'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TableOfContents;