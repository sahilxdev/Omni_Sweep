import React from 'react';
import Threads from '../ui/Threads';

export default function Info() {
  return (
    <section className="relative overflow-hidden  text-white py-20 mt-16 md:mt-28 lg:mt-36">
     
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <div className="rounded-3xl border-2 border-white/10 p-6 md:p-10  bg-clip-padding backdrop-blur-md">
           <Threads amplitude={1.0} distance={0.0} enableMouseInteraction={false} />
            <h2 className="text-4xl font-extrabold mb-3">The $0 ETH Trap</h2>
            <p className="text-gray-300 mb-8">It&apos;s Not About Expensive Gas. It&apos;s About Having ZERO Gas.</p>

              <div className="grid sm:grid-cols-2 gap-6 mb-12 md:mb-16">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col h-full">
              <div className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">Scenario</div>
              <h3 className="text-xl font-bold mt-2 mb-4 text-white">A small token stuck without gas</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                 
                  <span>You have <strong>$15</strong> of PEPE on Optimism</span>
                </li>
                <li className="flex items-start gap-3">
                  
                  <span>You have <strong>$0.00 ETH</strong> in that wallet</span>
                </li>
                <li className="flex items-start gap-3 text-gray-200">
                  
                  <span>You <strong>CAN&apos;T</strong> move the $15 (can&apos;t pay $0.01 gas)</span>
                </li>
              </ul>
            </div>

              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col h-full">
              <div className="text-sm font-semibold text-purple-400 uppercase tracking-wide">Traditional Solution</div>
              <h3 className="text-xl font-bold mt-2 mb-4 text-white">Time-consuming multi-step flow</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Buy ETH on exchange → 5 min</li>
                <li>Bridge ETH to Optimism → 10 min</li>
                <li>Finally swap PEPE → 2 min</li>
              </ol>
              <p className="mt-4 text-gray-300"><span className="font-semibold text-rose-400">Result:</span> 17 minutes for $15 → <span className="font-bold">73% abandon it</span></p>
            </div>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-10 md:mt-12">
            <div>
              <div className="text-4xl md:text-5xl font-light text-white">$2-5B</div>
              <div className="text-sm text-purple-400 mt-2">Trapped Globally</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-white">100M+</div>
              <div className="text-sm text-purple-400 mt-2">Users Affected</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-white">73%</div>
              <div className="text-sm text-purple-400 mt-2">Abandon Small Balances</div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
