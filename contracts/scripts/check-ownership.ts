import { ethers } from "hardhat";

async function main() {
  const TOKEN = "0x1c807Bd375a79249F34DC8EBfB6B426B8ffe4ca4";
  const CONTROLLER = "0x16377c24E52361AF460FAA064a95F7d32f522A8e";
  
  console.log("🔍 CHECKING TOKEN OWNERSHIP\n");
  
  const token = await ethers.getContractAt("MockSecurityToken", TOKEN);
  const controller = await ethers.getContractAt("InvestmentController", CONTROLLER);
  
  // Check token owner
  const owner = await token.owner();
  console.log(`👑 Token owner: ${owner}`);
  console.log(`🎮 Controller: ${CONTROLLER}`);
  console.log(`✅ Owner is controller? ${owner.toLowerCase() === CONTROLLER.toLowerCase()}`);
  
  // Check controller params
  const treasury = await controller.treasury();
  const hardCap = await controller.hardCap();
  const issued = await controller.issued();
  
  console.log(`\n💰 Treasury: ${treasury}`);
  console.log(`🎯 Hard Cap: ${hardCap}`);
  console.log(`📊 Issued: ${issued}`);
  console.log(`📈 Available: ${hardCap - issued}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
