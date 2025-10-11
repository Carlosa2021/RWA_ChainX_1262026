// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ClaimTopicsRegistry
 * @dev Registry of required claim topics (KYC/AML types)
 */
contract ClaimTopicsRegistry is Ownable {
    
    // Array of required claim topics
    uint256[] private claimTopics;
    
    event ClaimTopicAdded(uint256 indexed topic);
    event ClaimTopicRemoved(uint256 indexed topic);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Add a claim topic
     */
    function addClaimTopic(uint256 _topic) external onlyOwner {
        require(!isClaimTopic(_topic), "Claim topic already exists");
        claimTopics.push(_topic);
        emit ClaimTopicAdded(_topic);
    }
    
    /**
     * @dev Remove a claim topic
     */
    function removeClaimTopic(uint256 _topic) external onlyOwner {
        require(isClaimTopic(_topic), "Claim topic does not exist");
        
        for (uint256 i = 0; i < claimTopics.length; i++) {
            if (claimTopics[i] == _topic) {
                claimTopics[i] = claimTopics[claimTopics.length - 1];
                claimTopics.pop();
                emit ClaimTopicRemoved(_topic);
                break;
            }
        }
    }
    
    /**
     * @dev Check if topic exists
     */
    function isClaimTopic(uint256 _topic) public view returns (bool) {
        for (uint256 i = 0; i < claimTopics.length; i++) {
            if (claimTopics[i] == _topic) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get all claim topics
     */
    function getClaimTopics() external view returns (uint256[] memory) {
        return claimTopics;
    }
}
