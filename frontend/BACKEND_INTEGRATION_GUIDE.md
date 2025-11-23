# OmniSweep Backend API Integration Guide

## 🔗 Backend URL
```
Production: https://omni-sweeper-production.up.railway.app
Local: http://localhost:3001
```

---

## 📡 API Endpoints

### 1. Health Check
**GET** `/api/health`

Check if backend is running and get contract addresses.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-23T07:05:00.000Z",
  "contracts": {
    "omniSweeper": "0x8C64716b0d512Fef62F5f42FC01e83D70350EB8A",
    "usdc": "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
  }
}
```

**PowerShell Example:**
```powershell
Invoke-RestMethod -Uri "https://omni-sweeper-production.up.railway.app/api/health"
```

---

### 2. Get Contract Addresses
**GET** `/api/contracts`

Get all deployed smart contract addresses across chains.

**Response:**
```json
{
  "ethSepolia": {
    "omniSweeper": "0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd",
    "testDustToken": "0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60",
    "usdc": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    "chainId": 11155111,
    "rpc": "https://ethereum-sepolia-rpc.publicnode.com"
  },
  "avalancheFuji": {
    "receiptOApp": "0x4c956ed76Dbe238507c06D7764440C2977Cd5275",
    "chainId": 43113,
    "rpc": "https://api.avax-test.network/ext/bc/C/rpc"
  }
}
```

**TypeScript Usage:**
```typescript
const contracts = await fetch(`${API_URL}/api/contracts`).then(r => r.json());
console.log(contracts.ethSepolia.omniSweeper);
```

---

### 3. Get Swap Quote
**GET** `/api/quote?tokenIn=<address>&amount=<wei>&chainId=<optional>`

Get 1inch swap quote for converting dust token to USDC.

**Query Parameters:**
- `tokenIn` (required): ERC20 token address to swap
- `amount` (required): Amount in wei (18 decimals)
- `chainId` (optional): Chain ID (default: 11155111 for Sepolia)

**Response:**
```json
{
  "success": true,
  "mock": true,
  "message": "1inch API not available on testnet - using mock data",
  "estimatedOutput": "1000000",
  "minOutput": "950000",
  "oneInchData": "0x",
  "tokenIn": "0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60",
  "amount": "1000000000000000000"
}
```

**TypeScript Usage:**
```typescript
const quote = await fetch(
  `${API_URL}/api/quote?tokenIn=0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60&amount=1000000000000000000`
).then(r => r.json());

console.log(`Estimated USDC: ${quote.estimatedOutput / 1e6}`);
```

**PowerShell Example:**
```powershell
$TOKEN = "0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60"
$AMOUNT = "1000000000000000000"
$url = "https://omni-sweeper-production.up.railway.app/api/quote" + "?tokenIn=$TOKEN" + "&amount=$AMOUNT"
Invoke-RestMethod -Uri $url
```

---

### 4. Check Token Balance
**GET** `/api/balance/:address?token=<tokenAddress>`

Check user's token balance.

**Path Parameters:**
- `address`: User's wallet address

**Query Parameters:**
- `token` (required): Token contract address to check

**Response:**
```json
{
  "success": true,
  "balance": {
    "address": "0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60",
    "name": "Test Dust Token",
    "symbol": "DUST",
    "balance": "5000000000000000000",
    "decimals": 18,
    "formatted": "5.0"
  }
}
```

**TypeScript Usage:**
```typescript
const userAddress = "0xa58DCCb0F17279abD1d0D9069Aa8711Df4a4c58E";
const tokenAddress = "0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60";

const balance = await fetch(
  `${API_URL}/api/balance/${userAddress}?token=${tokenAddress}`
).then(r => r.json());

console.log(`Balance: ${balance.balance.formatted} ${balance.balance.symbol}`);
```

---

### 5. Check Token Allowance
**GET** `/api/allowance/:address?token=<tokenAddress>&spender=<optional>`

Check if user has approved token spending.

**Path Parameters:**
- `address`: User's wallet address

**Query Parameters:**
- `token` (required): Token contract address
- `spender` (optional): Spender address (defaults to OmniSweeper contract)

**Response:**
```json
{
  "success": true,
  "allowance": "0",
  "needsApproval": true,
  "spender": "0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd"
}
```

**TypeScript Usage:**
```typescript
const allowance = await fetch(
  `${API_URL}/api/allowance/${userAddress}?token=${tokenAddress}`
).then(r => r.json());

if (allowance.needsApproval) {
  console.log("User needs to approve token first");
}
```

---

### 6. Execute Sweep Transaction
**POST** `/api/sweep`

Execute a dust token sweep transaction.

**Request Body:**
```json
{
  "userAddress": "0xa58DCCb0F17279abD1d0D9069Aa8711Df4a4c58E",
  "tokenIn": "0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60",
  "amount": "1000000000000000000",
  "oneInchData": "0x",
  "minUsdcOut": "950000"
}
```

**Response (Success):**
```json
{
  "success": true,
  "transaction": {
    "hash": "0x...",
    "from": "0xa58DCCb0F17279abD1d0D9069Aa8711Df4a4c58E",
    "to": "0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd",
    "gasUsed": "150000",
    "blockNumber": 12345
  },
  "sweepResult": {
    "usdcReceived": "980000",
    "gasCost": "0.001 ETH"
  },
  "explorer": "https://sepolia.etherscan.io/tx/0x..."
}
```

**Response (Error - Insufficient Funds):**
```json
{
  "error": "Sweep failed",
  "message": "insufficient funds for gas * price + value: have 98224067990535 want 10000000000000000"
}
```

**TypeScript Usage:**
```typescript
const sweepRequest = {
  userAddress: "0xa58DCCb0F17279abD1d0D9069Aa8711Df4a4c58E",
  tokenIn: "0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60",
  amount: "1000000000000000000",
  oneInchData: "0x",
  minUsdcOut: "950000"
};

const result = await fetch(`${API_URL}/api/sweep`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(sweepRequest)
}).then(r => r.json());

console.log(`Transaction: ${result.transaction.hash}`);
```

---

### 7. Get User Receipts
**GET** `/api/receipts/:address`

Get user's sweep transaction history.

**Path Parameters:**
- `address`: User's wallet address

**Response:**
```json
{
  "success": true,
  "receipts": [
    {
      "id": "1",
      "user": "0xa58DCCb0F17279abD1d0D9069Aa8711Df4a4c58E",
      "amount": "1000000",
      "timestamp": "1700000000",
      "srcChainId": "11155111",
      "txHash": "0x..."
    }
  ],
  "count": 1
}
```

---

### 8. Get Protocol Statistics
**GET** `/api/stats`

Get protocol-wide statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalValue": "5000000",
    "totalCount": 5,
    "averageValue": "1000000",
    "formatted": {
      "totalValue": "5.0",
      "averageValue": "1.0"
    }
  }
}
```

---

### 9. Check Transaction Status
**GET** `/api/transaction/:hash?chain=<chainName>`

Check transaction status on blockchain.

**Path Parameters:**
- `hash`: Transaction hash

**Query Parameters:**
- `chain` (optional): `ethSepolia` or `avalancheFuji` (default: ethSepolia)

**Response:**
```json
{
  "success": true,
  "receipt": {
    "transactionHash": "0x...",
    "blockNumber": 12345,
    "status": 1,
    "gasUsed": "150000"
  },
  "explorer": "https://sepolia.etherscan.io/tx/0x..."
}
```

---

## 🔧 Frontend Environment Setup

### Required Environment Variables

Create a `.env.local` file in your frontend with:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://omni-sweeper-production.up.railway.app

# For local development:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# WalletConnect (if using)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# World App / MiniKit (if implementing Mini App)
NEXT_PUBLIC_WORLD_APP_ID=app_staging_omnisweep
NEXT_PUBLIC_WORLD_ACTION=verify-omnisweep-user
NEXT_PUBLIC_WORLDCHAIN_RPC=https://worldchain-sepolia.g.alchemy.com/public
```

---

## 📦 Smart Contract Addresses

### Ethereum Sepolia (Chain ID: 11155111)
```
OmniSweeper: 0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd
TestDustToken: 0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60
USDC: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
RPC: https://ethereum-sepolia-rpc.publicnode.com
Explorer: https://sepolia.etherscan.io
```

### Avalanche Fuji (Chain ID: 43113)
```
ReceiptOApp: 0x4c956ed76Dbe238507c06D7764440C2977Cd5275
RPC: https://api.avax-test.network/ext/bc/C/rpc
Explorer: https://testnet.snowtrace.io
```

### Base Sepolia (Alternative deployment)
```
OmniSweeper: 0x8C64716b0d512Fef62F5f42FC01e83D70350EB8A
USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
Explorer: https://sepolia.basescan.org
```

---

## 🔌 API Client Implementation

Here's a ready-to-use TypeScript API client:

### `lib/api.ts`
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Health check
export async function checkHealth() {
  const response = await fetch(`${API_URL}/api/health`);
  return response.json();
}

// Get contracts
export async function fetchContracts() {
  const response = await fetch(`${API_URL}/api/contracts`);
  return response.json();
}

// Get quote
export async function fetchQuote(tokenIn: string, amount: string, chainId?: string) {
  const url = new URL(`${API_URL}/api/quote`);
  url.searchParams.set('tokenIn', tokenIn);
  url.searchParams.set('amount', amount);
  if (chainId) url.searchParams.set('chainId', chainId);
  
  const response = await fetch(url.toString());
  return response.json();
}

// Check balance
export async function fetchBalance(address: string, token: string) {
  const url = new URL(`${API_URL}/api/balance/${address}`);
  url.searchParams.set('token', token);
  
  const response = await fetch(url.toString());
  return response.json();
}

// Check allowance
export async function checkAllowance(address: string, token: string, spender?: string) {
  const url = new URL(`${API_URL}/api/allowance/${address}`);
  url.searchParams.set('token', token);
  if (spender) url.searchParams.set('spender', spender);
  
  const response = await fetch(url.toString());
  return response.json();
}

// Execute sweep
export async function executeSweep(params: {
  userAddress: string;
  tokenIn: string;
  amount: string;
  oneInchData: string;
  minUsdcOut: string;
}) {
  const response = await fetch(`${API_URL}/api/sweep`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Sweep failed');
  }
  
  return response.json();
}

// Get receipts
export async function fetchReceipts(address: string) {
  const response = await fetch(`${API_URL}/api/receipts/${address}`);
  return response.json();
}

// Get stats
export async function fetchStats() {
  const response = await fetch(`${API_URL}/api/stats`);
  return response.json();
}

// Check transaction
export async function checkTransaction(hash: string, chain?: 'ethSepolia' | 'avalancheFuji') {
  const url = new URL(`${API_URL}/api/transaction/${hash}`);
  if (chain) url.searchParams.set('chain', chain);
  
  const response = await fetch(url.toString());
  return response.json();
}

// Helper functions
export function formatTokenAmount(amount: string, decimals: number): string {
  const value = BigInt(amount) / BigInt(10 ** decimals);
  return value.toString();
}

export function parseTokenAmount(amount: string, decimals: number): string {
  const value = BigInt(Math.floor(parseFloat(amount) * 10 ** decimals));
  return value.toString();
}
```

---

## 🧪 Testing the Backend

### Quick Test Commands

```powershell
# Test health
Invoke-RestMethod -Uri "https://omni-sweeper-production.up.railway.app/api/health"

# Test contracts
Invoke-RestMethod -Uri "https://omni-sweeper-production.up.railway.app/api/contracts"

# Test quote
$TOKEN = "0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60"
$AMOUNT = "1000000000000000000"
$url = "https://omni-sweeper-production.up.railway.app/api/quote?tokenIn=$TOKEN&amount=$AMOUNT"
Invoke-RestMethod -Uri $url
```

---

## 📝 Integration Checklist

### Step 1: Environment Setup
- [ ] Create `.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] Add WalletConnect Project ID
- [ ] Configure World App credentials (if needed)

### Step 2: Install API Client
- [ ] Create `lib/api.ts` with all API functions
- [ ] Add TypeScript types for responses
- [ ] Test health endpoint

### Step 3: Connect UI Components
- [ ] Use `fetchContracts()` to get contract addresses
- [ ] Use `fetchQuote()` in sweep flow
- [ ] Use `checkAllowance()` before sweep
- [ ] Use `executeSweep()` for transactions
- [ ] Use `fetchBalance()` to display balances

### Step 4: Test Full Flow
- [ ] Health check works
- [ ] Can fetch quotes
- [ ] Can check balances
- [ ] Can check allowances
- [ ] Sweep executes (may fail with insufficient funds - that's OK!)

---

## 🚨 Important Notes

### Testnet Limitations
- **1inch API**: Not available on testnet, backend returns mock data
- **Gas**: Backend wallet needs ETH on Sepolia for transaction execution
- **USDC**: Using testnet USDC, not real USDC

### Error Handling
The most common error you'll see:
```json
{
  "error": "Sweep failed",
  "message": "insufficient funds for gas"
}
```
This is **EXPECTED** - it means the backend wallet needs more testnet ETH. This actually proves the API is working!

### CORS
Backend has CORS enabled for all origins in development. No CORS issues expected.

---

## 🔗 Blockchain Explorers

### View Contracts
- **ETH Sepolia OmniSweeper**: https://sepolia.etherscan.io/address/0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd
- **Avalanche Receipt**: https://testnet.snowtrace.io/address/0x4c956ed76Dbe238507c06D7764440C2977Cd5275
- **Base Sepolia OmniSweeper**: https://sepolia.basescan.org/address/0x8C64716b0d512Fef62F5f42FC01e83D70350EB8A

### Test Tokens
- **TestDustToken**: https://sepolia.etherscan.io/address/0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60

---

## 📞 Support & Resources

- **Backend Repository**: This project
- **API Health**: https://omni-sweeper-production.up.railway.app/api/health
- **Deployment**: Railway (auto-deploys from GitHub)

---

## 🎯 Quick Integration Example

```typescript
import { useState } from 'react';
import { fetchQuote, executeSweep } from '@/lib/api';

export function SweepButton({ userAddress, tokenAddress, amount }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSweep = async () => {
    setLoading(true);
    try {
      // 1. Get quote
      const quote = await fetchQuote(tokenAddress, amount);
      console.log('Quote:', quote);

      // 2. Execute sweep
      const result = await executeSweep({
        userAddress,
        tokenIn: tokenAddress,
        amount,
        oneInchData: quote.oneInchData,
        minUsdcOut: quote.minOutput,
      });

      console.log('Success!', result.transaction.hash);
      alert(`Sweep successful! TX: ${result.transaction.hash}`);
    } catch (error) {
      console.error('Sweep failed:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSweep} disabled={loading}>
      {loading ? 'Sweeping...' : 'Sweep Dust Tokens'}
    </button>
  );
}
```

---

**Ready to integrate!** Copy this entire document to the other Windsurf instance. 🚀
