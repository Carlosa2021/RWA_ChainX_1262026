export const PROJECT_REGISTRY_ABI = [
  {
    "inputs": [],
    "name": "getAllProjects",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "address", "name": "securityToken", "type": "address" },
          { "internalType": "address", "name": "investmentController", "type": "address" },
          { "internalType": "uint256", "name": "pricePerToken", "type": "uint256" },
          { "internalType": "uint256", "name": "maxCap", "type": "uint256" },
          { "internalType": "address", "name": "stablecoin", "type": "address" },
          { "internalType": "string", "name": "metadataURI", "type": "string" },
          { "internalType": "bool", "name": "active", "type": "bool" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
        ],
        "internalType": "struct ProjectRegistry.Project[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProjectCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
