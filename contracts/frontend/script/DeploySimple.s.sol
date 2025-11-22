// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";
import "../src/ReceiptOApp.sol";

contract DeployOmniSweeperSimple is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        
        console.log("Deploying OmniSweeperSimple with:", deployer);
        console.log("Balance:", deployer.balance);
        
        vm.startBroadcast(deployerKey);
        
        // Optimism Sepolia Addresses
        address lzEndpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f;
        address oneInch = 0x1111111254EEB25477B68fb85Ed929f73A960582;
        address stargate = 0xE3B53AF74a4BF62Ae5511055290838050bf764Df;
        address usdc = 0x5fd84259d66Cd46123540766Be93DFE6D43130D7;
        
        uint32 baseEid = 40245; // Base Sepolia endpoint ID
        
        OmniSweeperSimple sweeper = new OmniSweeperSimple(
            lzEndpoint,
            deployer,
            oneInch,
            stargate,
            usdc,
            deployer, // deployer is paymaster for MVP
            baseEid
        );
        
        console.log("OmniSweeperSimple deployed at:", address(sweeper));
        console.log("");
        console.log("Chain: Optimism Sepolia");
        console.log("Deployer:", deployer);
        
        vm.stopBroadcast();
    }
}

contract DeployReceiptOApp is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        
        console.log("Deploying ReceiptOApp with:", deployer);
        console.log("Balance:", deployer.balance);
        
        vm.startBroadcast(deployerKey);
        
        // Base Sepolia Address
        address lzEndpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f;
        
        ReceiptOApp receipt = new ReceiptOApp(
            lzEndpoint,
            deployer
        );
        
        console.log("ReceiptOApp deployed at:", address(receipt));
        console.log("");
        console.log("Chain: Base Sepolia");
        console.log("Deployer:", deployer);
        
        vm.stopBroadcast();
    }
}
