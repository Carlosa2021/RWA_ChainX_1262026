// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../IIdentity.sol";

/**
 * @title TrustedIssuersRegistry
 * @dev Registry of trusted claim issuers (KYC providers)
 */
contract TrustedIssuersRegistry is Ownable {
    
    struct TrustedIssuer {
        IIdentity issuerIdentity;
        uint256[] claimTopics;
    }
    
    // Mapping issuer address => TrustedIssuer data
    mapping(address => TrustedIssuer) private trustedIssuers;
    
    // Array of all trusted issuer addresses
    address[] private issuerAddresses;
    
    event TrustedIssuerAdded(address indexed issuer, IIdentity indexed issuerIdentity, uint256[] claimTopics);
    event TrustedIssuerRemoved(address indexed issuer);
    event ClaimTopicsUpdated(address indexed issuer, uint256[] claimTopics);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Add a trusted issuer
     */
    function addTrustedIssuer(address _issuer, IIdentity _issuerIdentity, uint256[] calldata _claimTopics) external onlyOwner {
        require(_issuer != address(0), "Invalid issuer address");
        require(address(_issuerIdentity) != address(0), "Invalid identity address");
        require(!isTrustedIssuer(_issuer), "Issuer already exists");
        
        trustedIssuers[_issuer].issuerIdentity = _issuerIdentity;
        trustedIssuers[_issuer].claimTopics = _claimTopics;
        issuerAddresses.push(_issuer);
        
        emit TrustedIssuerAdded(_issuer, _issuerIdentity, _claimTopics);
    }
    
    /**
     * @dev Remove a trusted issuer
     */
    function removeTrustedIssuer(address _issuer) external onlyOwner {
        require(isTrustedIssuer(_issuer), "Issuer does not exist");
        
        delete trustedIssuers[_issuer];
        
        // Remove from array
        for (uint256 i = 0; i < issuerAddresses.length; i++) {
            if (issuerAddresses[i] == _issuer) {
                issuerAddresses[i] = issuerAddresses[issuerAddresses.length - 1];
                issuerAddresses.pop();
                break;
            }
        }
        
        emit TrustedIssuerRemoved(_issuer);
    }
    
    /**
     * @dev Update claim topics for issuer
     */
    function updateClaimTopics(address _issuer, uint256[] calldata _claimTopics) external onlyOwner {
        require(isTrustedIssuer(_issuer), "Issuer does not exist");
        trustedIssuers[_issuer].claimTopics = _claimTopics;
        emit ClaimTopicsUpdated(_issuer, _claimTopics);
    }
    
    /**
     * @dev Check if issuer is trusted
     */
    function isTrustedIssuer(address _issuer) public view returns (bool) {
        return address(trustedIssuers[_issuer].issuerIdentity) != address(0);
    }
    
    /**
     * @dev Get issuer identity
     */
    function getIssuerIdentity(address _issuer) external view returns (IIdentity) {
        return trustedIssuers[_issuer].issuerIdentity;
    }
    
    /**
     * @dev Get issuer claim topics
     */
    function getIssuerClaimTopics(address _issuer) external view returns (uint256[] memory) {
        return trustedIssuers[_issuer].claimTopics;
    }
    
    /**
     * @dev Get all trusted issuers
     */
    function getTrustedIssuers() external view returns (address[] memory) {
        return issuerAddresses;
    }
    
    /**
     * @dev Check if issuer has claim topic
     */
    function hasClaimTopic(address _issuer, uint256 _topic) external view returns (bool) {
        uint256[] memory topics = trustedIssuers[_issuer].claimTopics;
        for (uint256 i = 0; i < topics.length; i++) {
            if (topics[i] == _topic) {
                return true;
            }
        }
        return false;
    }
}
