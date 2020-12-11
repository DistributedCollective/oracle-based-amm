const fs = require('fs');
const path = require('path');
const Web3 = require('web3');

const CFG_FILE_NAME = process.argv[2];
const OLD_CONVERTER_CONTRACT = process.argv[3];
const OLD_CONVERTER_ADDRESS = process.argv[4];
const NEW_CONVERTER_CONTRACT = process.argv[5];
const NODE_ADDRESS = process.argv[6];
const PRIVATE_KEY = process.argv[7];
const ARTIFACTS_DIR = path.resolve(__dirname, '../build');
const MIN_GAS_LIMIT = 100000;
const ZERO_ADDRESS = '0x0';

const web3 = new Web3(NODE_ADDRESS);

const getConfig = () => {
    return JSON.parse(fs.readFileSync(CFG_FILE_NAME, { encoding: 'utf8' }));
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
            console.log("gasEstimate: "+gasEstimate, ' - value - ', value);
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
        const abi = fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + '.abi'), { encoding: 'utf8' });
        const bin = fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + '.bin'), { encoding: 'utf8' });
        const contract = new web3.eth.Contract(JSON.parse(abi));
        const options = { data: '0x' + bin, arguments: contractArgs };
        const transaction = contract.deploy(options);
        const receipt = await send(web3, account, gasPrice, transaction);
        const args = transaction.encodeABI().slice(options.data.length);
        console.log(`${contractId} deployed at ${receipt.contractAddress}`);
    }
    return deployed(web3, contractName, getConfig()[contractId].addr);
};

const deployed = (web3, contractName, contractAddr) => {
    const abi = fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + '.abi'), { encoding: 'utf8' });
    return new web3.eth.Contract(JSON.parse(abi), contractAddr);
};

const gasPrice = getGasPrice(web3);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
const web3Func = (func, ...args) => func(web3, account, gasPrice, ...args);
const execute = async (transaction, ...args) => {
    await web3Func(send, transaction, ...args);
};

const upgradeConverter = async (web3, upgrader, oldConverter, newConverterContract) => {
    
    // For versions 11 or higher, we just call upgrade on the converter.
    await execute(oldConverter.methods.upgrade());

    let events = await upgrader.getPastEvents('ConverterUpgrade');
    let newConverterAddress = events[0].returnValues._newConverter;
    let newConverter = deployed(web3, newConverterContract, newConverterAddress);
    await execute(newConverter.methods.acceptOwnership());
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
            symbol: await token.methods.symbol().call(),
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
        }
    }

    return state;
};

const run = async() => {
    let upgrader = deployed(web3, 'ConverterUpgrader', getConfig().converterUpgrader.addr);
    let oldConverter = deployed(web3, OLD_CONVERTER_CONTRACT, OLD_CONVERTER_ADDRESS);

    let oldConverterStateBefore = await getConverterState(oldConverter);  
    console.log("\n\nThe old converter state before upgrading:", oldConverterStateBefore, '\n');

    let newConverter = await upgradeConverter(web3, upgrader, oldConverter, NEW_CONVERTER_CONTRACT);
    console.log("The new converter address:", newConverter._address, '\n');
    
    let oldConverterStateAfter = await getConverterState(oldConverter);  
    let newConverterStateAfter = await getConverterState(newConverter);
    console.log("The old converter state after upgrading:", oldConverterStateAfter, '\n');
    console.log("The new converter state after upgrading:", newConverterStateAfter, '\n');
};

run();

const testUpdatePriceOracle = async () => {
    let converter = deployed(web3, NEW_CONVERTER_CONTRACT, '0x294916BB9C1eFa4d4002717267abf297CDC8080D');

    await execute(converter.methods.updatePriceOracle('0xE67cf20A24c85f0417070668123102247a6cfcC1', '0xBD01D701541D96399c338C9D66D4AE7bCAd878a2'));
    let events = await converter.getPastEvents('PriceOracleUpdate');
    console.log(events);

    let newPriceOracleAddress = await converter.methods.priceOracle().call();
    let newPriceOracle = deployed(web3, 'PriceOracle', newPriceOracleAddress);

    console.log('new price oracle:', newPriceOracleAddress, '\n');
    console.log('tokenAOracle:',await newPriceOracle.methods.tokenAOracle().call());
    console.log('tokenBOracle:',await newPriceOracle.methods.tokenBOracle().call());

    let newState = await getConverterState(converter);
    console.log('state:', newState);  
};

//testUpdatePriceOracle();
