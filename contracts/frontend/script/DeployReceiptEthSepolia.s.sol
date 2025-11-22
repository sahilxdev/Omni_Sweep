// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ReceiptOApp.sol";

contract DeployReceiptEthSepolia is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Ethereum Sepolia LayerZero endpoint
        address lzEndpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f;
        
        console.log("Deploying ReceiptOApp on Ethereum Sepolia...");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        
        ReceiptOApp receiptOApp = new ReceiptOApp(
            lzEndpoint,
            vm.addr(deployerPrivateKey) // owner
        );
        
        console.log("ReceiptOApp deployed at:", address(receiptOApp));
        console.log("");
        console.log("Next steps:");
        console.log("1. Configure LayerZero peer from Base Sepolia");
        console.log("2. Fund contract with ETH if needed");
        
        vm.stopBroadcast();
    }
}
