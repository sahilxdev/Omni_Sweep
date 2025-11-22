// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OApp, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";

/**
 * @title ReceiptOApp
 * @notice Receives LayerZero messages on Base and emits sweep receipts
 * @dev Extended lzReceive logic (required for LayerZero prize)
 */
contract ReceiptOApp is OApp {
    
    // ============ Events ============
    
    event SweepReceipt(
        address indexed user,
        uint256 amount,
        uint32 srcChainId,
        uint256 timestamp,
        bytes32 guid
    );
    
    event ReceiptProcessed(
        address indexed user,
        uint256 totalSwept,
        uint256 sweepCount
    );
    
    // ============ State Variables ============
    
    // Track total swept per user (EXTENDED LOGIC for LayerZero prize)
    mapping(address => uint256) public userTotalSwept;
    mapping(address => uint256) public userSweepCount;
    
    // Track total protocol stats
    uint256 public totalValueSwept;
    uint256 public totalSweeps;
    
    // ============ Constructor ============
    
    constructor(
        address _endpoint,
        address _owner
    ) OApp(_endpoint, _owner) {}
    
    // ============ LayerZero Receive (EXTENDED LOGIC) ============
    
    /**
     * @notice Receive cross-chain sweep receipt
     * @dev EXTENDS base OApp logic with custom receipt processing
     * @param _origin Source chain information
     * @param _guid Message identifier
     * @param message Encoded (user, amount)
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata message,
        address, // _executor
        bytes calldata // _extraData
    ) internal override {
        // Decode message
        (address user, uint256 amount) = abi.decode(message, (address, uint256));
        
        // ============ EXTENDED LOGIC (Required for LayerZero Prize) ============
        
        // Update user stats
        userTotalSwept[user] += amount;
        userSweepCount[user] += 1;
        
        // Update protocol stats
        totalValueSwept += amount;
        totalSweeps += 1;
        
        // Emit individual receipt
        emit SweepReceipt(
            user,
            amount,
            _origin.srcEid,
            block.timestamp,
            _guid
        );
        
        // Emit processed stats (EXTENDED functionality)
        emit ReceiptProcessed(
            user,
            userTotalSwept[user],
            userSweepCount[user]
        );
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get user sweep statistics
     */
    function getUserStats(address user) external view returns (
        uint256 totalSwept,
        uint256 sweepCount,
        uint256 averageSweep
    ) {
        totalSwept = userTotalSwept[user];
        sweepCount = userSweepCount[user];
        averageSweep = sweepCount > 0 ? totalSwept / sweepCount : 0;
    }
    
    /**
     * @notice Get protocol statistics
     */
    function getProtocolStats() external view returns (
        uint256 totalValue,
        uint256 totalCount,
        uint256 averageValue
    ) {
        totalValue = totalValueSwept;
        totalCount = totalSweeps;
        averageValue = totalCount > 0 ? totalValue / totalCount : 0;
    }
}
