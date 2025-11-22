# 🏗️ OmniSweep Technical Specification

> **Complete technical architecture for the ETH Argentina hackathon build**

---

## 1. High-Level Picture

OmniSweep is built as a 4-layer architecture:

1. **Frontend dapp** – React/Next.js UI talking to backend + wallets
2. **Backend service** – prepares calldata & price updates (1inch + Pyth)
3. **On-chain contracts** – OmniSweeper (Optimism + World) + ReceiptOApp (Base)
4. **External infra** – LayerZero + Stargate + Pyth + 1inch + Coinbase Smart Wallet + World ID

### System Diagram

```
User Browser
    |
    v
Frontend (Next.js + wagmi + CDP Smart Wallet + World ID)
    |
    v
Backend API (/api/quote: 1inch + Pyth)
    |
    v
OmniSweeper contract (Optimism / World)
    |  \  \
    |   \  \
Pyth    1inch   Stargate Router ---> LayerZero Endpoint
(on-    (on-chain                         |
chain)  router)                           |
                                          v
                                    ReceiptOApp (Base)
                                          |
                                          v
                              USDC bridged to user on Base
```

### Contract Flow Diagram

```
OmniSweeper
    |
    ├─> IPyth.updatePriceFeeds(pythUpdateData)
    ├─> transferFrom(tokenIn, user, amount)
    ├─> ONE_INCH_ROUTER.call(oneInchData)
    ├─> STARGATE_ROUTER.swap(...)
    └─> OApp.lzSend("SweepComplete", user, amount, srcChainId)
              |
              v
        ReceiptOApp.lzReceive(...)
              |
              └─> emit SweepReceipt(user, amount, srcChainId)
```

---

## 2. Blockchain Layer

### 2.1 Chains

| Chain | Purpose | Contracts |
|-------|---------|-----------|
| **Optimism Mainnet** | Primary source chain with dust | OmniSweeper |
| **World Chain Mainnet** | Secondary source chain (World prize) | OmniSweeper |
| **Base Mainnet** | Destination chain for consolidated USDC | ReceiptOApp |

### 2.2 Smart Contracts

#### A. OmniSweeper (Optimism + World)

**Location:** `contracts/src/OmniSweeper.sol`

**Responsibilities:**
1. Receive dust tokens from user via `transferFrom`
2. Verify price with Pyth using `updatePriceFeeds`
3. Swap tokenIn → USDC using 1inch router
4. Bridge USDC to Base using Stargate
5. Send LayerZero message to Base with receipt

**Key Integrations:**
- **IPyth** – reading/updating Pyth price feeds
- **ONE_INCH_ROUTER** – executing the swap
- **STARGATE_ROUTER** – bridging USDC
- **OApp (LayerZero)** – sending messages to Base

**Main Function:**
```solidity
function sweepDust(
    address tokenIn,
    uint256 amount,
    bytes calldata oneInchData,
    bytes[] calldata pythUpdateData
) external payable returns (uint256 usdcReceived);
```

**Internal Flow:**
1. `pyth.updatePriceFeeds(pythUpdateData)` – ensure fresh prices
2. `tokenIn.transferFrom(user, contract)` – pull dust
3. `tokenIn.approve(ONE_INCH_ROUTER, amount)` – approve swap
4. `ONE_INCH_ROUTER.call(oneInchData)` – execute swap → USDC
5. `USDC.approve(STARGATE_ROUTER, balance)` – approve bridge
6. `STARGATE_ROUTER.swap(...)` – bridge to Base
7. `lzSend(...)` – send receipt message to Base

#### B. ReceiptOApp (Base)

**Location:** `contracts/src/ReceiptOApp.sol`

**Responsibilities:**
- Implement `lzReceive` to:
  - Decode the LayerZero message
  - Emit `SweepReceipt` event

**Purpose:** Proves LayerZero integration and provides on-chain receipt of sweep completion.

**Note:** Stargate separately handles bridging USDC to user's wallet on Base. This contract is for messaging/events only.

```solidity
contract ReceiptOApp is OApp {
    event SweepReceipt(
        address indexed user,
        uint256 amount,
        uint32 srcChainId
    );

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata message,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        (address user, uint256 amount) = abi.decode(message, (address, uint256));
        emit SweepReceipt(user, amount, _origin.srcEid);
    }
}
```

---

## 3. External Services / Protocols

### 3.1 LayerZero + Stargate

#### Stargate
- **Purpose:** Liquidity bridge that moves USDC from Optimism/World to Base
- **Contract:** `STARGATE_ROUTER` on source chain

**From OmniSweeper:**
```solidity
STARGATE_ROUTER.swap(
    dstChainId,        // Base chain ID
    srcPoolId,         // USDC pool on source
    dstPoolId,         // USDC pool on Base
    refundAddress,     // user
    amount,            // USDC to bridge
    minAmount,         // slippage protection
    lzTxParams,        // LayerZero params
    to,                // user address on Base
    payload            // empty
);
```

#### LayerZero Endpoint
- **Purpose:** Messaging layer for `lzSend` / `lzReceive`
- **Integration:** Via OApp v2 pattern

**From OmniSweeper:**
```solidity
_lzSend(
    dstEid,                    // Base endpoint ID
    abi.encode(user, amount),  // message payload
    options,                   // execution options
    MessagingFee(msg.value, 0), // native fee
    payable(msg.sender)        // refund address
);
```

**On Base:**
```solidity
ReceiptOApp._lzReceive(...) // invoked by LayerZero executor
```

### 3.2 Pyth Network

#### On-Chain Contract
- **Address:** `PYTH` on Optimism/World
- **Function:** `updatePriceFeeds(bytes[] calldata updateData)`

#### Off-Chain Hermes API
- **Endpoint:** `https://hermes.pyth.network/api/`
- **Used By:** Backend to fetch `pythUpdateData` bytes
- **Process:** Frontend passes this data to `sweepDust`

**Purpose:**
- Validate sweep profitability (dust value > minimum threshold)
- Prove Pyth integration for sponsor prize

**Example:**
```typescript
// Backend calls:
const pythData = await fetch(
  `https://hermes.pyth.network/api/latest_price_feeds?ids[]=${tokenPriceId}&ids[]=${usdcPriceId}`
);
const updateData = pythData.binary.data; // hex bytes[]
```

### 3.3 1inch

#### Off-Chain Swap API
- **Endpoint:** `https://api.1inch.dev/swap/v5.2/{chainId}`
- **Called By:** Backend to get optimal route and calldata

**Request:**
```javascript
GET /swap?
  fromTokenAddress={tokenIn}
  &toTokenAddress={USDC}
  &amount={amount}
  &fromAddress={OmniSweeper}
  &slippage={5-10}
  &disableEstimate=true
```

**Response:**
```json
{
  "toAmount": "4230000",
  "tx": {
    "to": "0x1111111254EEB25477B68fb85Ed929f73A960582",
    "data": "0x...",
    "value": "0"
  }
}
```

#### On-Chain Router
- **Address:** `ONE_INCH_ROUTER` (AggregationRouterV5)
- **Called By:** OmniSweeper with low-level `call(oneInchData)`

**OmniSweeper Integration:**
```solidity
tokenIn.approve(ONE_INCH_ROUTER, amount);
(bool success, bytes memory result) = ONE_INCH_ROUTER.call(oneInchData);
require(success, "1inch swap failed");
```

### 3.4 Coinbase Developer Platform

#### Smart Wallet
- **Purpose:** Users create wallets in browser (no seed phrase)
- **Chains:** Optimism, World, Base
- **Integration:** Via CDP Kit + wagmi connector

**Features:**
- Batch transactions (approve + sweep in one UX)
- Built-in paymaster support
- ERC-4337 compatible

#### Paymaster
- **Purpose:** Sponsors gas for `approve` + `sweepDust`
- **Condition:** User passes World ID verification
- **Configuration:** Outside contracts (frontend wagmi/CDP connector)

**Frontend Setup:**
```typescript
const config = createConfig({
  chains: [optimism, worldchain, base],
  transports: {
    [optimism.id]: http(),
    [worldchain.id]: http(),
    [base.id]: http(),
  },
  connectors: [
    coinbaseWallet({
      appName: 'OmniSweep',
      preference: 'smartWalletOnly',
      paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL,
    }),
  ],
});
```

### 3.5 World ID / World MiniKit

#### World ID
- **Purpose:** Zero-knowledge proof of unique humanity
- **Integration:** World MiniKit SDK

**Frontend Flow:**
```typescript
import { MiniKit } from '@worldcoin/minikit-js';

const verifyUser = async () => {
  const result = await MiniKit.verify({
    action: 'sweep-dust',
    signal: userAddress,
  });
  
  if (result.success) {
    // Enable gas sponsorship
    setIsVerified(true);
  }
};
```

**Use Case:** "Only verified users get gas sponsorship"

---

## 4. Backend (Server / API Layer)

**Implementation:** Next.js API routes (`/api/*`)

### Main Endpoints

#### POST /api/quote

**Purpose:** Prepare transaction data for sweep

**Input:**
```json
{
  "tokenIn": "0xTokenAddressOnOptimism",
  "amount": "1000000000000000000",
  "srcChainId": 10
}
```

**Steps:**

1. **Call Pyth Hermes**
```typescript
const pythResponse = await fetch(
  `https://hermes.pyth.network/api/latest_price_feeds?` +
  `ids[]=${TOKEN_PRICE_ID}&ids[]=${USDC_PRICE_ID}`
);
const pythUpdateData = pythResponse.binary.data; // bytes[]
```

2. **Call 1inch Swap API**
```typescript
const oneInchResponse = await fetch(
  `https://api.1inch.dev/swap/v5.2/${srcChainId}/swap?` +
  `fromTokenAddress=${tokenIn}` +
  `&toTokenAddress=${USDC_ADDRESS}` +
  `&amount=${amount}` +
  `&fromAddress=${OMNISWEEPER_ADDRESS}` +
  `&slippage=5`
);
const oneInchData = oneInchResponse.tx.data;
```

3. **Response:**
```json
{
  "oneInchData": "0x...",
  "pythUpdateData": ["0x...", "0x..."]
}
```

#### GET /api/dust (Optional)

**Purpose:** Scan user's dust balances

**Input:**
```json
{
  "address": "0xUserAddress"
}
```

**Steps:**
- Call RPC `eth_call` for token balances
- Use third-party indexer (Alchemy, Moralis)
- Calculate USD values

**Response:**
```json
{
  "optimism": {
    "totalUSD": 7.12,
    "tokens": [
      { "address": "0x...", "symbol": "OP", "balance": "0.05", "valueUSD": 4.23 }
    ]
  },
  "world": {
    "totalUSD": 3.45,
    "tokens": [...]
  }
}
```

**Note:** Backend never holds keys and never sends transactions – it only prepares data.

---

## 5. Frontend (dapp)

**Tech Stack:** Next.js + React + wagmi + CDP Kit + World MiniKit

### Key Responsibilities

#### 1. Wallet Connection
```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { coinbaseWallet } from 'wagmi/connectors';

// Integrate Coinbase Smart Wallet as primary
// Fallback to MetaMask if needed
```

#### 2. Identity Check (World Prize)
```typescript
const { verify, isVerified } = useWorldID();

// On World Chain, show "Verify with World ID" button
// After success, enable gas sponsorship
```

#### 3. Dust Scanning UI
```typescript
const { data: dustData } = useDustScan(address);

// Display:
// "Dust on Optimism: $7.12"
// "Dust on World: $3.45"
// List tokens and allow selection
```

#### 4. Sweep Flow

**Step 1: Get Quote**
```typescript
const quote = await fetch('/api/quote', {
  method: 'POST',
  body: JSON.stringify({ tokenIn, amount, srcChainId }),
});
const { oneInchData, pythUpdateData } = await quote.json();
```

**Step 2: Approve Token**
```typescript
const { writeContract } = useWriteContract();

await writeContract({
  address: tokenIn,
  abi: ERC20_ABI,
  functionName: 'approve',
  args: [OMNISWEEPER_ADDRESS, amount],
});
```

**Step 3: Execute Sweep**
```typescript
await writeContract({
  address: OMNISWEEPER_ADDRESS,
  abi: OMNISWEEPER_ABI,
  functionName: 'sweepDust',
  args: [tokenIn, amount, oneInchData, pythUpdateData],
  value: parseEther('0.01'), // for LZ/Stargate fees (or Paymaster covers)
});
```

**Step 4: Monitor Status**
```typescript
const { data: receipt } = useWaitForTransactionReceipt({ hash });

// Show: "Swapping..." → "Bridging..." → "Received on Base ✔"
```

#### 5. Display Result

**Listen for Events:**
```typescript
const { data: logs } = useWatchContractEvent({
  address: RECEIPT_OAPP_ADDRESS,
  abi: RECEIPT_OAPP_ABI,
  eventName: 'SweepReceipt',
  chainId: base.id,
});

// Also watch USDC balance changes on Base
const { data: balance } = useBalance({
  address: userAddress,
  token: USDC_ADDRESS,
  chainId: base.id,
});
```

**UI Confirmation:**
```tsx
<Card>
  <h3>🎉 Dust Swept Successfully!</h3>
  <p>You swept 7.01 USDC to Base from Optimism</p>
  <Link href={`https://optimistic.etherscan.io/tx/${sourceTx}`}>
    View Source Transaction
  </Link>
  <Link href={`https://basescan.org/tx/${destTx}`}>
    View Destination Transaction
  </Link>
</Card>
```

---

## 6. End-to-End Flow (Complete Sweep Transaction)

### Narrative Walkthrough

**1. User opens dapp**
- Frontend loads, connects Coinbase Smart Wallet

**2. Frontend scans dust**
- Shows: "7.12 USDC worth of dust on Optimism"

**3. User clicks "Sweep dust on Optimism"**
- Chooses specific token (e.g., 0.05 OP)

**4. Frontend calls backend**
```
POST /api/quote
```

**5. Backend processes**
- Calls Pyth Hermes → returns `pythUpdateData`
- Calls 1inch API → returns `oneInchData`
- Sends both back to frontend

**6. Tx 1: Approve**
```solidity
tokenIn.approve(OmniSweeper, amount)
```
- Sent from Smart Wallet
- Gas sponsored if World ID verified

**7. Tx 2: Sweep**
```solidity
OmniSweeper.sweepDust(tokenIn, amount, oneInchData, pythUpdateData)
```

**8. On-chain in OmniSweeper:**
```solidity
pyth.updatePriceFeeds(pythUpdateData)  // ensure fresh price
tokenIn.transferFrom(user, contract)    // pull dust
approve(ONE_INCH_ROUTER, amount)        // prepare swap
call(oneInchData)                       // tokenIn → USDC
approve(STARGATE_ROUTER, usdcBalance)   // prepare bridge
STARGATE_ROUTER.swap(...)               // bridge USDC to Base
lzSend(...)                             // send message to Base
```

**9. Stargate delivers**
- Bridged USDC arrives in user's wallet on Base

**10. LayerZero delivers message**
```solidity
ReceiptOApp.lzReceive(...) // on Base
emit SweepReceipt(user, amount, srcChainId)
```

**11. Frontend (connected to Base)**
- Sees new USDC balance
- Catches `SweepReceipt` event

**12. UI shows success**
```
🎉 Dust revived!
7.01 USDC arrived on Base
```

---

## 7. Team Responsibilities (Who Does What)

### 👨‍💻 Smart Contract Dev

**Implement & Test:**
- `OmniSweeper.sol` (Optimism + World)
- `ReceiptOApp.sol` (Base)

**Integrate:**
- Pyth SDK (`IPyth`, `updatePriceFeeds`)
- LayerZero OApp v2 (`lzSend`, `lzReceive`)
- Stargate router (`swap` function)
- ERC-20 approvals & safety checks

**Write Scripts:**
- Deployment scripts for all 3 chains
- Local/Hardhat test for full sweep flow
- Gas estimation utilities

**Deliverables:**
```
contracts/
├── src/
│   ├── OmniSweeper.sol
│   ├── ReceiptOApp.sol
│   └── interfaces/
├── test/
│   ├── OmniSweeper.t.sol
│   └── ReceiptOApp.t.sol
└── script/
    ├── DeployOmniSweeper.s.sol
    └── DeployReceiptOApp.s.sol
```

---

### 🔧 Backend Dev

**Implement API Routes:**
- `POST /api/quote`
  - Call Pyth Hermes
  - Call 1inch API
  - Validate inputs
- `GET /api/dust` (optional)
- World ID proof verification (optional)

**Environment Management:**
- Organize `.env` (RPC URLs, API keys)
- Error handling & logging
- Rate limiting for external APIs

**Deliverables:**
```
backend/
├── api/
│   ├── quote.ts
│   └── dust.ts
├── lib/
│   ├── pyth.ts
│   ├── oneinch.ts
│   └── types.ts
└── .env.example
```

---

### 🎨 Frontend Dev

**Setup:**
- Next.js + TypeScript
- wagmi + CDP Smart Wallet connector
- TailwindCSS + shadcn/ui

**Build UI:**
- Connect wallet page
- Dust scanning list
- Sweep modal/flow
- Transaction status tracker
- Success confirmation

**Integrate:**
- World MiniKit on World Chain
- `/api/quote` → `approve` → `sweepDust` flow
- Event listener for `SweepReceipt` on Base

**Deliverables:**
```
frontend/
├── app/
│   ├── page.tsx
│   ├── sweep/
│   └── layout.tsx
├── components/
│   ├── ConnectWallet.tsx
│   ├── DustList.tsx
│   ├── SweepModal.tsx
│   └── TransactionStatus.tsx
└── hooks/
    ├── useSweep.ts
    └── useDustScan.ts
```

---

### 🔗 Glue / DevOps / PM

**Ensure Correct Configuration:**
- Contract addresses on all chains
- Chain IDs and LayerZero endpoint IDs
- Fund accounts (ETH + USDC on each network)

**Handle:**
- `README.md` with setup instructions
- `addresses.json` with deployed contracts
- Final demo script
- Pitch deck preparation

**Deliverables:**
```
repo/
├── README.md
├── TECHNICAL_SPEC.md (this doc)
├── addresses.json
├── .env.example
└── DEMO_SCRIPT.md
```

---

## 8. Configuration Reference

### Contract Addresses (Template)

```json
{
  "optimism": {
    "OmniSweeper": "0x...",
    "PYTH": "0x...",
    "ONE_INCH_ROUTER": "0x1111111254EEB25477B68fb85Ed929f73A960582",
    "STARGATE_ROUTER": "0x...",
    "USDC": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"
  },
  "world": {
    "OmniSweeper": "0x...",
    "PYTH": "0x...",
    "ONE_INCH_ROUTER": "0x...",
    "STARGATE_ROUTER": "0x...",
    "USDC": "0x..."
  },
  "base": {
    "ReceiptOApp": "0x...",
    "USDC": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  }
}
```

### Chain IDs

| Network | Chain ID | LZ Endpoint ID |
|---------|----------|----------------|
| Optimism | 10 | 30111 |
| World Chain | 480 | 30184 |
| Base | 8453 | 30184 |

### Environment Variables

```bash
# RPC URLs
OPTIMISM_RPC_URL=https://mainnet.optimism.io
WORLD_RPC_URL=https://worldchain-mainnet.g.alchemy.com/v2/...
BASE_RPC_URL=https://mainnet.base.org

# API Keys
PYTH_API_KEY=...
ONEINCH_API_KEY=...
ALCHEMY_API_KEY=...

# Contract Addresses
OMNISWEEPER_OPTIMISM=0x...
OMNISWEEPER_WORLD=0x...
RECEIPT_OAPP_BASE=0x...

# CDP Paymaster
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/...

# Deployment
PRIVATE_KEY=...
ETHERSCAN_API_KEY=...
```

---

## 9. Testing Strategy

### Unit Tests (Foundry)
```bash
forge test -vvv
```

**Coverage:**
- `OmniSweeper.sweepDust()` success cases
- `OmniSweeper.sweepDust()` failure cases (insufficient price, slippage)
- `ReceiptOApp.lzReceive()` message parsing
- Gas estimation accuracy

### Integration Tests (Fork)
```bash
forge test --fork-url $OPTIMISM_RPC_URL
```

**Test:**
- Real 1inch swaps on mainnet fork
- Real Pyth price feeds
- Stargate bridge simulation
- LayerZero message delivery

### E2E Frontend Tests (Playwright)
```typescript
test('full sweep flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="connect-wallet"]');
  // ... simulate full flow
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});
```

---

## 10. Deployment Checklist

### Pre-Deploy
- [ ] All contracts compile without warnings
- [ ] Tests pass (unit + integration)
- [ ] Gas optimization review
- [ ] Security checklist (reentrancy, approvals, etc.)

### Deploy to Testnets
- [ ] Deploy `OmniSweeper` to Optimism Sepolia
- [ ] Deploy `OmniSweeper` to World Chain Sepolia
- [ ] Deploy `ReceiptOApp` to Base Sepolia
- [ ] Verify contracts on Etherscan
- [ ] Test full flow on testnet

### Deploy to Mainnets
- [ ] Deploy `OmniSweeper` to Optimism Mainnet
- [ ] Deploy `OmniSweeper` to World Chain Mainnet
- [ ] Deploy `ReceiptOApp` to Base Mainnet
- [ ] Verify contracts
- [ ] Fund contracts with gas tokens
- [ ] Update `addresses.json`
- [ ] Test with small amounts first

### Post-Deploy
- [ ] Update frontend with production addresses
- [ ] Configure Paymaster for production
- [ ] Set up monitoring/alerts
- [ ] Write deployment blog post

---

## 11. Risk Mitigation

### High-Risk Items

**1. Paymaster Integration**
- **Risk:** Complex, may fail on-chain
- **Mitigation:** Use battle-tested Gelato/Pimlico paymaster
- **Backup:** User pays gas normally

**2. LayerZero Bridge Latency**
- **Risk:** Cross-chain can take 5-10 minutes
- **Mitigation:** Show clear "bridging in progress" UI
- **Backup:** Demo single-chain sweep first if time constrained

**3. 1inch API Rate Limits**
- **Risk:** May hit limits during demo
- **Mitigation:** Cache routes, implement retry logic
- **Backup:** Use Uniswap router as fallback

**4. Pyth Price Feed Availability**
- **Risk:** Testnet may have limited price pairs
- **Mitigation:** Test with common pairs (ETH, USDC, OP)
- **Backup:** Use Chainlink as fallback oracle

---

## 12. Demo Script

### Setup (5 min before)
1. Have testnet ETH + dust tokens on Optimism Sepolia
2. Open dapp in browser
3. Connect Coinbase Smart Wallet
4. Verify World ID (if demoing on World Chain)

### Live Demo (3 min)
1. **Show problem** (15s)
   - "I have $7 of dust stuck on Optimism"
   - Point to dust list in UI

2. **Initiate sweep** (30s)
   - Click "Sweep to Base"
   - Show approve transaction (instant with Paymaster)
   - Show sweep transaction

3. **Explain magic** (45s)
   - "Pyth verifies it's profitable"
   - "1inch gets best swap rate"
   - "Stargate bridges to Base"
   - "LayerZero confirms receipt"

4. **Show result** (60s)
   - USDC appears on Base
   - Show transaction on both chains
   - Emphasize: "No gas paid by user"

5. **Highlight tech** (30s)
   - Coinbase Smart Wallet (gasless)
   - Pyth (price feeds)
   - 1inch (DEX aggregation)
   - LayerZero (cross-chain)
   - World ID (verification)

---

## Status

✅ **Architecture Finalized**  
📅 **Last Updated:** November 22, 2024  
🚀 **Ready for Implementation**

---

## Next Steps

1. **Contract Dev:** Start with `OmniSweeper.sol` skeleton
2. **Backend Dev:** Implement `/api/quote` endpoint
3. **Frontend Dev:** Set up Next.js + wagmi + CDP Kit
4. **All:** Daily standups to sync progress

**Let's build! 🌊**
