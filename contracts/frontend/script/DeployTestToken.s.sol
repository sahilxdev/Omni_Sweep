// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TestDustToken.sol";

contract DeployTestDustToken is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        
        console.log("=== Deploying Test Dust Token ===");
        console.log("Deployer:", deployer);
        
        vm.startBroadcast(deployerKey);
        
        TestDustToken token = new TestDustToken();
        
        console.log("");
        console.log("SUCCESS!");
        console.log("TestDustToken deployed at:", address(token));
        console.log("Balance:", token.balanceOf(deployer) / 1e18, "DUST");
        console.log("");
        console.log("Explorer: https://sepolia.etherscan.io/address/", address(token));
        
        vm.stopBroadcast();
    }
}
