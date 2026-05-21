import React from 'react';
import Image from 'next/image';

const TitleCover: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.png"
          alt="Balloon Boy"
          fill
          priority
          className="object-cover opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-hebrew text-[#c5a059] tracking-tighter mb-4">
          THE WEIGHT OF THE SKY
        </h1>
        <p className="text-xl md:text-2xl italic font-serif text-gray-400">
          a systems research into the architecture of the void
        </p>
      </div>
    </section>
  );
};

export default TitleCover;