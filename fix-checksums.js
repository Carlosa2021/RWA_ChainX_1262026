const { ethers } = require('ethers');

const addresses = {
  IDENTITY_REGISTRY: '0xa9be2Ab6Ee90f407D2E802E2f6D0439d067A8e82',
  IDENTITY_REGISTRY_STORAGE: '0x9ad9d3aCD25E7F1E8D09ECC0C0e6E1c3A55ebDa95',
  CLAIM_TOPICS_REGISTRY: '0x9c15D32e6aA4d73B95B62beCfF1d4fA31e807297',
  TRUSTED_ISSUERS_REGISTRY: '0x1ddF03dc8bf1ef87fcCA37e71F8f9cC2EcB1353a',
  COMPLIANCE: '0x6a7b3e0fE0D7ebb32e6091C8AB3FdbF1Fbc3d91f',
  SECURITY_TOKEN: '0xb555F4f8cDB5Ff0Fe38D9e2Cd2DBa84d1b35549c',
  INVESTMENT_CONTROLLER: '0xa0921344cdc4b0a1058df3dd1ec53070333ea712'
};

console.log('🔧 Corrigiendo checksums EIP-55...\n');

for (const [name, addr] of Object.entries(addresses)) {
  try {
    const checksummed = ethers.getAddress(addr);
    const isValid = addr === checksummed;
    
    console.log(`${name}:`);
    console.log(`  Original:  ${addr}`);
    console.log(`  Correcto:  ${checksummed}`);
    console.log(`  Status:    ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}\n`);
  } catch (error) {
    console.log(`${name}: ❌ ERROR - ${error.message}\n`);
  }
}
