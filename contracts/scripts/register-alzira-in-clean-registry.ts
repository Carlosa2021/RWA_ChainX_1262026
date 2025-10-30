import { ethers } from "hardhat";

/**
 * REGISTRAR PROYECTO ALZIRA EN REGISTRY LIMPIO
 * - 5 tokens @ 1 EUR
 * - Usa contratos existentes (Token + Controller)
 */

async function main() {
  console.log("\n🏠 REGISTRANDO PROYECTO ALZIRA...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Owner:", deployer.address);
  
  // Direcciones
  const REGISTRY = "0xEf1a4c26BC8a9a0a1477dA08056e406BDf00D560"; // Registry limpio
  const TOKEN = "0x1c807Bd375a79249F34DC8EBfB6B426B8ffe4ca4"; // Token Alzira existente
  const CONTROLLER = "0x16377c24E52361AF460FAA064a95F7d32f522A8e"; // Controller existente
  const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  
  const registry = await ethers.getContractAt("ProjectRegistry", REGISTRY);
  
  console.log("📝 Registrando proyecto:");
  console.log("  Nombre: Inmueble Reyes Católicos Alzira");
  console.log("  Token:", TOKEN);
  console.log("  Controller:", CONTROLLER);
  console.log("  Precio: 1 EUR");
  console.log("  Tokens: 5\n");
  
  try {
    const tx = await registry.registerProject(
      "Inmueble Reyes Católicos Alzira",
      TOKEN,
      CONTROLLER,
      ethers.parseUnits("1", 6), // 1 USDC (6 decimales)
      5, // 5 tokens
      USDC,
      "ipfs://QmAlziraReyesCatolicos2025"
    );
    
    console.log("⏳ Transaction:", tx.hash);
    console.log("Esperando confirmación...");
    
    const receipt = await tx.wait();
    console.log("✅ Proyecto registrado! Block:", receipt?.blockNumber);
    
    // Verificar
    const count = await registry.getProjectCount();
    console.log("\n📊 Proyectos en registry:", count.toString());
    
    console.log("\n🎉 LISTO! El proyecto aparecerá en el dashboard en unos segundos");
    console.log("🔍 Vercel recargará automáticamente\n");
    
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    
    if (error.message.includes("Ownable")) {
      console.log("\n⚠️  Solo el owner del registry puede registrar proyectos");
      console.log("Tu wallet:", deployer.address);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
