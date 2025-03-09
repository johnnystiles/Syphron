// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SyphronDeposit
 * @dev Smart contract for handling deposits in Syphron DeFi platform
 */
contract SyphronDeposit is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Strategy types
    enum Strategy { Balanced, Conservative, Aggressive, YieldFarming, LiquidityProvision }
    
    // User deposit information
    struct UserDeposit {
        uint256 amount;
        address token;
        Strategy strategy;
        uint256 timestamp;
    }

    // Maps user addresses to their deposits
    mapping(address => UserDeposit[]) public userDeposits;
    
    // Supported tokens
    mapping(address => bool) public supportedTokens;
    
    // Total deposits per token
    mapping(address => uint256) public totalDeposits;
    
    // Events
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event DepositMade(address indexed user, address indexed token, uint256 amount, Strategy strategy);
    event EthReceived(address indexed from, uint256 amount);
    event WithdrawalMade(address indexed user, address indexed token, uint256 amount);

    constructor() {
        // Add ETH (represented as address(0)) as a supported token
        supportedTokens[address(0)] = true;
    }

    /**
     * @dev Add a supported token
     * @param token Address of the ERC20 token
     */
    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Token cannot be zero address");
        require(!supportedTokens[token], "Token already supported");
        
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }

    /**
     * @dev Remove a supported token
     * @param token Address of the ERC20 token
     */
    function removeSupportedToken(address token) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }

    /**
     * @dev Make a deposit with ERC20 token
     * @param token Address of the token
     * @param amount Amount to deposit
     * @param strategy Strategy to use
     */
    function deposit(address token, uint256 amount, Strategy strategy) external nonReentrant {
        require(token != address(0), "Use depositETH for ETH deposits");
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from user
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Record the deposit
        userDeposits[msg.sender].push(UserDeposit({
            amount: amount,
            token: token,
            strategy: strategy,
            timestamp: block.timestamp
        }));
        
        // Update total deposits
        totalDeposits[token] += amount;
        
        emit DepositMade(msg.sender, token, amount, strategy);
    }

    /**
     * @dev Make a deposit with ETH
     * @param strategy Strategy to use
     */
    function depositETH(Strategy strategy) external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        
        // Record the deposit (ETH is represented as address(0))
        userDeposits[msg.sender].push(UserDeposit({
            amount: msg.value,
            token: address(0),
            strategy: strategy,
            timestamp: block.timestamp
        }));
        
        // Update total deposits
        totalDeposits[address(0)] += msg.value;
        
        emit DepositMade(msg.sender, address(0), msg.value, strategy);
    }

    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {
        emit EthReceived(msg.sender, msg.value);
    }

    /**
     * @dev Get all deposits for a user
     * @param user Address of the user
     * @return Array of user deposits
     */
    function getUserDeposits(address user) external view returns (UserDeposit[] memory) {
        return userDeposits[user];
    }

    /**
     * @dev Get the user's deposit count
     * @param user Address of the user
     * @return Number of deposits
     */
    function getUserDepositCount(address user) external view returns (uint256) {
        return userDeposits[user].length;
    }

    /**
     * @dev Get the total deposits for a specific token
     * @param token Address of the token (use address(0) for ETH)
     * @return Total amount deposited
     */
    function getTotalDeposits(address token) external view returns (uint256) {
        return totalDeposits[token];
    }

    /**
     * @dev Withdraw funds (admin function for now - would be replaced with proper withdrawal logic)
     * @param token Token address (address(0) for ETH)
     * @param amount Amount to withdraw
     * @param to Recipient address
     */
    function withdraw(address token, uint256 amount, address to) external onlyOwner nonReentrant {
        require(to != address(0), "Cannot withdraw to zero address");
        
        if (token == address(0)) {
            // ETH withdrawal
            require(address(this).balance >= amount, "Insufficient ETH balance");
            
            (bool success, ) = to.call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 withdrawal
            require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient token balance");
            
            IERC20(token).safeTransfer(to, amount);
        }
        
        emit WithdrawalMade(to, token, amount);
    }
}
