const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const prettier = require("prettier");

const CFG_FILE_NAME = process.argv[2];
const NODE_ADDRESS = process.argv[3];
const PRIVATE_KEY = process.argv[4];
// this flag is true by default 
const flag = process.argv[5] !== 'false' ? true : false;

const ARTIFACTS_DIR = path.resolve(__dirname, "../build");

const MIN_GAS_LIMIT = 100000;

const getConfig = () => {
	return JSON.parse(fs.readFileSync(CFG_FILE_NAME, { encoding: "utf8" }));
};

const setConfig = (record) => {
	fs.writeFileSync(CFG_FILE_NAME, JSON.stringify({ ...getConfig(), ...record }, null, 4));
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

const clean = async (fileName) => {
	// 1. we retreive the content of fileName and store it in a local variable
	let localV = fs.readFileSync(fileName, {encoding:'utf8', flag:'r'});
	let localJson;
	try {
		localJson = JSON.parse(localV);
	} catch (error) {
		console.log('\n the file ' + fileName + '\n needs to be in JSON format');
		return;
	}
	// 2. we create a new local variable and assign it just with the contents of "reserves" and "converters" with previous local variable
	let newLocal = {};
	if (localJson.reserves) newLocal.reserves = localJson.reserves;
	if (localJson.converters) newLocal.converters = localJson.converters;
	newLocal = prettier.format(JSON.stringify(newLocal),{ semi: false, parser: "json" });
	// 3. we create an new file just with the newLocal content
	let foLder = path.dirname(fileName);
	let eXtension = path.extname(fileName);		
	fs.writeFileSync(path.format({
		dir: foLder, name: 'random', ext: eXtension
	}), newLocal);
	// 4. then we rename the new file as the fileName, leaving totally clean that file
	try {
		fs.renameSync(path.format({
			dir: foLder, name: 'random', ext: eXtension
		}), fileName);		
		console.log('\n' + fileName + ' Successfully cleaned \n');
	} catch (err) {
		if (err) throw err;		
	}	
}

const run = async (flag) => {

	console.log('\n please, make sure you provided a valid private key managed by your URL provider \n');

	const web3 = new Web3(NODE_ADDRESS);
	const gasPrice = await getGasPrice(web3);
	const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
	const web3Func = (func, ...args) => func(web3, account, gasPrice, ...args);
	const addresses = { ETH: Web3.utils.toChecksumAddress("0x".padEnd(42, "e")) };
	const tokenDecimals = { ETH: 18 };

	await clean(CFG_FILE_NAME);

	if(!flag) {
		let f = require('./config_rsk.json');
		let g = getConfig();
		let k = Object.keys(f);
		let phase = 0;
		setConfig({ phase });
		for (let i = 3; i < k.length ; i++) {
			if (k[i] != 'newLiquidityPoolV1Converter' && k[i] != 'Oracle' && k[i] != 'oracleWhitelist') {
				g[k[i]] = f[k[i]];
				setConfig({ [k[i]] : g[k[i]] });	
			}
		}
		let conTrol = await scan('\n please check status of config_rsk.json and addUSDSOV.json \n and press enter \n');
	}

	/*
    if (!getConfig().mocMedianizer) {
        throw new Error("MoC Medinizer contract address is undefined");
    }*/

	let phase = 0;
	if (getConfig().phase === undefined) {
		setConfig({ phase });
	}
	const execute = async (transaction, ...args) => {
		console.log('\n the value of "phase" in the .json file is: ' + getConfig().phase + '\n and the actual value of phase is: ' + phase);		
		if (getConfig().phase === phase++) {
			await web3Func(send, transaction, ...args);
			console.log(`phase ${phase} executed`);
			setConfig({ phase });
		}
	};

	// main contracts
	const contractRegistry = await web3Func(deploy, "contractRegistry", "ContractRegistry", []);
	const converterFactory = await web3Func(deploy, "converterFactory", "ConverterFactory", []);
	const sovrynSwapFormula = await web3Func(deploy, "sovrynSwapFormula", "SovrynSwapFormula", []);
	const sovrynSwapNetwork = await web3Func(deploy, "sovrynSwapNetwork", "SovrynSwapNetwork", [contractRegistry._address]);
	const conversionPathFinder = await web3Func(deploy, "conversionPathFinder", "ConversionPathFinder", [contractRegistry._address]);
	const converterUpgrader = await web3Func(deploy, "converterUpgrader", "ConverterUpgrader", [contractRegistry._address, addresses.ETH]);
	const converterRegistry = await web3Func(deploy, "converterRegistry", "ConverterRegistry", [contractRegistry._address]);
	const converterRegistryData = await web3Func(deploy, "converterRegistryData", "ConverterRegistryData", [contractRegistry._address]);
	const liquidTokenConverterFactory = await web3Func(deploy, "liquidTokenConverterFactory", "LiquidTokenConverterFactory", []);
	const liquidityPoolV1ConverterFactory = await web3Func(deploy, "liquidityPoolV1ConverterFactory", "LiquidityPoolV1ConverterFactory", []);
	// console.log("deploy v2")
	// const liquidityPoolV2ConverterFactory = await web3Func(deploy, "liquidityPoolV2ConverterFactory", "LiquidityPoolV2ConverterFactory", []);
	// console.log("deploy v2 a ")
	// const liquidityPoolV2ConverterAnchorFactory = await web3Func(
	// 	deploy,
	// 	"liquidityPoolV2ConverterAnchorFactory",
	// 	"LiquidityPoolV2ConverterAnchorFactory",
	// 	[]
	// );
	// const liquidityPoolV2ConverterCustomFactory = await web3Func(
	// 	deploy,
	// 	"liquidityPoolV2ConverterCustomFactory",
	// 	"LiquidityPoolV2ConverterCustomFactory",
	// 	[]
	// );
	const oracleWhitelist = await web3Func(deploy, "oracleWhitelist", "Whitelist", []);
	console.log('\n converterRegistry contract address: ' + converterRegistry._address);

	const tokens = getConfig().reserves;
	let medianizer = getConfig().mocMedianizer;
	if (!medianizer) {
		//intialize mock MoC Oracle
		const mocMedianizerMockUSDtoBTC = await web3Func(deploy, "mocMedianizerMockUSDtoBTC", "MoCMedianizerMock", []);
		await execute(mocMedianizerMockUSDtoBTC.methods.setValue("10000000000000000000000"));
		await execute(mocMedianizerMockUSDtoBTC.methods.setHas(true));
		medianizer = mocMedianizerMockUSDtoBTC._address;
		//const rbtcToBTC = await web3Func(deploy, 'rbtcToBTC', 'MocBTCToBTCOracle', []);
		//const rbtcToUSD = await web3Func(deploy, 'rbtcToUSD', 'MocBTCToUSDOracle', [mocMedianizerMockUSDtoBTC._address]);
	}

	/*
    // contract deployment for etherscan verification only
    const smartToken = await web3Func(deploy, 'smartToken', 'SmartToken', ["Token1", "RBTC", 18]);
    const smartToken2 = await web3Func(deploy, 'smartToken2', 'SmartToken', ["Token2", "SUSD", 18]);
    const poolTokensContainer = await web3Func(deploy, 'poolTokensContainer', 'PoolTokensContainer', ["Pool", "POOL", 18]);

    await web3Func(deploy, 'priceOracle', 'PriceOracle', [tokens[0].address, tokens[1].address, rbtcToUSD._address, rbtcToBTC._address]);
    await web3Func(deploy, 'liquidTokenConverter', 'LiquidTokenConverter', [smartToken._address, contractRegistry._address, 1000]);
    await web3Func(deploy, 'liquidityPoolV1Converter', 'LiquidityPoolV1Converter', [smartToken2._address, contractRegistry._address, 1000]);
    await web3Func(deploy, 'liquidityPoolV2Converter', 'LiquidityPoolV2Converter', [poolTokensContainer._address, contractRegistry._address, 1000]);
 */

	// initialize contract registry
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("ContractRegistry"), contractRegistry._address));
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("ConverterFactory"), converterFactory._address));
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SovrynSwapFormula"), sovrynSwapFormula._address));
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SovrynSwapNetwork"), sovrynSwapNetwork._address));
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("ConversionPathFinder"), conversionPathFinder._address));
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SovrynSwapConverterUpgrader"), converterUpgrader._address));
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SovrynSwapConverterRegistry"), converterRegistry._address));
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SovrynSwapConverterRegistryData"), converterRegistryData._address));
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("ChainlinkOracleWhitelist"), oracleWhitelist._address));

	// initialize converter factory
	await execute(converterFactory.methods.registerTypedConverterFactory(liquidTokenConverterFactory._address));
	await execute(converterFactory.methods.registerTypedConverterFactory(liquidityPoolV1ConverterFactory._address));
	// await execute(converterFactory.methods.registerTypedConverterFactory(liquidityPoolV2ConverterFactory._address));
	// await execute(converterFactory.methods.registerTypedConverterAnchorFactory(liquidityPoolV2ConverterAnchorFactory._address));
	// await execute(converterFactory.methods.registerTypedConverterCustomFactory(liquidityPoolV2ConverterCustomFactory._address));

	for (const reserve of getConfig().reserves) {
		if (reserve.address) {
			addresses[reserve.symbol] = reserve.address;
			tokenDecimals[reserve.symbol] = reserve.decimals;
			setConfig({ [reserve.symbol]: { name: reserve.symbol, addr: reserve.address } });
		}
		else{
			let t;
			if(reserve.symbol == "RBTC"){
				t = await web3Func(deploy, reserve.symbol, "WRBTC");
				await execute(deployed(web3, "WRBTC", t._address).methods.deposit(), decimalToInteger("10", reserve.decimals));
			}
			else
				t = await web3Func(deploy, reserve.symbol, "ERC20Token", [reserve.symbol, reserve.symbol, reserve.decimals, decimalToInteger("10000", reserve.decimals) ]);
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
		console.log("------------------------------------");
		console.log("tokens:");
		console.log(tokens);
		console.log("------------------------------------")
		const weights = converter.reserves.map((reserve) => percentageToPPM(reserve.weight));
		const amounts = converter.reserves.map((reserve) => decimalToInteger(reserve.balance, tokenDecimals[reserve.symbol]));
		const value = 0; // amounts[converter.reserves.findIndex(reserve => reserve.symbol === 'RBTC')];

		console.log("Deploying converter for ", type, " - ", name, " with value ", value);

		console.log(converterRegistry._address);
		const newConverter = await converterRegistry.methods.newConverter(type, name, symbol, decimals, "1000000", tokens, weights).call();

		await execute(converterRegistry.methods.newConverter(type, name, symbol, decimals, "1000000", tokens, weights));
		console.log('\n why is this transaction repeated?... NEEDS REFACTOR \n');
	
		await execute(converterRegistry.methods.setupConverter(type, tokens, weights, newConverter));
		console.log("New Converter is  ", newConverter);

		console.log("Test1");
		const oracle = await web3Func(deploy, "Oracle", "Oracle", [newConverter, tokens[0]]);
		console.log("Test2");
		setConfig({ [`newLiquidityPoolV${type}Converter`]: { name: `LiquidityPoolV${type}Converter`, addr: newConverter, args: "" } });
		console.log("Test3");

		console.log("Calling anchors");
		console.log('\n the list of anchors: \n' + await converterRegistry.methods.getAnchors().call());

		const anchor = deployed(web3, "IConverterAnchor", (await converterRegistry.methods.getAnchors().call()).slice(-1)[0]);
		const converterBase = deployed(web3, "ConverterBase", newConverter);

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
						const oracleName = reserve.symbol === "RBTC" ? "MocBTCToUSDOracle" : "MocBTCToBTCOracle"; // Uses MocBTCToUSDOracle with an mocked Oracle that return 1000. See mocMedianizerMockUSDtoBTC
						const mocOracleArgs = oracleName === "MocBTCToUSDOracle" ? [medianizer] : [];
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
        const deployedConverter = await deployed(web3, "LiquidityPoolV1Converter", converterBase._address);

        //setup oracle
        await execute(deployedConverter.methods.setOracle(oracle._address));
        await execute(deployedConverter.methods.addLiquidity(tokens, amounts, 1), value);
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

		console.log("x: ", tokens[0])
		const swapSettings = await web3Func(deploy, "swapSettings", "SwapSettings", [tokens[0], tokens[0], tokens[1], 0])
	await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SwapSettings"), swapSettings._address));

		addresses[converter.symbol] = anchor._address;
	}

	if(flag) {
		await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("RBTCToken"), addresses.RBTC));
		await execute(conversionPathFinder.methods.setAnchorToken(addresses.RBTC));
	} else {
		let RBTC_ = require('./config_rsk.json').RBTC.addr;
		if (RBTC_) console.log('\n please, copy - paste this address below: ' + RBTC_);
		// in scan() there are instructions to do this very thing without "seadline-sync"
		let addressWRBTC = await scan('Please, provide the WRBTC address: ');
		addressWRBTC = addressWRBTC.toLowerCase();
		console.log('\n address for WRBTC contract: ' + addressWRBTC + '\n');

		await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("RBTCToken"), addressWRBTC));
		await execute(conversionPathFinder.methods.setAnchorToken(addressWRBTC));
	}

	await execute(sovrynSwapFormula.methods.init());
	console.log("All done");

	if (web3.currentProvider.constructor.name === "WebsocketProvider") {
		web3.currentProvider.connection.close();
	}
};

run(flag);
