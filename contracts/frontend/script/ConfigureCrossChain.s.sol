// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";
import "../src/ReceiptOApp.sol";

// Configure OmniSweeper on Ethereum Sepolia
contract ConfigureEthSepoliaPeer is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        
        console.log("=== Configuring OmniSweeper (ETH Sepolia) ===");
        
        vm.startBroadcast(deployerKey);
        
        address omniSweeperAddress = 0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd; // ETH Sepolia
        address receiptOAppAddress = 0x4c956ed76Dbe238507c06D7764440C2977Cd5275; // Avalanche Fuji
        uint32 avalancheFujiEid = 40106;
        
        OmniSweeperSimple sweeper = OmniSweeperSimple(omniSweeperAddress);
        
        // Set peer: OmniSweeper → ReceiptOApp
        bytes32 peerBytes = bytes32(uint256(uint160(receiptOAppAddress)));
        sweeper.setPeer(avalancheFujiEid, peerBytes);
        
        console.log("Peer configured!");
        console.log("OmniSweeper on ETH Sepolia:", omniSweeperAddress);
        console.log("Points to ReceiptOApp on Avalanche:", receiptOAppAddress);
        
        vm.stopBroadcast();
    }
}

// Configure ReceiptOApp on Avalanche Fuji
contract ConfigureAvalancheFujiPeer is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        
        console.log("=== Configuring ReceiptOApp (Avalanche Fuji) ===");
        
        vm.startBroadcast(deployerKey);
        
        address omniSweeperAddress = 0xfd1411e2e3ddfC0C68649d3FEb1bE50C6d599EBd; // ETH Sepolia
        address receiptOAppAddress = 0x4c956ed76Dbe238507c06D7764440C2977Cd5275; // Avalanche Fuji
        uint32 ethSepoliaEid = 40161;
        
        ReceiptOApp receiptOApp = ReceiptOApp(receiptOAppAddress);
        
        // Set peer: ReceiptOApp → OmniSweeper
        bytes32 peerBytes = bytes32(uint256(uint160(omniSweeperAddress)));
        receiptOApp.setPeer(ethSepoliaEid, peerBytes);
        
        console.log("Peer configured!");
        console.log("ReceiptOApp on Avalanche:", receiptOAppAddress);
        console.log("Points to OmniSweeper on ETH Sepolia:", omniSweeperAddress);
        
        vm.stopBroadcast();
    }
}
