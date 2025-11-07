import { ethers } from "hardhat";

/**
 * Mintea tokens (decimales 0) al InvestmentController.
 * Requiere rol Agent en el Token. Si no lo tienes, ejecuta antes `grant-agents.ts`.
 */
async function main() {
  const TOKEN = process.env.TOKEN as string;
  const CONTROLLER = process.env.INVESTMENT_CONTROLLER as string;
  const AMOUNT = Number(process.env.MINT_AMOUNT ?? 100);
  if (!TOKEN || !CONTROLLER) throw new Error("Faltan TOKEN e INVESTMENT_CONTROLLER");

  const token = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/token/Token.sol:Token",
    TOKEN
  );

  console.log(`\n🏭 Mint ${AMOUNT} -> ${CONTROLLER}`);
  const tx = await token.mint(CONTROLLER, AMOUNT);
  console.log("⏳ tx:", tx.hash);
  const rc = await tx.wait();
  console.log("✅ Mint OK. Gas:", rc?.gasUsed?.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
