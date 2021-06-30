const fs = require("fs");
const path = require("path");
const Web3 = require("web3");

const NODE_ADDRESS = process.argv[2];
const PRIVATE_KEY = process.argv[3];

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

const transferOwnership = async () => {
  await initialiseWeb3();

  const MULTISIG_ADDRESS = "0x924f5ad34698Fd20c90Fe5D5A8A0abd3b42dc711";

  const converters = [
    "0x52eD2aD69A44A431B393d28CE415c19348abAb16",
    "0xf90558859d1bBC79544Cb2Da49bA7Ce471a6343e",
    "0x303401D9AB4394AEaE4156F1A21C620eED56E22C"
  ];

  for (let index = 0; index < converters.length; index++) {
    const converterBase = deployed(web3, "ConverterBase", converters[index]);
    await execute(converterBase.methods.transferOwnership(MULTISIG_ADDRESS));

    console.log("\nConverter: "+converters[index]);

    const owner = await converterBase.methods.owner().call();
    console.log("\nowner: ");
    console.log(owner);
  
    const newOwner = await converterBase.methods.newOwner().call();
    console.log("\nnewOwner: ");
    console.log(newOwner);
  }

  console.log("All done");

  if (web3.currentProvider.constructor.name === "WebsocketProvider") {
    web3.currentProvider.connection.close();
  }
};

transferOwnership();
