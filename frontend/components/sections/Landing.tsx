"use client";

import React from 'react';
import Aurora from '@/components/ui/Aurora';

export default function Landing() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between px-8 py-20 overflow-hidden">
      {/* Aurora background positioned behind content */}
      <div className="absolute inset-0 z-0 opacity-90 pointer-events-none">
        <Aurora
          colorStops={["#667eea", "#764ba2", "#f093fb"]}
          amplitude={1.6}
          blend={0.7}
          speed={0.9}
        />
      </div>

      {/* Content - sits above Aurora */}
      <div className="relative z-10 pt-32 pl-8">
        <p className="text-xl md:text-2xl text-gray-100 font-light max-w-2xl">
          Solving the <span className="text-purple-400 font-medium">$0 ETH Trap</span> through self-sustaining economics
        </p>
      </div>

      {/* Large background heading positioned bottom-left */}
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none w-full">
        <h1
          className="font-extrabold uppercase leading-none tracking-tight select-none"
          style={{ color: '#1f2224', fontSize: '14vw', lineHeight: 0.9, letterSpacing: '-0.03em', fontWeight: 900 }}
        >
          OMNISWEEP
        </h1>
      </div>
    </section>
  );
}
