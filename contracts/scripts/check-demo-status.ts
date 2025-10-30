import { ethers } from "hardhat";

async function main() {
  const REGISTRY_ADDRESS = "0xD0A787C10E1050cB994297206A5B251C6Ca11861";
  
  console.log("📊 Checking deployed contracts...\n");
  
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const registry = ProjectRegistry.attach(REGISTRY_ADDRESS);
  
  const projectCount = await registry.getProjectCount();
  console.log("Total projects:", projectCount.toString());
  
  if (projectCount > 0n) {
    console.log("\n📋 Projects:\n");
    const projects = await registry.getAllProjects();
    
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      console.log(`Project ${i}:`);
      console.log(`  Name: ${p.name}`);
      console.log(`  Token: ${p.securityToken}`);
      console.log(`  Controller: ${p.investmentController}`);
      console.log(`  Price: ${ethers.formatUnits(p.pricePerToken, 6)} USDC`);
      console.log(`  Max Cap: ${p.maxCap.toString()} tokens`);
      console.log(`  Active: ${p.active}`);
      console.log();
    }
  } else {
    console.log("⚠️  No projects registered yet");
  }
}

main().catch(console.error);
