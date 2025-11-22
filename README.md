# 🌊 OmniSweep: The Gasless Dust Aggregator

> **Transform your scattered crypto dust into real value—without paying gas fees.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ETH Argentina 2024](https://img.shields.io/badge/ETH%20Argentina-2024-blue)](https://ethargentina.org/)

## 🎯 The Problem

Users have small amounts of tokens (dust) scattered across multiple chains that are too small to move profitably. The gas fees to consolidate these tokens often exceed their value.

**Example:** You have $3 worth of OP tokens on Optimism, but it costs $5 in gas to swap and bridge them. Your tokens are effectively worthless.

## 💡 The Solution

OmniSweep is a **gas-abstracted dust sweeper** that:
- ✅ Finds your dust across multiple chains
- ✅ Aggregates and swaps tokens without you paying gas upfront
- ✅ Automatically deducts gas costs from the final output
- ✅ Bridges consolidated funds to your preferred chain
- ✅ Verifies profitability using real-time price feeds (Pyth)

**The Magic:** The dust pays for its own gas. You only receive value if the transaction is profitable.

## 🚀 Key Features

### 1. **Gas Advance Protocol**
- No upfront gas payment required
- Gas costs are automatically deducted from swapped funds
- Self-sustaining economic model

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

| Sponsor | Integration | Purpose |
|---------|-------------|---------|
| **Coinbase** | Smart Wallet + Paymasters | Gasless UX |
| **Pyth Network** | Price Feeds | Profitability verification |
| **1inch** | DEX Aggregator | Best swap rates |
| **LayerZero** | Cross-chain messaging | Token bridging |
| **World ID** | Identity verification | Fee reduction |

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

- [Vision & Strategy](./vision.md) - Project philosophy and competitive analysis
- [Architecture](./ARCHITECTURE.md) - Technical deep dive
- [Contributing](./CONTRIBUTING.md) - Development guidelines

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 👥 Team

Built with ❤️ at ETH Argentina 2024

- **GitHub:** [@sahilxdev](https://github.com/sahilxdev)
- **Repository:** [Omni_Sweep](https://github.com/sahilxdev/Omni_Sweep)

## 🔗 Links

- **Demo:** [Coming Soon]
- **Docs:** [Coming Soon]
- **Twitter:** [Coming Soon]

---

**⚡ Start sweeping your dust today. Every satoshi matters.**
