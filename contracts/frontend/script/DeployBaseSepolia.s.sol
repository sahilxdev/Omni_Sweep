// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";

contract DeployBaseSepolia is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Base Sepolia addresses
        address lzEndpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f; // LayerZero Base Sepolia
        address usdc = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // USDC on Base Sepolia
        address oneInchRouter = 0x111111125421cA6dc452d289314280a0f8842A65; // 1inch on Base
        
        console.log("Deploying OmniSweeper on Base Sepolia...");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        
        OmniSweeperSimple omniSweeper = new OmniSweeperSimple(
            lzEndpoint,
            vm.addr(deployerPrivateKey), // owner
            usdc,
            oneInchRouter
        );
        
        console.log("OmniSweeper deployed at:", address(omniSweeper));
        console.log("");
        console.log("Next steps:");
        console.log("1. Fund contract with ETH for LayerZero fees");
        console.log("2. Configure LayerZero peer to Avalanche Fuji");
        console.log("3. Verify on BaseScan:");
        console.log("   forge verify-contract", address(omniSweeper));
        console.log("   --chain base-sepolia");
        console.log("   --constructor-args $(cast abi-encode 'constructor(address,address,address,address)' %s %s %s %s)", 
            lzEndpoint, 
            vm.addr(deployerPrivateKey),
            usdc,
            oneInchRouter
        );
        
        vm.stopBroadcast();
    }
}
