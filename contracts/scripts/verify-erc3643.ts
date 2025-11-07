import hre from "hardhat";

/**
 * Verifica todos los contratos desplegados en Polygonscan con los nombres totalmente cualificados.
 * Rellena las direcciones con tus valores o pásalas por ENV.
 * Requiere: ETHERSCAN_API_KEY configurada (Polygonscan).
 */

async function verifyOne(address: string, fullyQualifiedName: string, constructorArgs: any[] = []) {
  console.log(`\n🔎 Verificando ${fullyQualifiedName} @ ${address}`);
  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments: constructorArgs,
      contract: fullyQualifiedName,
    });
    console.log("✅ Verificado");
  } catch (e: any) {
    const msg = e?.message || String(e);
    if (msg.includes("Already Verified") || msg.includes("Contract source code already verified")) {
      console.log("ℹ️ Ya verificado");
    } else {
      console.log("❌ Fallo verificación:", msg);
    }
  }
}

async function main() {
  const CLAIM_TOPICS = process.env.CLAIM_TOPICS as string;
  const TRUSTED_ISSUERS = process.env.TRUSTED_ISSUERS as string;
  const IDENTITY_STORAGE = process.env.IDENTITY_STORAGE as string;
  const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY as string;
  const COMPLIANCE = process.env.COMPLIANCE as string;
  const TOKEN = process.env.TOKEN as string;
  const CONTROLLER = process.env.INVESTMENT_CONTROLLER as string;

  // Verificaciones sin constructor
  if (CLAIM_TOPICS) await verifyOne(CLAIM_TOPICS, "contracts/contracts/DeployableClaimTopicsRegistry.sol:DeployableClaimTopicsRegistry");
  if (TRUSTED_ISSUERS) await verifyOne(TRUSTED_ISSUERS, "contracts/contracts/DeployableTrustedIssuersRegistry.sol:DeployableTrustedIssuersRegistry");
  if (IDENTITY_STORAGE) await verifyOne(IDENTITY_STORAGE, "contracts/contracts/DeployableIdentityRegistryStorage.sol:DeployableIdentityRegistryStorage");
  if (IDENTITY_REGISTRY) await verifyOne(IDENTITY_REGISTRY, "contracts/contracts/DeployableIdentityRegistry.sol:DeployableIdentityRegistry");
  if (COMPLIANCE) await verifyOne(COMPLIANCE, "contracts/contracts/DeployableModularCompliance.sol:DeployableModularCompliance");
  if (TOKEN) await verifyOne(TOKEN, "contracts/contracts/DeployableToken.sol:DeployableToken");

  // Verificación del InvestmentController con argumentos
  if (CONTROLLER) {
    const TOKEN_ADDR = process.env.TOKEN as string;
    const USDC = process.env.USDC_ADDRESS || "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
    const TREASURY = process.env.TREASURY as string;
    const EUR_USD = process.env.EUR_USD_FEED || "0x73366Fe0AA0Ded304479862808e02506FE556a98";
    const PRICE_EUR_CENTS = Number(process.env.PRICE_EUR_CENTS || 100);
    const HARD_CAP = Number(process.env.HARD_CAP || 100);
    await verifyOne(CONTROLLER, "contracts/contracts/ChainXInvestmentController.sol:ChainXInvestmentController", [
      TOKEN_ADDR,
      USDC,
      TREASURY,
      EUR_USD,
      PRICE_EUR_CENTS,
      HARD_CAP,
    ]);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
