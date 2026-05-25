import React from 'react';

const Dedication: React.FC = () => {
  return (
    <section className="h-screen w-full bg-black flex items-center justify-center p-8">
      <div className="max-w-prose text-center space-y-8 animate-fade-in">
        <p className="text-[#c5a059] italic font-serif text-2xl md:text-3xl leading-relaxed opacity-80">
          For those who wait in the void,<br />
          and for the stones that remember the ascent.
        </p>
        <div className="w-12 h-px bg-[#c5a059] mx-auto opacity-40" />
      </div>
    </section>
  );
};

export default Dedication;