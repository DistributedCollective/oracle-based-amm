#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Web3 = require("web3");

const ETH_RESERVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const CONVERTER_ABI = [
	{
		constant: true,
		inputs: [],
		name: "converterType",
		outputs: [{ name: "", type: "uint16" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "reserveTokenCount",
		outputs: [{ name: "", type: "uint16" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ name: "_index", type: "uint256" }],
		name: "reserveTokens",
		outputs: [{ name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "connectorTokenCount",
		outputs: [{ name: "", type: "uint16" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [{ name: "_index", type: "uint256" }],
		name: "connectorTokens",
		outputs: [{ name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
];

const OWNED_ABI = [
	{
		constant: true,
		inputs: [],
		name: "owner",
		outputs: [{ name: "", type: "address" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
];

const ERC20_STRING_ABI = [
	{
		constant: true,
		inputs: [],
		name: "symbol",
		outputs: [{ name: "", type: "string" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "decimals",
		outputs: [{ name: "", type: "uint8" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
];

const ERC20_BYTES32_ABI = [
	{
		constant: true,
		inputs: [],
		name: "symbol",
		outputs: [{ name: "", type: "bytes32" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "decimals",
		outputs: [{ name: "", type: "uint8" }],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
];

const CONVERSION_EVENT_OLD = {
	name: "Conversion",
	type: "event",
	inputs: [
		{ indexed: true, name: "_fromToken", type: "address" },
		{ indexed: true, name: "_toToken", type: "address" },
		{ indexed: true, name: "_trader", type: "address" },
		{ indexed: false, name: "_amount", type: "uint256" },
		{ indexed: false, name: "_return", type: "uint256" },
		{ indexed: false, name: "_conversionFee", type: "int256" },
	],
};

const CONVERSION_EVENT_NEW = {
	name: "Conversion",
	type: "event",
	inputs: [
		{ indexed: true, name: "_fromToken", type: "address" },
		{ indexed: true, name: "_toToken", type: "address" },
		{ indexed: true, name: "_trader", type: "address" },
		{ indexed: false, name: "_amount", type: "uint256" },
		{ indexed: false, name: "_return", type: "uint256" },
		{ indexed: false, name: "_conversionFee", type: "int256" },
		{ indexed: false, name: "_protocolFee", type: "int256" },
	],
};

function printUsage() {
	console.log(
		[
			"Usage:",
			"  node scripts/monthlyTokenVolumes.js --rpc <RPC_URL> [options]",
			"",
			"Options:",
			"  --addresses <file>     Input file with converter/pool addresses.",
			"                         Default: ./mainnet _adresses.json",
			"  --out <file>           Output CSV path.",
			"                         Default: ./monthly_token_volumes_last5y.csv",
			"  --json-out <file>      Optional JSON output path.",
			"  --months <n>           Lookback window in months (default: 60).",
			"  --start-date <iso>     Override start date (UTC), e.g. 2021-02-20T00:00:00Z",
			"  --from-block <n>       Override start block (skips timestamp->block search).",
			"  --to-block <n>         Override end block (default: latest).",
			"  --chunk <n>            Block chunk size for eth_getLogs (default: 20000).",
			"  --help                 Show this help.",
		].join("\n")
	);
}

function parseArgs(argv) {
	const options = {
		rpc: "",
		addressesFile: "mainnet _adresses.json",
		outFile: "monthly_token_volumes_last5y.csv",
		jsonOutFile: "",
		months: 60,
		startDate: "",
		fromBlock: "",
		toBlock: "",
		chunkSize: 20000,
	};

	for (let i = 2; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--help" || arg === "-h") {
			options.help = true;
			continue;
		}
		if (arg === "--rpc" || arg === "-r") {
			options.rpc = argv[++i] || "";
			continue;
		}
		if (arg === "--addresses" || arg === "-a") {
			options.addressesFile = argv[++i] || "";
			continue;
		}
		if (arg === "--out" || arg === "-o") {
			options.outFile = argv[++i] || "";
			continue;
		}
		if (arg === "--json-out") {
			options.jsonOutFile = argv[++i] || "";
			continue;
		}
		if (arg === "--months") {
			options.months = Number(argv[++i] || 60);
			continue;
		}
		if (arg === "--start-date") {
			options.startDate = argv[++i] || "";
			continue;
		}
		if (arg === "--from-block") {
			options.fromBlock = Number(argv[++i]);
			continue;
		}
		if (arg === "--to-block") {
			options.toBlock = Number(argv[++i]);
			continue;
		}
		if (arg === "--chunk") {
			options.chunkSize = Number(argv[++i] || 20000);
			continue;
		}
		throw new Error("Unknown argument: " + arg);
	}

	return options;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetries(fn, label, attempts) {
	let lastError;
	for (let i = 0; i < attempts; i++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			if (i < attempts - 1) {
				const waitMs = 500 * (i + 1);
				console.error("Retrying after error (" + label + "): " + error.message);
				await sleep(waitMs);
			}
		}
	}
	throw lastError;
}

function isTransportError(error) {
	const msg = String((error && error.message) || error || "").toLowerCase();
	const markers = [
		"invalid json rpc response",
		"connection",
		"network error",
		"socket hang up",
		"timed out",
		"timeout",
		"failed to fetch",
		"econn",
		"429",
		"too many requests",
		"bad gateway",
		"gateway timeout",
		"service unavailable",
	];
	for (const marker of markers) {
		if (msg.indexOf(marker) >= 0) {
			return true;
		}
	}
	return false;
}

function toLowerAddress(address) {
	return address.toLowerCase();
}

function toChecksumAddress(web3, address) {
	return web3.utils.toChecksumAddress(address);
}

function asMonthKey(unixTimestamp) {
	const d = new Date(unixTimestamp * 1000);
	const y = d.getUTCFullYear();
	const m = String(d.getUTCMonth() + 1).padStart(2, "0");
	return y + "-" + m;
}

function buildMonthRange(startTs, endTs) {
	const keys = [];
	const start = new Date(startTs * 1000);
	const end = new Date(endTs * 1000);
	const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1, 0, 0, 0));
	const limit = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1, 0, 0, 0));

	while (cursor.getTime() <= limit.getTime()) {
		const y = cursor.getUTCFullYear();
		const m = String(cursor.getUTCMonth() + 1).padStart(2, "0");
		keys.push(y + "-" + m);
		cursor.setUTCMonth(cursor.getUTCMonth() + 1);
	}

	return keys;
}

function normalizeOutputPath(filePath) {
	return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}

function parseAddressEntriesFromObject(input, prefix) {
	const entries = [];
	if (input === null || input === undefined) {
		return entries;
	}

	if (Array.isArray(input)) {
		for (let i = 0; i < input.length; i++) {
			const childPrefix = prefix ? prefix + "[" + i + "]" : "[" + i + "]";
			const childEntries = parseAddressEntriesFromObject(input[i], childPrefix);
			for (const item of childEntries) {
				entries.push(item);
			}
		}
		return entries;
	}

	if (typeof input === "object") {
		for (const key of Object.keys(input)) {
			const value = input[key];
			const label = prefix ? prefix + "." + key : key;
			if (typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value.trim())) {
				entries.push({ label: label, address: value.trim() });
			} else {
				const childEntries = parseAddressEntriesFromObject(value, label);
				for (const item of childEntries) {
					entries.push(item);
				}
			}
		}
	}

	return entries;
}

function parseAddressEntriesFromText(text) {
	const entries = [];
	const kvRegex = /"([^"]+)"\s*:\s*"(0x[a-fA-F0-9]{40})"/g;
	let match = kvRegex.exec(text);
	while (match) {
		entries.push({ label: match[1], address: match[2] });
		match = kvRegex.exec(text);
	}

	if (entries.length > 0) {
		return entries;
	}

	const addrRegex = /(0x[a-fA-F0-9]{40})/g;
	let index = 0;
	let match2 = addrRegex.exec(text);
	while (match2) {
		entries.push({ label: "address_" + index, address: match2[1] });
		match2 = addrRegex.exec(text);
		index++;
	}
	return entries;
}

function dedupeAddressEntries(entries) {
	const seen = new Set();
	const deduped = [];
	for (const item of entries) {
		const addressLower = item.address.toLowerCase();
		if (!seen.has(addressLower)) {
			seen.add(addressLower);
			deduped.push(item);
		}
	}
	return deduped;
}

function loadInputAddresses(filePath) {
	const raw = fs.readFileSync(filePath, { encoding: "utf8" });
	let entries = [];

	try {
		const parsed = JSON.parse(raw);
		entries = parseAddressEntriesFromObject(parsed, "");
	} catch (error) {
		entries = parseAddressEntriesFromText(raw);
	}

	if (entries.length === 0) {
		entries = parseAddressEntriesFromText(raw);
	}

	return dedupeAddressEntries(entries);
}

async function isConverter(web3, address) {
	const contract = new web3.eth.Contract(CONVERTER_ABI, address);
	try {
		await contract.methods.converterType().call();
		return true;
	} catch (error) {
		if (isTransportError(error)) {
			throw error;
		}
		return false;
	}
}

async function getOwner(web3, address) {
	const contract = new web3.eth.Contract(OWNED_ABI, address);
	try {
		const owner = await contract.methods.owner().call();
		if (!owner || owner.toLowerCase() === ZERO_ADDRESS) {
			return "";
		}
		return owner;
	} catch (error) {
		if (isTransportError(error)) {
			throw error;
		}
		return "";
	}
}

async function resolveConverters(web3, addressEntries) {
	const resolved = new Map();
	const skipped = [];

	for (const item of addressEntries) {
		const checksumAddress = toChecksumAddress(web3, item.address);
		const lowered = toLowerAddress(checksumAddress);

		if (await withRetries(() => isConverter(web3, checksumAddress), "isConverter:" + checksumAddress, 3)) {
			if (!resolved.has(lowered)) {
				resolved.set(lowered, {
					converter: checksumAddress,
					source: item.label,
					origin: checksumAddress,
				});
			}
			continue;
		}

		const owner = await withRetries(() => getOwner(web3, checksumAddress), "owner:" + checksumAddress, 3);
		if (owner) {
			const ownerChecksum = toChecksumAddress(web3, owner);
			const ownerLower = toLowerAddress(ownerChecksum);
			if (await withRetries(() => isConverter(web3, ownerChecksum), "isConverterOwner:" + ownerChecksum, 3)) {
				if (!resolved.has(ownerLower)) {
					resolved.set(ownerLower, {
						converter: ownerChecksum,
						source: item.label,
						origin: checksumAddress,
					});
				}
				continue;
			}
		}

		skipped.push({ label: item.label, address: checksumAddress });
	}

	return {
		converters: Array.from(resolved.values()),
		skipped: skipped,
	};
}

async function getReserveTokens(web3, converterAddress) {
	const contract = new web3.eth.Contract(CONVERTER_ABI, converterAddress);
	const reserveTokens = [];
	let count = 0;
	let useReserveMethods = true;

	try {
		count = Number(await contract.methods.reserveTokenCount().call());
	} catch (error) {
		useReserveMethods = false;
		count = Number(await contract.methods.connectorTokenCount().call());
	}

	for (let i = 0; i < count; i++) {
		let token;
		if (useReserveMethods) {
			token = await contract.methods.reserveTokens(i).call();
		} else {
			token = await contract.methods.connectorTokens(i).call();
		}
		reserveTokens.push(token);
	}

	return reserveTokens;
}

function bytes32ToString(web3, value) {
	if (!value) {
		return "";
	}
	try {
		return web3.utils.hexToUtf8(value).replace(/\u0000/g, "").trim();
	} catch (error) {
		return "";
	}
}

async function fetchTokenMeta(web3, address) {
	const lower = toLowerAddress(address);
	if (lower === ETH_RESERVE_ADDRESS) {
		return {
			address: toChecksumAddress(web3, ETH_RESERVE_ADDRESS),
			symbol: "RBTC",
			decimals: 18,
		};
	}

	const checksum = toChecksumAddress(web3, address);
	const stringToken = new web3.eth.Contract(ERC20_STRING_ABI, checksum);
	try {
		const symbolRaw = await stringToken.methods.symbol().call();
		const decimalsRaw = await stringToken.methods.decimals().call();
		const symbol = (symbolRaw || "").trim() || checksum.slice(0, 10);
		const decimals = Number(decimalsRaw);
		return { address: checksum, symbol: symbol, decimals: isNaN(decimals) ? 18 : decimals };
	} catch (error) {
		if (isTransportError(error)) {
			throw error;
		}
		const bytesToken = new web3.eth.Contract(ERC20_BYTES32_ABI, checksum);
		try {
			const symbolBytes = await bytesToken.methods.symbol().call();
			const decimalsRaw = await bytesToken.methods.decimals().call();
			const symbol = bytes32ToString(web3, symbolBytes) || checksum.slice(0, 10);
			const decimals = Number(decimalsRaw);
			return { address: checksum, symbol: symbol, decimals: isNaN(decimals) ? 18 : decimals };
		} catch (error2) {
			if (isTransportError(error2)) {
				throw error2;
			}
			return { address: checksum, symbol: checksum.slice(0, 10), decimals: 18 };
		}
	}
}

async function findBlockByTimestamp(web3, targetTimestamp, latestBlockNumber) {
	let low = 0;
	let high = latestBlockNumber;

	while (low < high) {
		const mid = Math.floor((low + high) / 2);
		const block = await withRetries(() => web3.eth.getBlock(mid), "getBlock:" + mid, 4);
		const ts = Number(block.timestamp);
		if (ts < targetTimestamp) {
			low = mid + 1;
		} else {
			high = mid;
		}
	}

	return low;
}

function addVolume(volumeMap, tokenAddressLower, monthKey, kind, rawAmount) {
	if (!rawAmount) {
		return;
	}

	let amount;
	try {
		amount = BigInt(rawAmount);
	} catch (error) {
		return;
	}

	if (amount < 0n) {
		return;
	}

	const key = tokenAddressLower + "|" + monthKey;
	let row = volumeMap.get(key);
	if (!row) {
		row = {
			sourceRaw: 0n,
			targetRaw: 0n,
			sourceTrades: 0,
			targetTrades: 0,
		};
		volumeMap.set(key, row);
	}

	if (kind === "source") {
		row.sourceRaw += amount;
		row.sourceTrades += 1;
	} else {
		row.targetRaw += amount;
		row.targetTrades += 1;
	}
}

function formatUnits(value, decimals) {
	if (decimals === 0) {
		return value.toString();
	}

	const negative = value < 0n;
	const absValue = negative ? -value : value;
	const base = absValue.toString().padStart(decimals + 1, "0");
	const whole = base.slice(0, base.length - decimals) || "0";
	const fraction = base.slice(base.length - decimals).replace(/0+$/, "");
	const formatted = fraction ? whole + "." + fraction : whole;
	return negative ? "-" + formatted : formatted;
}

function csvEscape(value) {
	const str = String(value);
	if (str.indexOf(",") >= 0 || str.indexOf('"') >= 0 || str.indexOf("\n") >= 0) {
		return '"' + str.replace(/"/g, '""') + '"';
	}
	return str;
}

async function main() {
	const options = parseArgs(process.argv);

	if (options.help) {
		printUsage();
		return;
	}

	if (!options.rpc) {
		throw new Error("Missing --rpc. Example: --rpc https://public-node.rsk.co");
	}

	const addressesPath = normalizeOutputPath(options.addressesFile);
	if (!fs.existsSync(addressesPath)) {
		throw new Error("Addresses file not found: " + addressesPath);
	}

	const web3 = new Web3(options.rpc);
	const inputEntries = loadInputAddresses(addressesPath);
	if (inputEntries.length === 0) {
		throw new Error("No addresses found in file: " + addressesPath);
	}

	console.log("Loaded", inputEntries.length, "address entries from", addressesPath);
	console.log("Resolving converter contracts...");

	const resolved = await resolveConverters(web3, inputEntries);
	if (resolved.converters.length === 0) {
		throw new Error("Could not resolve any converter addresses from the provided file.");
	}

	console.log("Resolved", resolved.converters.length, "unique converter contracts.");
	if (resolved.skipped.length > 0) {
		console.log("Skipped", resolved.skipped.length, "addresses that are neither converters nor pool tokens.");
	}

	const latestBlock = Number(await withRetries(() => web3.eth.getBlockNumber(), "getBlockNumber", 4));
	const toBlock = Number.isFinite(options.toBlock) ? options.toBlock : latestBlock;
	if (toBlock > latestBlock) {
		throw new Error("--to-block cannot be greater than latest block (" + latestBlock + ")");
	}

	let startTimestamp;
	if (options.startDate) {
		const parsed = new Date(options.startDate);
		if (isNaN(parsed.getTime())) {
			throw new Error("Invalid --start-date: " + options.startDate);
		}
		startTimestamp = Math.floor(parsed.getTime() / 1000);
	} else {
		const now = new Date();
		now.setUTCMonth(now.getUTCMonth() - options.months);
		startTimestamp = Math.floor(now.getTime() / 1000);
	}

	let fromBlock;
	if (Number.isFinite(options.fromBlock)) {
		fromBlock = options.fromBlock;
	} else {
		console.log("Locating start block for timestamp", startTimestamp, "...");
		fromBlock = await findBlockByTimestamp(web3, startTimestamp, toBlock);
	}

	if (fromBlock > toBlock) {
		throw new Error("fromBlock > toBlock (" + fromBlock + " > " + toBlock + ")");
	}

	const chunkSize = Number(options.chunkSize);
	if (!Number.isFinite(chunkSize) || chunkSize <= 0) {
		throw new Error("Invalid --chunk: " + options.chunkSize);
	}

	const topicOld = web3.utils.sha3("Conversion(address,address,address,uint256,uint256,int256)");
	const topicNew = web3.utils.sha3("Conversion(address,address,address,uint256,uint256,int256,int256)");
	const oldTopicLower = topicOld.toLowerCase();
	const newTopicLower = topicNew.toLowerCase();

	const converterAddresses = resolved.converters.map((c) => c.converter);
	const tokenSet = new Set();
	const volumeMap = new Map();
	const blockTsCache = new Map();
	let totalLogs = 0;

	console.log("Reading reserve tokens from converters...");
	for (const converter of converterAddresses) {
		try {
			const reserves = await withRetries(
				() => getReserveTokens(web3, converter),
				"getReserveTokens:" + converter,
				4
			);
			for (const token of reserves) {
				tokenSet.add(toLowerAddress(token));
			}
		} catch (error) {
			console.error("Warning: could not read reserves for converter", converter, "-", error.message);
		}
	}

	async function getBlockTimestamp(blockNumber) {
		if (blockTsCache.has(blockNumber)) {
			return blockTsCache.get(blockNumber);
		}
		const block = await withRetries(() => web3.eth.getBlock(blockNumber), "getBlockTs:" + blockNumber, 4);
		const ts = Number(block.timestamp);
		blockTsCache.set(blockNumber, ts);
		return ts;
	}

	console.log(
		"Scanning Conversion logs from block",
		fromBlock,
		"to",
		toBlock,
		"in chunks of",
		chunkSize,
		"..."
	);

	for (let current = fromBlock; current <= toBlock; current += chunkSize) {
		const end = Math.min(current + chunkSize - 1, toBlock);
		const logs = await withRetries(
			() =>
				web3.eth.getPastLogs({
					fromBlock: current,
					toBlock: end,
					address: converterAddresses,
					topics: [[topicOld, topicNew]],
				}),
			"getPastLogs:" + current + "-" + end,
			4
		);

		totalLogs += logs.length;

		const blocksInChunk = new Set();
		for (const log of logs) {
			blocksInChunk.add(Number(log.blockNumber));
		}

		for (const blockNumber of blocksInChunk) {
			await getBlockTimestamp(blockNumber);
		}

		for (const log of logs) {
			const topic = (log.topics[0] || "").toLowerCase();
			let decoded;
			if (topic === oldTopicLower) {
				decoded = web3.eth.abi.decodeLog(CONVERSION_EVENT_OLD.inputs, log.data, log.topics.slice(1));
			} else if (topic === newTopicLower) {
				decoded = web3.eth.abi.decodeLog(CONVERSION_EVENT_NEW.inputs, log.data, log.topics.slice(1));
			} else {
				continue;
			}

			const blockTs = blockTsCache.get(Number(log.blockNumber));
			const monthKey = asMonthKey(blockTs);

			const fromToken = toLowerAddress(decoded._fromToken);
			const toToken = toLowerAddress(decoded._toToken);
			tokenSet.add(fromToken);
			tokenSet.add(toToken);

			addVolume(volumeMap, fromToken, monthKey, "source", decoded._amount);
			addVolume(volumeMap, toToken, monthKey, "target", decoded._return);
		}

		console.log(
			"Processed blocks",
			current + "-" + end,
			"| logs:",
			logs.length,
			"| cumulative:",
			totalLogs
		);
	}

	console.log("Resolved token metadata...");
	const tokenMeta = new Map();
	for (const tokenLower of tokenSet) {
		const meta = await withRetries(() => fetchTokenMeta(web3, tokenLower), "tokenMeta:" + tokenLower, 3);
		tokenMeta.set(tokenLower, meta);
	}

	const endBlockData = await withRetries(() => web3.eth.getBlock(toBlock), "getEndBlock", 4);
	const endTimestamp = Number(endBlockData.timestamp);
	const monthKeys = buildMonthRange(startTimestamp, endTimestamp);

	const sortedTokens = Array.from(tokenMeta.entries()).sort(function (a, b) {
		const as = (a[1].symbol || "").toUpperCase();
		const bs = (b[1].symbol || "").toUpperCase();
		if (as < bs) return -1;
		if (as > bs) return 1;
		if (a[0] < b[0]) return -1;
		if (a[0] > b[0]) return 1;
		return 0;
	});

	const csvRows = [];
	csvRows.push(
		[
			"month",
			"token_symbol",
			"token_address",
			"source_volume",
			"target_volume",
			"total_volume",
			"source_trades",
			"target_trades",
			"total_trades",
		].join(",")
	);

	const jsonRows = [];
	let nonZeroRows = 0;

	for (const tokenEntry of sortedTokens) {
		const tokenLower = tokenEntry[0];
		const meta = tokenEntry[1];
		for (const monthKey of monthKeys) {
			const key = tokenLower + "|" + monthKey;
			const row = volumeMap.get(key) || {
				sourceRaw: 0n,
				targetRaw: 0n,
				sourceTrades: 0,
				targetTrades: 0,
			};

			const totalRaw = row.sourceRaw + row.targetRaw;
			const totalTrades = row.sourceTrades + row.targetTrades;
			if (totalRaw > 0n) {
				nonZeroRows += 1;
			}

			const sourceVolume = formatUnits(row.sourceRaw, meta.decimals);
			const targetVolume = formatUnits(row.targetRaw, meta.decimals);
			const totalVolume = formatUnits(totalRaw, meta.decimals);

			csvRows.push(
				[
					csvEscape(monthKey),
					csvEscape(meta.symbol),
					csvEscape(meta.address),
					csvEscape(sourceVolume),
					csvEscape(targetVolume),
					csvEscape(totalVolume),
					csvEscape(row.sourceTrades),
					csvEscape(row.targetTrades),
					csvEscape(totalTrades),
				].join(",")
			);

			if (options.jsonOutFile) {
				jsonRows.push({
					month: monthKey,
					token_symbol: meta.symbol,
					token_address: meta.address,
					source_volume: sourceVolume,
					target_volume: targetVolume,
					total_volume: totalVolume,
					source_trades: row.sourceTrades,
					target_trades: row.targetTrades,
					total_trades: totalTrades,
				});
			}
		}
	}

	const outPath = normalizeOutputPath(options.outFile);
	fs.writeFileSync(outPath, csvRows.join("\n") + "\n");
	console.log("Wrote CSV:", outPath);

	if (options.jsonOutFile) {
		const jsonPath = normalizeOutputPath(options.jsonOutFile);
		fs.writeFileSync(jsonPath, JSON.stringify(jsonRows, null, 2) + "\n");
		console.log("Wrote JSON:", jsonPath);
	}

	console.log("Summary:");
	console.log("  converters:", converterAddresses.length);
	console.log("  tokens:", sortedTokens.length);
	console.log("  logs:", totalLogs);
	console.log("  rows:", csvRows.length - 1);
	console.log("  non_zero_rows:", nonZeroRows);
}

main().catch((error) => {
	console.error("Error:", error.message);
	process.exit(1);
});
