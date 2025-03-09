// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SyphToken
 * @dev ERC20 token for Syphron platform with minting capability using USDC
 */
contract SyphToken is ERC20, ERC20Burnable, Ownable {
    // USDC token contract address (Ethereum Mainnet)
    IERC20 public immutable usdcToken;
    
    // Vault address where USDC will be stored
    address public immutable vaultAddress;
    
    // Mint rate (1 USDC = 1 SYPH)
    uint256 public mintRate = 1e18; // 1:1 ratio (both tokens have 18 decimals)
    
    // Events
    event TokensMinted(address indexed recipient, uint256 usdcAmount, uint256 syphAmount);
    event MintRateUpdated(uint256 oldRate, uint256 newRate);
    event VaultAddressUpdated(address oldVault, address newVault);

    constructor(address _usdcAddress, address _vaultAddress) ERC20("Syphron Token", "SYPH") {
        require(_usdcAddress != address(0), "USDC address cannot be zero");
        require(_vaultAddress != address(0), "Vault address cannot be zero");
        
        usdcToken = IERC20(_usdcAddress);
        vaultAddress = _vaultAddress;
    }

    /**
     * @dev Mint SYPH tokens by depositing USDC
     * @param usdcAmount Amount of USDC to deposit
     */
    function mintWithUSDC(uint256 usdcAmount) external {
        require(usdcAmount > 0, "Amount must be greater than 0");
        
        // Calculate SYPH amount to mint
        uint256 syphAmount = calculateMintAmount(usdcAmount);
        
        // Transfer USDC from sender to vault
        bool success = usdcToken.transferFrom(msg.sender, vaultAddress, usdcAmount);
        require(success, "USDC transfer failed");
        
        // Mint SYPH tokens to sender
        _mint(msg.sender, syphAmount);
        
        emit TokensMinted(msg.sender, usdcAmount, syphAmount);
    }
    
    /**
     * @dev Calculate amount of SYPH tokens to mint based on USDC amount
     * @param usdcAmount Amount of USDC
     * @return Amount of SYPH tokens to mint
     */
    function calculateMintAmount(uint256 usdcAmount) public view returns (uint256) {
        return (usdcAmount * mintRate) / 1e18;
    }
    
    /**
     * @dev Update the mint rate (only owner)
     * @param newRate New mint rate
     */
    function updateMintRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be greater than 0");
        
        uint256 oldRate = mintRate;
        mintRate = newRate;
        
        emit MintRateUpdated(oldRate, newRate);
    }
    
    /**
     * @dev Mint tokens directly (only owner)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
