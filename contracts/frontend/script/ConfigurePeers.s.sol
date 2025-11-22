// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";
import "../src/ReceiptOApp.sol";

contract ConfigureAvalanchePeer is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        
        console.log("Configuring OmniSweeper on Avalanche Fuji...");
        
        vm.startBroadcast(deployerKey);
        
        // Addresses
        address omniSweeperAddress = 0x92273aAdE50Fe78ED03004144eC673a822b5B714;
        address receiptOAppAddress = 0x8C64716b0d512Fef62F5f42FC01e83D70350EB8A;
        uint32 baseSepoliaEid = 40245;
        
        OmniSweeperSimple sweeper = OmniSweeperSimple(omniSweeperAddress);
        
        // Set peer: OmniSweeper -> ReceiptOApp on Base
        bytes32 peerBytes = bytes32(uint256(uint160(receiptOAppAddress)));
        sweeper.setPeer(baseSepoliaEid, peerBytes);
        
        console.log("Peer set on Avalanche!");
        console.log("OmniSweeper:", omniSweeperAddress);
        console.log("Points to ReceiptOApp:", receiptOAppAddress);
        
        vm.stopBroadcast();
    }
}

contract ConfigureBasePeer is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        
        console.log("Configuring ReceiptOApp on Base Sepolia...");
        
        vm.startBroadcast(deployerKey);
        
        // Addresses
        address omniSweeperAddress = 0x92273aAdE50Fe78ED03004144eC673a822b5B714;
        address receiptOAppAddress = 0x8C64716b0d512Fef62F5f42FC01e83D70350EB8A;
        uint32 avalancheFujiEid = 40106;
        
        ReceiptOApp receiptOApp = ReceiptOApp(receiptOAppAddress);
        
        // Set peer: ReceiptOApp -> OmniSweeper on Avalanche
        bytes32 peerBytes = bytes32(uint256(uint160(omniSweeperAddress)));
        receiptOApp.setPeer(avalancheFujiEid, peerBytes);
        
        console.log("Peer set on Base!");
        console.log("ReceiptOApp:", receiptOAppAddress);
        console.log("Points to OmniSweeper:", omniSweeperAddress);
        
        vm.stopBroadcast();
    }
}
