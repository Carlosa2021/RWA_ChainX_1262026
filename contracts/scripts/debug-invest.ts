import { ethers } from "hardhat";

// Diagnóstico del revert en invest(): simula la llamada usando callStatic para obtener el motivo exacto.
// Requiere definir en ENV:
// - INVESTMENT_CONTROLLER: dirección del contrato ChainXInvestmentController
// - TEST_INVESTOR: wallet registrada KYC que provoca el revert

const CONTROLLER = process.env.INVESTMENT_CONTROLLER as string;
const TEST_INVESTOR = process.env.TEST_INVESTOR as string;

if (!CONTROLLER || !TEST_INVESTOR) {
	throw new Error("Faltan ENV: INVESTMENT_CONTROLLER y/o TEST_INVESTOR");
}

const CONTROLLER_ABI = [
	"function quoteUSDC(uint256 tokenAmount) view returns (uint256)",
	"function invest(uint256 tokenAmount, uint256 maxUsdcExpected)"
];

const TOKEN = process.env.TOKEN3643 as string;

const TOKEN_ABI = [
	"function isAgent(address) view returns (bool)",
	"function paused() view returns (bool)",
	"function identityRegistry() view returns (address)",
	"function name() view returns (string)",
	"function symbol() view returns (string)"
];

const IDENTITY_REGISTRY_ABI = [
	"function isVerified(address) view returns (bool)",
	"function identity(address) view returns (address)"
];

async function main() {
	console.log("🚀 Iniciando diagnóstico invest()");
	const controller = new ethers.Contract(CONTROLLER, CONTROLLER_ABI, ethers.provider);
	const tokenAmount = 1n; // 1 token

	if (!TOKEN) {
		throw new Error("Falta TOKEN3643 en .env para diagnosticar roles");
	}

	const token = new ethers.Contract(TOKEN, TOKEN_ABI, ethers.provider);
	const tokenCode = await ethers.provider.getCode(TOKEN);
	console.log("📦 Token bytecode length:", tokenCode.length, "address:", TOKEN);

	try {
		const agent = await token.isAgent(CONTROLLER);
		console.log("🤖 Token.isAgent(controller):", agent);
	} catch (err: any) {
		console.warn("⚠️ No se pudo consultar isAgent:", err?.message);
		if (err?.data) {
			console.warn("   ↳ data:", err.data);
		}
	}

	try {
		const [paused, name, symbol] = await Promise.all([
			token.paused(),
			token.name(),
			token.symbol(),
		]);
		console.log("⏸️ Token.paused():", paused);
		console.log("🏷️ Token name/symbol:", name, symbol);
	} catch (err) {
		console.warn("⚠️ No se pudieron leer paused/name/symbol:", (err as Error).message);
	}

	try {
		const identityRegistry = await token.identityRegistry();
		const irCode = await ethers.provider.getCode(identityRegistry);
		console.log("🪪 Token.identityRegistry():", identityRegistry, "codeLength:", irCode.length);
		const irFromToken = new ethers.Contract(identityRegistry, IDENTITY_REGISTRY_ABI, ethers.provider);
		const [verifiedOnTokenIR, onchainId] = await Promise.all([
			irFromToken.isVerified(TEST_INVESTOR),
			irFromToken.identity(TEST_INVESTOR),
		]);
		console.log("   ↳ isVerified(TEST_INVESTOR):", verifiedOnTokenIR, "onchainID:", onchainId);
	} catch (err) {
		console.warn("⚠️ No se pudo consultar identityRegistry():", (err as Error).message);
	}

	if (process.env.NEXT_PUBLIC_IDENTITY_REGISTRY) {
		const envIr = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY;
		const irEnv = new ethers.Contract(envIr, IDENTITY_REGISTRY_ABI, ethers.provider);
		const [envVerified, envIdentity] = await Promise.all([
			irEnv.isVerified(TEST_INVESTOR),
			irEnv.identity(TEST_INVESTOR),
		]);
		console.log("🌐 Env IdentityRegistry:", envIr, "isVerified:", envVerified, "identity:", envIdentity);
	}

	const quote = await controller.quoteUSDC(tokenAmount);
	console.log("📊 quoteUSDC(1):", quote.toString(), "USDC (6 decimales)");

	const data = controller.interface.encodeFunctionData("invest", [tokenAmount, quote * 105n / 100n]);

	try {
		const res = await ethers.provider.call({
			from: TEST_INVESTOR,
			to: CONTROLLER,
			data,
		});
		console.log("✅ call() completó sin revert:", res);
	} catch (error: any) {
		console.error("❌ Revert detectado");
		if (error?.error?.data) {
			console.error("error.error.data:", error.error.data);
		}
		if (error?.data) {
			console.error("error.data:", error.data);
		}
		if (error?.errorName) {
			console.error("errorName:", error.errorName);
		}
		if (error?.reason) {
			console.error("reason:", error.reason);
		}
		if (error?.shortMessage) {
			console.error("shortMessage:", error.shortMessage);
		}
		if (error?.message) {
			console.error("message:", error.message);
		}
		try {
			const decoded = token.interface.parseError(error.data);
			console.error("⛔ Decodificado con ABI Token:", decoded.name, decoded.args);
		} catch (_) {
			// ignore if no match
		}
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});

