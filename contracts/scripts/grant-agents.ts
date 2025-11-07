import { ethers } from "hardhat";

/**
 * Concede rol de Agent a tu wallet (signer) en IdentityRegistry y/o Token.
 * Pasa por ENV las direcciones que quieras tocar.
 */
async function main() {
  const [signer] = await ethers.getSigners();
  const IDENTITY_REGISTRY = process.env.IDENTITY_REGISTRY as string | undefined;
  const TOKEN = process.env.TOKEN as string | undefined;

  console.log("\n👤 Signer:", signer.address);

  if (IDENTITY_REGISTRY) {
    const ir = await ethers.getContractAt(
      "@erc3643org/erc-3643/contracts/registry/implementation/IdentityRegistry.sol:IdentityRegistry",
      IDENTITY_REGISTRY
    );
    try {
      const tx = await ir.addAgent(signer.address);
      console.log("⏳ addAgent(IR) tx:", tx.hash);
      await tx.wait();
      console.log("✅ Agent concedido en IdentityRegistry");
    } catch (e: any) {
      console.log("ℹ️ IdentityRegistry addAgent info:", e?.message || e);
    }
  }

  if (TOKEN) {
    const token = await ethers.getContractAt(
      "@erc3643org/erc-3643/contracts/token/Token.sol:Token",
      TOKEN
    );
    try {
      const tx = await token.addAgent(signer.address);
      console.log("⏳ addAgent(Token) tx:", tx.hash);
      await tx.wait();
      console.log("✅ Agent concedido en Token");
    } catch (e: any) {
      console.log("ℹ️ Token addAgent info:", e?.message || e);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
