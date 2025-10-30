import { ethers } from "hardhat";

async function main() {
  const CONTROLLER_ADDRESS = "0x9501a2FaAC3Fdad5E051917739e0a259AcA9b3F0";
  
  console.log("🔧 Updating slippage tolerance...\n");
  
  const InvestmentController = await ethers.getContractFactory("InvestmentController");
  const controller = InvestmentController.attach(CONTROLLER_ADDRESS);
  
  // Aumentar slippage a 5% (500 bps) para demo
  const tx = await controller.setMaxSlippageBps(500);
  await tx.wait();
  
  console.log("✅ Slippage updated to 5%");
  
  const newSlippage = await controller.maxSlippageBps();
  console.log("Current slippage:", newSlippage.toString(), "bps");
}

main().catch(console.error);
