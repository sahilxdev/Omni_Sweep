// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";

contract ConfigureBaseToEth is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Contract addresses
        address omniSweeperBaseSepolia = 0x8C64716b0d512Fef62F5f42FC01e83D70350EB8A;
        address receiptOAppEthSepolia = 0x83A3AFEb5D6AEbcc01eaF42AA6bb9f08b58031A1;
        
        // LayerZero Endpoint IDs
        uint32 ethSepoliaEid = 40161;
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Configuring Base Sepolia -> Ethereum Sepolia");
        
        OmniSweeperSimple(omniSweeperBaseSepolia).setPeer(
            ethSepoliaEid,
            bytes32(uint256(uint160(receiptOAppEthSepolia)))
        );
        
        console.log("Peer set! Base can now send to Ethereum Sepolia");
        
        vm.stopBroadcast();
    }
}
