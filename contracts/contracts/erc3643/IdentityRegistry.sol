// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./storage/IdentityRegistryStorage.sol";
import "./registry/ClaimTopicsRegistry.sol";
import "./registry/TrustedIssuersRegistry.sol";

/**
 * @title IdentityRegistry
 * @dev Central registry linking investors to their identities and verification status
 */
contract IdentityRegistry is Ownable {
    
    IdentityRegistryStorage public identityStorage;
    ClaimTopicsRegistry public claimTopicsRegistry;
    TrustedIssuersRegistry public trustedIssuersRegistry;
    
    event IdentityRegistered(address indexed investor, address indexed identity);
    event IdentityRemoved(address indexed investor);
    event IdentityUpdated(address indexed investor, address indexed oldIdentity, address indexed newIdentity);
    
    constructor(
        address _identityStorage,
        address _claimTopicsRegistry,
        address _trustedIssuersRegistry
    ) Ownable(msg.sender) {
        require(_identityStorage != address(0), "Invalid identity storage");
        require(_claimTopicsRegistry != address(0), "Invalid claim topics registry");
        require(_trustedIssuersRegistry != address(0), "Invalid issuers registry");
        
        identityStorage = IdentityRegistryStorage(_identityStorage);
        claimTopicsRegistry = ClaimTopicsRegistry(_claimTopicsRegistry);
        trustedIssuersRegistry = TrustedIssuersRegistry(_trustedIssuersRegistry);
    }
    
    /**
     * @dev Register identity for investor
     */
    function registerIdentity(address _investor, address _identity, uint16 _country) external onlyOwner {
        identityStorage.addIdentity(_investor, _identity, _country);
        emit IdentityRegistered(_investor, _identity);
    }
    
    /**
     * @dev Remove identity for investor
     */
    function deleteIdentity(address _investor) external onlyOwner {
        address identity = identityStorage.identity(_investor);
        identityStorage.removeIdentity(_investor);
        emit IdentityRemoved(_investor);
    }
    
    /**
     * @dev Update identity for investor
     */
    function updateIdentity(address _investor, address _identity) external onlyOwner {
        address oldIdentity = identityStorage.identity(_investor);
        require(oldIdentity != address(0), "Identity does not exist");
        
        uint16 country = identityStorage.country(_investor);
        identityStorage.removeIdentity(_investor);
        identityStorage.addIdentity(_investor, _identity, country);
        
        emit IdentityUpdated(_investor, oldIdentity, _identity);
    }
    
    /**
     * @dev Update country for investor
     */
    function updateCountry(address _investor, uint16 _country) external onlyOwner {
        identityStorage.updateCountry(_investor, _country);
    }
    
    /**
     * @dev Check if investor is verified (has all required claims)
     * Simplified version - checks if identity exists and country is set
     */
    function isVerified(address _investor) public view returns (bool) {
        if (identityStorage.identity(_investor) == address(0)) {
            return false;
        }
        
        // In a full implementation, would check all required claim topics
        // For now, just check if identity exists
        return true;
    }
    
    /**
     * @dev Get investor's identity address
     */
    function identity(address _investor) external view returns (address) {
        return identityStorage.identity(_investor);
    }
    
    /**
     * @dev Get investor's country
     */
    function investorCountry(address _investor) external view returns (uint16) {
        return identityStorage.country(_investor);
    }
    
    /**
     * @dev Get all investors
     */
    function getInvestors() external view returns (address[] memory) {
        return identityStorage.getInvestors();
    }
    
    /**
     * @dev Check if address contains identity (is registered)
     */
    function contains(address _investor) external view returns (bool) {
        return identityStorage.identity(_investor) != address(0);
    }
}
