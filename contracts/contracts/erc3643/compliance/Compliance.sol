// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Compliance
 * @dev Enforces transfer rules (jurisdictions, limits, lockups, etc.)
 */
contract Compliance is Ownable {
    
    // Mapping: country code => allowed
    mapping(uint16 => bool) private allowedCountries;
    
    // Mapping: investor => lockup time
    mapping(address => uint256) private lockupUntil;
    
    // Global transfer limits
    bool public transfersEnabled = true;
    uint256 public maxHoldingAmount = type(uint256).max;
    uint256 public minHoldingAmount = 0;
    
    event CountryAllowed(uint16 indexed country);
    event CountryBlocked(uint16 indexed country);
    event LockupSet(address indexed investor, uint256 until);
    event TransfersToggled(bool enabled);
    event MaxHoldingSet(uint256 amount);
    event MinHoldingSet(uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Allow a country
     */
    function allowCountry(uint16 _country) external onlyOwner {
        allowedCountries[_country] = true;
        emit CountryAllowed(_country);
    }
    
    /**
     * @dev Block a country
     */
    function blockCountry(uint16 _country) external onlyOwner {
        allowedCountries[_country] = false;
        emit CountryBlocked(_country);
    }
    
    /**
     * @dev Set lockup period for investor
     */
    function setLockup(address _investor, uint256 _until) external onlyOwner {
        lockupUntil[_investor] = _until;
        emit LockupSet(_investor, _until);
    }
    
    /**
     * @dev Enable/disable all transfers
     */
    function setTransfersEnabled(bool _enabled) external onlyOwner {
        transfersEnabled = _enabled;
        emit TransfersToggled(_enabled);
    }
    
    /**
     * @dev Set maximum holding amount
     */
    function setMaxHolding(uint256 _amount) external onlyOwner {
        maxHoldingAmount = _amount;
        emit MaxHoldingSet(_amount);
    }
    
    /**
     * @dev Set minimum holding amount
     */
    function setMinHolding(uint256 _amount) external onlyOwner {
        minHoldingAmount = _amount;
        emit MinHoldingSet(_amount);
    }
    
    /**
     * @dev Check if transfer is compliant
     */
    function canTransfer(
        address _from,
        address _to,
        uint256 _value,
        uint16 _fromCountry,
        uint16 _toCountry,
        uint256 _toBalance
    ) external view returns (bool) {
        // Check if transfers are enabled
        if (!transfersEnabled) {
            return false;
        }
        
        // Check lockup for sender
        if (block.timestamp < lockupUntil[_from]) {
            return false;
        }
        
        // Check if countries are allowed
        if (!allowedCountries[_fromCountry] || !allowedCountries[_toCountry]) {
            return false;
        }
        
        // Check max holding for receiver
        uint256 newBalance = _toBalance + _value;
        if (newBalance > maxHoldingAmount) {
            return false;
        }
        
        // Check min holding for receiver (if they will have tokens after)
        if (newBalance > 0 && newBalance < minHoldingAmount) {
            return false;
        }
        
        return true;
    }
    
    /**
     * @dev Check if country is allowed
     */
    function isCountryAllowed(uint16 _country) external view returns (bool) {
        return allowedCountries[_country];
    }
    
    /**
     * @dev Get lockup time for investor
     */
    function getLockup(address _investor) external view returns (uint256) {
        return lockupUntil[_investor];
    }
    
    /**
     * @dev Check if investor is locked
     */
    function isLocked(address _investor) external view returns (bool) {
        return block.timestamp < lockupUntil[_investor];
    }
}
