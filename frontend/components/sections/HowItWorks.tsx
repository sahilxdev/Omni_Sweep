import React from 'react';
import { ArrowRight, RefreshCw, MapPin, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const cards = [
    {
      id: 1,
      title: 'Scan Your Dust',
      desc: 'We scan your small token balances on Optimism and World Chain',
      icon: <ArrowRight className="w-6 h-6 text-cyan-400" />,
      href: '#',
    },
    {
      id: 2,
      title: 'Price & Swap',
      desc: 'We call Pyth & 1inch to get the best prices and execute swaps',
      icon: <RefreshCw className="w-6 h-6 text-cyan-400" />,
      href: '#',
    },
    {
      id: 3,
      title: 'Bridge to Base',
      desc: 'Stargate + LayerZero send your USDC securely to Base',
      icon: <MapPin className="w-6 h-6 text-cyan-400" />,
      href: '#',
    },
    {
      id: 4,
      title: 'Receive Clean USDC',
      desc: 'You receive consolidated USDC in your wallet on Base',
      icon: <CheckCircle className="w-6 h-6 text-cyan-400" />,
      href: '#',
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ol className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden divide-y divide-white/5">
          {cards.map((card) => (
            <li key={card.id} className="p-5 sm:p-6 md:p-8">
              {/* Mobile layout */}
              <div className="flex md:hidden items-start gap-4">
                <div className="flex flex-col items-start">
                  <span className="text-4xl font-extrabold text-white leading-none">{card.id}</span>
                  <span className="mt-1 text-[10px] font-semibold text-white/40 tracking-widest">STEP</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-2">{card.title}</h3>
                  <p className="text-purple-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:grid md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-3 relative h-full">
                  <div className="absolute left-0 top-0">
                    <span className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-none">{card.id}</span>
                  </div>
                  <div className="absolute left-14 md:left-20 bottom-0">
                    <span className="text-xs font-semibold text-white/40 uppercase tracking-widest leading-none">STEP</span>
                  </div>
                </div>
                <div className="md:col-span-9">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-snug mb-4">{card.title}</h3>
                  <p className="text-purple-400 text-base md:text-lg leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
