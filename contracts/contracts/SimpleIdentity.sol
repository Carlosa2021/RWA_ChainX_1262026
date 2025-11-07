// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title SimpleIdentity (Minimal stub for ERC-3643 registration)
 * @notice This lightweight identity contract implements only the function
 *         required by the ERC-3643 SecurityToken / IdentityRegistry for
 *         verification and (future) recovery logic: keyHasPurpose.
 *
 *         It treats a single externally owned account (EOA) as having both
 *         MANAGEMENT (1) and ACTION (2) purposes. This is sufficient for
 *         test/demo KYC registration when you don't yet have a full OnchainID
 *         (ERC-734/735) deployment.
 *
 *         Production: Replace with a full identity implementation that
 *         supports adding/removing keys and claims. This stub purposefully
 *         omits events & advanced key management.
 */
interface IIdentity {
    function keyHasPurpose(bytes32 key, uint256 purpose) external view returns (bool);
}

contract SimpleIdentity is IIdentity {
    address public immutable owner;

    constructor(address _owner) {
        require(_owner != address(0), "owner zero");
        owner = _owner;
    }

    /**
     * @dev Returns true if the provided key corresponds to the owner and the
     *      requested purpose is MANAGEMENT (1) or ACTION (2). Other purposes
     *      are not supported in this minimal stub and return false.
     * @param key keccak256(abi.encode(walletAddress)) expected for owner.
     * @param purpose ERC-734 purpose code (1=MANAGEMENT, 2=ACTION).
     */
    function keyHasPurpose(bytes32 key, uint256 purpose) external view override returns (bool) {
        if (purpose == 1 || purpose == 2) {
            return key == keccak256(abi.encode(owner));
        }
        return false;
    }
}
