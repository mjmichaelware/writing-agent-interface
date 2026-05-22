import React from 'react';

const Synopsis: React.FC = () => {
  return (
    <section className="min-h-screen w-full bg-black flex items-center justify-center p-8 py-40">
      <div className="max-w-prose space-y-12">
        <h2 className="text-3xl font-serif text-[#c5a059] border-b border-[#c5a059]/30 pb-4 tracking-widest">
          SYNOPSIS
        </h2>
        <div className="space-y-8 text-xl md:text-2xl font-serif text-gray-300 leading-relaxed text-justify">
          <p>
            Hebron, 1003 BCE. A scholar named Aviel surrenders to the crushing gravity of grief, 
            transforming his home into a reliquary of decay. His son, Dan, possesses a forbidden 
            inheritance: the ability to walk through the dreams of men.
          </p>
          <p>
            As the Earth-God Dagon tightens his claim on the horizontal world, Dan must embark on 
            a vertical journey—a systems research into the architecture of the void—to find 
            the path of the ascent before the stardust returns to stardust.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Synopsis;