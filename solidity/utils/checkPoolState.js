const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const BN = require("bn.js");
const Decimal = require("decimal.js");

const { parseUnits, formatUnits, getReserveDecimals } = require("./calcMinDepositReturn");

Decimal.set({ precision: 80, rounding: Decimal.ROUND_DOWN });

const [, , CONFIG_FILE, DATA_FILE, ...args] = process.argv;
const NODE_URL = args.length > 0 ? args[args.length - 1] : undefined;
const OPTION_ARGS = args.slice(0, -1);
const ARTIFACTS_DIR = path.resolve(__dirname, "../build/contracts");

function usage() {
	console.error(
		[
			"Usage:",
			"  node checkPoolState.js <config.json> <data.json> [options] <node_url>",
			"",
			"Options:",
			"  --quote-rbtc <amount>   RBTC amount for the sell-side quote WRBTC -> USDT0 (default: 1)",
			"  --quote-usdt <amount>   USDT0 amount for the buy-side quote USDT0 -> WRBTC",
			"                          (default: RBTC quote size valued at the current spot price)",
			"",
			"Example:",
			"  node checkPoolState.js addUSDT0_mainnet.json data_mainnet.json --quote-rbtc 1 https://mainnet-dev.sovryn.app/rpc",
		].join("\n")
	);
}

function readJson(file) {
	const fullPath = path.isAbsolute(file) || fs.existsSync(file) ? file : path.join(__dirname, file);
	return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function loadAbi(contractName) {
	return JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, `${contractName}.json`), "utf8")).abi;
}

function parseOptions(optionArgs) {
	const options = {
		quoteRbtc: "1",
		quoteUsdt: null,
	};

	for (let i = 0; i < optionArgs.length; i++) {
		const arg = optionArgs[i];
		if (arg === "--quote-rbtc") options.quoteRbtc = optionArgs[++i];
		else if (arg === "--quote-usdt") options.quoteUsdt = optionArgs[++i];
		else throw new Error(`Unknown option: ${arg}`);
	}

	return options;
}

function getTopLevelReserve(config, reserve) {
	return (config.reserves || []).find((x) => x.symbol === reserve.symbol);
}

function getReserveAddress(config, reserve) {
	const topReserve = getTopLevelReserve(config, reserve);
	const addr = reserve.address || (topReserve && topReserve.address) || (config[reserve.symbol] && config[reserve.symbol].addr);

	if (!addr) {
		throw new Error(`Missing address for token ${reserve.symbol}`);
	}

	return addr;
}

function converterConfigKey(converter) {
	return `newLiquidityPoolV${converter.type}Converter_${converter.symbol.replace(/[^a-zA-Z0-9]/g, "")}`;
}

function getConverterAddress(config, converter) {
	const specific = config[converterConfigKey(converter)];
	const legacy = config[`newLiquidityPoolV${converter.type}Converter`];
	const addr = (specific && specific.addr) || (legacy && legacy.addr);

	if (!addr) {
		throw new Error(`Missing deployed converter address for ${converter.symbol}`);
	}

	return addr;
}

function toDecimal(raw, decimals) {
	return new Decimal(raw.toString()).div(new Decimal(10).pow(decimals));
}

function formatDecimal(value, places = 12) {
	if (value === null) return "n/a";
	return value.toDecimalPlaces(places).toString();
}

async function quote(pool, source, target, amountRaw) {
	const result = await pool.methods.targetAmountAndFee(source.address, target.address, amountRaw.toString(10)).call();
	const netTarget = new BN(result[0]);
	const fee = new BN(result[1]);
	return {
		netTarget,
		fee,
		grossTarget: netTarget.add(fee),
	};
}

async function main() {
	if (!CONFIG_FILE || !DATA_FILE || !NODE_URL) {
		usage();
		process.exit(1);
	}

	const options = parseOptions(OPTION_ARGS);
	const config = readJson(CONFIG_FILE);
	readJson(DATA_FILE); // Keeps the same command shape as other utils and catches bad paths.

	const converterConfig = config.converters.find((c) => c.type === 1);
	if (!converterConfig) throw new Error("No V1 converter found in config");
	if (converterConfig.reserves.length !== 2) throw new Error("This checker expects a two-reserve V1 pool");

	const reserveInfo = converterConfig.reserves.map((reserve) => ({
		symbol: reserve.symbol,
		address: getReserveAddress(config, reserve),
		decimals: getReserveDecimals(config, reserve),
	}));

	const rbtc = reserveInfo.find((reserve) => /BTC/i.test(reserve.symbol));
	const stable = reserveInfo.find((reserve) => reserve !== rbtc);
	if (!rbtc || !stable) throw new Error("Could not identify RBTC and stable-token reserves from config symbols");

	const web3 = new Web3(NODE_URL);
	const converterAddress = getConverterAddress(config, converterConfig);
	const pool = new web3.eth.Contract(loadAbi("LiquidityPoolV1Converter"), converterAddress);
	const anchorAddress = await pool.methods.anchor().call();
	const anchor = new web3.eth.Contract(loadAbi("SmartToken"), anchorAddress);
	const blockNumber = await web3.eth.getBlockNumber();

	const [isActive, conversionFee, reserveRatio, totalSupply, poolTokenDecimals, poolTokenSymbol] = await Promise.all([
		pool.methods.isActive().call(),
		pool.methods.conversionFee().call(),
		pool.methods.reserveRatio().call(),
		anchor.methods.totalSupply().call(),
		anchor.methods.decimals().call(),
		anchor.methods.symbol().call(),
	]);

	const reserveRows = [];
	for (const reserve of reserveInfo) {
		const onchain = await pool.methods.reserves(reserve.address).call();
		reserveRows.push({
			...reserve,
			balanceRaw: new BN(onchain.balance),
			weight: onchain.weight,
			isSet: onchain.isSet,
			balance: toDecimal(onchain.balance, reserve.decimals),
		});
	}

	const rbtcReserve = reserveRows.find((reserve) => reserve.address.toLowerCase() === rbtc.address.toLowerCase());
	const stableReserve = reserveRows.find((reserve) => reserve.address.toLowerCase() === stable.address.toLowerCase());
	const totalSupplyRaw = new BN(totalSupply);
	const totalSupplyScaled = toDecimal(totalSupply, Number(poolTokenDecimals));
	const emptyPool = totalSupplyRaw.isZero() || rbtcReserve.balanceRaw.isZero() || stableReserve.balanceRaw.isZero();

	let reservePrice = null;
	let totalLiquidityStable = null;
	let poolTokenPriceStable = null;

	if (!emptyPool) {
		reservePrice = stableReserve.balance.mul(rbtcReserve.weight).div(rbtcReserve.balance.mul(stableReserve.weight));
		totalLiquidityStable = stableReserve.balance.add(rbtcReserve.balance.mul(reservePrice));
		poolTokenPriceStable = totalLiquidityStable.div(totalSupplyScaled);
	}

	console.log(`Block: ${blockNumber}`);
	console.log(`Converter: ${converterAddress}`);
	console.log(`Anchor / LP token: ${anchorAddress} (${poolTokenSymbol})`);
	console.log(`Active: ${isActive}`);
	console.log(`Conversion fee: ${conversionFee} ppm (${new Decimal(conversionFee).div(10000).toString()}%)`);
	console.log(`Reserve ratio: ${reserveRatio} ppm`);
	console.log("");

	console.log("Liquidity");
	for (const reserve of reserveRows) {
		console.log(`  ${reserve.symbol}: ${reserve.balance.toString()} (raw ${reserve.balanceRaw.toString(10)})`);
		console.log(`    address: ${reserve.address}`);
		console.log(`    weight: ${reserve.weight} ppm, isSet: ${reserve.isSet}`);
	}
	console.log("");

	console.log("LP token");
	console.log(`  total supply: ${formatUnits(totalSupply, Number(poolTokenDecimals))} ${poolTokenSymbol} (raw ${totalSupply})`);
	console.log(`  pool token price: ${formatDecimal(poolTokenPriceStable)} ${stable.symbol} per ${poolTokenSymbol}`);
	console.log(`  total pool value: ${formatDecimal(totalLiquidityStable)} ${stable.symbol}`);
	console.log("");

	console.log("Price");
	console.log(`  reserve-implied spot: ${formatDecimal(reservePrice)} ${stable.symbol}/${rbtc.symbol}`);

	if (emptyPool || !isActive) {
		console.log(`  ${options.quoteRbtc} ${rbtc.symbol} quote: n/a`);
		console.log("  reason: pool is empty or inactive");
		return;
	}

	const quoteRbtcRaw = parseUnits(options.quoteRbtc, rbtc.decimals);
	if (quoteRbtcRaw.isZero()) throw new Error("--quote-rbtc must be greater than zero");

	const rbtcToStable = await quote(pool, rbtc, stable, quoteRbtcRaw);
	const quoteRbtcAmount = toDecimal(quoteRbtcRaw, rbtc.decimals);
	const grossOut = toDecimal(rbtcToStable.grossTarget, stable.decimals);
	const netOut = toDecimal(rbtcToStable.netTarget, stable.decimals);
	const feeOut = toDecimal(rbtcToStable.fee, stable.decimals);
	const grossPrice = grossOut.div(quoteRbtcAmount);
	const netPrice = netOut.div(quoteRbtcAmount);

	console.log(`  ${options.quoteRbtc} ${rbtc.symbol} -> ${stable.symbol} quote:`);
	console.log(`    gross out before fee: ${grossOut.toString()} ${stable.symbol}`);
	console.log(`    fee: ${feeOut.toString()} ${stable.symbol}`);
	console.log(`    net out: ${netOut.toString()} ${stable.symbol}`);
	console.log(`    gross effective price: ${formatDecimal(grossPrice)} ${stable.symbol}/${rbtc.symbol}`);
	console.log(`    net effective price: ${formatDecimal(netPrice)} ${stable.symbol}/${rbtc.symbol}`);

	// Buy side: USDT0 -> WRBTC. Default to a notional comparable to the RBTC quote so both sides match.
	const quoteStableAmount =
		options.quoteUsdt !== null
			? new Decimal(options.quoteUsdt)
			: quoteRbtcAmount.mul(reservePrice).toDecimalPlaces(stable.decimals, Decimal.ROUND_DOWN);
	const quoteStableStr = quoteStableAmount.toFixed(stable.decimals, Decimal.ROUND_DOWN);
	const quoteStableRaw = parseUnits(quoteStableStr, stable.decimals);
	if (quoteStableRaw.isZero()) throw new Error("USDT0 quote amount must be greater than zero");

	const stableToRbtc = await quote(pool, stable, rbtc, quoteStableRaw);
	const grossRbtcOut = toDecimal(stableToRbtc.grossTarget, rbtc.decimals);
	const netRbtcOut = toDecimal(stableToRbtc.netTarget, rbtc.decimals);
	const feeRbtcOut = toDecimal(stableToRbtc.fee, rbtc.decimals);
	// Price expressed in USDT0/WRBTC (= input / output) so it is directly comparable to spot and the sell side.
	const grossBuyPrice = grossRbtcOut.isZero() ? null : quoteStableAmount.div(grossRbtcOut);
	const netBuyPrice = netRbtcOut.isZero() ? null : quoteStableAmount.div(netRbtcOut);

	console.log("");
	console.log(`  ${quoteStableStr} ${stable.symbol} -> ${rbtc.symbol} quote:`);
	console.log(`    gross out before fee: ${grossRbtcOut.toString()} ${rbtc.symbol}`);
	console.log(`    fee: ${feeRbtcOut.toString()} ${rbtc.symbol}`);
	console.log(`    net out: ${netRbtcOut.toString()} ${rbtc.symbol}`);
	console.log(`    gross effective price: ${formatDecimal(grossBuyPrice)} ${stable.symbol}/${rbtc.symbol}`);
	console.log(`    net effective price: ${formatDecimal(netBuyPrice)} ${stable.symbol}/${rbtc.symbol}`);

	if (new Decimal(options.quoteRbtc).gte(rbtcReserve.balance.mul("0.1"))) {
		console.log("");
		console.log(`Note: RBTC quote size (${options.quoteRbtc}) is >= 10% of the RBTC reserve, so its price includes large slippage.`);
	}
	if (quoteStableAmount.gte(stableReserve.balance.mul("0.1"))) {
		console.log("");
		console.log(`Note: USDT0 quote size (${quoteStableStr}) is >= 10% of the USDT0 reserve, so its price includes large slippage.`);
	}
}

if (require.main === module) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
