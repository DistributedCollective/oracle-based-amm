const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const BN = require("bn.js");

// Usage: node calcMinDepositReturn.js <config.json> <data.json> <amount1> <amount2> ... <node_url>
// e.g. node calcMinDepositReturn.js addBOS_mainnet.json data_mainnet.json 1 233656500 https://mainnet-dev.sovryn.app/rpc
const [, , CONFIG_FILE, DATA_FILE, ...args] = process.argv;
const NODE_URL = args.pop();
const AMOUNT_ARGS = args;

if (!CONFIG_FILE || !DATA_FILE || AMOUNT_ARGS.length < 2 || !NODE_URL) {
	console.error("Usage: node getLPDepositMinReturn.js <config.json> <data.json> <amount1> <amount2> ... <node_url>");
	process.exit(1);
}

const ARTIFACTS_DIR = path.resolve(__dirname, "../build/contracts");

function getConfig() {
	return JSON.parse(fs.readFileSync(path.join(__dirname, CONFIG_FILE), "utf8"));
}
function getData() {
	return JSON.parse(fs.readFileSync(path.join(__dirname, DATA_FILE), "utf8"));
}

async function main() {
	const config = getConfig();
	const data = getData();
	const web3 = new Web3(NODE_URL);

	// Find the V1 converter config
	const converter = config.converters.find((c) => c.type === 1);
	if (!converter) {
		console.error("No V1 converter found in config.");
		process.exit(1);
	}

	// Get token addresses and decimals
	const reserves = converter.reserves;
	const tokens = reserves.map((r) => {
		let addr = r.address;
		if (!addr) {
			// Try top-level reserves array
			const topReserve = config.reserves.find((x) => x.symbol === r.symbol);
			if (topReserve && topReserve.address) addr = topReserve.address;
		}
		if (!addr && config[r.symbol] && config[r.symbol].addr) {
			addr = config[r.symbol].addr;
		}
		if (!addr) {
			throw new Error(`Missing address for token ${r.symbol}`);
		}
		return addr;
	});
	const decimals = reserves.map((r) => r.decimals || 18);

	// Scale input amounts to token decimals
	const amounts = AMOUNT_ARGS.map((amt, i) => {
		// Use BN for precision, avoid floating point errors
		const [whole, fraction = ""] = amt.split(".");
		const padded = (whole + fraction.padEnd(decimals[i], "0")).replace(/^0+/, "");
		return padded === "" ? "0" : padded;
	});

	// Get converter contract address
	const converterAddr = config["newLiquidityPoolV1Converter"]?.addr;
	if (!converterAddr) {
		console.error("No deployed V1 converter found in config.");
		process.exit(1);
	}

	// Load ABIs
	const poolAbi = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, "LiquidityPoolV1Converter.json"), "utf8")).abi;
	const anchorAbi = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, "SmartToken.json"), "utf8")).abi;
	const formulaAbi = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, "SovrynSwapFormula.json"), "utf8")).abi;

	// Get contract instances
	const pool = new web3.eth.Contract(poolAbi, converterAddr);

	// Get anchor address and total supply
	const anchorAddr = await pool.methods.anchor().call();
	const anchor = new web3.eth.Contract(anchorAbi, anchorAddr);
	const totalSupply = await anchor.methods.totalSupply().call();

	// Get reserve balances
	const reserveBalances = [];
	for (let i = 0; i < tokens.length; i++) {
		const reserve = await pool.methods.reserves(tokens[i]).call();
		reserveBalances[i] = reserve.balance;
	}

	// Get reserveRatio
	const reserveRatio = await pool.methods.reserveRatio().call();

	// Get SovrynSwapFormula contract
	const formulaAddr = data.sovrynSwapFormula.addr;
	const formula = new web3.eth.Contract(formulaAbi, formulaAddr);

	// Find limiting reserve (minimum proportional share)
	let minIndex = 0;
	for (let i = 1; i < amounts.length; i++) {
		const left = new BN(amounts[i]).mul(new BN(reserveBalances[minIndex]));
		const right = new BN(amounts[minIndex]).mul(new BN(reserveBalances[i]));
		if (left.lt(right)) minIndex = i;
	}

	// Print proportional shares for debugging
	console.log("Proportional shares for each reserve:");
	for (let i = 0; i < amounts.length; i++) {
		const share = Number(amounts[i]) / Number(reserveBalances[i]);
		console.log(`  Reserve ${i}: depositAmount = ${amounts[i]}, reserveBalance = ${reserveBalances[i]}, proportionalShare = ${share}`);
	}
	console.log(`Limiting reserve index: ${minIndex}\n`);

	// Call formula contract
	const expectedLP = await formula.methods.fundSupplyAmount(totalSupply, reserveBalances[minIndex], reserveRatio, amounts[minIndex]).call();

	// Get pool token decimals
	const poolTokenDecimals = await anchor.methods.decimals().call();

	// Convert from wei to tokens for output
	const scaledLP = Number(expectedLP) / Math.pow(10, poolTokenDecimals);

	// Calculate minReturn
	const minReturnRaw = Math.floor(Number(expectedLP) * 0.99);
	const minReturnScaled = scaledLP * 0.99;

	console.log(`Expected LP tokens (raw): ${expectedLP}`);
	console.log(`Expected LP tokens (scaled): ${scaledLP}`);
	console.log(`Recommended minReturn (99%) raw: ${minReturnRaw}`);
	console.log(`Recommended minReturn (99%) scaled: ${minReturnScaled}`);
	console.log("Use this value for addLiquidity(..., ..., minReturn)");
}

main().catch(console.error);
