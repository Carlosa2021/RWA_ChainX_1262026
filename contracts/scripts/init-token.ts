import { ethers } from "hardhat";

/**
 * Inicializa el Security Token (ERC-3643) desplegado SIN proxy.
 * Usa el contrato real `Token.sol` del paquete oficial para exponer `init` y el resto de funciones.
 *
 * Requisitos:
 * - Haber compilado antes: `npx hardhat compile`
 * - Rellenar las direcciones abajo o pasar por ENV
 */

async function main() {
  const TOKEN = (process.env.TOKEN as `0x${string}`) ?? ""; // Dirección del DeployableToken desplegado
  const IDENTITY_REGISTRY = (process.env.IDENTITY_REGISTRY as `0x${string}`) ?? "";
  const COMPLIANCE = (process.env.COMPLIANCE as `0x${string}`) ?? "";

  if (!TOKEN || !IDENTITY_REGISTRY || !COMPLIANCE) {
    throw new Error(
      "Faltan variables: TOKEN, IDENTITY_REGISTRY y COMPLIANCE. Pásalas por ENV o edita este archivo."
    );
  }

  const NAME = process.env.TOKEN_NAME ?? "ChainX Test InmoToken";
  const SYMBOL = process.env.TOKEN_SYMBOL ?? "CXIMT";
  const DECIMALS = Number(process.env.TOKEN_DECIMALS ?? 0);
  const ONCHAIN_ID = (process.env.TOKEN_ONCHAIN_ID as `0x${string}`) ?? ethers.ZeroAddress;

  console.log("\n🔧 Inicializando Token:");
  console.log("Token:", TOKEN);
  console.log("IdentityRegistry:", IDENTITY_REGISTRY);
  console.log("Compliance:", COMPLIANCE);

  // Usamos el contrato oficial para exponer `init(...)`
  const token = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/token/Token.sol:Token",
    TOKEN
  );

  const tx = await token.init(
    IDENTITY_REGISTRY,
    COMPLIANCE,
    NAME,
    SYMBOL,
    DECIMALS,
    ONCHAIN_ID
  );
  console.log("⏳ TX enviada:", tx.hash);
  const rc = await tx.wait();
  console.log("✅ Token inicializado. Gas:", rc?.gasUsed?.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
