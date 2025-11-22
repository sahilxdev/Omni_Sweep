import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Web3Provider } from '@/components/Web3Provider';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/Toaster';
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
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Aurora Background */}
            <div className="fixed inset-0 z-0 opacity-80">
              <Aurora 
                colorStops={['#667eea', '#764ba2', '#f093fb']}
                amplitude={1.8}
                blend={0.8}
                speed={0.8}
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <Header />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}
