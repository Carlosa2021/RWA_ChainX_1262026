require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { POLYGON_RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enables the IR-based code generator to avoid stack too deep errors
    },
  },
  networks: {
    polygon: {
      url: POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      // OPCIONAL: descomenta si quieres fijar topes globales
      // maxFeePerGas: 120_000_000_000,        // 120 gwei
      // maxPriorityFeePerGas: 40_000_000_000, // 40 gwei
    },
  },
};
