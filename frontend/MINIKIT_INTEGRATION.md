# World MiniKit Integration Guide

This document explains how the World MiniKit SDK is integrated into OmniSweep.

## Overview

OmniSweep is now a World Mini App that leverages the MiniKit SDK to provide:
- **World ID Verification**: Verify users with World ID (Orb or Device level)
- **Wallet Integration**: Access World App's built-in wallet
- **Payment Processing**: Enable payments through World App
- **Transaction Signing**: Sign messages and transactions

## Requirements for World Mini App Bounty

✅ **Build a Mini App with MiniKit** - Implemented
✅ **Integrate MiniKit SDK Commands** - Multiple commands integrated:
  - `verify` - World ID verification
  - `pay` - Payment processing
  - `sendTransaction` - Transaction handling
  - `signMessage` - Message signing

✅ **On-chain activity** - App deploys contracts to World Chain
✅ **No gambling/chance-based** - OmniSweep is a DeFi utility app
✅ **Proof validation** - World ID proofs can be validated on backend

## Installation

The MiniKit SDK is already installed:
```bash
npm install @worldcoin/minikit-js
```

## Architecture

### 1. MiniKit Provider
Location: `/components/MiniKitProvider.tsx`

Wraps the entire app and initializes the MiniKit SDK on mount. This must be the outermost provider.

```tsx
<MiniKitProvider>
  <Web3Provider>
    {/* App content */}
  </Web3Provider>
</MiniKitProvider>
```

### 2. Custom Hook
Location: `/hooks/useMiniKit.ts`

Provides easy access to MiniKit functionality throughout the app:

```tsx
const { 
  isInstalled,
  walletAddress,
  verify,
  sendTransaction,
  pay,
  signMessage 
} = useMiniKit();
```

### 3. World ID Verification
Location: `/components/sweep/WorldIDPanel.tsx`

Implements World ID verification for gas sponsorship on World Chain:

```tsx
const verifyPayload = {
  action: 'verify-human',
  signal: '',
  verification_level: 'orb'
};

const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
```

The verification proof contains:
- `merkle_root`: Merkle tree root
- `nullifier_hash`: Unique identifier
- `proof`: Zero-knowledge proof
- `verification_level`: 'orb' or 'device'

### 4. Payment Integration
Location: `/components/minikit/MiniKitPayment.tsx`

Handles payments through World App wallet:

```tsx
const paymentPayload = {
  reference: 'unique-tx-ref',
  to: '0x...',
  tokens: [{
    symbol: 'WLD',
    token_amount: '1.5'
  }],
  description: 'Payment description'
};

await MiniKit.commandsAsync.pay(paymentPayload);
```

### 5. Wallet Display
Location: `/components/wallet/WorldWalletButton.tsx`

Shows the connected World App wallet address.

## MiniKit Commands Used

### 1. Verify (World ID)
```typescript
MiniKit.commandsAsync.verify({
  action: 'verify-human',
  signal: '', // Optional
  verification_level: 'orb' // or 'device'
})
```

**Use case**: Verify users for gas sponsorship eligibility

### 2. Pay
```typescript
MiniKit.commandsAsync.pay({
  reference: 'unique-ref',
  to: '0xRecipient',
  tokens: [{ symbol: 'WLD', token_amount: '1.0' }],
  description: 'Payment description'
})
```

**Use case**: Process payments for sweep fees (if applicable)

### 3. Send Transaction
```typescript
MiniKit.commandsAsync.sendTransaction({
  to: '0xContract',
  value: '0',
  data: '0x...'
})
```

**Use case**: Execute sweep transactions on World Chain

### 4. Sign Message
```typescript
MiniKit.commandsAsync.signMessage({
  message: 'Message to sign'
})
```

**Use case**: Sign authentication messages or transaction approvals

## Configuration

### minikit.json
Location: `/minikit.json`

Defines the mini app metadata:
```json
{
  "name": "OmniSweep",
  "description": "Sweep dust tokens to USDC on Base",
  "categories": ["defi", "utility"],
  "verification_type": "orb",
  "permissions": [
    "wallet:read",
    "wallet:write",
    "identity:read"
  ],
  "supported_chains": [
    "worldchain",
    "base",
    "optimism"
  ]
}
```

## Testing

### In Development
1. The app will work normally in a browser (MiniKit detection will fail gracefully)
2. MiniKit commands will show "not installed" errors

### In World App
1. Deploy the app to a public URL
2. Submit to World App for review
3. Test all MiniKit commands in the actual World App environment

### Simulator (if available)
World may provide a simulator for testing MiniKit apps locally.

## Event Handling

MiniKit uses event-based communication:

```typescript
MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, (payload) => {
  if (payload.status === 'success') {
    // Handle success
  } else if (payload.status === 'error') {
    // Handle error
  }
});
```

Available events:
- `ResponseEvent.MiniAppVerifyAction`
- `ResponseEvent.MiniAppPayAction`
- `ResponseEvent.MiniAppSendTransactionAction`
- `ResponseEvent.MiniAppSignMessageAction`

## Error Handling

All MiniKit commands should include error handling:

```typescript
try {
  const result = await MiniKit.commandsAsync.verify(payload);
  if (result.finalPayload.status === 'error') {
    throw new Error(result.finalPayload.error?.message);
  }
} catch (error) {
  console.error('MiniKit error:', error);
  // Show user-friendly error message
}
```

## Backend Integration

### World ID Proof Verification

After receiving a World ID proof from the frontend, verify it on your backend:

```typescript
// Backend endpoint
POST /api/verify-worldid

// Request body
{
  "merkle_root": "0x...",
  "nullifier_hash": "0x...",
  "proof": "0x...",
  "verification_level": "orb",
  "action": "verify-human",
  "signal": ""
}
```

Use the World ID Developer Portal to verify proofs:
https://developer.worldcoin.org/

## Deployment Checklist

- [ ] Test all MiniKit commands in World App
- [ ] Ensure proper error handling for non-World App environments
- [ ] Add analytics tracking for MiniKit events
- [ ] Submit app to World App store
- [ ] Configure backend verification for World ID proofs
- [ ] Test payment flows end-to-end
- [ ] Document any World Chain specific contract deployments

## Resources

- [MiniKit Documentation](https://docs.worldcoin.org/minikit)
- [World ID Documentation](https://docs.worldcoin.org/world-id)
- [World Chain Documentation](https://docs.worldcoin.org/world-chain)
- [Mini App Guidelines](https://docs.worldcoin.org/mini-apps/guidelines)
- [Bounty Information](https://devfolio.co/worldcoin)

## Support

For issues with MiniKit integration:
1. Check the [MiniKit GitHub](https://github.com/worldcoin/minikit-js)
2. Join the [World Discord](https://discord.gg/worldcoin)
3. Post in the [World Forum](https://forum.worldcoin.org/)

---

**Note**: This app is built for the World Mini App bounty. All required MiniKit SDK commands are integrated and ready for testing in World App.
