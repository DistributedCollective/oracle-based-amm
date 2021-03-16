const fs = require("fs");
const path = require("path");
const Web3 = require("web3");

const TOKEN_NAME = process.argv[2];
const NODE_ADDRESS = process.argv[3];
const PRIVATE_KEY = process.argv[4];

const ARTIFACTS_DIR = path.resolve(__dirname, "../build");

const MIN_GAS_LIMIT = 100000;

String.prototype.replaceAll = function (exp, newStr) {
	return this.replace(new RegExp(exp, "gm"), newStr);
};

String.prototype.format = function (args) {
	var result = this;
	if (arguments.length < 1) {
		return result;
	}

	var data = arguments;
	if (arguments.length == 1 && typeof args == "object") {
		data = args;
	}
	for (var key in data) {
		var value = data[key];
		if (undefined != value) {
			result = result.replaceAll("\\{" + key + "\\}", value);
		}
	}
	return result;
};

const getConfig = () => {
	return JSON.parse(fs.readFileSync(path.join(__dirname, "add{token}.json".format({ token: TOKEN_NAME })), { encoding: "utf8" }));
};

const getData = () => {
	return JSON.parse(fs.readFileSync("./config_rsk.json", { encoding: "utf8" }));
};

const setConfig = (record) => {
	fs.writeFileSync(path.join(__dirname, "add{token}.json".format({ token: TOKEN_NAME })), JSON.stringify({ ...getConfig(), ...record }, null, 4));
};

const scan = async (message) => {
	process.stdout.write(message);
	return await new Promise((resolve, reject) => {
		process.stdin.resume();
		process.stdin.once("data", (data) => {
			process.stdin.pause();
			resolve(data.toString().trim());
		});
	});
};

const getGasPrice = async (web3) => {
	while (true) {
		const nodeGasPrice = await web3.eth.getGasPrice();
		const userGasPrice = await scan(`Enter gas-price or leave empty to use ${nodeGasPrice}: `);
		if (/^\d+$/.test(userGasPrice)) {
			return userGasPrice;
		}
		if (userGasPrice === "") {
			return nodeGasPrice;
		}
		console.log("Illegal gas-price");
	}
};

const getTransactionReceipt = async (web3) => {
	while (true) {
		const hash = await scan("Enter transaction-hash or leave empty to retry: ");
		if (/^0x([0-9A-Fa-f]{64})$/.test(hash)) {
			const receipt = await web3.eth.getTransactionReceipt(hash);
			if (receipt) {
				return receipt;
			}
			console.log("Invalid transaction-hash");
		} else if (hash) {
			console.log("Illegal transaction-hash");
		} else {
			return null;
		}
	}
};

const send = async (web3, account, gasPrice, transaction, value = 0) => {
	while (true) {
		try {
			const gasEstimate = await transaction.estimateGas({ from: account.address, value: value });
			console.log("gasEstimate: " + gasEstimate, " - value - ", value);
			const tx = {
				to: transaction._parent._address,
				data: transaction.encodeABI(),
				gas: Math.max(await transaction.estimateGas({ from: account.address, value: value }), MIN_GAS_LIMIT),
				gasPrice: gasPrice || (await getGasPrice(web3)),
				chainId: await web3.eth.net.getId(),
				value: value,
			};
			const signed = await web3.eth.accounts.signTransaction(tx, account.privateKey);
			const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
			return receipt;
		} catch (error) {
			console.log(error.message);
			const receipt = await getTransactionReceipt(web3);
			if (receipt) {
				return receipt;
			}
		}
	}
};

const deploy = async (web3, account, gasPrice, contractId, contractName, contractArgs) => {
	if (getConfig()[contractId] === undefined) {
		const abi = fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".abi"), { encoding: "utf8" });
		const bin = fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".bin"), { encoding: "utf8" });
		const contract = new web3.eth.Contract(JSON.parse(abi));
		const options = { data: "0x" + bin, arguments: contractArgs };
		const transaction = contract.deploy(options);
		const receipt = await send(web3, account, gasPrice, transaction);
		const args = transaction.encodeABI().slice(options.data.length);
		console.log(`${contractId} deployed at ${receipt.contractAddress}`);
		setConfig({ [contractId]: { name: contractName, addr: receipt.contractAddress, args: args } });
	}
	return deployed(web3, contractName, getConfig()[contractId].addr);
};

const deployed = (web3, contractName, contractAddr) => {
	const abi = fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".abi"), { encoding: "utf8" });
	return new web3.eth.Contract(JSON.parse(abi), contractAddr);
};

const decimalToInteger = (value, decimals) => {
	const parts = [...value.split("."), ""];
	return parts[0] + parts[1].padEnd(decimals, "0");
};

const percentageToPPM = (value) => {
	return decimalToInteger(value.replace("%", ""), 4);
};

const addConverter = async (tokenOracleName, oracleMockName, oracleMockValue, oracleMockHas) => {
	const web3 = new Web3(NODE_ADDRESS);

	const gasPrice = await getGasPrice(web3);
	const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
	const web3Func = (func, ...args) => func(web3, account, gasPrice, ...args);

	const addresses = { ETH: Web3.utils.toChecksumAddress("0x".padEnd(42, "e")) };
	const tokenDecimals = { ETH: 18 };

	let phase = 0;
	if (getConfig().phase === undefined) {
		setConfig({ phase });
	}

	const execute = async (transaction, ...args) => {
		if (getConfig().phase === phase++) {
			await web3Func(send, transaction, ...args);
			console.log(`phase ${phase} executed`);
			setConfig({ phase });
		}
	};

	const converterRegistry = await deployed(web3, "ConverterRegistry", getData().converterRegistry.addr);
	const oracleWhitelist = await deployed(web3, "Whitelist", getData().oracleWhitelist.addr);

	let underlyingOracleAddress = [];
	if (oracleMockName != undefined) {
		//if underlying address is defined, use it
		if (getConfig().underlyingOracleAddress !== undefined) {
			underlyingOracleAddress = getConfig().underlyingOracleAddress;
		}
		//else deploy a mockup
		else {
			console.log("deploying a mockup");
			const oracleMock = await web3Func(deploy, oracleMockName, oracleMockName, []);
			underlyingOracleAddress = oracleMock._address;
			if (oracleMockName != undefined) {
				await execute(oracleMock.methods.setValue(oracleMockValue));
			}
			if (oracleMockHas != undefined) {
				await execute(oracleMock.methods.setHas(oracleMockHas));
			}
			const tokenOracle = await web3Func(deploy, tokenOracleName, tokenOracleName, [underlyingOracleAddress]);
		}
	}

	for (const reserve of getConfig().reserves) {
		if (reserve.address) {
			addresses[reserve.symbol] = reserve.address;
			tokenDecimals[reserve.symbol] = reserve.decimals;
		}
	}

	for (const converter of getConfig().converters) {
		const type = converter.type;
		const name = converter.symbol + (type == 0 ? " Liquid Token" : " Liquidity Pool");
		const symbol = converter.symbol;
		const decimals = converter.decimals;
		const fee = percentageToPPM(converter.fee);

		const tokens = converter.reserves.map((reserve) => addresses[reserve.symbol]);
		const weights = converter.reserves.map((reserve) => percentageToPPM(reserve.weight));
		const amounts = converter.reserves.map((reserve) => decimalToInteger(reserve.balance, tokenDecimals[reserve.symbol]));
		const value = 0; // amounts[converter.reserves.findIndex(reserve => reserve.symbol === 'RBTC')];

		console.log("Deploying converter for ", type, " - ", name, " with value ", value);

		//if the script breaks during execution and you need to resume it, comment out this line + set the newConverter to the actual converter
		const newConverter = await converterRegistry.methods.newConverter(type, name, symbol, decimals, "1000000", tokens, weights).call();
		//const newConverter = '0xe4E467D8B5f61b5C83048d857210678eB86730A4';

		await execute(converterRegistry.methods.newConverter(type, name, symbol, decimals, "1000000", tokens, weights));
		await execute(converterRegistry.methods.setupConverter(type, tokens, weights, newConverter));
		console.log("New Converter is  ", newConverter);

		console.log("Calling anchors");
		console.log(await converterRegistry.methods.getAnchors().call());

		const anchor = deployed(web3, "IConverterAnchor", (await converterRegistry.methods.getAnchors().call()).slice(-1)[0]);
		const converterBase = deployed(web3, "ConverterBase", await anchor.methods.owner().call());

		console.log("Now executing the settings on " + converterBase._address);
		await execute(converterBase.methods.acceptOwnership());
		await execute(converterBase.methods.setConversionFee(fee));
		console.log("Done with conversion fee");

		console.log("Done with ownership acceptance");

		if (type !== 0 && amounts.every((amount) => amount > 0)) {
			for (let i = 0; i < converter.reserves.length; i++) {
				const reserve = converter.reserves[i];
				if (reserve.symbol !== "ETH") {
					console.log("Approving amount for ERC20Token: " + amounts[i]);
					await execute(deployed(web3, "ERC20Token", tokens[i]).methods.approve(converterBase._address, amounts[i]));
					let availableBalance = await deployed(web3, "ERC20Token", tokens[i]).methods.balanceOf(account.address).call();
					console.log("available balance: ");
					console.log(availableBalance);
				}

				if (type == 2) {
					if (!reserve.oracle) {
						const oracleName = reserve.symbol === "RBTC" ? "MocBTCToUSDOracle" : tokenOracleName;
						//mocMedianizerMockUSDtoBTC is actually returning BTCtoUSD
						const mocOracleArgs =
							oracleName === "MocBTCToUSDOracle" ? [getData().mocMedianizerMockUSDtoBTC.addr] : [underlyingOracleAddress];
						const mocPriceOracle = await web3Func(
							deploy,
							"mocPriceOracle" + converter.symbol + reserve.symbol,
							oracleName,
							mocOracleArgs
						);
						reserve.oracle = mocPriceOracle._address;
					}
					console.log("reserve.oracle", reserve.oracle);
					await execute(oracleWhitelist.methods.addAddress(reserve.oracle));
				}
			}

			if (type == 1) {
				await execute(deployed(web3, "LiquidityPoolV1Converter", converterBase._address).methods.addLiquidity(tokens, amounts, 1), value);
			} else if (type == 2) {
				const deployedConverter = deployed(web3, "LiquidityPoolV2Converter", converterBase._address);
				await execute(deployedConverter.methods.activate(tokens[0], converter.reserves[0].oracle, converter.reserves[1].oracle));

				for (let i = 0; i < converter.reserves.length; i++) {
					console.log("Adding liquidity for LiquidityPoolV2Converter. ", "For token: ", tokens[i], " with amount ", amounts[i]);
					await execute(deployedConverter.methods.addLiquidity(tokens[i], amounts[i], 1), value);
					console.log("Liquidity added");
				}
			}
		}

		addresses[converter.symbol] = anchor._address;
	}

	console.log("All done");

	if (web3.currentProvider.constructor.name === "WebsocketProvider") {
		web3.currentProvider.connection.close();
	}
};

if (TOKEN_NAME === "BPro") {
	addConverter("BProOracle", "MoCStateMock", "20000000000000000000000");
}

if (TOKEN_NAME === "USDT") {
	addConverter("MocBTCToBTCOracle");
}
