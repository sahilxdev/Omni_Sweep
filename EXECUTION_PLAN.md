# 🚀 OmniSweep Execution Plan
## **36-Hour Hackathon Strategy**

> **Goal:** Build a working demo with ALL sponsor integrations that wins $100k in prizes

---

## ⚡ Critical Path (Must Complete)

### Phase 1: Foundation (Hours 0-8)
### Phase 2: Integrations (Hours 8-20)
### Phase 3: Polish & Demo (Hours 20-36)

---

# Phase 1: Foundation (Hours 0-8)

## Hour 0-2: Smart Contract Base

### Tasks:
1. **Setup Foundry**
```bash
cd contracts
forge init --force
forge install OpenZeppelin/openzeppelin-contracts
forge install LayerZero-Labs/LayerZero-v2
forge install pyth-network/pyth-sdk-solidity
```

2. **Create OmniSweeper.sol skeleton**
- Inherit from `OApp` (LayerZero)
- Add constructor with all addresses
- Create `sweepDustWithGasRefund()` function stub
- Add basic events

3. **Create ReceiptOApp.sol**
- Simple OApp receiver on Base
- Implement `_lzReceive` with custom logic

**Deliverable:** Contracts compile ✅

---

## Hour 2-4: Core Swap Logic

### Tasks:
1. **Implement token pulling**
```solidity
IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);
```

2. **Implement 1inch swap**
```solidity
IERC20(tokenIn).approve(oneInchRouter, amount);
(bool success,) = oneInchRouter.call(oneInchData);
uint256 usdcReceived = IERC20(usdc).balanceOf(address(this));
```

3. **Add basic tests**
- Test token transfer
- Test swap execution (mock)

**Deliverable:** Basic swap working in tests ✅

---

## Hour 4-6: Pyth Integration (CRITICAL FOR PRIZE)

### Tasks:
1. **Add Pyth price updates**
```solidity
pyth.updatePriceFeeds{value: updateFee}(pythUpdateData);
```

2. **Add profitability check**
```solidity
PythStructs.Price memory tokenPrice = pyth.getPrice(tokenPriceId);
uint256 dustValueUSD = calculateValue(amount, tokenPrice);
uint256 estimatedGas = tx.gasprice * 500000;
require(dustValueUSD > estimatedGas * 12 / 10, "Unprofitable");
```

3. **Test with mock Pyth data**

**Deliverable:** Pyth safety check working ✅

---

## Hour 6-8: Gas Advance Implementation (THE SECRET SAUCE)

### Tasks:
1. **Add gas tracking**
```solidity
uint256 gasBefore = gasleft();
// ... swap logic ...
uint256 gasUsed = gasBefore - gasleft() + 100000;
```

2. **Calculate gas cost in USDC**
```solidity
PythStructs.Price memory ethPrice = pyth.getPrice(ethPriceId);
uint256 gasCostUSDC = (gasUsed * tx.gasprice * uint256(int256(ethPrice.price))) / 1e36;
```

3. **Implement deduction logic**
```solidity
if (isWorldVerified) {
    netOutput = usdcReceived; // FREE for World ID
} else {
    uint256 protocolFee = usdcReceived * 5 / 1000;
    netOutput = usdcReceived - gasCostUSDC - protocolFee;
    IERC20(usdc).transfer(PAYMASTER, gasCostUSDC);
}
```

**Deliverable:** Gas Advance working in tests ✅

---

# Phase 2: Integrations (Hours 8-20)

## Hour 8-10: LayerZero + Stargate

### Tasks:
1. **Add Stargate bridge**
```solidity
IERC20(usdc).approve(stargateRouter, netOutput);
IStargateRouter(stargateRouter).swap{value: msg.value}(
    BASE_CHAIN_ID,
    USDC_POOL_ID,
    USDC_POOL_ID,
    payable(msg.sender),
    netOutput,
    minAmount,
    lzTxObj,
    abi.encodePacked(msg.sender),
    bytes("")
);
```

2. **Add LayerZero receipt**
```solidity
_lzSend(
    BASE_EID,
    abi.encode(msg.sender, netOutput),
    options,
    MessagingFee(msg.value / 2, 0),
    payable(msg.sender)
);
```

3. **Extend ReceiptOApp logic**
```solidity
function _lzReceive(...) internal override {
    (address user, uint256 amount) = abi.decode(message, (address, uint256));
    emit SweepReceipt(user, amount, _origin.srcEid, block.timestamp);
    // EXTENDED LOGIC (required for LayerZero prize)
}
```

**Deliverable:** Cross-chain sweep working ✅

---

## Hour 10-12: Deploy to Testnets

### Tasks:
1. **Deploy OmniSweeper to Optimism Sepolia**
```bash
forge script script/DeployOmniSweeper.s.sol --rpc-url $OPTIMISM_SEPOLIA_RPC_URL --broadcast
```

2. **Deploy OmniSweeper to World Sepolia**
3. **Deploy ReceiptOApp to Base Sepolia**
4. **Configure LayerZero peers**
5. **Verify on explorers**

**Deliverable:** All contracts on testnet ✅

---

## Hour 12-14: Backend API

### Tasks:
1. **Create Next.js project** (if not done)
```bash
npx create-next-app@latest frontend --typescript --tailwind --app
```

2. **Implement `/api/quote` endpoint**

**File:** `frontend/app/api/quote/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { tokenIn, amount, srcChainId } = await request.json();
    
    // 1. Fetch Pyth price data
    const pythResponse = await fetch(
        `https://hermes.pyth.network/api/latest_price_feeds?ids[]=${TOKEN_PRICE_ID}&ids[]=${USDC_PRICE_ID}`
    );
    const pythData = await pythResponse.json();
    const pythUpdateData = pythData.binary.data;
    
    // 2. Fetch 1inch swap data
    const oneInchResponse = await fetch(
        `https://api.1inch.dev/swap/v5.2/${srcChainId}/swap?` +
        `src=${tokenIn}&dst=${USDC_ADDRESS}&amount=${amount}&from=${OMNISWEEPER_ADDRESS}&slippage=5`,
        { headers: { 'Authorization': `Bearer ${ONEINCH_API_KEY}` } }
    );
    const oneInchData = await oneInchResponse.json();
    
    return NextResponse.json({
        oneInchData: oneInchData.tx.data,
        pythUpdateData,
        estimatedOutput: oneInchData.toAmount,
    });
}
```

3. **Test with curl**

**Deliverable:** API returns real data ✅

---

## Hour 14-16: Frontend Wallet Integration

### Tasks:
1. **Install dependencies**
```bash
pnpm add wagmi viem @coinbase/wallet-sdk @tanstack/react-query @worldcoin/minikit-js
```

2. **Setup wagmi config**

**File:** `frontend/lib/wagmi.ts`

```typescript
import { createConfig, http } from 'wagmi';
import { optimism, base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const worldChain = {
    id: 480,
    name: 'World Chain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: [process.env.NEXT_PUBLIC_WORLD_RPC_URL] },
    },
};

export const config = createConfig({
    chains: [optimism, worldChain, base],
    connectors: [
        coinbaseWallet({
            appName: 'OmniSweep',
            preference: 'smartWalletOnly',
        }),
    ],
    transports: {
        [optimism.id]: http(),
        [worldChain.id]: http(),
        [base.id]: http(),
    },
});
```

3. **Create Connect Wallet component**

**Deliverable:** Wallet connects on all 3 chains ✅

---

## Hour 16-18: Sweep Flow UI

### Tasks:
1. **Create SweepButton component**

**File:** `frontend/components/SweepButton.tsx`

```typescript
'use client';
import { useWriteContract, useAccount } from 'wagmi';
import { useState } from 'react';

export function SweepButton({ tokenIn, amount }: { tokenIn: string; amount: bigint }) {
    const { address } = useAccount();
    const { writeContract } = useWriteContract();
    const [status, setStatus] = useState<string>('idle');
    
    const handleSweep = async () => {
        try {
            setStatus('Fetching quote...');
            
            // 1. Get quote from API
            const quote = await fetch('/api/quote', {
                method: 'POST',
                body: JSON.stringify({ tokenIn, amount: amount.toString(), srcChainId: 10 }),
            }).then(r => r.json());
            
            setStatus('Approving token...');
            
            // 2. Approve token
            await writeContract({
                address: tokenIn,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [OMNISWEEPER_ADDRESS, amount],
            });
            
            setStatus('Sweeping dust...');
            
            // 3. Sweep dust
            await writeContract({
                address: OMNISWEEPER_ADDRESS,
                abi: OMNISWEEPER_ABI,
                functionName: 'sweepDustWithGasRefund',
                args: [
                    tokenIn,
                    amount,
                    quote.oneInchData,
                    quote.pythUpdateData,
                    '0x' // worldIdProof (empty for now)
                ],
                value: parseEther('0.01'), // LZ/Stargate fees
            });
            
            setStatus('✅ Swept successfully!');
        } catch (error) {
            setStatus('❌ Error: ' + error.message);
        }
    };
    
    return (
        <div>
            <button onClick={handleSweep}>Sweep Dust</button>
            <p>{status}</p>
        </div>
    );
}
```

**Deliverable:** Can execute sweep from UI ✅

---

## Hour 18-20: World ID Integration

### Tasks:
1. **Add World ID verification**

**File:** `frontend/components/WorldVerify.tsx`

```typescript
import { MiniKit } from '@worldcoin/minikit-js';

export function WorldVerify({ onVerified }: { onVerified: (proof: any) => void }) {
    const verify = async () => {
        const result = await MiniKit.commandsAsync.verify({
            action: 'sweep-dust',
            signal: userAddress,
        });
        
        if (result.finalPayload.status === 'success') {
            onVerified(result.finalPayload);
        }
    };
    
    return (
        <button onClick={verify} className="bg-black text-white px-4 py-2 rounded">
            🌍 Verify with World ID (Get Free Gas!)
        </button>
    );
}
```

2. **Update contract to accept World ID proof**
3. **Test verification flow**

**Deliverable:** World ID integration working ✅

---

# Phase 3: Polish & Demo (Hours 20-36)

## Hour 20-24: Integration Testing

### Tasks:
1. **End-to-end test on testnet**
   - Connect wallet
   - Get testnet tokens
   - Execute full sweep
   - Verify USDC on Base

2. **Fix any bugs**
3. **Test all 3 chains**

**Deliverable:** Working demo on testnet ✅

---

## Hour 24-28: Mainnet Deployment

### Tasks:
1. **Deploy to Optimism Mainnet**
```bash
forge script script/DeployOmniSweeper.s.sol \
    --rpc-url $OPTIMISM_RPC_URL \
    --broadcast \
    --verify \
    --etherscan-api-key $OPTIMISTIC_ETHERSCAN_API_KEY
```

2. **Deploy to World Chain Mainnet**
3. **Deploy to Base Mainnet**
4. **Configure LayerZero peers**
5. **Update frontend with mainnet addresses**
6. **Test with small amounts**

**Deliverable:** Live on mainnet ✅

---

## Hour 28-32: UI Polish

### Tasks:
1. **Add dust scanner**
   - Scan user balances
   - Show dust value in USD
   - List all small tokens

2. **Improve transaction status**
   - Loading states
   - Success/error messages
   - Transaction links

3. **Add analytics**
   - Total swept
   - Gas saved
   - User count

4. **Mobile responsive**

**Deliverable:** Beautiful, functional UI ✅

---

## Hour 32-36: Demo Preparation

### Tasks:
1. **Create demo video (2-3 min)**
   - Problem statement
   - Show UI
   - Execute sweep
   - Highlight tech

2. **Write pitch deck (5 slides)**
   - Problem
   - Solution (Gas Advance)
   - Tech Stack
   - Sponsor Integrations
   - Market Opportunity

3. **Prepare live demo script**
4. **Test demo flow 3x**
5. **Submit to DevPost**

**Deliverable:** Demo-ready project ✅

---

# 🎯 Sponsor Prize Checklist

## LayerZero ($20k)
- [ ] Deploy OApp on 3 chains
- [ ] Extend `_lzReceive` with custom logic
- [ ] Use Stargate for USDC bridging
- [ ] Show cross-chain messaging in demo
- [ ] Mention in README and pitch

## 1inch ($20k)
- [ ] Call 1inch Swap API in backend
- [ ] Execute swaps via 1inch router
- [ ] Show route optimization in UI
- [ ] Mention DEX aggregation benefits
- [ ] Include in tech stack docs

## Pyth Network ($20k)
- [ ] Fetch price updates via Hermes
- [ ] Call `updatePriceFeeds()` on-chain
- [ ] Show profitability validation
- [ ] Add "Verified by Pyth" badge
- [ ] Explain safety mechanism

## Coinbase CDP ($20k)
- [ ] Use Smart Wallet as primary connector
- [ ] Implement Paymaster sponsorship
- [ ] Show batch transactions
- [ ] Demonstrate seedless onboarding
- [ ] Highlight gasless UX

## World ($20k)
- [ ] Deploy on World Chain mainnet
- [ ] Integrate World ID via MiniKit
- [ ] Gate gas sponsorship behind verification
- [ ] Create mini app experience
- [ ] Show 23M user potential

---

# 🚨 Risk Mitigation

## High-Risk Items:

**1. LayerZero Messaging**
- Risk: Complex, might fail
- Mitigation: Test thoroughly on testnet first
- Backup: Demo single-chain, add cross-chain later

**2. 1inch API Rate Limits**
- Risk: Hit limits during demo
- Mitigation: Cache quotes, implement retry logic
- Backup: Use Uniswap V2 as fallback

**3. Pyth Price Feeds**
- Risk: Testnet might have limited pairs
- Mitigation: Test with ETH, USDC, common tokens
- Backup: Mock data for demo

**4. Gas Estimation**
- Risk: Calculation might be off
- Mitigation: Add 20% buffer to gas estimates
- Backup: Use fixed gas refund amount

---

# 📊 Success Metrics

## Minimum Viable Demo (MUST HAVE):
- ✅ User connects Coinbase Smart Wallet
- ✅ Scan finds dust on Optimism
- ✅ Execute sweep (with Pyth + 1inch + LayerZero)
- ✅ USDC arrives on Base
- ✅ Gas deducted automatically
- ✅ World ID gives free gas

## Stretch Goals (NICE TO HAVE):
- 🎯 Beautiful, polished UI
- 🎯 Mobile responsive
- 🎯 Live on mainnet (not just testnet)
- 🎯 Analytics dashboard
- 🎯 Multiple token support

---

# 🎬 Demo Script (3 minutes)

### **Minute 1: Problem (30s)**
"Everyone has dust—small token amounts stuck across chains. Gas costs more than the tokens are worth. $2-5B in total stuck value."

### **Minute 2: Solution (90s)**
"OmniSweep introduces the Gas Advance Protocol:
1. User pays $0 upfront—Coinbase Paymaster sponsors
2. Pyth verifies dust value > gas cost
3. 1inch swaps to USDC at best rates
4. Contract deducts gas from output, refunds Paymaster
5. Stargate bridges to Base
6. World ID verified users get 100% FREE gas

[SHOW LIVE DEMO]"

### **Minute 3: Tech & Impact (30s)**
"Built on:
- LayerZero OApp v2 across 3 chains
- 1inch for optimal execution
- Pyth for on-chain safety
- CDP Smart Wallet for gasless UX
- World ID for verified humans

Self-sustaining—protocol doesn't burn VC money on gas."

---

# 🏆 Winning Strategy

### What Makes This Win:

1. **Clear Problem:** Universal pain point (dust)
2. **Novel Solution:** Gas Advance (self-sustaining)
3. **Deep Integrations:** ALL sponsors used meaningfully
4. **Working Demo:** Live on mainnet, not just testnet
5. **Strong Pitch:** 30-second soundbite for each sponsor

### Judge Soundbites:

**LayerZero:** "OApp v2 on 3 chains, extended lzReceive, Stargate for USDC"

**1inch:** "Swap API + router for optimal dust→USDC routes"

**Pyth:** "Pull oracle validates profitability on-chain before every sweep"

**Coinbase:** "Smart Wallet with Paymaster sponsors all transactions"

**World:** "World Chain + World ID: verified humans get 100% free gas"

---

**EXECUTE THIS PLAN. WIN $100K. 🚀**
