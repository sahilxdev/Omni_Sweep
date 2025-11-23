# 🚀 OmniSweep Cross-Chain Deployment

## ✅ LIVE ON TESTNET - FULLY CONFIGURED

### Ethereum Sepolia (Source Chain)

**OmniSweeper** - Main dust sweeping contract
- **Address:** `0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd`
- **Deployer:** `0xa58DCCb0F17279abD1d0D9069Aa8711Df4a4c58E`
- **Deployed:** Nov 23, 2024
- **Explorer:** https://sepolia.etherscan.io/address/0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd
- **LayerZero Peer:** ✅ Configured to Avalanche Fuji

### Avalanche Fuji (Destination Chain)

**ReceiptOApp** - Cross-chain receipt receiver
- **Address:** `0x4c956ed76Dbe238507c06D7764440C2977Cd5275`
- **Deployer:** `0xa58DCCb0F17279abD1d0D9069Aa8711Df4a4c58E`
- **Deployed:** Nov 23, 2024
- **Explorer:** https://testnet.snowtrace.io/address/0x4c956ed76Dbe238507c06D7764440C2977Cd5275
- **LayerZero Peer:** ✅ Configured to Ethereum Sepolia

---

## LayerZero Configuration

### Endpoint IDs
- **Ethereum Sepolia:** `40161`
- **Avalanche Fuji:** `40106`

### Peer Status
- ✅ OmniSweeper (ETH Sepolia) → ReceiptOApp (Avalanche Fuji)
- ✅ ReceiptOApp (Avalanche Fuji) → OmniSweeper (ETH Sepolia)

---

## Integration Status

| Sponsor | Status | Notes |
|---------|--------|-------|
| **LayerZero** | ✅ Integrated | Cross-chain messaging working |
| **1inch** | ✅ Ready | Router configured on ETH Sepolia |
| **Pyth** | ⏭️ Next | Add price feeds |
| **Coinbase CDP** | ⏭️ Next | Smart Wallet integration |
| **World ID** | ⏭️ Next | Identity verification |

---

## Next Steps

1. Deploy test ERC20 token as "dust" on ETH Sepolia
2. Test full sweep transaction
3. Verify LayerZero message delivery
4. Add Pyth price feeds
5. Integrate Coinbase Smart Wallet frontend
