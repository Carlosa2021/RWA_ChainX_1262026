require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { POLYGON_RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    polygon: {
      url: POLYGON_RPC_URL || "https://137.rpc.thirdweb.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 137,
      gasPrice: 50000000000, // 50 gwei - más agresivo
      timeout: 300000, // 5 minutos
    },
  },
};
