# 🚀 Quick Start Guide

## Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Environment**
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your WalletConnect Project ID:
- Get one at: https://cloud.walletconnect.com

3. **Run Development Server**
```bash
npm run dev
```

Open http://localhost:3000

## 🎯 What You Should See

### When NOT Connected:
1. **Header** with "Dashboard" and "Receipts" nav links
2. **"Connect Wallet" button** in top right
3. **Hero section** with OmniSweep branding
4. **3 feature cards**:
   - Multi-Chain Sweep
   - Gas Sponsorship
   - Best Rates
5. **"How It Works" section** with 3 steps

### When Connected:
1. **Header** shows connected wallet address with dropdown
2. **Dashboard** shows:
   - "Your Dust Dashboard" title
   - **2 large chain cards**:
     - **Optimism Card** (red icon 🔴)
     - **World Chain Card** (blue icon 🌍)
   - Each card has:
     - Chain name and description
     - Network info
     - Destination (Base USDC)
     - "View & Sweep Dust" button

3. **Clicking a chain card** takes you to:
   - `/sweep?chain=optimism` OR
   - `/sweep?chain=world`

### On Sweep Page:
1. **Breadcrumb** navigation back to dashboard
2. **Chain header** with icon
3. **Network switch banner** (if on wrong network)
4. **World ID verification panel** (World Chain only)
5. **Dust token list** table
6. **"Sweep" button** for each token
7. **Info section** about dust sweeping

### Clicking "Sweep":
1. **Modal opens** with:
   - Token info
   - Amount input
   - "Get Quote" button
2. After quote:
   - Shows estimated USDC output
   - Shows fees
   - "Approve & Sweep" button
3. During sweep:
   - **3-step progress**:
     1. Approving token...
     2. Swapping & bridging...
     3. Finalizing on Base...
   - Transaction hashes with explorer links
4. On success:
   - 🎉 celebration
   - Shows final USDC amount
   - "Do Another Sweep" button

## 📄 All Pages

1. **`/` (Dashboard)**
   - Entry point
   - Chain selection

2. **`/sweep?chain=optimism`**
   - Sweep dust from Optimism

3. **`/sweep?chain=world`**
   - Sweep dust from World Chain
   - World ID verification

4. **`/receipts`**
   - Transaction history

## 🔧 Troubleshooting

### Error: Module not found
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Blank page or errors
1. Check browser console for errors
2. Make sure you ran `npm install`
3. Make sure `.env.local` exists with WalletConnect ID
4. Try clearing Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Wallet not connecting
1. Check that you have a WalletConnect Project ID in `.env.local`
2. Make sure you're using a supported browser (Chrome, Brave, Firefox)
3. Try a different wallet (Coinbase Wallet, MetaMask, etc.)

## 🎨 Current Status

**✅ Fully Implemented (with mock data):**
- Wallet connection (Coinbase Smart Wallet + WalletConnect)
- Chain selection dashboard
- Sweep pages for both chains
- Quote system
- Transaction flow with 3 steps
- Transaction status tracking
- Success/error states
- Receipts page
- World ID verification panel

**📝 TODO (Backend Integration):**
- Replace mock token balances with real RPC calls
- Connect to actual `/api/quote` backend
- Implement real contract interactions
- Add World ID MiniKit SDK
- Listen for SweepReceipt events

## 🔗 Next Steps

1. ✅ Frontend is complete with mock data
2. 🔄 Deploy backend `/api/quote` endpoint
3. 🔄 Deploy smart contracts
4. 🔄 Update contract addresses in `lib/contracts.ts`
5. 🔄 Replace mock data with real data
6. 🔄 Test end-to-end flow
7. 🚀 Deploy to production

## 📚 Documentation

- **README.md** - Full setup guide
- **IMPLEMENTATION_SUMMARY.md** - Complete implementation details
- **frontend.md** - Original requirements
- **architecture.md** - System architecture

## 🆘 Need Help?

Check the code comments - all integration points are marked with `TODO` comments showing exactly where to add backend/contract integration.

---

**Happy Building! 🎉**
