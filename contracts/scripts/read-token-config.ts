import { ethers } from "hardhat";

/**
 * Lee configuración clave del Token ERC-3643 desplegado:
 * - identityRegistry() asociada
 * - compliance()
 * - owner()
 * - paused()
 * Requiere ENV: TOKEN (address)
 */
async function main() {
  const TOKEN = process.env.TOKEN;
  if (!TOKEN) throw new Error("Falta env TOKEN");

  const token = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/token/Token.sol:Token",
    TOKEN
  );

  console.log("🔎 Token:", TOKEN);
  const ir = await token.identityRegistry();
  const comp = await token.compliance();
  const owner = await token.owner();
  const paused = await token.paused();

  console.log("identityRegistry():", ir);
  console.log("compliance():", comp);
  console.log("owner():", owner);
  console.log("paused():", paused);
}

main().catch((e) => { console.error(e); process.exit(1); });
