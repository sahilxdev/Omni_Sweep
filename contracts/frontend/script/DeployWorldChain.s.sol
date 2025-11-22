// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";

contract DeployWorldChain is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // World Chain Sepolia addresses
        // Note: World Chain Sepolia uses Eid 40247
        address lzEndpoint = 0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff; // LayerZero V2 Endpoint on World Sepolia
        address owner = vm.addr(deployerPrivateKey);
        address oneInchRouter = 0x1111111254EEB25477B68fb85Ed929f73A960582; // 1inch v5 router
        address stargateRouter = 0x45A01E4e04F14f7A4a6702c74187c5F6222033cd; // Stargate router (may not exist)
        address usdc = 0x79A02482A880bCE3F13e09Da970dC34db4CD24d1; // USDC on World Chain Sepolia
        address paymaster = owner;
        uint32 dstEid = 40161; // Ethereum Sepolia endpoint ID

        console.log("Deploying OmniSweeper to World Chain Sepolia...");
        console.log("Owner:", owner);

        OmniSweeperSimple omniSweeper = new OmniSweeperSimple(
            lzEndpoint,
            owner,
            oneInchRouter,
            stargateRouter,
            usdc,
            paymaster,
            dstEid
        );

        console.log("========================================");
        console.log("OmniSweeper deployed to:", address(omniSweeper));
        console.log("========================================");
        console.log("Verify on: https://worldchain-sepolia.explorer.alchemy.com/address/%s", address(omniSweeper));
        
        vm.stopBroadcast();
    }
}
