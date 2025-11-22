// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OmniSweeperSimple.sol";

contract DeployZircuit is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Zircuit testnet addresses (using compatible addresses)
        address lzEndpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f; // LayerZero V2 Endpoint
        address owner = vm.addr(deployerPrivateKey);
        address oneInchRouter = 0x1111111254EEB25477B68fb85Ed929f73A960582; // 1inch v5 router
        address stargateRouter = 0x45A01E4e04F14f7A4a6702c74187c5F6222033cd; // Stargate router
        address usdc = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // USDC
        address paymaster = owner;
        uint32 dstEid = 40161; // Ethereum Sepolia endpoint ID

        console.log("Deploying OmniSweeper to Zircuit Testnet...");
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
        console.log("Verify on: https://explorer.garfield-testnet.zircuit.com/address/%s", address(omniSweeper));
        
        vm.stopBroadcast();
    }
}
