import { ethers } from "hardhat";

/**
 * Despliega un SimpleIdentity que cumple la interfaz mínima IIdentity
 * y devuelve la dirección para usarla en IdentityRegistry.registerIdentity.
 *
 * ENV opcionales:
 * - ID_OWNER: dirección que será owner del identity (por defecto, el signer)
 */
async function main() {
  const [signer] = await ethers.getSigners();
  const ID_OWNER = (process.env.ID_OWNER as `0x${string}`) ?? signer.address;

  console.log("\n👤 Identity owner:", ID_OWNER);
  const Factory = await ethers.getContractFactory("SimpleIdentity");
  const id = await Factory.deploy(ID_OWNER);
  await id.waitForDeployment();
  const addr = await id.getAddress();
  console.log("✅ SimpleIdentity desplegado:", addr);

  // Pequeña verificación local de keyHasPurpose
  const key = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["address"], [ID_OWNER]));
  const ok1 = await (await ethers.getContractAt("SimpleIdentity", addr)).keyHasPurpose(key, 1);
  const ok2 = await (await ethers.getContractAt("SimpleIdentity", addr)).keyHasPurpose(key, 2);
  console.log("keyHasPurpose(owner,1):", ok1);
  console.log("keyHasPurpose(owner,2):", ok2);

  console.log("\n➡️  Usa esta dirección en registerIdentity(user, identity, country)");
}

main().catch((e) => { console.error(e); process.exit(1); });
