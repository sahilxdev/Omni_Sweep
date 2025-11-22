// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TestDustToken
 * @notice Simple ERC20 token for testing dust sweeping
 */
contract TestDustToken is ERC20 {
    constructor() ERC20("Test Dust Token", "DUST") {
        // Mint 1000 tokens to deployer for testing
        _mint(msg.sender, 1000 * 10**18);
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
