// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OApp, Origin, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";

/**
 * @title OmniSweeperSimple
 * @notice Simplified gasless dust sweeper with Gas Advance Protocol (MVP)
 * @dev Integrates: LayerZero, 1inch, Stargate (Pyth coming later)
 */
contract OmniSweeperSimple is OApp {
    using SafeERC20 for IERC20;

    // ============ State Variables ============
    
    address public immutable oneInchRouter;
    address public immutable stargateRouter;
    address public immutable usdc;
    address public paymaster;
    uint32 public immutable dstEid; // Base chain endpoint ID
    
    uint256 public constant PROTOCOL_FEE_BPS = 50; // 0.5%
    uint256 public constant MIN_DUST_VALUE = 1e6; // $1 minimum (6 decimals for USDC)
    
    // ============ Events ============
    
    event DustSwept(
        address indexed user,
        address indexed tokenIn,
        uint256 amountIn,
        uint256 usdcOut,
        uint256 gasCost,
        uint256 netOutput,
        bool worldIdVerified,
        uint256 timestamp
    );
    
    // ============ Constructor ============
    
    constructor(
        address _endpoint,
        address _owner,
        address _oneInchRouter,
        address _stargateRouter,
        address _usdc,
        address _paymaster,
        uint32 _dstEid
    ) OApp(_endpoint, _owner) {
        oneInchRouter = _oneInchRouter;
        stargateRouter = _stargateRouter;
        usdc = _usdc;
        paymaster = _paymaster;
        dstEid = _dstEid;
    }
    
    // ============ Main Function ============
    
    /**
     * @notice Sweep dust with Gas Advance Protocol (Simplified MVP)
     * @param tokenIn Address of dust token to sweep
     * @param amount Amount of dust token
     * @param oneInchData Calldata for 1inch swap
     * @param minUsdcOut Minimum USDC expected (slippage protection)
     * @return netOutput Amount of USDC sent to user on Base
     */
    function sweepDust(
        address tokenIn,
        uint256 amount,
        bytes calldata oneInchData,
        uint256 minUsdcOut
    ) external payable returns (uint256 netOutput) {
        uint256 gasBefore = gasleft();
        
        // ============ Step 1: Pull Dust from User ============
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amount);
        
        // ============ Step 2: Swap via 1inch (1INCH INTEGRATION) ============
        IERC20(tokenIn).safeIncreaseAllowance(oneInchRouter, amount);
        
        (bool success,) = oneInchRouter.call(oneInchData);
        require(success, "1inch swap failed");
        
        uint256 usdcReceived = IERC20(usdc).balanceOf(address(this));
        require(usdcReceived >= minUsdcOut, "Slippage too high");
        require(usdcReceived >= MIN_DUST_VALUE, "Output too low");
        
        // ============ Step 3: Calculate Gas Cost (GAS ADVANCE PROTOCOL) ============
        uint256 gasUsed = gasBefore - gasleft() + 200000; // Add buffer
        uint256 gasCostWei = gasUsed * tx.gasprice;
        
        // Simple ETH price assumption: 1 ETH = $2000, 1 USDC = $1
        // TODO: Use Pyth in production
        uint256 gasCostUSDC = (gasCostWei * 2000) / 1e18; // Convert Wei to USDC
        
        // ============ Step 4: Apply Gas Advance Logic ============
        // For MVP: everyone pays gas (World ID integration coming later)
        
        uint256 protocolFee = (usdcReceived * PROTOCOL_FEE_BPS) / 10000;
        uint256 totalDeduction = gasCostUSDC + protocolFee;
        
        require(usdcReceived > totalDeduction, "Insufficient output");
        
        netOutput = usdcReceived - totalDeduction;
        
        // Refund paymaster in USDC
        if (gasCostUSDC > 0) {
            IERC20(usdc).safeTransfer(paymaster, gasCostUSDC);
        }
        if (protocolFee > 0) {
            IERC20(usdc).safeTransfer(owner(), protocolFee);
        }
        
        // ============ Step 5: Bridge to Base via Stargate (LAYERZERO INTEGRATION) ============
        IERC20(usdc).safeIncreaseAllowance(stargateRouter, netOutput);
        
        // Stargate swap parameters
        uint16 dstChainId = 184; // Base Stargate chain ID
        uint256 srcPoolId = 1; // USDC pool
        uint256 dstPoolId = 1; // USDC pool
        
        IStargateRouter(stargateRouter).swap{value: msg.value}(
            dstChainId,
            srcPoolId,
            dstPoolId,
            payable(msg.sender),
            netOutput,
            (netOutput * 9950) / 10000, // 0.5% slippage
            IStargateRouter.lzTxObj(200000, 0, "0x"),
            abi.encodePacked(msg.sender),
            bytes("")
        );
        
        // ============ Step 6: Send Receipt via LayerZero (LAYERZERO PRIZE) ============
        bytes memory message = abi.encode(msg.sender, netOutput);
        bytes memory options = hex"00030100110100000000000000000000000000030d40";
        
        _lzSend(
            dstEid,
            message,
            options,
            MessagingFee(msg.value / 2, 0),
            payable(msg.sender)
        );
        
        emit DustSwept(
            msg.sender,
            tokenIn,
            amount,
            usdcReceived,
            gasCostUSDC,
            netOutput,
            false, // worldIdVerified = false for MVP
            block.timestamp
        );
    }
    
    // ============ Admin Functions ============
    
    function updatePaymaster(address _newPaymaster) external onlyOwner {
        paymaster = _newPaymaster;
    }
    
    // ============ LayerZero Receive ============
    
    function _lzReceive(
        Origin calldata,
        bytes32,
        bytes calldata,
        address,
        bytes calldata
    ) internal override {
        revert("Not implemented on source chain");
    }
}

// ============ External Interfaces ============

interface IStargateRouter {
    struct lzTxObj {
        uint256 dstGasForCall;
        uint256 dstNativeAmount;
        bytes dstNativeAddr;
    }
    
    function swap(
        uint16 _dstChainId,
        uint256 _srcPoolId,
        uint256 _dstPoolId,
        address payable _refundAddress,
        uint256 _amountLD,
        uint256 _minAmountLD,
        lzTxObj memory _lzTxParams,
        bytes calldata _to,
        bytes calldata _payload
    ) external payable;
}
