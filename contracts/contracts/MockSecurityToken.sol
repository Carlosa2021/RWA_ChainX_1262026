// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * MockSecurityToken
 * -----------------
 * - ERC20 con `issue(address,uint256)` para integrarse con InvestmentController.
 * - Por defecto `decimals` configurable. Para participaciones indivisibles, usa 0.
 * - Solo el owner puede emitir (simula rol de emisor).
 * *** NO es ERC-3643 real. Es para piloto end-to-end. ***
 */
contract MockSecurityToken is ERC20, Ownable {
    uint8 private immutable _dec;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        _dec = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _dec;
    }

    /// compatible con controller
    function issue(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
