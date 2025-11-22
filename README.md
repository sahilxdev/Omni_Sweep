# 🌊 OmniSweep: The Self-Sustaining Dust Aggregator

> **Your dust pays for its own gas. Turn scattered tokens into USDC on Base—without spending a penny.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ETH Argentina 2025](https://img.shields.io/badge/ETH%20Argentina-2025-blue)](https://ethargentina.org/)

## 🎯 The Problem

Users have small amounts of tokens (dust) scattered across multiple chains that are too small to move profitably. The gas fees to consolidate these tokens often exceed their value.

**Example:** You have $3 worth of OP tokens on Optimism, but it costs $5 in gas to swap and bridge them. Your tokens are effectively worthless.

## 💡 The Solution: Gas Advance Protocol

OmniSweep introduces the **Gas Advance Protocol**—a self-sustaining economic model:

1. 🔍 **Scan:** Find dust on Optimism & World Chain
2. ✅ **Verify:** Pyth confirms dust value > gas cost
3. 💱 **Swap:** 1inch aggregates best rates to USDC
4. ⛽ **Deduct:** Gas costs automatically deducted from USDC output
5. 🌉 **Bridge:** Remaining USDC sent to Base via Stargate
6. 🎁 **Bonus:** World ID verified humans get FREE gas

**The Magic:** The dust pays for its own gas. Protocol sustains itself—no VC money burned.

## 🚀 Key Features

### 1. **Gas Advance Protocol** (The Secret Sauce)
- User pays **$0 upfront**—Coinbase Paymaster sponsors transaction
- Contract swaps dust → USDC via 1inch
- Contract calculates: `gasCost = tx.gasprice * gasUsed`
- Contract deducts gas from USDC and refunds Paymaster
- User receives: `swappedUSDC - gasCost - 0.5% fee`
- **World ID verified users:** 100% FREE (gas waived)

### 2. **Multi-Chain Support**
- Scan balances across Optimism, Base, Arbitrum, and more
- Cross-chain bridging via LayerZero
- Unified liquidity aggregation

### 3. **Smart Price Verification**
- Pyth Network integration for real-time price feeds
- Automatic profitability checks
- Protection against unprofitable transactions

### 4. **World ID Integration**
- Verified users get reduced/waived fees
- Sybil-resistant incentives
- Community-first approach

### 5. **Coinbase Smart Wallet Support**
- Gasless transactions via Paymasters
- Batch operations for efficiency
- Intent-based transaction signing

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ (Coinbase Smart Wallet + Intent Signing)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Contract  │ (OmniSweep Core Logic)
│             │
│  • Pull Tokens
│  • Swap (1inch)
│  • Gas Refund
│  • Bridge (LayerZero)
│  • Pyth Verification
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Paymaster  │ (Gas Sponsorship)
└─────────────┘
```

## 📋 User Flow

1. **Connect Wallet** → User connects Coinbase Smart Wallet
2. **Scan Dust** → Frontend scans for small balances across chains
3. **View Analysis** → Pyth calculates total value and estimated gas
4. **Sign Intent** → User signs batch transaction (no gas needed)
5. **Execute Sweep** → Contract:
   - Pulls tokens
   - Swaps to USDC via 1inch
   - Deducts gas cost
   - Bridges remaining to target chain
6. **Receive Funds** → User gets consolidated USDC on their preferred chain

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** - Core sweep logic
- **1inch API** - DEX aggregation
- **LayerZero** - Cross-chain messaging
- **Pyth Network** - Price feeds
- **ERC-4337** - Account abstraction

### Frontend
- **React** + **TypeScript**
- **Wagmi** / **Viem** - Ethereum interactions
- **Coinbase Wallet SDK** - Smart wallet integration
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library

### Infrastructure
- **Base** - Primary deployment chain
- **Optimism** - Secondary chain support
- **Gelato** / **Pimlico** - Paymaster services

## 🎯 Sponsor Technology Integration

### 🏆 Prize-Winning Stack

| Sponsor | Prize | Integration | How We Win |
|---------|-------|-------------|------------|
| **LayerZero** | $20k | OApp v2 + Stargate | Extended `lzReceive`, cross-chain receipts, USDC bridging |
| **1inch** | $20k | Swap API + Router | Optimal dust→USDC routes on Optimism/World |
| **Pyth Network** | $20k | Pull Oracle | On-chain safety: validates dust value > gas cost |
| **Coinbase CDP** | $20k | Smart Wallet + Paymaster | Seedless onboarding, sponsored transactions |
| **World** | $20k | World Chain + World ID | Gas-free for verified humans, mini app integration |

### Integration Depth

**LayerZero ($20k):**
- Deploy OApp on Optimism, World Chain, Base
- Extend `_lzReceive` with custom sweep receipt logic
- Use Stargate for USDC liquidity bridging
- Cross-chain messaging for transaction confirmation

**1inch ($20k):**
- Backend calls 1inch Swap API for optimal routes
- Contract executes swaps via 1inch router
- Shows route visualization in frontend
- Aggregates all DEXs for best execution

**Pyth Network ($20k):**
- Backend fetches signed price update data via Hermes
- Contract calls `updatePriceFeeds()` before every sweep
- On-chain validation: `dustValueUSD > gasCostUSD * 1.2`
- Prevents unprofitable transactions

**Coinbase CDP ($20k):**
- Primary wallet: Smart Wallet (no seed phrase)
- Paymaster sponsors approve + sweep transactions
- Batch operations for better UX
- Works across all 3 chains

**World ($20k):**
- OmniSweeper deployed on World Chain mainnet
- World ID integration via MiniKit SDK
- Verified users: 100% gas sponsorship
- Unverified: pay via Gas Advance model

## 🏆 Competitive Advantages

1. **Self-Sustaining Economics** - Protocol doesn't burn money on gas
2. **Real User Problem** - Dust is a universal pain point
3. **Low Technical Risk** - Atomic smart contracts (no complex relayer)
4. **Clear Value Prop** - "Get your money back"
5. **Multi-Chain from Day 1** - Not limited to single ecosystem

## 📊 Market Opportunity

- **100M+** crypto users have dust scattered across chains
- **Average $20-50** per user in inaccessible dust
- **$2-5B** total addressable market
- **0.5% fee** = $10-25M revenue potential

## 🚦 Development Roadmap

### Phase 1: MVP (Hackathon) ✅
- [x] Core sweep contract
- [x] Single-chain (Optimism → Base)
- [x] 1inch integration
- [x] Pyth price feeds
- [x] Basic frontend

### Phase 2: Production
- [ ] Multi-chain support (5+ chains)
- [ ] Advanced routing algorithms
- [ ] Mobile app
- [ ] Recurring sweep automation
- [ ] DAO governance

### Phase 3: Scale
- [ ] Institutional partnerships
- [ ] Liquidity mining program
- [ ] Cross-protocol integrations
- [ ] White-label solution

## 📖 Documentation

- **[Technical Specification](./TECHNICAL_SPEC.md)** - Complete implementation guide (START HERE)
- [Vision & Strategy](./vision.md) - Project philosophy and competitive analysis
- [Architecture](./ARCHITECTURE.md) - High-level technical design
- [Contributing](./CONTRIBUTING.md) - Development guidelines

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 👥 Team

Built with ❤️ at ETH Argentina 2025

- **GitHub:** [@sahilxdev](https://github.com/sahilxdev)
- **Repository:** [Omni_Sweep](https://github.com/sahilxdev/Omni_Sweep)

## 🔗 Links

- **Demo:** [Coming Soon]
- **Docs:** [Coming Soon]
- **Twitter:** [Coming Soon]

---

**⚡ Start sweeping your dust today. Every satoshi matters.**
