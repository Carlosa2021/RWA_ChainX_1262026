import { ethers } from "hardhat";

async function main() {
  const CONTROLLER = "0x4354Ac2A12b0eCeb85F5fa3328a7C3ADEBDd8fb7";
  
  console.log("\n⚙️ SETTING SLIPPAGE 5% ON NEW CONTROLLER...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Owner:", deployer.address);
  
  const controller = await ethers.getContractAt("InvestmentController", CONTROLLER);
  
  // Check current slippage
  const currentSlippage = await controller.maxSlippageBps();
  console.log("Current slippage:", currentSlippage.toString(), "bps");
  
  // Set to 5% (500 bps)
  console.log("\nSetting slippage to 500 bps (5%)...");
  const tx = await controller.setMaxSlippageBps(500);
  await tx.wait();
  
  console.log("✅ Slippage updated!");
  console.log("TX:", tx.hash);
  
  // Verify
  const newSlippage = await controller.maxSlippageBps();
  console.log("\nNew slippage:", newSlippage.toString(), "bps (5%)");
  
  console.log("\n🎉 Controller ready for investments!\n");
}

main().catch(console.error);
