const fs = require("fs");
const path = require("path");
const Web3 = require("web3");

const TOKEN_NAME = process.argv[2];
const NETWORK = process.argv[3];
const NODE_ADDRESS = process.argv[5];
const PRIVATE_KEY = process.argv[6];

const ARTIFACTS_DIR = path.resolve(__dirname, "../build");

const MIN_GAS_LIMIT = 100000;
const TOKEN_CONFIG_FILENAME = `config_${NETWORK}_${TOKEN_NAME}.json`;
const DATA_FILENAME = `add_${TOKEN_NAME}.json`;
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

let web3;
let gasPrice;
let account;
let phase = 0;

const initialiseWeb3 = async () => {
	const nodeURL = NODE_ADDRESS;
	const privateKey = PRIVATE_KEY;
	web3 = new Web3(nodeURL);
	account = await web3.eth.accounts.privateKeyToAccount(privateKey);
	gasPrice = await getGasPrice(web3);
}

const getConfig = () => {
	return JSON.parse(fs.readFileSync(path.join(__dirname, TOKEN_CONFIG_FILENAME), { encoding: "utf8" }));
};

const setConfig = (record) => {
	fs.writeFileSync(path.join(__dirname, DATA_FILENAME), JSON.stringify({ ...getConfig(), ...record }, null, 4));
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
		const buildFile = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".json"), { encoding: "utf8" }));
		const contract = new web3.eth.Contract(abi);
		const options = { data: bin, arguments: contractArgs };
		const transaction = contract.deploy(options);
		const receipt = await send(web3, account, gasPrice, transaction);
		const args = transaction.encodeABI().slice(options.data.length);
		console.log(`${contractId} deployed at ${receipt.contractAddress}`);
		setConfig({ [contractId]: { name: contractName, addr: receipt.contractAddress, args: args } });
	}
	return deployed(web3, contractName, getConfig()[contractId].addr);
};

const deployed = (web3, contractName, contractAddr) => {
	const buildFile = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".json"), { encoding: "utf8" }));
	return new web3.eth.Contract(buildFile.abi, contractAddr);
};

const decimalToInteger = (value, decimals) => {
	const parts = [...value.split("."), ""];
	return parts[0] + parts[1].padEnd(decimals, "0");
};

const percentageToPPM = (value) => {
	return decimalToInteger(value.replace("%", ""), 4);
};

const web3Func = (func, ...args) => func(web3, account, gasPrice, ...args);
const addresses = { ETH: Web3.utils.toChecksumAddress("0x".padEnd(42, "e")) };
const tokenDecimals = { ETH: 18 };

const addConverter = async (tokenOracleName, oracleMockName, oracleMockValue, oracleMockHas) => {
	await initialiseWeb3();

	if (getConfig().phase === undefined) {
		setConfig({ phase });
	}

	const converterRegistry = await deployed(web3, "ConverterRegistry", getConfig().converterRegistry.addr);
	const oracleWhitelist = await deployed(web3, "Whitelist", getConfig().oracleWhitelist.addr);

	//this block is just relevant for v2 pools
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

	//read reserve data from the config or deploy new tokens if not defined
	for (const reserve of getConfig().reserves) {
		if (reserve.address) {
			addresses[reserve.symbol] = reserve.address;
			tokenDecimals[reserve.symbol] = reserve.decimals;
			setConfig({ [reserve.symbol]: { name: reserve.symbol, addr: reserve.address } });
		} else {
			t = await web3Func(deploy, reserve.symbol, "ERC20Token", [
				reserve.symbol,
				reserve.symbol,
				reserve.decimals,
				decimalToInteger("10000", reserve.decimals),
			]);
			tokenDecimals[reserve.symbol] = reserve.decimals;
			addresses[reserve.symbol] = t._address;
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
		if (getConfig()["phase"] > 0) console.log(`Restarting from phase #${getConfig()["phase"]}`);

		let newConverter;
		//if the script breaks during execution, run it again, it will resume from the point of failure automagically
		if (getConfig()["phase"] < 2) {
			newConverter = await converterRegistry.methods.newConverter(type, name, symbol, decimals, "1000000", tokens, weights).call();
		} else {
			newConverter = getConfig()[`newLiquidityPoolV${type}Converter`].addr;
			console.log("Using previously created converter  ", newConverter);
		}

		await execute(converterRegistry.methods.newConverter(type, name, symbol, decimals, "1000000", tokens, weights));
		await execute(converterRegistry.methods.setupConverter(type, tokens, weights, newConverter));
		
		console.log("New Converter is  ", newConverter);
		setConfig({ [`newLiquidityPoolV${type}Converter`]: { name: `LiquidityPoolV${type}Converter`, addr: newConverter, args: "" } });

		console.log("Calling anchors");
		console.log(await converterRegistry.methods.getAnchors().call());

		const anchor = deployed(web3, "IConverterAnchor", (await converterRegistry.methods.getAnchors().call()).slice(-1)[0]);

		console.log("Anchor Taken: ", anchor._address)

		const converterBase = deployed(web3, "ConverterBase", newConverter);

		console.log("Now executing the settings on " + converterBase._address);
		await execute(converterBase.methods.acceptOwnership());
		console.log("Done with ownership acceptance");
		await execute(converterBase.methods.setConversionFee(fee));
		console.log("Done with conversion fee");

		if (type === 1) {
			console.log("Deploying Oracle");
			const oracle = await web3Func(deploy, "Oracle", "Oracle", [converterBase._address, getConfig().btcAddress]);

			console.log("Setting k", getConfig().k);
			await execute(oracle.methods.setK(getConfig().k));

			console.log("Setting oracle in converter", oracle._address);
			const liquidityV1PoolConverter = deployed(web3, "LiquidityPoolV1Converter", converterBase._address);
			await execute(liquidityV1PoolConverter.methods.setOracle(oracle._address));
			console.log("Done with adding oracle");

			console.log("Updating oracle ownership");
			await execute(oracle.methods.transferOwnership(multiSigWallet._address));	
		}

		//adding the liquidity and thereby seeting the price
		if (type !== 0 && amounts.every((amount) => amount > 0)) {
			for (let i = 0; i < converter.reserves.length; i++) {
				const reserve = converter.reserves[i];

				console.log("Approving amount for ERC20Token: " + amounts[i]);
				await execute(deployed(web3, "ERC20Token", tokens[i]).methods.approve(converterBase._address, amounts[i]));
				let availableBalance = await deployed(web3, "ERC20Token", tokens[i]).methods.balanceOf(account.address).call();
				console.log("available balance: ");
				console.log(availableBalance);

				if (type == 2) {
					if (!reserve.oracle) {
						const oracleName = reserve.symbol === "RBTC" ? "MocBTCToUSDOracle" : tokenOracleName;
						//mocMedianizerMockUSDtoBTC is actually returning BTCtoUSD
						const mocOracleArgs =
							oracleName === "MocBTCToUSDOracle" ? [getConfig().mocMedianizerMockUSDtoBTC.addr] : [underlyingOracleAddress];
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
				console.log("adding liquidity");
				console.log("tokens:");
				console.log(tokens);
				console.log("amounts:");
				console.log(amounts);
				console.log("converterBase._address:");
				console.log(converterBase._address);
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
} else if (TOKEN_NAME === "USDT") {
	addConverter("MocBTCToBTCOracle");
} else {
	addConverter();
}
