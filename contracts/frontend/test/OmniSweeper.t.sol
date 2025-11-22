// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/OmniSweeperSimple.sol";
import "../src/ReceiptOApp.sol";
import "../src/TestDustToken.sol";

contract OmniSweeperTest is Test {
    OmniSweeperSimple public sweeper;
    TestDustToken public dustToken;
    
    address public deployer = address(0x1);
    address public user = address(0x2);
    
    function setUp() public {
        vm.startPrank(deployer);
        
        // Deploy test token
        dustToken = new TestDustToken();
        
        // Mint some tokens to user
        dustToken.mint(user, 100 * 1e18);
        
        vm.stopPrank();
    }
    
    function testTokenDeployment() public {
        assertEq(dustToken.balanceOf(deployer), 1000 * 1e18);
        assertEq(dustToken.balanceOf(user), 100 * 1e18);
        console.log("Token deployment: PASSED");
    }
    
    function testTokenApproval() public {
        vm.startPrank(user);
        
        address sweeperAddress = address(0x123); // mock
        dustToken.approve(sweeperAddress, 10 * 1e18);
        
        uint256 allowance = dustToken.allowance(user, sweeperAddress);
        assertEq(allowance, 10 * 1e18);
        
        console.log("Token approval: PASSED");
        vm.stopPrank();
    }
    
    function testUserBalance() public view {
        uint256 balance = dustToken.balanceOf(user);
        console.log("User balance:", balance / 1e18, "DUST");
        assertGt(balance, 0);
    }
}
