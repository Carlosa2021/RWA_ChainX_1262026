import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "POL");
  
  const balanceNum = parseFloat(ethers.formatEther(balance));
  if (balanceNum < 0.1) {
    console.log("⚠️  WARNING: Balance muy bajo para desplegar plataforma completa");
    console.log("   Necesitas ~0.5-1 POL para desplegar todo");
  } else {
    console.log("✅ Balance suficiente para despliegue");
  }
}

main().catch(console.error);
