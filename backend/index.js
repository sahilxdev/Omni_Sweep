import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Contract addresses
const OMNISWEEPER_ADDRESS = '0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd';
const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // ETH Sepolia USDC

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

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 OmniSweep Backend API running on port ${PORT}`);
    console.log(`📍 Health: http://localhost:${PORT}/api/health`);
    console.log(`📍 Quote: http://localhost:${PORT}/api/quote?tokenIn=<addr>&amount=<wei>`);
    console.log(`📍 Contracts: http://localhost:${PORT}/api/contracts\n`);
});
