const fs = require("fs");
const path = require("path");
const Web3 = require("web3");

const NODE_ADDRESS = process.argv[2];
const PRIVATE_KEY = process.argv[3];
const MULTISIG_ADDRESS = process.argv[4];
const CONVERTER_ADDRESS = process.argv[5];

const ARTIFACTS_DIR = path.resolve(__dirname, "../build/contracts");
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

  const buildFile = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".json"), { encoding: "utf8" }));

  const contract = new web3.eth.Contract(buildFile.abi);
  const options = { data: buildFile.bytecode, arguments: contractArgs };
  const transaction = contract.deploy(options);
  const receipt = await send(web3, account, gasPrice, transaction);
  const args = transaction.encodeABI().slice(options.data.length);
  console.log(`${contractId} deployed at ${receipt.contractAddress}`);
  return deployed(web3, contractName, receipt.contractAddress);
};

const deployed = (web3, contractName, contractAddr) => {
  const buildFile = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + ".json"), { encoding: "utf8" }));
  return new web3.eth.Contract(buildFile.abi, contractAddr);
};

let web3;
let gasPrice;
let account;
const initialiseWeb3 = async () => {
  web3 = new Web3(NODE_ADDRESS);
  gasPrice = await getGasPrice(web3);
  account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  console.log("account: ", account);
}

const execute = async (transaction, ...args) => {
  return await web3Func(send, transaction, ...args);
};
const web3Func = (func, ...args) => func(web3, account, gasPrice, ...args);

const acceptOwnership = async () => {
  await initialiseWeb3();
  let multisig;

  if (!MULTISIG_ADDRESS) {
    multisig = await web3Func(deploy, "multisig", "MultiSigWallet", [[account.address], 1]);
  } else {
    multisig = deployed(web3, "MultiSigWallet", MULTISIG_ADDRESS);
  }

  const converterBase = deployed(web3, "ConverterBase", CONVERTER_ADDRESS);
  const acceptOwnershipTxn = converterBase.methods.acceptOwnership().encodeABI();

  const transactionId = await multisig.methods.submitTransaction(CONVERTER_ADDRESS, 0, acceptOwnershipTxn).call();
  await execute(multisig.methods.submitTransaction(CONVERTER_ADDRESS, 0, acceptOwnershipTxn));
  console.log("Transaction submitted at: ", transactionId);

  await execute(multisig.methods.executeTransaction(transactionId));
  console.log("TransactionId", transactionId, "executed");

  console.log("All done");

  const owner = await converterBase.methods.owner().call();
  console.log("\nowner: ");
  console.log(owner);

  const newOwner = await converterBase.methods.newOwner().call();
  console.log("\nnewOwner: ");
  console.log(newOwner);

  if (web3.currentProvider.constructor.name === "WebsocketProvider") {
    web3.currentProvider.connection.close();
  }
};

acceptOwnership(false);
