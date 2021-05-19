const fs = require("fs");
const path = require("path");
const Web3 = require("web3");

const CFG_FILE_NAME = process.argv[2];
const NODE_ADDRESS = process.argv[3];
const PRIVATE_KEY = process.argv[4];

const ARTIFACTS_DIR = path.resolve(__dirname, "../build");

const MIN_GAS_LIMIT = 100000;
const MAX_CONVERSION_FEE = 10000

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

const run = async () => {
  const web3 = new Web3(NODE_ADDRESS);

  const gasPrice = await getGasPrice(web3);
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  const web3Func = (func, ...args) => func(web3, account, gasPrice, ...args);

  const addresses = { ETH: Web3.utils.toChecksumAddress("0x".padEnd(42, "e")) };
  const tokenDecimals = { ETH: 18 };

  /*
    if (!getConfig().mocMedianizer) {
        throw new Error("MoC Medinizer contract address is undefined");
    }*/

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

  // main contracts
  const contractRegistry = await web3Func(deploy, "contractRegistry", "ContractRegistry", []);
  const converterFactory = await web3Func(deploy, "converterFactory", "ConverterFactory", []);
  const sovrynSwapFormula = await web3Func(deploy, "sovrynSwapFormula", "SovrynSwapFormula", []);
  const sovrynSwapNetwork = await web3Func(deploy, "sovrynSwapNetwork", "SovrynSwapNetwork", [contractRegistry._address]);
  const converterUpgrader = await web3Func(deploy, "converterUpgrader", "ConverterUpgrader", [contractRegistry._address, addresses.ETH]);
  const converterRegistry = await web3Func(deploy, "converterRegistry", "ConverterRegistry", [contractRegistry._address]);
  const liquidityPoolV1ConverterFactory = await web3Func(deploy, "liquidityPoolV1ConverterFactory", "LiquidityPoolV1ConverterFactory", []);
  const smartToken = await web3Func(deploy, "smartToken", "SmartToken", ["TOKEN", "TKN", 1]);
  const oracle = await web3Func(deploy, "oracle", "Oracle", []);
  const liquidityPoolV1Converter = await web3Func(deploy, "liquidityPoolV1Converter", "LiquidityPoolV1Converter", [smartToken._address, contractRegistry._address, MAX_CONVERSION_FEE]);

  //init sovryn swap formula
  await execute(sovrynSwapFormula.methods.init());

  // initialize contract registry
  await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("ContractRegistry"), contractRegistry._address));
  await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("ConverterFactory"), converterFactory._address));
  await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SovrynSwapFormula"), sovrynSwapFormula._address));
  await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SovrynSwapNetwork"), sovrynSwapNetwork._address));
  await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SovrynSwapConverterUpgrader"), converterUpgrader._address));
  await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex("SovrynSwapConverterRegistry"), converterRegistry._address));

  // initialize converter factory
  await execute(converterFactory.methods.registerTypedConverterFactory(liquidityPoolV1ConverterFactory._address));

  // initialize liquidityPoolV1Converter
  await execute(liquidityPoolV1Converter.methods.setOracle(oracle._address));
  await execute(oracle.methods.setLiquidityPool(liquidityPoolV1Converter._address));
  console.log("All done");

  if (web3.currentProvider.constructor.name === "WebsocketProvider") {
    web3.currentProvider.connection.close();
  }
};

run();
