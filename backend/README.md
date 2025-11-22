# OmniSweep Backend API

Backend API for OmniSweep that integrates with 1inch for swap quotes.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Server
```bash
npm run dev
```

Server will run on `http://localhost:3001`

---

## 📡 API Endpoints

### 1. Get Swap Quote

**GET** `/api/quote`

Get swap quote from 1inch and return calldata for OmniSweeper contract.

**Query Parameters:**
- `tokenIn` (required): Address of token to swap
- `amount` (required): Amount to swap in wei
- `chainId` (optional): Chain ID (default: 11155111 for ETH Sepolia)

**Example:**
```bash
curl "http://localhost:3001/api/quote?tokenIn=0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60&amount=10000000000000000000"
```

**Response:**
```json
{
  "success": true,
  "oneInchData": "0x...",
  "estimatedOutput": "1000000",
  "minOutput": "950000",
  "tokenIn": "0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60",
  "tokenOut": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  "chainId": "11155111"
}
```

### 2. Health Check

**GET** `/api/health`

Check if API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-23T00:00:00.000Z",
  "contracts": {
    "omniSweeper": "0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd",
    "usdc": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
  }
}
```

### 3. Get Contract Addresses

**GET** `/api/contracts`

Get all deployed contract addresses.

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

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:
```bash
cp .env.example .env
```

Then add your 1inch API key:
```
PORT=3001
ONEINCH_API_KEY=your_1inch_api_key_here
```

Get API key from: https://portal.1inch.dev/

---

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://localhost:3001/api/health
```

### Test Quote Endpoint
```bash
curl "http://localhost:3001/api/quote?tokenIn=0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60&amount=10000000000000000000"
```

### Test with Different Token
```bash
curl "http://localhost:3001/api/quote?tokenIn=YOUR_TOKEN_ADDRESS&amount=1000000000000000000"
```

---

## 📋 Integration with Frontend

### Example Usage in Frontend

```javascript
// Fetch swap quote
const getQuote = async (tokenIn, amount) => {
  const response = await fetch(
    `http://localhost:3001/api/quote?tokenIn=${tokenIn}&amount=${amount}`
  );
  const data = await response.json();
  return data;
};

// Use in sweep flow
const quote = await getQuote(
  '0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60', // DUST token
  '10000000000000000000' // 10 tokens
);

// Pass to contract
await omnisweeper.sweepDust(
  tokenIn,
  amount,
  quote.oneInchData, // Calldata from 1inch
  quote.minOutput    // Min USDC expected
);
```

---

## 🚨 Important Notes

### Testnet Limitations

- 1inch API may not support all testnet tokens
- For testing, API returns mock data when 1inch is unavailable
- On mainnet, replace with real 1inch API calls

### For Production

1. Get 1inch API key: https://portal.1inch.dev/
2. Update `ONEINCH_API_KEY` in `.env`
3. Remove mock data fallback
4. Add rate limiting
5. Add caching for quotes
6. Add error handling

---

## 📚 API Documentation

### 1inch Integration

The backend integrates with 1inch Swap API v5.2:
- **Docs:** https://docs.1inch.io/docs/aggregation-protocol/api/swap-params
- **Endpoint:** `https://api.1inch.dev/swap/v5.2/{chainId}/swap`

### Contract Integration

Calls `OmniSweeper.sweepDust()` with:
- `tokenIn`: Token to sweep
- `amount`: Amount in wei
- `oneInchData`: Swap calldata from 1inch API
- `minUsdcOut`: Minimum USDC expected (with slippage)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in .env
PORT=3002
```

### CORS Errors
- CORS is enabled for all origins
- For production, restrict to your frontend domain

### 1inch API Errors
- Check API key is valid
- Verify token addresses are correct
- Ensure sufficient liquidity on 1inch

---

## 🔗 Related

- **Contracts:** `../contracts/frontend/`
- **Frontend:** `../frontend/` (to be created)
- **Deployment Info:** `../DEPLOYMENTS.md`
- **On-Chain Status:** `../ONCHAIN_STATUS.md`

---

## 📊 Status

- ✅ Express server setup
- ✅ CORS enabled
- ✅ Health endpoint
- ✅ Contracts endpoint
- ✅ Quote endpoint with 1inch integration
- ✅ Mock data for testnet
- ⏭️ Rate limiting (production)
- ⏭️ Caching (production)
- ⏭️ Monitoring (production)
