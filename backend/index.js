import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import blockchain from './blockchain.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize blockchain wallet
const wallet = blockchain.initializeBackendWallet();

// Middleware
app.use(cors());
app.use(express.json());

// Contract addresses
const OMNISWEEPER_ADDRESS = blockchain.CONTRACTS.ethSepolia.omniSweeper;
const USDC_ADDRESS = blockchain.CONTRACTS.ethSepolia.usdc;

// Start event listeners (disabled for production with public RPCs)
// Enable these if using a dedicated RPC node with websockets
if (process.env.ENABLE_EVENT_LISTENERS === 'true') {
    blockchain.listenForSweepEvents((event) => {
        console.log('🎉 Sweep event:', event);
    });

    blockchain.listenForReceiptEvents((event) => {
        console.log('📨 Receipt event:', event);
    });
    console.log('👂 Event listeners enabled');
} else {
    console.log('ℹ️ Event listeners disabled (set ENABLE_EVENT_LISTENERS=true to enable)');
}

/**
 * GET /api/quote
 * Get swap quote from 1inch and return swap calldata
 * 
 * Query params:
 * - tokenIn: Address of token to swap
 * - amount: Amount to swap (in wei)
 * - chainId: Chain ID (default: 11155111 for ETH Sepolia)
 */
app.get('/api/quote', async (req, res) => {
    try {
        const { tokenIn, amount, chainId = '11155111' } = req.query;
        
        if (!tokenIn || !amount) {
            return res.status(400).json({
                error: 'Missing required parameters: tokenIn, amount'
            });
        }
        
        console.log('📊 Fetching quote for:', { tokenIn, amount, chainId });
        
        // 1inch API endpoint
        const oneInchApiUrl = `https://api.1inch.dev/swap/v5.2/${chainId}/swap`;
        
        const params = {
            src: tokenIn,
            dst: USDC_ADDRESS,
            amount: amount,
            from: OMNISWEEPER_ADDRESS,
            slippage: 5, // 5% slippage
            disableEstimate: true,
            allowPartialFill: false
        };
        
        console.log('🔄 Calling 1inch API...');
        
        // Note: 1inch API requires API key for production
        // For testing, we'll return a mock response structure
        // Your frontend dev should replace with real API call
        
        try {
            const response = await axios.get(oneInchApiUrl, {
                params,
                headers: {
                    'Authorization': `Bearer ${process.env.ONEINCH_API_KEY}`,
                    'Accept': 'application/json'
                }
            });
            
            const { tx, toAmount } = response.data;
            
            return res.json({
                success: true,
                oneInchData: tx.data,
                estimatedOutput: toAmount,
                minOutput: Math.floor(toAmount * 0.95).toString(), // 5% slippage
                tokenIn,
                tokenOut: USDC_ADDRESS,
                chainId
            });
            
        } catch (apiError) {
            console.log('⚠️ 1inch API error (expected on testnet):', apiError.message);
            
            // Return mock data for testing
            return res.json({
                success: true,
                mock: true,
                message: '1inch API not available on testnet - using mock data',
                oneInchData: '0x', // Empty calldata for testing
                estimatedOutput: '1000000', // 1 USDC (6 decimals)
                minOutput: '950000', // 0.95 USDC
                tokenIn,
                tokenOut: USDC_ADDRESS,
                chainId,
                note: 'For mainnet, implement real 1inch API call here'
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch quote',
            message: error.message
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        contracts: {
            omniSweeper: OMNISWEEPER_ADDRESS,
            usdc: USDC_ADDRESS
        }
    });
});

/**
 * GET /api/contracts
 * Get contract addresses
 */
app.get('/api/contracts', (req, res) => {
    res.json({
        ethSepolia: {
            omniSweeper: '0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd',
            testDustToken: '0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60',
            usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
            chainId: 11155111,
            rpc: 'https://ethereum-sepolia-rpc.publicnode.com'
        },
        avalancheFuji: {
            receiptOApp: '0x4c956ed76Dbe238507c06D7764440C2977Cd5275',
            chainId: 43113,
            rpc: 'https://api.avax-test.network/ext/bc/C/rpc'
        }
    });
});

/**
 * POST /api/sweep
 * Execute sweep transaction on-chain
 * 
 * Body:
 * - userAddress: Address of user
 * - tokenIn: Token to sweep
 * - amount: Amount in wei
 * - oneInchData: Swap calldata from /api/quote
 * - minUsdcOut: Minimum USDC expected
 */
app.post('/api/sweep', async (req, res) => {
    try {
        if (!wallet) {
            return res.status(503).json({
                error: 'Backend wallet not configured',
                message: 'Set BACKEND_PRIVATE_KEY in environment variables'
            });
        }
        
        const { userAddress, tokenIn, amount, oneInchData, minUsdcOut } = req.body;
        
        if (!userAddress || !tokenIn || !amount || !oneInchData || !minUsdcOut) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['userAddress', 'tokenIn', 'amount', 'oneInchData', 'minUsdcOut']
            });
        }
        
        console.log('🔄 Executing sweep for:', userAddress);
        
        const txData = await blockchain.executeSweep(
            userAddress,
            tokenIn,
            amount,
            oneInchData,
            minUsdcOut
        );
        
        res.json({
            success: true,
            transaction: txData,
            explorer: `https://sepolia.etherscan.io/tx/${txData.hash}`
        });
        
    } catch (error) {
        console.error('❌ Sweep error:', error.message);
        res.status(500).json({
            error: 'Sweep failed',
            message: error.message
        });
    }
});

/**
 * GET /api/transaction/:hash
 * Get transaction status and receipt
 */
app.get('/api/transaction/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        const { chain = 'ethSepolia' } = req.query;
        
        const provider = blockchain.providers[chain];
        if (!provider) {
            return res.status(400).json({
                error: 'Invalid chain',
                validChains: Object.keys(blockchain.providers)
            });
        }
        
        const receipt = await blockchain.waitForTransaction(hash, provider);
        
        res.json({
            success: true,
            receipt,
            explorer: chain === 'ethSepolia' 
                ? `https://sepolia.etherscan.io/tx/${hash}`
                : `https://testnet.snowtrace.io/tx/${hash}`
        });
        
    } catch (error) {
        console.error('❌ Transaction check error:', error.message);
        res.status(500).json({
            error: 'Failed to get transaction',
            message: error.message
        });
    }
});

/**
 * GET /api/balance/:address
 * Get user token balance
 * 
 * Query params:
 * - token: Token address
 */
app.get('/api/balance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({
                error: 'Missing token parameter'
            });
        }
        
        const balance = await blockchain.getUserBalance(address, token);
        
        res.json({
            success: true,
            balance
        });
        
    } catch (error) {
        console.error('❌ Balance check error:', error.message);
        res.status(500).json({
            error: 'Failed to get balance',
            message: error.message
        });
    }
});

/**
 * GET /api/allowance/:address
 * Check token allowance
 * 
 * Query params:
 * - token: Token address
 * - spender: Spender address (default: OmniSweeper)
 */
app.get('/api/allowance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const { token, spender = OMNISWEEPER_ADDRESS } = req.query;
        
        if (!token) {
            return res.status(400).json({
                error: 'Missing token parameter'
            });
        }
        
        const allowance = await blockchain.getTokenAllowance(address, token, spender);
        
        res.json({
            success: true,
            allowance,
            needsApproval: BigInt(allowance.allowance) === 0n
        });
        
    } catch (error) {
        console.error('❌ Allowance check error:', error.message);
        res.status(500).json({
            error: 'Failed to get allowance',
            message: error.message
        });
    }
});

/**
 * GET /api/receipts/:address
 * Get user sweep receipts from Avalanche
 */
app.get('/api/receipts/:address', async (req, res) => {
    try {
        const { address } = req.params;
        
        const receipts = await blockchain.getUserReceipts(address);
        
        res.json({
            success: true,
            user: address,
            receipts
        });
        
    } catch (error) {
        console.error('❌ Receipts error:', error.message);
        res.status(500).json({
            error: 'Failed to get receipts',
            message: error.message
        });
    }
});

/**
 * GET /api/stats
 * Get protocol statistics
 */
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await blockchain.getProtocolStats();
        
        res.json({
            success: true,
            stats
        });
        
    } catch (error) {
        console.error('❌ Stats error:', error.message);
        res.status(500).json({
            error: 'Failed to get stats',
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 OmniSweep Functional Backend API running on port ${PORT}`);
    console.log(`📍 Health: http://localhost:${PORT}/api/health`);
    console.log(`📍 Contracts: http://localhost:${PORT}/api/contracts`);
    console.log(`\n📡 Blockchain Endpoints:`);
    console.log(`📍 GET  /api/quote?tokenIn=<addr>&amount=<wei>`);
    console.log(`📍 POST /api/sweep - Execute sweep transaction`);
    console.log(`📍 GET  /api/balance/:address?token=<addr>`);
    console.log(`📍 GET  /api/allowance/:address?token=<addr>`);
    console.log(`📍 GET  /api/receipts/:address - Cross-chain receipts`);
    console.log(`📍 GET  /api/stats - Protocol statistics`);
    console.log(`📍 GET  /api/transaction/:hash - Transaction status\n`);
    
    if (wallet) {
        console.log(`✅ Backend wallet: ${wallet.address}`);
        console.log(`✅ Can execute on-chain transactions\n`);
    } else {
        console.log(`⚠️  Backend wallet not configured`);
        console.log(`⚠️  Set BACKEND_PRIVATE_KEY to execute transactions\n`);
    }
});
