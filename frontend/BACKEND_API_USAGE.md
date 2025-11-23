# Backend API Integration - Usage Guide

## ✅ Setup Complete!

Your frontend is now connected to the backend at:
**https://omni-sweeper-production.up.railway.app**

## 🎯 Quick Start

### 1. Test the Connection

Visit **`/api-test`** page in your app to verify all endpoints are working:
```
http://localhost:3000/api-test
```

This will test:
- ✅ Health check
- ✅ Fetch contracts
- ✅ Get swap quote
- ✅ Fetch stats

### 2. Using in Components

The backend API is now integrated via custom hooks. Here's how to use them:

## 📚 Available Hooks

### useBackendHealth()
Check if backend is online
```tsx
import { useBackendHealth } from '@/hooks/useBackendApi';

function MyComponent() {
  const { health, loading, error, check } = useBackendHealth();
  
  useEffect(() => {
    check();
  }, []);
  
  return <div>{health?.status}</div>;
}
```

### useContracts()
Get all contract addresses
```tsx
import { useContracts } from '@/hooks/useBackendApi';

function MyComponent() {
  const { contracts, loading, error } = useContracts();
  
  // contracts.ethSepolia.omniSweeper
  // contracts.ethSepolia.usdc
  // contracts.avalancheFuji.receiptOApp
}
```

### useSwapQuote()
Get swap quote from 1inch
```tsx
import { useSwapQuote } from '@/hooks/useBackendApi';

function MyComponent() {
  const { quote, loading, error, getQuote } = useSwapQuote(
    tokenAddress,
    amountInWei,
    chainId
  );
  
  const handleGetQuote = async () => {
    const quoteData = await getQuote();
    console.log('Estimated USDC output:', quoteData.estimatedOutput);
  };
}
```

### useTokenBalance()
Check token balance for user
```tsx
import { useTokenBalance } from '@/hooks/useBackendApi';

function MyComponent() {
  const { balance, loading, error } = useTokenBalance(
    userAddress,
    tokenAddress
  );
  
  return <div>Balance: {balance}</div>;
}
```

### useAllowance()
Check if token is approved for spending
```tsx
import { useAllowance } from '@/hooks/useBackendApi';

function MyComponent() {
  const { allowance, loading, error, checkApproval } = useAllowance(
    userAddress,
    tokenAddress,
    spenderAddress
  );
  
  const handleCheck = async () => {
    const result = await checkApproval();
    console.log('Needs approval:', result.needsApproval);
  };
}
```

### useSweep()
Execute sweep transaction
```tsx
import { useSweep } from '@/hooks/useBackendApi';

function MyComponent() {
  const { result, loading, error, sweep } = useSweep();
  
  const handleSweep = async () => {
    const tx = await sweep({
      userAddress: '0x...',
      tokenIn: '0x...',
      amount: '1000000000000000000',
      oneInchData: '0x...',
      minUsdcOut: '950000'
    });
    
    console.log('Transaction hash:', tx.transaction.hash);
    console.log('Explorer:', tx.explorer);
  };
}
```

### useReceipts()
Get user's sweep history
```tsx
import { useReceipts } from '@/hooks/useBackendApi';

function MyComponent() {
  const { receipts, loading, error } = useReceipts(userAddress);
  
  return (
    <div>
      {receipts.map(receipt => (
        <div key={receipt.guid}>
          Amount: {receipt.amount}
          Time: {receipt.timestamp}
        </div>
      ))}
    </div>
  );
}
```

### useStats()
Get protocol statistics
```tsx
import { useStats } from '@/hooks/useBackendApi';

function MyComponent() {
  const { stats, loading, error } = useStats();
  
  return (
    <div>
      Total Value: ${stats?.totalValue}
      Total Sweeps: {stats?.totalCount}
    </div>
  );
}
```

## 🔧 Direct API Calls

You can also use the API functions directly:

```tsx
import {
  fetchQuote,
  fetchBalance,
  checkAllowance,
  executeSweep,
  fetchReceipts,
  fetchStats,
  fetchContracts,
  checkHealth
} from '@/lib/api';

// Get a quote
const quote = await fetchQuote(tokenAddress, amountWei, chainId);

// Execute sweep
const result = await executeSweep({
  userAddress: '0x...',
  tokenIn: '0x...',
  amount: '1000000000000000000',
  oneInchData: quote.oneInchData,
  minUsdcOut: quote.minOutput
});
```

## 🎨 UI Components

### BackendStatus Component
Shows backend connection status
```tsx
import { BackendStatus } from '@/components/BackendStatus';

function Header() {
  return (
    <div>
      <BackendStatus />
    </div>
  );
}
```

## 📝 Backend API Endpoints

All endpoints are available at: `https://omni-sweeper-production.up.railway.app`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Backend health check |
| `/api/contracts` | GET | Get contract addresses |
| `/api/quote` | GET | Get swap quote |
| `/api/balance/:address` | GET | Check token balance |
| `/api/allowance/:address` | GET | Check token allowance |
| `/api/sweep` | POST | Execute sweep |
| `/api/receipts/:address` | GET | Get sweep history |
| `/api/stats` | GET | Protocol statistics |
| `/api/transaction/:hash` | GET | Transaction status |

## 🧪 Testing

### Test Page
Visit `/api-test` to test all endpoints interactively.

### Manual Test
```bash
# Health check
curl https://omni-sweeper-production.up.railway.app/api/health

# Get contracts
curl https://omni-sweeper-production.up.railway.app/api/contracts

# Get quote
curl "https://omni-sweeper-production.up.railway.app/api/quote?tokenIn=0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60&amount=1000000000000000000"
```

## 🔍 Contract Addresses (Testnet)

### Ethereum Sepolia (Chain ID: 11155111)
- **OmniSweeper**: `0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd`
- **TestDustToken**: `0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60`
- **USDC**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

### Avalanche Fuji (Chain ID: 43113)
- **ReceiptOApp**: `0x4c956ed76Dbe238507c06D7764440C2977Cd5275`

## ⚠️ Important Notes

1. **Testnet Only**: Backend is running on testnet (Sepolia/Fuji)
2. **Mock 1inch Data**: 1inch API returns mock data on testnets
3. **Insufficient Funds**: Sweep execution may fail if backend wallet needs testnet ETH
4. **No Auth**: All endpoints are public (no authentication required)
5. **CORS Enabled**: Backend supports CORS for frontend calls

## 🎯 Integration Status

| Feature | Status | Component |
|---------|--------|-----------|
| Health Check | ✅ Working | `/api-test` |
| Contract Addresses | ✅ Working | `useContracts()` |
| Swap Quotes | ✅ Working | `SweepModal.tsx` |
| Token Balances | ⏳ Ready | `useTokenBalance()` |
| Allowances | ⏳ Ready | `useAllowance()` |
| Sweep Execution | ⏳ Ready | `useSweep()` |
| Receipts | ⏳ Ready | `useReceipts()` |
| Stats | ⏳ Ready | `useStats()` |

## 🚀 Next Steps

1. **Test the integration**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/api-test
   ```

2. **Update components** to use real data instead of mocks

3. **Add error handling** for offline scenarios

4. **Implement retry logic** for failed API calls

## 📖 Example: Full Sweep Flow

```tsx
import { useSwapQuote, useSweep } from '@/hooks/useBackendApi';

function SweepComponent({ token, userAddress }) {
  const { getQuote } = useSwapQuote(token.address, token.balance, '11155111');
  const { sweep } = useSweep();
  
  const handleSweep = async () => {
    // 1. Get quote
    const quote = await getQuote();
    
    // 2. Execute sweep
    const result = await sweep({
      userAddress,
      tokenIn: token.address,
      amount: token.balance,
      oneInchData: quote.oneInchData,
      minUsdcOut: quote.minOutput
    });
    
    // 3. Show success
    console.log('Transaction:', result.transaction.hash);
    console.log('Explorer:', result.explorer);
  };
  
  return <button onClick={handleSweep}>Sweep</button>;
}
```

---

**Backend URL**: https://omni-sweeper-production.up.railway.app
**Test Page**: http://localhost:3000/api-test
**Status**: ✅ Connected and Ready!
