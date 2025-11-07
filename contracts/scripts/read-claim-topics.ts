import { ethers } from "hardhat";

async function main() {
  const CTR = process.env.CLAIM_TOPICS || "0x9c158B6A22573773225ac2F3e0AFc700E4E47297";
  const ctr = await ethers.getContractAt(
    "@erc3643org/erc-3643/contracts/registry/implementation/ClaimTopicsRegistry.sol:ClaimTopicsRegistry",
    CTR
  );
  const topics: bigint[] = await ctr.getClaimTopics();
  console.log("ClaimTopicsRegistry:", CTR);
  console.log("Topics count:", topics.length);
  console.log("Topics:", topics);
}

main().catch((e) => { console.error(e); process.exit(1); });
