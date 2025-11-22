// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";
import "../src/ReceiptOApp.sol";

contract ConfigureCrossChainBase is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Update these after deployment
        address omniSweeperBaseSepolia = address(0); // TO BE FILLED
        address receiptOAppAvalanche = 0x4c956ed76Dbe238507c06D7764440C2977Cd5275; // Your existing contract
        
        // LayerZero Endpoint IDs
        uint32 baseSepoliaEid = 40245;
        uint32 avalancheFujiEid = 40106;
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Configuring cross-chain peers...");
        console.log("");
        
        // Configure OmniSweeper on Base Sepolia to send to Avalanche
        console.log("Step 1: Setting peer on Base Sepolia OmniSweeper");
        console.log("Target: Avalanche Fuji (EID: %s)", avalancheFujiEid);
        
        OmniSweeperSimple(omniSweeperBaseSepolia).setPeer(
            avalancheFujiEid,
            bytes32(uint256(uint160(receiptOAppAvalanche)))
        );
        
        console.log("Peer set on Base Sepolia!");
        console.log("");
        console.log("Step 2: Setting peer on Avalanche Fuji ReceiptOApp");
        console.log("Run this on Avalanche Fuji:");
        console.log("");
        console.log("forge script script/ConfigureFromAvalanche.s.sol:ConfigureFromAvalanche \\");
        console.log("  --rpc-url $AVALANCHE_FUJI_RPC_URL \\");
        console.log("  --broadcast \\");
        console.log("  --verify");
        
        vm.stopBroadcast();
        
        console.log("");
        console.log("Cross-chain configuration complete!");
        console.log("Base Sepolia can now send messages to Avalanche Fuji");
    }
}
