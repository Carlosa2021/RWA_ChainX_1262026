// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol";

// Wrapper deployable del contrato oficial
// Note: Usa pattern upgradeable con init() en lugar de constructor
contract DeployableIdentityRegistry is IdentityRegistry {}
