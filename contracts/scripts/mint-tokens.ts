import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Iniciando proceso de mint de tokens...\n");

  // Direcciones de los contratos desplegados
  const TOKEN_ADDRESS = "0xe8BF1C76F547609540c0118722C8339e642cd9C7";
  const INVESTMENT_CONTROLLER = "0xb26D106148BC20B24380f82517aFB7A1085f8069";
  
  const [deployer] = await ethers.getSigners();
  console.log("📍 Wallet deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "POL\n");

  // Obtener instancia del Token
  const Token = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/token/IToken.sol:IToken",
    TOKEN_ADDRESS
  );

  console.log("🎯 Token Address:", TOKEN_ADDRESS);
  console.log("📊 Token Name:", await Token.name());
  console.log("🔤 Token Symbol:", await Token.symbol());
  console.log("📈 Total Supply actual:", (await Token.totalSupply()).toString(), "\n");

  // Paso 1: Agregar deployer como agent (si no lo es ya)
  console.log("🔐 Paso 1: Verificando si eres agent del token...");
  try {
    // Intentar mintear 0 tokens para verificar si ya eres agent
    // Si falla, agregamos como agent
    console.log("   Agregando wallet como agent...");
    const addAgentTx = await Token.addAgent(deployer.address);
    await addAgentTx.wait();
    console.log("   ✅ Agent agregado! TX:", addAgentTx.hash, "\n");
  } catch (error: any) {
    if (error.message.includes("already an agent") || error.message.includes("AgentRole")) {
      console.log("   ℹ️ Ya eres agent del contrato\n");
    } else {
      console.log("   ⚠️ Error al agregar agent (puede que ya lo seas):", error.message, "\n");
    }
  }

  // Paso 2: Mintear 100 tokens al InvestmentController
  console.log("🏭 Paso 2: Minteando 100 tokens al InvestmentController...");
  console.log("   Destinatario:", INVESTMENT_CONTROLLER);
  console.log("   Cantidad: 100 tokens (sin decimales)\n");

  try {
    const mintTx = await Token.mint(INVESTMENT_CONTROLLER, 100);
    console.log("   ⏳ Esperando confirmación...");
    const receipt = await mintTx.wait();
    console.log("   ✅ Mint exitoso!");
    console.log("   📝 TX Hash:", receipt.hash);
    console.log("   ⛽ Gas usado:", receipt.gasUsed.toString(), "\n");

    // Verificar balance final
    const finalSupply = await Token.totalSupply();
    const controllerBalance = await Token.balanceOf(INVESTMENT_CONTROLLER);
    
    console.log("📊 Estado Final:");
    console.log("   Total Supply:", finalSupply.toString(), "tokens");
    console.log("   Balance InvestmentController:", controllerBalance.toString(), "tokens");
    console.log("\n🎉 ¡Proceso completado exitosamente!");
    console.log("\n📋 Siguiente paso: Actualizar .env.local con las addresses y probar el frontend\n");

  } catch (error: any) {
    console.error("❌ Error al mintear tokens:");
    console.error(error.message);
    
    if (error.message.includes("AgentRole")) {
      console.log("\n💡 Solución: Tu wallet NO es agent del token.");
      console.log("   Ve a thirdweb dashboard del Token y ejecuta:");
      console.log("   addAgent('", deployer.address, "')");
    }
    
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
