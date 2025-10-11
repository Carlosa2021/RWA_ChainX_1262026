// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./erc3643/SecurityToken.sol";

/**
 * @title PayoutDistributor
 * @dev Distributes rental income (10% annual yield) to token holders
 */
contract PayoutDistributor is Ownable {
    
    SecurityToken public immutable securityToken;
    IERC20 public immutable stablecoin;
    
    struct Payout {
        uint256 totalAmount;
        uint256 snapshotSupply;
        uint256 timestamp;
        bool executed;
        mapping(address => bool) claimed;
    }
    
    // Payout ID => Payout data
    mapping(uint256 => Payout) public payouts;
    uint256 public payoutCount;
    
    event PayoutScheduled(uint256 indexed payoutId, uint256 amount, uint256 supply);
    event PayoutClaimed(uint256 indexed payoutId, address indexed investor, uint256 amount);
    
    constructor(
        address _securityToken,
        address _stablecoin
    ) Ownable(msg.sender) {
        require(_securityToken != address(0), "Invalid security token");
        require(_stablecoin != address(0), "Invalid stablecoin");
        
        securityToken = SecurityToken(_securityToken);
        stablecoin = IERC20(_stablecoin);
    }
    
    /**
     * @dev Schedule a payout (snapshot current supply)
     */
    function schedulePayout(uint256 _amount) external onlyOwner returns (uint256) {
        require(_amount > 0, "Invalid amount");
        
        // Transfer stablecoin from owner to this contract
        require(
            stablecoin.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        uint256 payoutId = payoutCount;
        Payout storage payout = payouts[payoutId];
        payout.totalAmount = _amount;
        payout.snapshotSupply = securityToken.totalSupply();
        payout.timestamp = block.timestamp;
        payout.executed = true;
        
        payoutCount++;
        
        emit PayoutScheduled(payoutId, _amount, payout.snapshotSupply);
        
        return payoutId;
    }
    
    /**
     * @dev Claim payout for a specific payout ID
     */
    function claimPayout(uint256 _payoutId) external {
        require(_payoutId < payoutCount, "Invalid payout ID");
        Payout storage payout = payouts[_payoutId];
        require(payout.executed, "Payout not executed");
        require(!payout.claimed[msg.sender], "Already claimed");
        
        uint256 balance = securityToken.balanceOf(msg.sender);
        require(balance > 0, "No tokens held");
        
        // Calculate proportional payout
        uint256 claimAmount = (payout.totalAmount * balance) / payout.snapshotSupply;
        require(claimAmount > 0, "No payout available");
        
        payout.claimed[msg.sender] = true;
        
        require(
            stablecoin.transfer(msg.sender, claimAmount),
            "Payout transfer failed"
        );
        
        emit PayoutClaimed(_payoutId, msg.sender, claimAmount);
    }
    
    /**
     * @dev Claim multiple payouts at once
     */
    function claimMultiplePayouts(uint256[] calldata _payoutIds) external {
        for (uint256 i = 0; i < _payoutIds.length; i++) {
            uint256 payoutId = _payoutIds[i];
            
            if (payoutId >= payoutCount) continue;
            
            Payout storage payout = payouts[payoutId];
            if (!payout.executed || payout.claimed[msg.sender]) continue;
            
            uint256 balance = securityToken.balanceOf(msg.sender);
            if (balance == 0) continue;
            
            uint256 claimAmount = (payout.totalAmount * balance) / payout.snapshotSupply;
            if (claimAmount == 0) continue;
            
            payout.claimed[msg.sender] = true;
            
            require(
                stablecoin.transfer(msg.sender, claimAmount),
                "Payout transfer failed"
            );
            
            emit PayoutClaimed(payoutId, msg.sender, claimAmount);
        }
    }
    
    /**
     * @dev Get claimable amount for investor
     */
    function getClaimableAmount(address _investor, uint256 _payoutId) external view returns (uint256) {
        if (_payoutId >= payoutCount) return 0;
        
        Payout storage payout = payouts[_payoutId];
        if (!payout.executed || payout.claimed[_investor]) return 0;
        
        uint256 balance = securityToken.balanceOf(_investor);
        if (balance == 0) return 0;
        
        return (payout.totalAmount * balance) / payout.snapshotSupply;
    }
    
    /**
     * @dev Check if investor has claimed payout
     */
    function hasClaimed(address _investor, uint256 _payoutId) external view returns (bool) {
        if (_payoutId >= payoutCount) return false;
        return payouts[_payoutId].claimed[_investor];
    }
    
    /**
     * @dev Get total unclaimed payouts for investor
     */
    function getTotalUnclaimed(address _investor) external view returns (uint256 total) {
        uint256 balance = securityToken.balanceOf(_investor);
        if (balance == 0) return 0;
        
        for (uint256 i = 0; i < payoutCount; i++) {
            Payout storage payout = payouts[i];
            if (payout.executed && !payout.claimed[_investor]) {
                total += (payout.totalAmount * balance) / payout.snapshotSupply;
            }
        }
    }
    
    /**
     * @dev Get payout info
     */
    function getPayoutInfo(uint256 _payoutId) external view returns (
        uint256 totalAmount,
        uint256 snapshotSupply,
        uint256 timestamp,
        bool executed
    ) {
        require(_payoutId < payoutCount, "Invalid payout ID");
        Payout storage payout = payouts[_payoutId];
        return (
            payout.totalAmount,
            payout.snapshotSupply,
            payout.timestamp,
            payout.executed
        );
    }
}
