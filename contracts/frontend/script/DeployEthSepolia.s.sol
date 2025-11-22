// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";

contract DeployOmniSweeperEthSepolia is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        
        console.log("=== Deploying OmniSweeper to Ethereum Sepolia ===");
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance / 1e18, "ETH");
        
        vm.startBroadcast(deployerKey);
        
        // Ethereum Sepolia Addresses
        address lzEndpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f; // LayerZero V2
        address oneInch = 0x1111111254EEB25477B68fb85Ed929f73A960582; // 1inch router
        address stargate = 0x0000000000000000000000000000000000000000; // Not available on ETH Sepolia
        address usdc = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238; // USDC on ETH Sepolia
        
        uint32 avalancheFujiEid = 40106; // Avalanche Fuji LayerZero Endpoint ID
        
        OmniSweeperSimple sweeper = new OmniSweeperSimple(
            lzEndpoint,
            deployer,
            oneInch,
            stargate,
            usdc,
            deployer, // paymaster
            avalancheFujiEid
        );
        
        console.log("");
        console.log("SUCCESS!");
        console.log("OmniSweeper deployed at:", address(sweeper));
        console.log("");
        console.log("=== SAVE THIS ADDRESS ===");
        console.log("Chain: Ethereum Sepolia");
        console.log("Address:", address(sweeper));
        console.log("Explorer: https://sepolia.etherscan.io/address/", address(sweeper));
        
        vm.stopBroadcast();
    }
}
