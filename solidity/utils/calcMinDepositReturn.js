const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const BN = require("bn.js");

// Usage: node calcMinDepositReturn.js <config.json> <data.json> <amount1> <amount2> ... <node_url>
// e.g. node calcMinDepositReturn.js addBOS_mainnet.json data_mainnet.json 1 233656500 https://mainnet-dev.sovryn.app/rpc
const [, , CONFIG_FILE, DATA_FILE, ...args] = process.argv;
const NODE_URL = args.length > 0 ? args[args.length - 1] : undefined;
const AMOUNT_ARGS = args.slice(0, -1);

const ARTIFACTS_DIR = path.resolve(__dirname, "../build/contracts");
const TEN = new BN(10);
const BASIS_POINTS = new BN(10000);

function getConfig() {
	return JSON.parse(fs.readFileSync(path.join(__dirname, CONFIG_FILE), "utf8"));
}

function getData() {
	return JSON.parse(fs.readFileSync(path.join(__dirname, DATA_FILE), "utf8"));
}

function getTopLevelReserve(config, reserve) {
	return (config.reserves || []).find((x) => x.symbol === reserve.symbol);
}

function getReserveAddress(config, reserve) {
	const topReserve = getTopLevelReserve(config, reserve);
	const addr = reserve.address || topReserve?.address || config[reserve.symbol]?.addr;

	if (!addr) {
		throw new Error(`Missing address for token ${reserve.symbol}`);
	}

	return addr;
}

function getReserveDecimals(config, reserve) {
	const topReserve = getTopLevelReserve(config, reserve);
	const decimals = reserve.decimals ?? topReserve?.decimals ?? 18;

	return Number(decimals);
}

function parseUnits(value, decimals) {
	if (!/^\d+(\.\d+)?$/.test(value)) {
		throw new Error(`invalid decimal amount: ${value}`);
	}

	const [whole, fraction = ""] = value.split(".");
	if (fraction.length > decimals) {
		throw new Error(`too many decimal places for ${decimals}-decimal token: ${value}`);
	}

	const wholePart = new BN(whole || "0").mul(TEN.pow(new BN(decimals)));
	const fractionPart = new BN((fraction.padEnd(decimals, "0") || "0").replace(/^0+/, "") || "0");
	return wholePart.add(fractionPart);
}

function formatUnits(value, decimals) {
	const raw = new BN(value);
	const scale = TEN.pow(new BN(decimals));
	const whole = raw.div(scale).toString(10);
	const fraction = raw.mod(scale).toString(10).padStart(decimals, "0").replace(/0+$/, "");

	return fraction.length === 0 ? whole : `${whole}.${fraction}`;
}

function minReturnWithSlippage(expectedLP, slippageBps = 9900) {
	return new BN(expectedLP).mul(new BN(slippageBps)).div(BASIS_POINTS);
}

function decimalLength(value) {
	const raw = new BN(value);
	if (raw.isZero()) {
		throw new Error("reserve amount must be greater than zero");
	}

	let digits = 0;
	for (let x = raw; x.gt(new BN(0)); x = x.div(TEN)) {
		digits++;
	}

	return new BN(digits);
}

function roundDiv(numerator, denominator) {
	const n = new BN(numerator);
	const d = new BN(denominator);

	return n.add(d.div(new BN(2))).div(d);
}

function geometricMean(values) {
	if (values.length === 0) {
		throw new Error("at least one reserve amount is required");
	}

	const numOfDigits = values.reduce((sum, value) => sum.add(decimalLength(value)), new BN(0));
	const exponent = roundDiv(numOfDigits, new BN(values.length)).sub(new BN(1));

	return TEN.pow(exponent);
}

async function main() {
	if (!CONFIG_FILE || !DATA_FILE || AMOUNT_ARGS.length < 2 || !NODE_URL) {
		console.error("Usage: node calcMinDepositReturn.js <config.json> <data.json> <amount1> <amount2> ... <node_url>");
		process.exit(1);
	}

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
	if (AMOUNT_ARGS.length !== reserves.length) {
		console.error(`Expected ${reserves.length} amount arguments, got ${AMOUNT_ARGS.length}.`);
		process.exit(1);
	}

	const tokens = reserves.map((r) => {
		return getReserveAddress(config, r);
	});
	const decimals = reserves.map((r) => getReserveDecimals(config, r));

	// Scale input amounts to token decimals
	const amounts = AMOUNT_ARGS.map((amt, i) => {
		return parseUnits(amt, decimals[i]);
	});
	for (let i = 0; i < amounts.length; i++) {
		if (amounts[i].isZero()) {
			console.error(`Amount for reserve ${i} must be greater than zero.`);
			process.exit(1);
		}
	}

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
	const poolTokenDecimals = await anchor.methods.decimals().call();
	const totalSupplyBN = new BN(totalSupply);
	let expectedLP;

	if (totalSupplyBN.isZero()) {
		expectedLP = geometricMean(amounts).toString(10);
		console.log("Pool is empty: using LiquidityPoolV1Converter.geometricMean(amounts).\n");
	} else {
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
			const left = amounts[i].mul(new BN(reserveBalances[minIndex]));
			const right = amounts[minIndex].mul(new BN(reserveBalances[i]));
			if (left.lt(right)) minIndex = i;
		}

		// Print proportional shares for debugging
		console.log("Pool is non-empty: using fundSupplyAmount for the limiting reserve.");
		console.log("Proportional shares for each reserve:");
		for (let i = 0; i < amounts.length; i++) {
			const reserveBalance = new BN(reserveBalances[i]);
			const sharePpm = reserveBalance.isZero() ? "n/a" : amounts[i].mul(new BN(1000000)).div(reserveBalance).toString(10);
			console.log(
				`  Reserve ${i}: depositAmount = ${amounts[i].toString(10)}, reserveBalance = ${reserveBalances[i]}, proportionalSharePpm = ${sharePpm}`
			);
		}
		console.log(`Limiting reserve index: ${minIndex}\n`);

		// Call formula contract
		expectedLP = await formula.methods
			.fundSupplyAmount(totalSupply, reserveBalances[minIndex], reserveRatio, amounts[minIndex].toString(10))
			.call();
	}

	// Calculate minReturn
	const minReturnRaw = minReturnWithSlippage(expectedLP);

	console.log(`Expected LP tokens (raw): ${expectedLP}`);
	console.log(`Expected LP tokens (scaled): ${formatUnits(expectedLP, Number(poolTokenDecimals))}`);
	console.log(`Recommended minReturn (99%) raw: ${minReturnRaw.toString(10)}`);
	console.log(`Recommended minReturn (99%) scaled: ${formatUnits(minReturnRaw, Number(poolTokenDecimals))}`);
	console.log("Use this value for addLiquidity(..., ..., minReturn)");
}

if (require.main === module) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}

module.exports = {
	parseUnits,
	formatUnits,
	getReserveDecimals,
	minReturnWithSlippage,
	decimalLength,
	roundDiv,
	geometricMean,
};
