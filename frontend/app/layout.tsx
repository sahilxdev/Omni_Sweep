import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Web3Provider } from '@/components/Web3Provider';
import { MiniKitProvider } from '@/components/MiniKitProvider';
import { FloatingHeader } from '@/components/layout/FloatingHeader';
import Landing from '@/components/sections/Landing';
import Info from '@/components/sections/Info';
import HowItWorks from '@/components/sections/HowItWorks';
import { Toaster } from '@/components/ui/Toaster';
import { Footer } from '@/components/ui/footer';
import { Hexagon, Github, Twitter } from 'lucide-react';
import Showcase from '@/components/sections/Showcase';


import dynamic from 'next/dynamic';

const Aurora = dynamic(() => import('@/components/ui/Aurora'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OmniSweep - Sweep Dust to USDC',
  description: 'Convert your dust tokens to USDC on Base - gasless and efficient',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <MiniKitProvider>
          <Web3Provider>
            <div className="min-h-screen relative overflow-hidden bg-black text-white">
          
            
            {/* Content */}
            <div className="relative z-10">
              <FloatingHeader />

              {/* Full-viewport landing section (renders edge-to-edge) */}
              <Landing />

              <main className="container mx-auto px-4 py-6">
                {/* Info and page content */}
                <Info />

                {/* How It Works section below Info */}
                <HowItWorks />

                <Showcase />
               
              </main>
              {/* Site footer */}
              <Footer
                logo={
                  <div className="flex items-baseline space-x-1 group">
                    <span className="text-2xl sm:text-3xl font-extrabold italic text-purple-400 uppercase tracking-tight leading-none select-none">
                      OMNI
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-purple-300 capitalize ml-1">
                      sweep
                    </span>
                  </div>
                }
                brandName="OmniSweep"
                socialLinks={[
                  { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com', label: 'Twitter' },
                  { icon: <Github className="h-5 w-5" />, href: 'https://github.com', label: 'GitHub' },
                ]}
                mainLinks={[
                  { href: '/products', label: 'Products' },
                  { href: '/ETHGlobal', label: 'ETH Global' },
             
                  { href: '/contact', label: 'Contact' },
                ]}
                legalLinks={[{ href: '/privacy', label: 'Privacy' }, { href: '/terms', label: 'Terms' }]}
                copyright={{ text: '© 2025 OmniSweep', license: 'All rights reserved' }}
              />
              
            </div>
          </div>
          <Toaster />
          </Web3Provider>
        </MiniKitProvider>
      </body>
    </html>
  );
}
