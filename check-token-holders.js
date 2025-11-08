const { createThirdwebClient, getContract, defineChain, getContractEvents } = require("thirdweb");

const client = createThirdwebClient({ 
  clientId: "8e23c797a5775080df8bad49ce5719a4" 
});

const chain = defineChain(137);

const tokens = [
  { name: "Token correcto (.env)", address: "0xbe550479af0776fa8d95b29e08c820d66d35549e" },
  { name: "Token incorrecto (viejo)", address: "0xb555f4f8cdb5ff0fe38d9e2cd2dba84d1b35549c" },
];

async function checkToken(tokenAddress, name) {
  console.log(`\n🔍 Verificando ${name}: ${tokenAddress}`);
  
  try {
    const contract = getContract({ 
      client, 
      address: tokenAddress, 
      chain 
    });

    // Leer eventos Transfer
    const events = await getContractEvents({
      contract,
      fromBlock: BigInt(0),
      toBlock: "latest",
      events: [{
        type: "event",
        name: "Transfer",
        inputs: [
          { type: "address", name: "from", indexed: true },
          { type: "address", name: "to", indexed: true },
          { type: "uint256", name: "value", indexed: false },
        ],
      }],
    });

    console.log(`✅ Eventos Transfer encontrados: ${events.length}`);
    
    if (events.length > 0) {
      console.log("\n📊 Holders encontrados:");
      const holders = new Set();
      events.forEach(e => {
        const to = e.args?.to || e.args?.[1];
        if (to && to.toLowerCase() !== "0x0000000000000000000000000000000000000000") {
          holders.add(to.toLowerCase());
        }
      });
      
      holders.forEach(holder => console.log(`  - ${holder}`));
      console.log(`\n📋 Total holders únicos: ${holders.size}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log("🚀 Buscando SecurityToken con inversores...\n");
  
  for (const token of tokens) {
    await checkToken(token.address, token.name);
  }
}

main();
