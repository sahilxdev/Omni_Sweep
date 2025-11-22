// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ReceiptOApp.sol";

contract DeployReceiptOAppAvalanche is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        
        console.log("=== Deploying ReceiptOApp to Avalanche Fuji ===");
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance / 1e18, "AVAX");
        
        vm.startBroadcast(deployerKey);
        
        // Avalanche Fuji Address
        address lzEndpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f; // LayerZero V2
        
        ReceiptOApp receiptOApp = new ReceiptOApp(
            lzEndpoint,
            deployer
        );
        
        console.log("");
        console.log("SUCCESS!");
        console.log("ReceiptOApp deployed at:", address(receiptOApp));
        console.log("");
        console.log("=== SAVE THIS ADDRESS ===");
        console.log("Chain: Avalanche Fuji");
        console.log("Address:", address(receiptOApp));
        console.log("Explorer: https://testnet.snowtrace.io/address/", address(receiptOApp));
        
        vm.stopBroadcast();
    }
}
