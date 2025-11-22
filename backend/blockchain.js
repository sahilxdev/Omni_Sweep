import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Contract addresses
export const CONTRACTS = {
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
};

// ABIs
export const ABIS = {
    OmniSweeper: [
        "function sweepDust(address tokenIn, uint256 amount, bytes calldata oneInchData, uint256 minUsdcOut) external payable returns (uint256)",
        "function paymaster() external view returns (address)",
        "function USDC() external view returns (address)",
        "event DustSwept(address indexed user, address indexed tokenIn, uint256 amountIn, uint256 usdcOut, uint256 gasCost, uint256 netOutput, uint256 timestamp)"
    ],
    ERC20: [
        "function balanceOf(address account) external view returns (uint256)",
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function decimals() external view returns (uint8)",
        "function symbol() external view returns (string)",
        "function name() external view returns (string)"
    ],
    ReceiptOApp: [
        "function getUserStats(address user) external view returns (uint256 totalSwept, uint256 sweepCount, uint256 averageSweep)",
        "function getProtocolStats() external view returns (uint256 totalValue, uint256 totalCount, uint256 averageValue)",
        "event SweepReceipt(address indexed user, uint256 amount, uint32 srcChainId, uint256 timestamp, bytes32 guid)"
    ]
};

// Initialize providers
export const providers = {
    ethSepolia: new ethers.JsonRpcProvider(CONTRACTS.ethSepolia.rpc),
    avalancheFuji: new ethers.JsonRpcProvider(CONTRACTS.avalancheFuji.rpc)
};

// Initialize wallet for backend transactions
let backendWallet = null;

export function initializeBackendWallet() {
    if (!process.env.BACKEND_PRIVATE_KEY) {
        console.warn('⚠️ BACKEND_PRIVATE_KEY not set. Backend cannot execute transactions.');
        return null;
    }
    
    backendWallet = new ethers.Wallet(
        process.env.BACKEND_PRIVATE_KEY,
        providers.ethSepolia
    );
    
    console.log('✅ Backend wallet initialized:', backendWallet.address);
    return backendWallet;
}

// Get contract instances
export function getContracts() {
    return {
        omniSweeper: new ethers.Contract(
            CONTRACTS.ethSepolia.omniSweeper,
            ABIS.OmniSweeper,
            providers.ethSepolia
        ),
        receiptOApp: new ethers.Contract(
            CONTRACTS.avalancheFuji.receiptOApp,
            ABIS.ReceiptOApp,
            providers.avalancheFuji
        )
    };
}

// Get token contract
export function getTokenContract(tokenAddress, provider = providers.ethSepolia) {
    return new ethers.Contract(tokenAddress, ABIS.ERC20, provider);
}

// Execute sweep transaction
export async function executeSweep(userAddress, tokenIn, amount, oneInchData, minUsdcOut) {
    if (!backendWallet) {
        throw new Error('Backend wallet not initialized');
    }
    
    const omniSweeper = new ethers.Contract(
        CONTRACTS.ethSepolia.omniSweeper,
        ABIS.OmniSweeper,
        backendWallet
    );
    
    // Estimate gas for the transaction
    const gasEstimate = await omniSweeper.sweepDust.estimateGas(
        tokenIn,
        amount,
        oneInchData,
        minUsdcOut,
        { value: ethers.parseEther('0.01') } // LayerZero fee
    );
    
    // Execute transaction
    const tx = await omniSweeper.sweepDust(
        tokenIn,
        amount,
        oneInchData,
        minUsdcOut,
        {
            value: ethers.parseEther('0.01'), // LayerZero messaging fee
            gasLimit: gasEstimate * 120n / 100n // Add 20% buffer
        }
    );
    
    console.log('📤 Sweep transaction submitted:', tx.hash);
    
    return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value.toString(),
        gasLimit: tx.gasLimit.toString()
    };
}

// Wait for transaction and get receipt
export async function waitForTransaction(txHash, provider = providers.ethSepolia) {
    const receipt = await provider.waitForTransaction(txHash, 1, 60000); // Wait up to 60s
    
    if (!receipt) {
        throw new Error('Transaction not found');
    }
    
    return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? 'success' : 'failed',
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.gasPrice ? receipt.gasPrice.toString() : '0',
        logs: receipt.logs.length
    };
}

// Get user token balance
export async function getUserBalance(userAddress, tokenAddress) {
    const token = getTokenContract(tokenAddress);
    
    const [balance, decimals, symbol, name] = await Promise.all([
        token.balanceOf(userAddress),
        token.decimals(),
        token.symbol(),
        token.name()
    ]);
    
    return {
        address: tokenAddress,
        name,
        symbol,
        balance: balance.toString(),
        decimals: Number(decimals),
        formatted: ethers.formatUnits(balance, decimals)
    };
}

// Get token allowance
export async function getTokenAllowance(userAddress, tokenAddress, spenderAddress) {
    const token = getTokenContract(tokenAddress);
    const allowance = await token.allowance(userAddress, spenderAddress);
    
    return {
        allowance: allowance.toString(),
        formatted: ethers.formatUnits(allowance, await token.decimals())
    };
}

// Get user sweep receipts from Avalanche
export async function getUserReceipts(userAddress) {
    const { receiptOApp } = getContracts();
    
    const [totalSwept, sweepCount, averageSweep] = await receiptOApp.getUserStats(userAddress);
    
    return {
        totalSwept: totalSwept.toString(),
        sweepCount: Number(sweepCount),
        averageSweep: averageSweep.toString(),
        formatted: {
            totalSwept: ethers.formatUnits(totalSwept, 6), // USDC has 6 decimals
            averageSweep: ethers.formatUnits(averageSweep, 6)
        }
    };
}

// Get protocol statistics
export async function getProtocolStats() {
    const { receiptOApp } = getContracts();
    
    const [totalValue, totalCount, averageValue] = await receiptOApp.getProtocolStats();
    
    return {
        totalValue: totalValue.toString(),
        totalCount: Number(totalCount),
        averageValue: averageValue.toString(),
        formatted: {
            totalValue: ethers.formatUnits(totalValue, 6),
            averageValue: ethers.formatUnits(averageValue, 6)
        }
    };
}

// Listen for DustSwept events
export function listenForSweepEvents(callback) {
    const { omniSweeper } = getContracts();
    
    omniSweeper.on('DustSwept', (user, tokenIn, amountIn, usdcOut, gasCost, netOutput, timestamp, event) => {
        callback({
            user,
            tokenIn,
            amountIn: amountIn.toString(),
            usdcOut: usdcOut.toString(),
            gasCost: gasCost.toString(),
            netOutput: netOutput.toString(),
            timestamp: Number(timestamp),
            transactionHash: event.log.transactionHash,
            blockNumber: event.log.blockNumber
        });
    });
    
    console.log('👂 Listening for DustSwept events...');
}

// Listen for receipt events on Avalanche
export function listenForReceiptEvents(callback) {
    const { receiptOApp } = getContracts();
    
    receiptOApp.on('SweepReceipt', (user, amount, srcChainId, timestamp, guid, event) => {
        callback({
            user,
            amount: amount.toString(),
            srcChainId: Number(srcChainId),
            timestamp: Number(timestamp),
            guid,
            transactionHash: event.log.transactionHash,
            blockNumber: event.log.blockNumber
        });
    });
    
    console.log('👂 Listening for SweepReceipt events on Avalanche...');
}

export default {
    CONTRACTS,
    ABIS,
    providers,
    initializeBackendWallet,
    getContracts,
    getTokenContract,
    executeSweep,
    waitForTransaction,
    getUserBalance,
    getTokenAllowance,
    getUserReceipts,
    getProtocolStats,
    listenForSweepEvents,
    listenForReceiptEvents
};
