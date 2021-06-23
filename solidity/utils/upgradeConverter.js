const fs = require('fs');
const path = require('path');
const Web3 = require('web3');

//path from current dir
const CFG_FILE_NAME = process.argv[2];

const ARTIFACTS_DIR = path.resolve(__dirname, '../build/contracts');
const MIN_GAS_LIMIT = 100000;
const ZERO_ADDRESS = '0x0';
const BTCAddress = "0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315"

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
}

const getConfig = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, CFG_FILE_NAME), { encoding: "utf8" }));
};

const scan = async (message) => {
  process.stdout.write(message);
  return await new Promise((resolve, reject) => {
    process.stdin.resume();
    process.stdin.once('data', (data) => {
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
    if (userGasPrice === '') {
      return nodeGasPrice;
    }
    console.log('Illegal gas-price');
  }
};

const getTransactionReceipt = async (web3) => {
  while (true) {
    const hash = await scan('Enter transaction-hash or leave empty to retry:');
    if (/^0x([0-9A-Fa-f]{64})$/.test(hash)) {
      const receipt = await web3.eth.getTransactionReceipt(hash);
      if (receipt) {
        return receipt;
      }
      console.log('Invalid transaction-hash');
    }
    else if (hash) {
      console.log('Illegal transaction-hash');
    }
    else {
      return null;
    }
  }
};

const send = async (web3, account, gasPrice, transaction, value = 0) => {
  while (true) {
    try {
      const gasEstimate = await transaction.estimateGas({ from: account.address, value: value });
      console.log("gasEstimate: " + gasEstimate, ' - value - ', value);
      const tx = {
        to: transaction._parent._address,
        data: transaction.encodeABI(),
        gas: Math.max(await transaction.estimateGas({ from: account.address, value: value }), MIN_GAS_LIMIT),
        gasPrice: gasPrice || await getGasPrice(web3),
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

const deploy = async (web3, account, gasPrice, contractId, contractName, contractArgs) => {
  if (getConfig()[contractId] === undefined) {
    const buildFile = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".json"), { encoding: "utf8" }));

    const contract = new web3.eth.Contract(buildFile.abi);
    const options = { data: buildFile.bytecode, arguments: contractArgs };
    const transaction = contract.deploy(options);
    const receipt = await send(web3, account, gasPrice, transaction);
    const args = transaction.encodeABI().slice(options.data.length);
    console.log(`${contractId} deployed at ${receipt.contractAddress}`);
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
  await web3Func(send, transaction, ...args);
};

const getConverter = async (web3, upgrader, newConverterContract) => {
  // For versions 11 or higher, we just call upgrade on the converter.
  let events = await upgrader.getPastEvents('ConverterUpgrade');
  let newConverterAddress = events[0].returnValues._newConverter;
  let newConverter = deployed(web3, newConverterContract, newConverterAddress);

  return newConverter;

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
  const smartToken = deployed(web3, 'SmartToken', address);
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
    symbol: await smartToken.methods.symbol().call(),
  };

  for (let i = 0; i < state.reserveTokenCount; i++) {
    const address = await converter.methods.connectorTokens(i).call();
    const token = deployed(web3, 'ERC20Token', address);

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
    }
    else {
      const priceOracle = deployed(web3, 'PriceOracle', priceOracleAddres);
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
  const transactionId = await multiSigWallet.methods.submitTransaction(contractAddress, 0, data).call();
  await execute(multiSigWallet.methods.submitTransaction(contractAddress, 0, data));
  console.log("Transaction submitted at: ", transactionId);
}

//IMPORTANT: NEEDS ConverterUpgrader and ConverterFactory in the config, nothing else   (possibly whitelist)
const upgrade = async () => {
  await initialiseWeb3();

  const config = getConfig();

  const oldConverter = deployed(web3, config.converterContract.name, config.converterContract.addr);
  const oldConverterStateBefore = await getConverterState(oldConverter);
  console.log("\n\nThe old converter state before upgrading:", oldConverterStateBefore, '\n');

  multiSigWallet = deployed(web3, config.multiSigWallet.name, config.multiSigWallet.addr);
  const converterFactory = deployed(web3, 'ConverterFactory', config.converterFactory.addr);

  let registerFactoryTxn;
  if (config.type === 1) {
    const liquidityPoolV1ConverterFactory = await web3Func(deploy, 'liquidityPoolV1ConverterFactory', 'LiquidityPoolV1ConverterFactory', []);
    registerFactoryTxn = converterFactory.methods.registerTypedConverterFactory(liquidityPoolV1ConverterFactory._address).encodeABI();
  } else if (config.type === 2) {
    const liquidityPoolV2ConverterFactory = await web3Func(deploy, 'liquidityPoolV2ConverterFactory', 'LiquidityPoolV2ConverterFactory', []);
    registerFactoryTxn = converterFactory.methods.registerTypedConverterFactory(liquidityPoolV2ConverterFactory._address).encodeABI();
  }

  //register factory
  await submitTransaction(
    registerFactoryTxn,
    config.converterFactory.addr
  );

  //upgradeConverter
  await submitTransaction(
    oldConverter.methods.upgrade().encodeABI(),
    oldConverter._address
  );
};

const setupPool = async () => {
  await initialiseWeb3();

  const config = getConfig();

  const oldConverter = deployed(web3, config.converterContract.name, config.converterContract.addr);
  const oldConverterStateBefore = await getConverterState(oldConverter);
  console.log("\n\nThe old converter state before upgrading:", oldConverterStateBefore, '\n');

  multiSigWallet = deployed(web3, config.multiSigWallet.name, config.multiSigWallet.addr);
  const upgrader = deployed(web3, 'ConverterUpgrader', config.converterUpgrader.addr);

  const newConverter = await getConverter(web3, upgrader, `LiquidityPoolV${config.type}Converter`);

  await submitTransaction(
    newConverter.methods.acceptOwnership().encodeABI(),
    newConverter._address
  );

  console.log("The new converter address:", newConverter._address, '\n');

  if (config.type === 1) {
    const oracle = await web3Func(deploy, 'Oracle', 'Oracle', [newConverter._address]);

    await submitTransaction(
     newConverter.methods.setOracle(oracle._address, BTCAddress).encodeABI(),
      config.converterFactory.addr
    );

    console.log(oracleAddress, "Oracle added in new converter");
    await submitTransaction(
      oracle.methods.transferOwnership(multiSigWallet._address).encodeABI(),
      config.converterFactory.addr
    );
  }

  //note: public RSK testnet node gave an method not allowed error here
  const oldConverterStateAfter = await getConverterState(oldConverter);
  const newConverterStateAfter = await getConverterState(newConverter);
  console.log("The old converter state after upgrading:", oldConverterStateAfter, '\n');
  console.log("The new converter state after upgrading:", newConverterStateAfter, '\n');
};

const run = async (toExecute) => {
  if (toExecute == 1) {
    await upgrade();
  } else {
    await setupPool();
  }
}

run(process.argv[3]);