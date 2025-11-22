# OmniSweep Frontend

Modern Next.js 14 frontend for OmniSweep - a dust token sweeper that consolidates small token balances from Optimism and World Chain into USDC on Base.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi v2 + viem v2
- **Wallets**: Coinbase Smart Wallet (primary), WalletConnect (fallback)
- **UI Components**: Custom components + shadcn/ui patterns
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **Identity**: World ID MiniKit (for World Chain)

## 📁 Project Structure

```
frontend/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Web3Provider
│   ├── page.tsx            # Dashboard / landing page
│   ├── sweep/
│   │   └── page.tsx        # Sweep page (/sweep?chain=optimism|world)
│   ├── receipts/
│   │   └── page.tsx        # Transaction history
│   └── globals.css         # Global styles + Tailwind
├── components/
│   ├── Web3Provider.tsx    # Wagmi + QueryClient provider
│   ├── layout/
│   │   └── Header.tsx      # Header with wallet connect
│   ├── wallet/
│   │   └── ConnectButton.tsx  # Wallet connection modal
│   ├── sweep/
│   │   ├── DustTokenList.tsx     # Display dust tokens table
│   │   ├── SweepModal.tsx        # Sweep confirmation + quote
│   │   ├── TransactionStepper.tsx # 3-step transaction UI
│   │   └── WorldIDPanel.tsx      # World ID verification
│   └── ui/
│       └── Button.tsx      # Reusable button component
├── hooks/                  # Custom React hooks (TODO)
├── lib/
│   ├── wagmi.ts           # Wagmi configuration
│   ├── chains.ts          # Chain configs (Optimism, World, Base)
│   ├── contracts.ts       # Contract addresses + ABIs
│   └── utils.ts           # Helper functions
└── types/
    └── index.ts           # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A WalletConnect Project ID (get one at https://cloud.walletconnect.com)

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## 🎯 Features Implemented

### ✅ Core Features

- **Multi-wallet support**: Coinbase Smart Wallet (primary) + WalletConnect fallback
- **Chain management**: Auto-detect wrong network + switch network functionality
- **Dashboard**: Chain selection cards for Optimism and World Chain
- **Dust token list**: Display tokens worth <$10 with USD values
- **Quote system**: Get estimates for USDC output before sweeping
- **Transaction flow**: 3-step process (Approve → Swap & Bridge → Finalize)
- **Transaction tracking**: Real-time status updates with explorer links
- **World ID integration**: Verification panel for World Chain gas sponsorship
- **Receipts page**: Transaction history (ready for event data integration)

### 🎨 UI/UX

- Beautiful gradient backgrounds and modern card designs
- Responsive layout (mobile-friendly)
- Toast notifications for user feedback
- Loading states and error handling
- Transaction stepper with real-time updates
- Modal system for confirmations

## 🔗 Integration Points

### Backend API

The frontend expects a `/api/quote` endpoint:

**Request:**
```json
{
  "tokenIn": "0x...",
  "amount": "1000000000000000000",
  "srcChainId": 10
}
```

**Response:**
```json
{
  "oneInchData": "0x...",
  "pythUpdateData": ["0x..."],
  "estUsdcOut": "5100000",
  "estFeeUsd": 0.15
}
```

### Smart Contracts

Update contract addresses in `lib/contracts.ts`:

```typescript
export const CONTRACTS = {
  optimism: {
    omniSweeper: '0xYourContractAddress',
    usdc: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  },
  // ... other chains
};
```

### World ID

Integrate World ID MiniKit in `components/sweep/WorldIDPanel.tsx`:

```typescript
// TODO: Replace mock with actual World ID integration
import { MiniKit } from '@worldcoin/minikit-js';
```

## 📝 TODOs

### High Priority

- [ ] Integrate actual backend `/api/quote` endpoint
- [ ] Connect real token balances (replace mock data in `DustTokenList.tsx`)
- [ ] Implement actual contract calls using wagmi's `useWriteContract`
- [ ] Add World ID MiniKit SDK integration
- [ ] Deploy actual smart contracts and update addresses

### Medium Priority

- [ ] Add loading skeletons for better UX
- [ ] Implement proper error boundaries
- [ ] Add analytics tracking
- [ ] Create custom hooks (`useTokenBalances`, `useSweepQuote`, etc.)
- [ ] Add unit tests

### Low Priority

- [ ] Dark mode support
- [ ] Multi-language support (i18n)
- [ ] Advanced filtering on receipts page
- [ ] Export receipts as CSV
- [ ] Add more chains

## 🎨 Styling Reference

The UI follows the design from https://dust-to-usdc.lovable.app with:
- Gradient backgrounds (`gradient-bg` class)
- Modern card designs with hover effects
- Clean typography and spacing
- Consistent color scheme (purple/blue gradients)

## 🤝 Contributing

See `CONTRIBUTING.md` in the root directory.

## 📄 License

See `LICENSE` in the root directory.

---

**Note**: All lint errors shown during development are expected since dependencies haven't been installed yet. Run `npm install` to resolve them.
