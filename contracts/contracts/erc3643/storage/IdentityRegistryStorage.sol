// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IdentityRegistryStorage
 * @dev Stores investor identities and their country codes
 */
contract IdentityRegistryStorage is Ownable {
    
    // Mapping investor address => Identity contract address
    mapping(address => address) private identities;
    
    // Mapping investor address => country code (e.g., 840 = USA)
    mapping(address => uint16) private investorCountry;
    
    // Array of all registered investors
    address[] private investors;
    
    event IdentityStored(address indexed investor, address indexed identity);
    event IdentityRemoved(address indexed investor, address indexed identity);
    event CountryUpdated(address indexed investor, uint16 country);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Store identity for investor
     */
    function addIdentity(address _investor, address _identity, uint16 _country) external onlyOwner {
        require(_investor != address(0), "Invalid investor address");
        require(_identity != address(0), "Invalid identity address");
        require(identities[_investor] == address(0), "Identity already exists");
        
        identities[_investor] = _identity;
        investorCountry[_investor] = _country;
        investors.push(_investor);
        
        emit IdentityStored(_investor, _identity);
        emit CountryUpdated(_investor, _country);
    }
    
    /**
     * @dev Remove identity for investor
     */
    function removeIdentity(address _investor) external onlyOwner {
        require(identities[_investor] != address(0), "Identity does not exist");
        
        address identity = identities[_investor];
        delete identities[_investor];
        delete investorCountry[_investor];
        
        // Remove from array
        for (uint256 i = 0; i < investors.length; i++) {
            if (investors[i] == _investor) {
                investors[i] = investors[investors.length - 1];
                investors.pop();
                break;
            }
        }
        
        emit IdentityRemoved(_investor, identity);
    }
    
    /**
     * @dev Update country for investor
     */
    function updateCountry(address _investor, uint16 _country) external onlyOwner {
        require(identities[_investor] != address(0), "Identity does not exist");
        investorCountry[_investor] = _country;
        emit CountryUpdated(_investor, _country);
    }
    
    /**
     * @dev Get identity address for investor
     */
    function identity(address _investor) external view returns (address) {
        return identities[_investor];
    }
    
    /**
     * @dev Get country code for investor
     */
    function country(address _investor) external view returns (uint16) {
        return investorCountry[_investor];
    }
    
    /**
     * @dev Get all registered investors
     */
    function getInvestors() external view returns (address[] memory) {
        return investors;
    }
}
