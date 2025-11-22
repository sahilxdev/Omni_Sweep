// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";

contract DeployOmniSweeperAvalanche is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        
        console.log("Deploying OmniSweeperSimple to Avalanche Fuji");
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance);
        
        vm.startBroadcast(deployerKey);
        
        // Avalanche Fuji Testnet Addresses
        address lzEndpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f; // LZ endpoint
        address oneInch = 0x1111111254EEB25477B68fb85Ed929f73A960582; // 1inch router
        address stargate = 0x13093E05Eb890dfA6DacecBdE51d24DabAb2Faa1; // Stargate router
        address usdc = 0x5425890298aed601595a70AB815c96711a31Bc65; // USDC on Fuji
        
        uint32 baseSepoliaEid = 40245; // Base Sepolia LayerZero Endpoint ID
        
        OmniSweeperSimple sweeper = new OmniSweeperSimple(
            lzEndpoint,
            deployer, // owner
            oneInch,
            stargate,
            usdc,
            deployer, // paymaster (deployer for MVP)
            baseSepoliaEid
        );
        
        console.log("OmniSweeperSimple deployed at:", address(sweeper));
        console.log("");
        console.log("=== NEXT STEPS ===");
        console.log("1. Set peer on OmniSweeper (Avalanche) -> ReceiptOApp (Base)");
        console.log("   Address: 0x8C64716b0d512Fef62F5f42FC01e83D70350EB8A");
        console.log("2. Set peer on ReceiptOApp (Base) -> OmniSweeper (Avalanche)");
        console.log("   Address:", address(sweeper));
        
        vm.stopBroadcast();
    }
}
