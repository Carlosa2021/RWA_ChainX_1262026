/**
 * Script para verificar campañas registradas en ProjectRegistry
 * 
 * Ejecutar: npx hardhat run scripts/check-campaigns.ts --network polygon
 */

import { ethers } from "hardhat";

async function main() {
  console.log("📋 Verificando campañas en ProjectRegistry...");
  console.log("━".repeat(60));

  const PROJECT_REGISTRY = "0xd1d027675babfd30baf60acf4fc3cbdbf011562d";
  
  const registry = await ethers.getContractAt("ProjectRegistry", PROJECT_REGISTRY);
  
  // Obtener el número total de proyectos
  const projectCount = await registry.getProjectCount();
  console.log(`📊 Total de proyectos registrados: ${projectCount}`);
  
  if (projectCount === 0n) {
    console.log("⚠️  No hay proyectos registrados");
    return;
  }
  
  console.log("\n📦 Lista de proyectos:\n");
  
  // Obtener todos los proyectos
  const allProjects = await registry.getAllProjects();
  
  for (let i = 0; i < allProjects.length; i++) {
    const project = allProjects[i];
    console.log(`━━━━━ Proyecto ${i + 1} ━━━━━`);
    console.log(`Nombre: ${project.name}`);
    console.log(`Token: ${project.securityToken}`);
    console.log(`Controller: ${project.investmentController}`);
    console.log(`Precio: ${project.pricePerToken} eurocents (€${Number(project.pricePerToken) / 100})`);
    console.log(`Hard Cap: ${project.maxCap}`);
    console.log(`Activo: ${project.active}`);
    console.log(`Creado: ${new Date(Number(project.createdAt) * 1000).toLocaleString()}`);
    console.log("");
  }
  
  console.log("━".repeat(60));
  
  // Obtener solo los activos
  const activeProjects = await registry.getActiveProjects();
  console.log(`\n✅ Proyectos activos: ${activeProjects.length}`);
  
  for (const project of activeProjects) {
    console.log(`   • ${project.name} - ${project.securityToken}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
