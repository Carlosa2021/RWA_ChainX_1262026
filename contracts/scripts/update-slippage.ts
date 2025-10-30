import { ethers } from "hardhat";

async function main() {
  console.log("\n⚙️ UPDATING SLIPPAGE TO 10%...\n");
  
  const [owner] = await ethers.getSigners();
  console.log("Owner:", owner.address);
  
  const CONTROLLER = "0x16377c24E52361AF460FAA064a95F7d32f522A8e";
  const controller = await ethers.getContractAt("InvestmentController", CONTROLLER);
  
  console.log("Setting slippage to 1000 bps (10%)...");
  const tx = await controller.setMaxSlippageBps(1000);
  await tx.wait();
  
  console.log("✅ Slippage updated to 10%!");
  console.log("🔍 TX:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
