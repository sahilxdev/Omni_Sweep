"use client"

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ConnectButton } from '@/components/wallet/ConnectButton';

export default function Showcase() {
  return (
    <section className="mt-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Outer subtle border to create the layered effect */}
        <div className="relative rounded-2xl border border-slate-100 p-1">
          <div className="rounded-xl bg-white border-2 border-double border-slate-200 p-2 md:p-3 shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all relative overflow-visible">

            {/* Top-right link button */}
            <a
              href="#"
              aria-label="Open case study"
              className="absolute -top-3 -right-3 z-20 inline-flex items-center justify-center rounded-full bg-pink-600 text-white p-3 shadow-lg hover:scale-105 transform transition-all"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4">
                <div className="rounded-lg overflow-hidden flex justify-center">
                  <img
                    src="https://framerusercontent.com/images/Dho9xi1tHxpd0Z8MGBkwJs22tKU.png?scale-down-to=1024&width=996&height=1234"
                    alt="App preview"
                    className="w-full h-auto block max-w-[320px] mx-auto"
                  />
                </div>
              </div>

              <div className="md:col-span-8">
                <div className="rounded-lg bg-white border-2 border-double border-slate-200 p-4 md:p-6 text-slate-900 shadow-md hover:shadow-lg transition-all">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">Turn Dust into USDC</h3>
                  <p className="text-slate-600 mb-3">No native gas required. Sweep small token balances from Optimism and World Chain into clean USDC on Base with one click.</p>

                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-start items-center">
                      <div className="w-full md:w-1/2">
                        <ConnectButton className="bg-purple-200 text-slate-900 hover:bg-purple-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
