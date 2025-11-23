# OmniSweep - Quick Start Guide

## 🚀 What's Configured

Your OmniSweep app is now fully integrated with both **World MiniKit** and your **Backend API**!

### ✅ Environment Variables Set
```env
✅ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (WalletConnect)
✅ NEXT_PUBLIC_WORLD_APP_ID (World Mini App)
✅ NEXT_PUBLIC_API_URL (Your Backend on Railway)
✅ NEXT_PUBLIC_ALCHEMY_API_KEY_OPTIMISM (Optimism RPC)
✅ NEXT_PUBLIC_ALCHEMY_API_KEY_BASE (Base RPC)
✅ NEXT_PUBLIC_ALCHEMY_API_KEY_WORLD (World Chain RPC)
```

## 🎯 Quick Test (2 Minutes)

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Backend Integration
Visit: **http://localhost:3000/api-test**

This page will test all backend endpoints:
- ✅ Health check
- ✅ Contract addresses
- ✅ Swap quotes
- ✅ Protocol stats

Expected: All tests should pass ✅

### 3. Test World MiniKit
The app includes World MiniKit integration:
- World ID verification
- World App wallet support
- Payment processing
- Transaction signing

**Note**: MiniKit features only work inside World App, not in browser.

## 📁 Key Files

### API Client
- **Location**: `/lib/api.ts`
- **Functions**: `fetchQuote()`, `executeSweep()`, `fetchReceipts()`, etc.

### Custom Hooks
- **Location**: `/hooks/useBackendApi.ts`
- **Hooks**: `useSwapQuote()`, `useSweep()`, `useReceipts()`, etc.

### Components
- **SweepModal**: Now uses real backend quotes
- **BackendStatus**: Shows connection status
- **API Test Page**: `/app/api-test/page.tsx`

## 🔧 Backend API

**URL**: https://omni-sweeper-production.up.railway.app

**Endpoints**:
- GET `/api/health` - Health check
- GET `/api/contracts` - Contract addresses
- GET `/api/quote` - Get swap quote
- POST `/api/sweep` - Execute sweep
- GET `/api/receipts/:address` - Transaction history

See `BACKEND_API_USAGE.md` for detailed documentation.

## 🌍 World MiniKit

**Integration Status**: ✅ Complete

**Features**:
- `MiniKit.verify()` - World ID verification
- `MiniKit.pay()` - Payment processing
- `MiniKit.sendTransaction()` - Execute transactions
- `MiniKit.signMessage()` - Sign messages

See `MINIKIT_INTEGRATION.md` for detailed documentation.

## 📝 Usage Examples

### Get Swap Quote
```tsx
import { fetchQuote } from '@/lib/api';

const quote = await fetchQuote(
  '0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60', // token address
  '1000000000000000000', // 1 token in wei
  '11155111' // Sepolia chain ID
);

console.log('Estimated USDC:', quote.estimatedOutput);
```

### Execute Sweep
```tsx
import { executeSweep } from '@/lib/api';

const result = await executeSweep({
  userAddress: '0x...',
  tokenIn: '0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60',
  amount: '1000000000000000000',
  oneInchData: quote.oneInchData,
  minUsdcOut: quote.minOutput
});

console.log('TX Hash:', result.transaction.hash);
```

### World ID Verification
```tsx
import { useMiniKit } from '@/hooks/useMiniKit';

const { verify } = useMiniKit();
const result = await verify('verify-human');
```

## 🎨 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard - Chain selection |
| `/sweep?chain=optimism` | Sweep page for Optimism |
| `/sweep?chain=world` | Sweep page for World Chain |
| `/receipts` | Transaction history |
| `/api-test` | **Backend API test page** ✨ |

## 🧪 Testing Checklist

### Backend Integration
- [ ] Visit `/api-test` page
- [ ] Run health check ✅
- [ ] Get contract addresses ✅
- [ ] Test swap quote ✅
- [ ] Check stats ✅

### Frontend
- [ ] Load homepage
- [ ] Connect wallet
- [ ] Navigate to sweep page
- [ ] Get quote for token
- [ ] (Optional) Execute sweep

### World MiniKit
- [ ] Deploy to public URL
- [ ] Test in World App
- [ ] Verify with World ID
- [ ] Test wallet integration

## 🚨 Troubleshooting

### "Failed to fetch"
- Check `.env.local` has correct backend URL
- Verify backend is online: `curl https://omni-sweeper-production.up.railway.app/api/health`
- Check CORS settings

### "MiniKit not installed"
- This is normal in browser
- MiniKit only works inside World App
- Deploy and test in production

### Build Errors
- Run `npm install` to ensure all dependencies
- Check TypeScript errors with `npm run build`
- Verify all imports are correct

## 🎯 Next Steps

### For Development
1. **Test backend integration**: Visit `/api-test`
2. **Update components**: Replace remaining mock data
3. **Add error handling**: Handle offline scenarios
4. **Implement retry logic**: For failed API calls

### For Production
1. **Deploy frontend**: Vercel, Netlify, or similar
2. **Test in World App**: Submit to World for review
3. **Monitor backend**: Check Railway logs
4. **Get testnet tokens**: For sweep testing

## 📚 Documentation

- **Backend API**: `BACKEND_API_USAGE.md`
- **World MiniKit**: `MINIKIT_INTEGRATION.md`
- **Setup Guide**: `WORLD_MINIAPP_SETUP.md`
- **Main README**: `README.md`

## 🎉 You're Ready!

Your app has:
- ✅ Backend API connected
- ✅ World MiniKit integrated
- ✅ All environment variables configured
- ✅ Custom hooks for easy API access
- ✅ Test page for verification

**Start developing**: `npm run dev`
**Test backend**: http://localhost:3000/api-test
**Deploy**: When ready for World App submission

---

**Need Help?**
- Check the documentation files listed above
- Review the test page at `/api-test`
- Verify `.env.local` has all values set

**Backend URL**: https://omni-sweeper-production.up.railway.app
**Status**: 🟢 Online and Ready!
