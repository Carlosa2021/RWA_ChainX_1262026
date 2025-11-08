// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@erc3643org/erc-3643/contracts/token/IToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface AggregatorV3Interface {
  function latestRoundData() external view returns (uint80, int256 answer, uint256, uint256, uint80);
  function decimals() external view returns (uint8);
}

/**
 * @title ChainX Investment Controller
 * @notice Manages token sales for real estate tokenization using official ERC-3643 Token
 */
contract ChainXInvestmentController {
  IToken public immutable token;
  address public immutable usdc;
  address public immutable treasury;
  AggregatorV3Interface public immutable eurUsd;

  uint256 public priceEuroCents;
  uint256 public hardCap;
  uint256 public issued;

  event Invested(address indexed investor, uint256 tokenAmount, uint256 paidUSDC);

  constructor(
    address _token,
    address _usdc,
    address _treasury,
    address _eurUsdFeed,
    uint256 _priceEuroCents,
    uint256 _hardCap
  ) {
    token = IToken(_token);
    usdc = _usdc;
    treasury = _treasury;
    eurUsd = AggregatorV3Interface(_eurUsdFeed);
    priceEuroCents = _priceEuroCents;
    hardCap = _hardCap;
  }

  function quoteUSDC(uint256 tokenAmount) public view returns (uint256 usdcAmount) {
    require(tokenAmount > 0, "amount=0");
    (, int256 answer, , , ) = eurUsd.latestRoundData();
    require(answer > 0, "bad feed");
    uint8 feedDec = eurUsd.decimals();
    usdcAmount = (tokenAmount * priceEuroCents * uint256(answer) * (10 ** 6))
                / (100 * (10 ** feedDec));
  }

  function invest(uint256 tokenAmount, uint256 /* maxUsdcExpected */) external {
    require(issued + tokenAmount <= hardCap, "hard cap");
    uint256 need = quoteUSDC(tokenAmount);

    // Transfer USDC from investor to treasury
    IERC20(usdc).transferFrom(msg.sender, treasury, need);

    // Mint tokens to investor using official ERC-3643 Token
    token.mint(msg.sender, tokenAmount);
    issued += tokenAmount;
    emit Invested(msg.sender, tokenAmount, need);
  }
}
