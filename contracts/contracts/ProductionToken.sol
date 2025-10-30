// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProductionToken
 * @notice ERC20 token for real estate tokenization
 * @dev Only owner (InvestmentController) can mint tokens
 */
contract ProductionToken is ERC20, Ownable {
    uint8 private immutable _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        _decimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /**
     * @notice Mint tokens to investor (called by InvestmentController)
     * @param to Investor address
     * @param amount Amount of tokens to mint
     */
    function issue(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
