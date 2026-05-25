import React from "react";
import ReaderLayout from "@/components/ReaderLayout";
import Layer1Void from "@/components/layers/Layer1Void";

export default function Loading() {
  return (
    <ReaderLayout>
      <Layer1Void />
      <div className="relative z-20 reader-column min-h-screen flex flex-col pt-32 opacity-70">
        <div className="h-10 w-2/3 bg-white/5 animate-pulse rounded-md mx-auto mb-32" />
        
        {[...Array(6)].map((_, i) => (
          <div key={i} className="mb-8 space-y-3 w-full">
            <div className="h-4 bg-white/5 animate-pulse rounded-sm w-full" />
            <div className="h-4 bg-white/5 animate-pulse rounded-sm w-11/12" />
            <div className="h-4 bg-white/5 animate-pulse rounded-sm w-full" />
            <div className="h-4 bg-white/5 animate-pulse rounded-sm w-4/5" />
            <div className="h-4 bg-white/5 animate-pulse rounded-sm w-full" />
            <div className="h-4 bg-white/5 animate-pulse rounded-sm w-1/3" />
          </div>
        ))}
      </div>
    </ReaderLayout>
  );
}
