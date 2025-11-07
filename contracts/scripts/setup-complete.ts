import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Setup completo del sistema ERC-3643\n");

  const TOKEN = "0xe8BF1C76F547609540c0118722C8339e642cd9C7";
  const IDENTITY_REGISTRY = "0x3E915D4A76fDC51b9e592e0E1Fe207E1509cE5D4";
  const INVESTMENT_CONTROLLER = "0xb26D106148BC20B24380f82517aFB7A1085f8069";

  const [deployer] = await ethers.getSigners();
  console.log("📍 Wallet:", deployer.address, "\n");

  // 1. Agregar deployer como agent del IdentityRegistry (si no lo es)
  console.log("🔐 Paso 1: Configurando agent en IdentityRegistry...");
  const IdentityRegistry = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/interface/IIdentityRegistry.sol:IIdentityRegistry",
    IDENTITY_REGISTRY
  );

  try {
    const tx1 = await IdentityRegistry.addAgent(deployer.address);
    await tx1.wait();
    console.log("   ✅ Agent agregado al IdentityRegistry\n");
  } catch (e: any) {
    if (e.message.includes("Ownable")) {
      console.log("   ❌ ERROR CRÍTICO: NO eres owner del IdentityRegistry");
      console.log("   💡 Solución: Ve a Polygonscan y ejecuta desde la wallet owner:");
      console.log("   https://polygonscan.com/address/" + IDENTITY_REGISTRY + "#writeProxyContract");
      console.log("   Función: addAgent('" + deployer.address + "')\n");
      process.exit(1);
    }
    console.log("   ℹ️ Ya eres agent (o error menor)\n");
  }

  // 2. Registrar InvestmentController como identidad
  console.log("📝 Paso 2: Registrando InvestmentController como identidad...");
  try {
    const tx2 = await IdentityRegistry.registerIdentity(
      INVESTMENT_CONTROLLER,
      ethers.ZeroAddress,
      0
    );
    await tx2.wait();
    console.log("   ✅ InvestmentController registrado\n");
  } catch (e: any) {
    if (e.message.includes("already registered")) {
      console.log("   ✅ Ya está registrado\n");
    } else {
      console.log("   ❌ Error:", e.message, "\n");
      throw e;
    }
  }

  // 3. Mintear 100 tokens
  console.log("🏭 Paso 3: Minteando 100 tokens...");
  const Token = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/token/IToken.sol:IToken",
    TOKEN
  );

  try {
    const tx3 = await Token.mint(INVESTMENT_CONTROLLER, 100);
    const receipt = await tx3.wait();
    console.log("   ✅ Mint exitoso! TX:", receipt.hash);
    
    const balance = await Token.balanceOf(INVESTMENT_CONTROLLER);
    const supply = await Token.totalSupply();
    console.log("\n📊 Estado final:");
    console.log("   Total Supply:", supply.toString());
    console.log("   Balance InvestmentController:", balance.toString());
    console.log("\n🎉 ¡TODO LISTO! Ahora actualiza el .env.local y prueba el frontend\n");
  } catch (e: any) {
    console.log("   ❌ Error al mintear:", e.message);
    
    if (e.message.includes("AgentRole")) {
      console.log("\n   💡 Ve a Token contract y ejecuta:");
      console.log("   https://polygonscan.com/address/" + TOKEN + "#writeProxyContract");
      console.log("   Función: addAgent('" + deployer.address + "')");
    }
    throw e;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
