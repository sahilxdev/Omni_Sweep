'use client';

import { FloatingNav } from '../ui/floating-navbar';
import { ConnectButton } from '../wallet/ConnectButton';
import { Home, Receipt } from 'lucide-react';
import Link from 'next/link';

export function FloatingHeader() {
  const navItems = [
    {
      name: "Dashboard",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Receipts",
      link: "/receipts",
      icon: <Receipt className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  const Logo = (
    <Link href="/" className="flex items-baseline space-x-1 group">
      <span className="text-2xl sm:text-3xl font-extrabold italic text-purple-400 uppercase tracking-tight leading-none select-none">
        OMNI
      </span>
      <span className="text-xs sm:text-sm font-semibold text-purple-300 capitalize ml-1">
        sweep
      </span>
    </Link>
  );

  return (
    <div className="relative w-full">
      <div className="fixed top-6 right-6 z-[5001]">
        <ConnectButton />
      </div>
      <FloatingNav 
        navItems={navItems} 
        logo={Logo}
        className="top-6"
      />
    </div>
  );
}
