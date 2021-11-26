const fs = require("fs");
const path = require("path");
const Web3 = require("web3");

//path from current dir
const CFG_FILE_NAME = process.argv[2];

const ARTIFACTS_DIR = path.resolve(__dirname, "../build/contracts");
const MIN_GAS_LIMIT = 100000;
const ZERO_ADDRESS = "0x0";

let web3;
let gasPrice;
let account;
let multiSigWallet;

const initialiseWeb3 = async () => {
	const nodeURL = getConfig().nodeURL;
	const privateKey = getConfig().privateKey;
	web3 = new Web3(nodeURL);
	gasPrice = await getGasPrice(web3);
	account = await web3.eth.accounts.privateKeyToAccount(privateKey);
};

const getConfig = () => {
	return JSON.parse(fs.readFileSync(path.join(__dirname, CFG_FILE_NAME), { encoding: "utf8" }));
};

const setConfig = (record) => {
	fs.writeFileSync(path.join(__dirname, CFG_FILE_NAME), JSON.stringify({ ...getConfig(), ...record }, null, 4));
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
		const hash = await scan("Enter transaction-hash or leave empty to retry:");
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
				value: value
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

let converterIndex = 0;

const deploy = async (web3, account, gasPrice, contractId, contractName, contractArgs) => {
	if (getConfig()[contractId] === undefined || contractId === "Oracle") {
		const buildFile = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".json"), { encoding: "utf8" }));

		const contract = new web3.eth.Contract(buildFile.abi);
		const options = { data: buildFile.bytecode, arguments: contractArgs };
		const transaction = contract.deploy(options);
		const receipt = await send(web3, account, gasPrice, transaction);
		const args = transaction.encodeABI().slice(options.data.length);
		console.log(`${contractId} deployed at ${receipt.contractAddress}`);

		let configName = contractId;
		if (contractId === "Oracle") configName = `${contractId}${converterIndex++}`;

		setConfig({ [configName]: { name: contractName, addr: receipt.contractAddress, args: args } });
		return deployed(web3, contractName, receipt.contractAddress);
	}
	return deployed(web3, contractName, getConfig()[contractId].addr);
};

const deployed = (web3, contractName, contractAddr) => {
	const buildFile = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".json"), { encoding: "utf8" }));
	return new web3.eth.Contract(buildFile.abi, contractAddr);
};

const web3Func = (func, ...args) => func(web3, account, gasPrice, ...args);
const execute = async (transaction, ...args) => {
	return await web3Func(send, transaction, ...args);
};

const getConverters = async (upgrader) => {
	// For versions 11 or higher, we just call upgrade on the converter.
	let events = await upgrader.getPastEvents("ConverterUpgrade", { fromBlock: getConfig().block });

	let converters = [];
	for (let event of events) {
		converters[event.returnValues._oldConverter.toString().toLowerCase()] = event.returnValues._newConverter;
	}

	return converters;

	// For previous versions we transfer ownership to the upgrader, then call upgradeOld on the upgrader,
	// then accept ownership of the new and old converter. The end results should be the same.
	/*    
  await execute(oldConverter.methods.transferOwnership(upgrader._address));
  await execute(upgrader.methods.upgradeOld(oldConverter._address, web3.utils.asciiToHex('')));

  let events = await upgrader.getPastEvents('ConverterUpgrade');
  let newConverterAddress = events[0].returnValues._newConverter;
  let newConverter = deployed(web3, newConverterContract, newConverterAddress);
  return newConverter;
  
  await execute(oldConverter.methods.acceptOwnership());
  */
};

const getConverterState = async (converter) => {
	const address = await converter.methods.token().call();
	const smartToken = deployed(web3, "SmartToken", address);
	const converterType = await converter.methods.converterType().call();

	const state = {
		address: converter._address,
		owner: await converter.methods.owner().call(),
		poolTokenOwner: await smartToken.methods.owner().call(),
		newOwner: await converter.methods.newOwner().call(),
		conversionFee: await converter.methods.conversionFee().call(),
		maxConversionFee: await converter.methods.maxConversionFee().call(),
		converterType: converterType,
		reserveTokenCount: await converter.methods.connectorTokenCount().call(),
		reserveTokens: []
	};

	state.poolToken = {
		address: address,
		name: await smartToken.methods.name().call(),
		symbol: await smartToken.methods.symbol().call()
	};

	for (let i = 0; i < state.reserveTokenCount; i++) {
		const address = await converter.methods.connectorTokens(i).call();
		const token = deployed(web3, "ERC20Token", address);

		state.reserveTokens[i] = {
			address,
			name: await token.methods.name().call(),
			balance: await converter.methods.getConnectorBalance(address).call()
		};
	}

	if (converterType == 2) {
		const priceOracleAddres = await converter.methods.priceOracle().call();
		state.priceOracle = priceOracleAddres;
		if (priceOracleAddres === ZERO_ADDRESS) {
			state.tokenAOracle = ZERO_ADDRESS;
			state.tokenBOracle = ZERO_ADDRESS;
		} else {
			const priceOracle = deployed(web3, "PriceOracle", priceOracleAddres);
			state.tokenAOracle = await priceOracle.methods.tokenAOracle().call();
			state.tokenBOracle = await priceOracle.methods.tokenBOracle().call();
		}

		for (let i = 0; i < state.reserveTokenCount; i++) {
			state.reserveTokens[i].stakedBalance = await converter.methods.reserveStakedBalance(state.reserveTokens[i].address).call();
			state.reserveTokens[i].reserveWeight = await converter.methods.reserveWeight(state.reserveTokens[i].address).call();
		}
	}

	return state;
};

const submitTransaction = async (data, contractAddress) => {
	const receipt = await execute(multiSigWallet.methods.submitTransaction(contractAddress, 0, data));
	const transactionId = receipt.logs[0].topics[1];
	console.log("Transaction ID:", parseInt(transactionId));
};

/**
 * Used to upgrade v1 pools: (step 1)
 * 1. Deploys a new factory and register it in ConverterFactory. (is a multisig transaction)
 * 2. Check if converter owner is multisig, transfers ownership if not. (is a multisig transaction)
 * 3. Execute upgrade converter on old converter and creates a transaction for multisig to be executed. (is a multisig transaction)
 */
const upgrade = async () => {
	await initialiseWeb3();

	const config = getConfig();

	multiSigWallet = deployed(web3, config.multiSigWallet.name, config.multiSigWallet.addr);
	const converterFactory = deployed(web3, "ConverterFactory", config.converterFactory.addr);

	//will read the typed factory from the config. if not present, a new one is deployed 
	if (config[`liquidityPoolV${config.type}ConverterFactory`] === undefined) {
		let registerFactoryTxn;
		if (config.type === 1) {
			console.log("Redeploying v1 factory contract");
			const liquidityPoolV1ConverterFactory = await web3Func(deploy, "liquidityPoolV1ConverterFactory", "LiquidityPoolV1ConverterFactory", []);
			registerFactoryTxn = converterFactory.methods.registerTypedConverterFactory(liquidityPoolV1ConverterFactory._address).encodeABI();
		} else if (config.type === 2) {
			console.log("Redeploying v2 factory contract");
			const liquidityPoolV2ConverterFactory = await web3Func(deploy, "liquidityPoolV2ConverterFactory", "LiquidityPoolV2ConverterFactory", []);
			registerFactoryTxn = converterFactory.methods.registerTypedConverterFactory(liquidityPoolV2ConverterFactory._address).encodeABI();
		}

		// register factory
		console.log("Updating factory contract in registry");
		await submitTransaction(registerFactoryTxn, config.converterFactory.addr);
	}

	//for each converter in the list
	// 1. transfer the ownership to multisig if it doesn't belong to the multisig yet
	// 2. upgrades the converter
	for (let converter of config.converterContract.addr) {
		const oldConverter = deployed(web3, config.converterContract.name, converter);

		let multisigAddress =
			config.multiSigWallet.addr.substring(0, 2) === "0x"
				? config.multiSigWallet.addr.slice(2).toLowerCase()
				: config.multiSigWallet.addr.toLowerCase();

		let owner = (await oldConverter.methods.owner().call()).toString().toLowerCase();
		owner = owner.substring(0, 2) === "0x" ? owner.slice(2) : owner;

		if (owner !== multisigAddress) {
			console.log("Updating Owner");
			await execute(oldConverter.methods.transferOwnership(config.multiSigWallet.addr));
			await submitTransaction(oldConverter.methods.acceptOwnership().encodeABI(), converter);
		}

		console.log("Upgrading converter:", converter);
		await submitTransaction(oldConverter.methods.upgrade().encodeABI(), converter);
	}
};

/**
 * Step 2
 * Deploy and setup the oracle
 * Accept the ownership of the new converter + oracle with the multisig
 */
const setupPool = async () => {
	await initialiseWeb3();

	const config = getConfig();

	multiSigWallet = deployed(web3, config.multiSigWallet.name, config.multiSigWallet.addr);
	const upgrader = deployed(web3, "ConverterUpgrader", config.converterUpgrader.addr);

	const newConverters = await getConverters(upgrader);

	for (let converter of config.converterContract.addr) {
		const newConverter = deployed(web3, `LiquidityPoolV${config.type}Converter`, newConverters[converter.toString().toLowerCase()]);
		console.log("\nThe new converter address:", newConverter._address);
		console.log("Accepting converter ownership");
		await submitTransaction(newConverter.methods.acceptOwnership().encodeABI(), newConverter._address);

		if (config.type === 1 && process.argv[5] == 1) {
			console.log("Deploying Oracle");
			const oracle = await web3Func(deploy, "Oracle", "Oracle", [newConverter._address, config.btcAddress]);

			console.log("Setting k", config.k);
			await execute(oracle.methods.setK(config.k));

			console.log("Setting oracle in converter", oracle._address);
			await submitTransaction(newConverter.methods.setOracle(oracle._address).encodeABI(), newConverter._address);

			console.log("Updating oracle ownership");
			await execute(oracle.methods.transferOwnership(multiSigWallet._address));
			await submitTransaction(oracle.methods.acceptOwnership().encodeABI(), oracle._address);
		}

		//note: public RSK testnet node gave an method not allowed error here
		const oldConverter = deployed(web3, `LiquidityPoolV${config.type}Converter`, converter);
		const oldConverterStateAfter = await getConverterState(oldConverter);
		console.log("The old converter state:", oldConverterStateAfter, "\n");

		const newConverterStateAfter = await getConverterState(newConverter);
		console.log("The new converter state after upgrading:", newConverterStateAfter, "\n");
	}
};

const deploySwapSettings = async () => {
	await initialiseWeb3();
	const config = getConfig();

	multiSigWallet = deployed(web3, config.multiSigWallet.name, config.multiSigWallet.addr);

	console.log("Deploying Swap Settings");
	const swapSettings = await web3Func(deploy, "SwapSettings", "SwapSettings", [
		config.feesController.addr,
		config.wrbtcAddress.addr,
		config.sovAddress.addr,
		"50000000000000000"
	]);

	// Register swap settings in contract registry
	const contractRegistry = await deployed(web3, "ContractRegistry", config.contractRegistry.addr);
	
	const contractRegistryTxn = contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SwapSettings"), swapSettings._address).encodeABI();
	await submitTransaction(contractRegistryTxn, config.contractRegistry.addr);

	// Transferring the ownership of swap settings
	await execute(swapSettings.methods.transferOwnership(config.multiSigWallet.addr));
	await submitTransaction(swapSettings.methods.acceptOwnership().encodeABI(), swapSettings._address);


	// TEST
	// swapSettingsObj = await deployed(web3, "SwapSettings", config.SwapSettings.addr);
	// console.log(await swapSettingsObj.methods.protocolFee().call());
	// console.log(await swapSettingsObj.methods.wrbtcAddress().call());
	// console.log(await swapSettingsObj.methods.sovTokenAddress().call());
	// console.log(await swapSettingsObj.methods.feesController().call());

	// // Get converter settings
	// for (let converter of config.converterContract.addr) {
	// 	const oldConverter = deployed(web3, config.converterContract.name, converter);

	// 	let multisigAddress =
	// 		config.multiSigWallet.addr.substring(0, 2) === "0x"
	// 			? config.multiSigWallet.addr.slice(2).toLowerCase()
	// 			: config.multiSigWallet.addr.toLowerCase();

	// 	let owner = (await oldConverter.methods.owner().call()).toString().toLowerCase();
	// 	owner = owner.substring(0, 2) === "0x" ? owner.slice(2) : owner;

	// 	if (owner !== multisigAddress) {
	// 		console.log("Updating Owner");
	// 		await execute(oldConverter.methods.transferOwnership(config.multiSigWallet.addr));
	// 		await submitTransaction(oldConverter.methods.acceptOwnership().encodeABI(), converter);
	// 	}

	// 	console.log("Protocol fee: ", converter);
	// 	console.log("Protocol Fee: ", await oldConverter.methods.getProtocolFeeFromSwapSettings().call());
	// 	console.log("Wrbtc: ", await oldConverter.methods.getWrbtcAddressFromSwapSettings().call());
	// 	console.log("SOV: ", await oldConverter.methods.getSOVTokenAddressFromSwapSettings().call());
	// 	console.log("FeesController: ", await oldConverter.methods.getFeesControllerFromSwapSettings().call());

	// }

	// END TEST

	// // Set conversion fee
	// for (let converter of config.converterContract.addr) {
	// 	const oldConverter = deployed(web3, config.converterContract.name, converter);

	// 	let multisigAddress =
	// 		config.multiSigWallet.addr.substring(0, 2) === "0x"
	// 			? config.multiSigWallet.addr.slice(2).toLowerCase()
	// 			: config.multiSigWallet.addr.toLowerCase();

	// 	let owner = (await oldConverter.methods.owner().call()).toString().toLowerCase();
	// 	owner = owner.substring(0, 2) === "0x" ? owner.slice(2) : owner;

	// 	if (owner !== multisigAddress) {
	// 		console.log("Updating Owner");
	// 		await execute(oldConverter.methods.transferOwnership(config.multiSigWallet.addr));
	// 		await submitTransaction(oldConverter.methods.acceptOwnership().encodeABI(), converter);
	// 	}

	// 	// console.log(await oldConverter.methods.conversionFee().call());

	// 	console.log("Upgrade converter fees: ", converter);
	// 	await submitTransaction(oldConverter.methods.setConversionFee("2500").encodeABI(), converter);
	// }

	// // set protocol fee
	// await submitTransaction(sovrynSwapNetwork.methods.setProtocolFee("50000000000000000").encodeABI(), sovrynSwapNetwork._address);
}

const run = async (toExecute, toDeploySwapSettings) => {
	if (toExecute == 1) {
		await upgrade();
	} else {
		await setupPool();
	}

	if(toDeploySwapSettings == 1) {
		await deploySwapSettings();
	}
};

// argv[3] = config type
// argv[4] = redeploy sovryn swap network
// argv[5] = deploy oracle
run(process.argv[3], process.argv[4]);
