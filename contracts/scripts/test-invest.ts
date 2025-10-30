import { ethers } from "hardhat";

/**
 * TEST INVESTMENT FLOW
 * Prueba completa: approve + invest
 */

async function main() {
  console.log("\n🧪 TESTING INVESTMENT FLOW...\n");
  
  const [owner] = await ethers.getSigners();
  console.log("Investor:", owner.address);
  
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const CONTROLLER = "0x16377c24E52361AF460FAA064a95F7d32f522A8e";
  const TOKEN = "0x1c807Bd375a79249F34DC8EBfB6B426B8ffe4ca4";
  
  const usdc = await ethers.getContractAt("IERC20", USDC);
  const controller = await ethers.getContractAt("InvestmentController", CONTROLLER);
  const token = await ethers.getContractAt("MockSecurityToken", TOKEN);
  
  // 1. Check USDC balance
  const usdcBalance = await usdc.balanceOf(owner.address);
  console.log("💰 USDC Balance:", ethers.formatUnits(usdcBalance, 6), "USDC");
  
  // 2. Quote price for 1 token
  const quote = await controller.quoteUSDC(1);
  console.log("💵 Price for 1 token:", ethers.formatUnits(quote, 6), "USDC");
  
  // 3. Calculate max with 5% slippage
  const maxUsdc = (quote * 10500n) / 10000n;
  console.log("📊 Max USDC (5% slippage):", ethers.formatUnits(maxUsdc, 6), "USDC");
  
  if (usdcBalance < quote) {
    console.log("\n❌ Insufficient USDC balance!");
    return;
  }
  
  // 4. Check current allowance
  const allowance = await usdc.allowance(owner.address, CONTROLLER);
  console.log("\n📝 Current allowance:", ethers.formatUnits(allowance, 6), "USDC");
  
  // 5. Approve if needed
  if (allowance < maxUsdc) {
    console.log("✍️  Approving USDC...");
    const txApprove = await usdc.approve(CONTROLLER, maxUsdc);
    await txApprove.wait();
    console.log("✅ Approved!");
  }
  
  // 6. Check token balance before
  const tokensBefore = await token.balanceOf(owner.address);
  console.log("\n🎫 Tokens before:", tokensBefore.toString());
  
  // 7. Invest!
  console.log("\n🚀 Investing 1 token...");
  try {
    const txInvest = await controller.invest(1, maxUsdc);
    console.log("⏳ Transaction:", txInvest.hash);
    const receipt = await txInvest.wait();
    console.log("✅ Investment successful! Block:", receipt.blockNumber);
    
    // 8. Check balances after
    const tokensAfter = await token.balanceOf(owner.address);
    const usdcAfter = await usdc.balanceOf(owner.address);
    
    console.log("\n📊 RESULT:");
    console.log("  Tokens:", tokensAfter.toString());
    console.log("  USDC:", ethers.formatUnits(usdcAfter, 6), "USDC");
    console.log("  USDC spent:", ethers.formatUnits(usdcBalance - usdcAfter, 6), "USDC");
    console.log("\n🎉 SUCCESS!");
    
  } catch (error: any) {
    console.error("\n❌ Investment failed:", error.message);
    
    // Debug info
    const issued = await controller.issued();
    const hardCap = await controller.hardCap();
    const slippage = await controller.maxSlippageBps();
    
    console.log("\n🔍 Contract state:");
    console.log("  Issued:", issued.toString());
    console.log("  Hard cap:", hardCap.toString());
    console.log("  Slippage:", slippage.toString(), "bps");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
