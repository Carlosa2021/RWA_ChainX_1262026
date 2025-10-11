// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/**
 * @dev Interface for ONCHAINID Identity contracts
 * Simplified for ERC-3643 compliance
 */
interface IIdentity {
    /**
     * @dev Returns true if the claim is valid
     */
    function isClaimValid(
        address _identity,
        uint256 _topic,
        bytes memory _signature,
        bytes memory _data
    ) external view returns (bool);

    /**
     * @dev Returns claim data for a specific topic
     */
    function getClaimIdsByTopic(uint256 _topic) external view returns (bytes32[] memory);
}
