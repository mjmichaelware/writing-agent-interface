import React from 'react';

const AboutAuthor: React.FC = () => {
  return (
    <section className="min-h-screen w-full bg-black flex items-center justify-center p-8 py-40">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-serif text-[#c5a059] border-b border-[#c5a059]/30 pb-4 tracking-widest uppercase">
            The Author
          </h2>
          <div className="text-lg md:text-xl font-serif text-gray-400 leading-relaxed space-y-4">
            <p>
              MJ Michael Ware is a systems researcher and classical pianist whose work explores 
              the intersection of ancient theological structures and modern technological 
              operating systems.
            </p>
            <p>
              "The Weight of the Sky" is the culmination of a year-long autonomous 
              synthesis, written entirely within a native Termux environment on a 
              mobile device.
            </p>
          </div>
        </div>
        <div className="relative aspect-[3/4] border border-[#c5a059]/20 bg-gray-900 overflow-hidden">
          {/* Placeholder for author image or abstract kinetic graphic */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black to-transparent opacity-60" />
          <div className="absolute bottom-8 left-8 right-8 text-[#c5a059] font-mono text-xs tracking-widest uppercase opacity-40">
            Systems Architect // 1003 BCE
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAuthor;