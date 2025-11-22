# OmniSweep Frontend

A beautiful Next.js 14 frontend for the OmniSweep dust token sweeping application with Aurora background effects, gradient text, and glass morphism UI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed
- A WalletConnect Project ID (get one at https://cloud.walletconnect.com)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Add your WalletConnect Project ID:
     ```
     NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to http://localhost:3000
   - You should see the beautiful Aurora background with gradient OmniSweep title

## ✨ Features

- **Aurora Background** - Animated WebGL aurora effect
- **Gradient Text** - Smooth color-flowing title animation
- **Glass Morphism** - Frosted glass cards with glare hover effects
- **Web3 Integration** - Coinbase Smart Wallet & WalletConnect support
- **Multi-Chain** - Support for Optimism, World Chain, and Base
- **Dark Purple Theme** - Consistent design throughout

## 🎨 Key Components

- `components/ui/Aurora.tsx` - WebGL aurora background
- `components/ui/GradientText.tsx` - Animated gradient text
- `components/ui/GlareHover.tsx` - Glass morphism hover effects
- `app/page.tsx` - Main dashboard page
- `components/wallet/ConnectButton.tsx` - Wallet connection

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Web3:** wagmi, viem, Coinbase Smart Wallet
- **Effects:** OGL (WebGL), Custom animations
- **UI:** shadcn/ui components

## 🔧 Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 Notes

- This is a frontend MVP with mock data
- Backend API integration is pending
- Smart contract calls are not yet implemented
- All transaction flows are currently simulated

## 🌟 Visual Effects

The dashboard includes:
- Animated aurora background (purple/pink waves)
- Gradient text with color flow animation
- Glass morphism cards with hover glare
- Responsive design for all screen sizes
- Dark purple theme with high contrast

Enjoy! 🚀
