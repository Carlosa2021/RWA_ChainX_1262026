// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 { 
  function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
interface IERC3643 { function issue(address to, uint256 amount) external; function decimals() external view returns (uint8); }
interface AggregatorV3Interface {
  function latestRoundData() external view returns (uint80, int256 answer, uint256, uint256, uint80);
  function decimals() external view returns (uint8);
}

contract InvestmentController {
  address public immutable token3643;
  address public immutable usdc;
  address public immutable treasury;
  AggregatorV3Interface public immutable eurUsd; // EUR/USD

  uint256 public priceEuroCents; // precio por token en céntimos de EUR
  uint256 public hardCap;
  uint256 public issued;
  uint16  public maxSlippageBps = 50; // 0.5%

  event Invested(address indexed investor, uint256 tokenAmount, uint256 paidUSDC);

  constructor(
    address _token3643,
    address _usdc,
    address _treasury,
    address _eurUsdFeed,
    uint256 _priceEuroCents,
    uint256 _hardCap
  ) {
    token3643 = _token3643;
    usdc = _usdc;
    treasury = _treasury;
    eurUsd = AggregatorV3Interface(_eurUsdFeed);
    priceEuroCents = _priceEuroCents;
    hardCap = _hardCap;
  }

  function setMaxSlippageBps(uint16 bps) external {
    require(bps <= 500, "slippage too high");
    maxSlippageBps = bps;
  }

  function quoteUSDC(uint256 tokenAmount) public view returns (uint256 usdcAmount) {
    require(tokenAmount > 0, "amount=0");
    (, int256 answer, , , ) = eurUsd.latestRoundData();
    require(answer > 0, "bad feed");
    uint8 feedDec = eurUsd.decimals();
    usdcAmount = (tokenAmount * priceEuroCents * uint256(answer) * (10 ** 6))
                / (100 * (10 ** feedDec));
  }

  function invest(uint256 tokenAmount, uint256 maxUsdcExpected) external {
    require(issued + tokenAmount <= hardCap, "hard cap");
    uint256 need = quoteUSDC(tokenAmount);
    uint256 maxAllowed = (need * (10000 + maxSlippageBps)) / 10000;
    require(maxUsdcExpected >= need && maxUsdcExpected <= maxAllowed, "slippage");

    // Transfer USDC from investor to treasury
    require(IERC20(usdc).transferFrom(msg.sender, treasury, need), "USDC transfer failed");

    IERC3643(token3643).issue(msg.sender, tokenAmount);
    issued += tokenAmount;
    emit Invested(msg.sender, tokenAmount, need);
  }
}
