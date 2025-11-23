# ✅ Setup Checklist

## Pre-Installation
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Git initialized

## Step 1: Install Dependencies
```bash
cd frontend
npm install
```

**Expected output:** All packages installed successfully

## Step 2: Environment Setup
```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

Get a Project ID from: https://cloud.walletconnect.com

## Step 3: Start Development Server
```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 4: Verify Pages Load

### Test 1: Dashboard (Not Connected)
- [ ] Open http://localhost:3000
- [ ] See "OmniSweep" logo in header
- [ ] See "Connect Wallet" button
- [ ] See hero section with ✨ icon
- [ ] See 3 feature cards
- [ ] See "How It Works" section

### Test 2: Connect Wallet
- [ ] Click "Connect Wallet"
- [ ] See modal with wallet options
- [ ] Can select Coinbase Smart Wallet OR WalletConnect
- [ ] Wallet connects successfully

### Test 3: Dashboard (Connected)
- [ ] See wallet address in header (shortened)
- [ ] See "Your Dust Dashboard" title
- [ ] See 2 large chain cards:
  - [ ] Optimism card (red 🔴)
  - [ ] World Chain card (blue 🌍)
- [ ] Cards have hover effect
- [ ] "View & Sweep Dust" buttons visible

### Test 4: Sweep Page - Optimism
- [ ] Click Optimism card OR go to `/sweep?chain=optimism`
- [ ] See "Sweep Dust → Base USDC" header
- [ ] See "Source network: Optimism"
- [ ] If on wrong network, see switch network banner
- [ ] See dust token list table (mock data)
- [ ] See "About Dust Sweeping" info section

### Test 5: Sweep Page - World Chain
- [ ] Click World Chain card OR go to `/sweep?chain=world`
- [ ] See "Sweep Dust → Base USDC" header
- [ ] See "Source network: World Chain"
- [ ] See "Verify with World ID" panel
- [ ] Can click "Verify with World ID" button
- [ ] After verification, see "World ID Verified ✓" badge
- [ ] See dust token list table
- [ ] See info about World Chain bonus

### Test 6: Sweep Modal Flow
- [ ] Click "Sweep" button on any token
- [ ] Modal opens with token details
- [ ] See amount input field
- [ ] Can click "Use max balance"
- [ ] Click "Get Quote"
- [ ] See loading state
- [ ] Quote appears with estimated USDC
- [ ] Click "Approve & Sweep"
- [ ] See 3-step progress:
  1. [ ] Approving token... (with spinner)
  2. [ ] Swapping & bridging... (with spinner)
  3. [ ] Finalizing on Base... (with spinner)
- [ ] Each step shows ✓ when complete
- [ ] Transaction hashes appear
- [ ] Explorer links are clickable
- [ ] Success screen shows 🎉 and USDC amount
- [ ] Can close modal or do another sweep

### Test 7: Receipts Page
- [ ] Go to `/receipts`
- [ ] See "Sweep Receipts" title
- [ ] See transaction history table (mock data)
- [ ] Table shows:
  - [ ] Date/Time
  - [ ] From Chain
  - [ ] Token In
  - [ ] Amount In
  - [ ] USDC on Base
  - [ ] Status (Complete ✓)
  - [ ] Explorer links (clickable)

### Test 8: Navigation
- [ ] Click "Dashboard" in header → goes to `/`
- [ ] Click "Receipts" in header → goes to `/receipts`
- [ ] Click logo → goes to `/`
- [ ] All back buttons work correctly

### Test 9: Wallet Dropdown
- [ ] Click connected wallet address
- [ ] See dropdown menu
- [ ] See full address
- [ ] See "Copy Address" option
- [ ] See "Disconnect" button
- [ ] Can disconnect wallet

### Test 10: Responsive Design
- [ ] Resize browser window
- [ ] Layout adjusts for mobile
- [ ] Navigation collapses properly
- [ ] Cards stack vertically on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Modals fit on small screens

## Common Issues & Fixes

### Issue: npm install fails
**Error:** `ETARGET No matching version found for @worldcoin/minikit-js`
**Fix:** This is fixed! Just run `npm install` again.

### Issue: Page is blank
**Possible causes:**
1. Dependencies not installed → Run `npm install`
2. .env.local missing → Copy from .env.local.example
3. Next.js cache → Delete `.next` folder and restart

**Fix:**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Issue: Wallet won't connect
**Possible causes:**
1. No WalletConnect Project ID
2. Invalid Project ID
3. Browser blocking popups

**Fix:**
1. Get valid Project ID from https://cloud.walletconnect.com
2. Add to `.env.local`
3. Restart dev server
4. Allow popups in browser

### Issue: Build errors
**Fix:**
```bash
npm run build
```
Check error messages and fix TypeScript/import issues.

## Development Workflow

### Making Changes
1. Edit files in `app/`, `components/`, `lib/`, or `types/`
2. Save file
3. Hot reload happens automatically
4. Check browser for updates
5. Check console for errors

### Adding New Components
```typescript
// components/my-component/MyComponent.tsx
'use client'; // For client components

import { ReactNode } from 'react';

export function MyComponent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
```

### Adding New Pages
```typescript
// app/my-page/page.tsx
export default function MyPage() {
  return <div>My Page</div>;
}
```

Route: `/my-page`

## Production Build

### Test Production Build
```bash
npm run build
npm start
```

### Deploy
- Vercel: `vercel deploy`
- Netlify: Connect repo and deploy
- Custom: Build and serve `.next` folder

## Backend Integration

When ready to connect to real backend:

1. **Update contract addresses** in `lib/contracts.ts`
2. **Replace mock data** in `components/sweep/DustTokenList.tsx`
3. **Connect to `/api/quote`** in `components/sweep/SweepModal.tsx`
4. **Add real contract calls** using wagmi's `useWriteContract`
5. **Add World ID SDK** in `components/sweep/WorldIDPanel.tsx`

All integration points marked with `// TODO` comments.

## File Structure Quick Reference

```
frontend/
├── app/                    # Pages & routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard (/)
│   ├── error.tsx          # Error boundary
│   ├── loading.tsx        # Loading state
│   ├── sweep/
│   │   └── page.tsx       # /sweep?chain=...
│   └── receipts/
│       └── page.tsx       # /receipts
│
├── components/
│   ├── layout/
│   │   └── Header.tsx     # Top nav bar
│   ├── wallet/
│   │   └── ConnectButton.tsx
│   ├── sweep/
│   │   ├── DustTokenList.tsx
│   │   ├── SweepModal.tsx
│   │   ├── TransactionStepper.tsx
│   │   └── WorldIDPanel.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Toaster.tsx
│   └── Web3Provider.tsx
│
├── lib/
│   ├── wagmi.ts           # Wallet config
│   ├── chains.ts          # Chain definitions
│   ├── contracts.ts       # Addresses & ABIs
│   └── utils.ts           # Helper functions
│
└── types/
    └── index.ts           # TypeScript types
```

## Success Criteria

✅ All 10 tests pass
✅ No console errors
✅ Wallet connects
✅ All pages load
✅ Navigation works
✅ Mock sweep flow completes
✅ UI looks good
✅ Mobile responsive

## Ready for Demo?

If all tests pass, you're ready to demo the frontend with mock data!

To go live with real functionality:
1. Deploy smart contracts
2. Deploy backend API
3. Update addresses and endpoints
4. Replace mock data with real blockchain calls
5. Add World ID MiniKit
6. Test end-to-end
7. 🚀 Launch!

---

**Questions? Check:**
- START_HERE.md
- README.md
- IMPLEMENTATION_SUMMARY.md
