# 🔄 BASE SEPOLIA MIGRATION GUIDE

**Why Base Sepolia?**
- ✅ Base = Memecoin capital (Brett, Degen, etc.)
- ✅ Better narrative for judges ("Dust on Base")
- ✅ Coinbase prize boost potential
- ✅ Cheaper gas = Better profitability
- ✅ More relatable to Base ecosystem judges

---

## 📋 PRE-FLIGHT CHECKLIST

### ✅ Done:
- [x] Private key added to `.env`
- [x] Base Sepolia RPC configured
- [x] Deployment script created
- [x] Backend updated to use Base Sepolia
- [x] Cross-chain config script created

### ⏭️ To Do:
- [ ] Get Base Sepolia ETH from faucet
- [ ] Deploy OmniSweeper contract
- [ ] Deploy test token (optional)
- [ ] Configure LayerZero peers
- [ ] Update contract addresses in backend
- [ ] Test sweep transaction
- [ ] Update all documentation

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### **Step 1: Get Base Sepolia ETH**

**Your Wallet Address:**
```
Run: cast wallet address --private-key $PRIVATE_KEY
```

**Get ETH from faucets:**
1. **Coinbase Faucet** (Best): https://portal.cdp.coinbase.com/products/faucet
2. **Base Sepolia Bridge**: https://bridge.base.org/deposit
3. **Superchain Faucet**: https://app.optimism.io/faucet

**Need:** ~0.1 ETH for deployment + testing

---

### **Step 2: Deploy OmniSweeper on Base Sepolia**

```bash
cd contracts/frontend

# Deploy
forge script script/DeployBaseSepolia.s.sol:DeployBaseSepolia \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY

# Or without verification first
forge script script/DeployBaseSepolia.s.sol:DeployBaseSepolia \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast
```

**Expected Output:**
```
OmniSweeper deployed at: 0x...
```

**Save this address!** You'll need it for the next steps.

---

### **Step 3: Update Backend with New Contract Address**

Edit `backend/blockchain.js`:

```javascript
baseSepolia: {
    omniSweeper: '0xYOUR_NEW_ADDRESS_HERE', // <-- Update this
    testDustToken: '0xOPTIONAL_TEST_TOKEN',
    usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    chainId: 84532,
    rpc: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org'
}
```

---

### **Step 4: Configure LayerZero Cross-Chain**

Edit `script/ConfigureCrossChainBase.s.sol` and add your deployed address:

```solidity
address omniSweeperBaseSepolia = 0xYOUR_NEW_ADDRESS; // <-- Update this
```

Then run:

```bash
forge script script/ConfigureCrossChainBase.s.sol:ConfigureCrossChainBase \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast
```

**This sets Base Sepolia → Avalanche Fuji peer**

Then configure the reverse (Avalanche → Base):

```bash
# On Avalanche, update ReceiptOApp to accept from Base Sepolia
# Your ReceiptOApp: 0x4c956ed76Dbe238507c06D7764440C2977Cd5275

cast send 0x4c956ed76Dbe238507c06D7764440C2977Cd5275 \
  "setPeer(uint32,bytes32)" \
  40245 \
  $(cast to-bytes32 YOUR_BASE_SEPOLIA_OMNISWEEPER) \
  --rpc-url $AVALANCHE_FUJI_RPC_URL \
  --private-key $PRIVATE_KEY
```

---

### **Step 5: Deploy Test Token (Optional)**

If you want to test with a custom token:

```bash
# Create simple ERC20
forge script script/DeployTestToken.s.sol:DeployTestToken \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast
```

Or use existing Base Sepolia tokens:
- **USDC:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **WETH:** `0x4200000000000000000000000000000000000006`

---

### **Step 6: Test the Sweep**

```bash
# Approve token
cast send YOUR_TOKEN_ADDRESS \
  "approve(address,uint256)" \
  YOUR_OMNISWEEPER_ADDRESS \
  1000000000000000000 \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY

# Check allowance
cast call YOUR_TOKEN_ADDRESS \
  "allowance(address,address)(uint256)" \
  YOUR_WALLET_ADDRESS \
  YOUR_OMNISWEEPER_ADDRESS \
  --rpc-url $BASE_SEPOLIA_RPC_URL
```

---

### **Step 7: Update Backend Environment**

Create/update `backend/.env`:

```bash
PORT=3001
ONEINCH_API_KEY=your_1inch_key
BACKEND_PRIVATE_KEY=0xaab86068014c222c1ff1bbd152ef481967c61e15f351e90c56ba15cd58e97e4d

# Chain selection
PRIMARY_CHAIN=baseSepolia
```

Restart backend:

```bash
cd backend
npm install
npm start
```

Test health:

```bash
curl http://localhost:3001/api/health
# Should show Base Sepolia contracts
```

---

### **Step 8: Update All Documentation**

Files to update with new Base Sepolia addresses:

1. **README.md**
   - Update contract links to BaseScan
   - Change "Ethereum Sepolia" → "Base Sepolia"
   - Update explorer links

2. **PROTOCOL.md**
   - Update deployment section
   - Change chain references

3. **DEPLOYMENTS.md**
   - Add Base Sepolia section
   - Update contract addresses

4. **TEST_RESULTS.md**
   - Re-run all backend tests
   - Update test results

5. **HACKATHON_SUBMISSION.md**
   - Update sponsor integration section
   - Emphasize Base/Coinbase connection

---

## 🔍 VERIFICATION

### Verify Contract on BaseScan

```bash
forge verify-contract YOUR_CONTRACT_ADDRESS \
  src/OmniSweeperSimple.sol:OmniSweeperSimple \
  --chain base-sepolia \
  --constructor-args $(cast abi-encode "constructor(address,address,address,address)" \
    0x6EDCE65403992e310A62460808c4b910D972f10f \
    YOUR_WALLET_ADDRESS \
    0x036CbD53842c5426634e7929541eC2318f3dCF7e \
    0x111111125421cA6dc452d289314280a0f8842A65) \
  --etherscan-api-key $BASESCAN_API_KEY
```

---

## 📊 POST-MIGRATION CHECKLIST

### ✅ Contract Verification:
- [ ] OmniSweeper deployed on Base Sepolia
- [ ] Contract verified on BaseScan
- [ ] LayerZero peer configured (Base → Avalanche)
- [ ] LayerZero peer configured (Avalanche → Base)

### ✅ Backend Verification:
- [ ] Backend updated with new addresses
- [ ] Backend restarted
- [ ] Health check passing
- [ ] Balance query working
- [ ] Quote endpoint working

### ✅ Documentation Verification:
- [ ] README.md updated
- [ ] PROTOCOL.md updated
- [ ] All links point to BaseScan
- [ ] Test results refreshed

### ✅ Testing:
- [ ] Test token approved
- [ ] Backend can read balance
- [ ] Backend can execute sweep
- [ ] Cross-chain message sent
- [ ] Receipt recorded on Avalanche

---

## 🎯 WHY THIS MIGRATION WINS

### **Narrative Boost:**

**Before (ETH Sepolia):**
> "We deployed on Ethereum testnet"

**After (Base Sepolia):**
> "We deployed on Base—the memecoin capital where dust is a REAL problem. Brett, Degen, Toshi traders leave dust daily. Our protocol is built for Base's ecosystem."

### **Prize Boost:**

1. **Coinbase CDP** ($20k)
   - Base is Coinbase's L2
   - Shows alignment with Coinbase ecosystem
   - Better integration story

2. **1inch** ($20k)
   - 1inch is active on Base
   - More real trading volume
   - Better demo potential

3. **LayerZero** ($20k)
   - Base → Avalanche shows real use case
   - More meaningful than ETH → Avalanche

### **Judge Appeal:**

- ✅ Base = Hot topic in crypto
- ✅ Memecoin narrative = Relatable
- ✅ Coinbase connection = Credibility
- ✅ Real problem (dust on Base) = Impact

---

## 🆘 TROUBLESHOOTING

### **Problem: Not enough ETH for deployment**
**Solution:** Use multiple faucets, or bridge from ETH Sepolia

### **Problem: LayerZero peer configuration fails**
**Solution:** Make sure both contracts are deployed first

### **Problem: Backend can't connect**
**Solution:** Check RPC URL, try: `https://base-sepolia.g.alchemy.com/v2/demo`

### **Problem: 1inch quote fails**
**Solution:** Use mock data on testnet (already implemented in backend)

---

## 📞 QUICK REFERENCE

### **Base Sepolia Details:**
- **Chain ID:** 84532
- **RPC:** https://sepolia.base.org
- **Explorer:** https://sepolia.basescan.org
- **LayerZero EID:** 40245
- **USDC:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

### **Key Addresses:**
- **LayerZero Endpoint:** `0x6EDCE65403992e310A62460808c4b910D972f10f`
- **1inch Router:** `0x111111125421cA6dc452d289314280a0f8842A65`
- **Your Avalanche ReceiptOApp:** `0x4c956ed76Dbe238507c06D7764440C2977Cd5275`

---

## ✅ MIGRATION COMPLETE!

Once all steps are done:
1. Test the full sweep flow
2. Update README with new addresses
3. Commit to GitHub
4. Deploy backend to Railway
5. **Go win the hackathon!** 🏆

---

**Time to Complete:** 30-45 minutes  
**Difficulty:** Medium (mostly copy-paste)  
**Impact:** HIGH (better narrative, more prizes!)
