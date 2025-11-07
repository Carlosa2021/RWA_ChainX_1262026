# ChainX® Smart Contracts - ERC-3643 Tokenization Platform

**Real estate tokenization infrastructure using ERC-3643 (T-REX) standard for regulatory compliance.**

---

## 🚀 Quick Start - Deployment

**✅ Método recomendado: thirdweb CLI**

```powershell
cd contracts
npx thirdweb deploy -k YOUR_SECRET_KEY
```

**📖 Guía completa:** Ver [DEPLOYMENT-THIRDWEB.md](./DEPLOYMENT-THIRDWEB.md)

---

## 📦 Contratos Principales

### ERC-3643 Infrastructure
- `IdentityRegistry` - KYC/AML verification registry
- `IdentityRegistryStorage` - On-chain KYC data storage
- `ClaimTopicsRegistry` - Required claims for token holders
- `TrustedIssuersRegistry` - Authorized KYC providers
- `Compliance` - Transfer restriction rules

### Platform Contracts
- `ProjectRegistry` - Registry of all tokenized properties
- `ProjectTokenFactory` - Factory for creating new projects
- `SecurityToken` - ERC-3643 compliant token (per project)
- `InvestmentController` - USDC payment + token issuance
- `PayoutDistributor` - Rental income distribution

---

## 🛠️ Development

### Install Dependencies
```powershell
npm install
```

### Compile Contracts
```powershell
npx hardhat compile
```

### Run Tests
```powershell
npx hardhat test
```

### Deploy (Production)
```powershell
npx thirdweb deploy -k $env:THIRDWEB_SECRET_KEY
```

---

## 🔐 Configuration

Create a `.env` file:

```bash
POLYGON_RPC_URL=https://137.rpc.thirdweb.com/YOUR_CLIENT_ID
PRIVATE_KEY=your_private_key_here
THIRDWEB_SECRET_KEY=your_secret_key_here
```

---

## 📚 Documentation

- [DEPLOYMENT-THIRDWEB.md](./DEPLOYMENT-THIRDWEB.md) - **Guía oficial de deployment**
- [COMO-VER-TOKENS-METAMASK.md](./COMO-VER-TOKENS-METAMASK.md) - Ver tokens en MetaMask
- [DEPLOYED_PROJECTS.md](./DEPLOYED_PROJECTS.md) - Proyectos desplegados

---

## 🔗 Resources

- [ERC-3643 Standard](https://erc3643.org/)
- [thirdweb Docs](https://portal.thirdweb.com/)
- [Hardhat Docs](https://hardhat.org/docs)
- [Polygon Network](https://polygon.technology/)

---

## ⚠️ Important Notes

- **ALWAYS use thirdweb CLI** for deployments (more reliable than Hardhat scripts)
- **Deploy to Polygon Mainnet** (chain ID 137)
- **Verify contracts** on PolygonScan after deployment
- **Save deployment addresses** to update `.env.local`

---

## 📝 Scripts Útiles

```powershell
# Aprobar usuario KYC
npx hardhat run scripts/approve-user-kyc.ts --network polygon

# Verificar investment status
npx hardhat run scripts/check-investment-status.ts --network polygon

# Agregar proyectos
npx hardhat run scripts/add-real-projects.ts --network polygon
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
