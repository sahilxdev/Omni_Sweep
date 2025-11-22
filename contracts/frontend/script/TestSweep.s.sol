// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";
import "../src/TestDustToken.sol";
import "../src/ReceiptOApp.sol";

contract TestSweepFlow is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        
        console.log("=== Testing Complete Sweep Flow ===");
        console.log("User:", deployer);
        console.log("");
        
        // Addresses
        address omniSweeperAddress = 0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd;
        address testTokenAddress = 0xe523fc1cc80A6EF2f643895b556cf43A1f1bCF60;
        address usdcAddress = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
        
        OmniSweeperSimple sweeper = OmniSweeperSimple(omniSweeperAddress);
        TestDustToken dustToken = TestDustToken(testTokenAddress);
        
        vm.startBroadcast(deployerKey);
        
        // Step 1: Check initial balances
        uint256 dustBalance = dustToken.balanceOf(deployer);
        console.log("Step 1: Check Balances");
        console.log("DUST balance:", dustBalance / 1e18, "tokens");
        console.log("");
        
        // Step 2: Approve OmniSweeper to spend DUST
        console.log("Step 2: Approving OmniSweeper...");
        uint256 sweepAmount = 10 * 1e18; // Sweep 10 DUST tokens
        dustToken.approve(omniSweeperAddress, sweepAmount);
        console.log("Approved", sweepAmount / 1e18, "DUST tokens");
        console.log("");
        
        // Step 3: Prepare sweep parameters
        console.log("Step 3: Preparing sweep...");
        console.log("Amount to sweep:", sweepAmount / 1e18, "DUST");
        console.log("");
        
        // For testing, we'll create a simple swap calldata
        // In production, this would come from 1inch API
        // For now, we'll just test the approval and cross-chain message
        
        console.log("=== IMPORTANT ===");
        console.log("To complete the sweep:");
        console.log("1. Get 1inch swap data from their API");
        console.log("2. Call sweepDust() with:");
        console.log("   - tokenIn:", testTokenAddress);
        console.log("   - amount:", sweepAmount);
        console.log("   - oneInchData: <from API>");
        console.log("   - minUsdcOut: <calculated>");
        console.log("");
        console.log("Contract ready to receive sweep!");
        console.log("OmniSweeper:", omniSweeperAddress);
        console.log("Approved amount:", sweepAmount / 1e18, "DUST");
        
        vm.stopBroadcast();
    }
}

contract CheckReceiptOnAvalanche is Script {
    function run() external view {
        console.log("=== Checking Receipt on Avalanche Fuji ===");
        
        address receiptOAppAddress = 0x4c956ed76Dbe238507c06D7764440C2977Cd5275;
        address testUser = 0xa58DCCb0F17279abD1d0D9069Aa8711Df4a4c58E;
        
        ReceiptOApp receiptOApp = ReceiptOApp(receiptOAppAddress);
        
        // Check stats
        (uint256 totalSwept, uint256 sweepCount, uint256 avgSweep) = receiptOApp.getUserStats(testUser);
        (uint256 protocolTotal, uint256 protocolCount, uint256 protocolAvg) = receiptOApp.getProtocolStats();
        
        console.log("");
        console.log("User Stats:");
        console.log("- Total Swept:", totalSwept);
        console.log("- Sweep Count:", sweepCount);
        console.log("- Average:", avgSweep);
        console.log("");
        console.log("Protocol Stats:");
        console.log("- Total Value:", protocolTotal);
        console.log("- Total Sweeps:", protocolCount);
        console.log("- Average Value:", protocolAvg);
    }
}
