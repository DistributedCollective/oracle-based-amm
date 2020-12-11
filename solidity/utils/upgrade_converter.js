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
const addresses = { ETH: Web3.utils.toChecksumAddress('0x'.padEnd(42, 'e')) };

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
    //let oldConverter = deployed(web3, OLD_CONVERTER_CONTRACT, OLD_CONVERTER_ADDRESS);
    let oldConverterABI = [{"constant":true,"inputs":[{"name":"_reserveToken","type":"address"}],"name":"reserveStakedBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_onlyOwnerCanUpdateRegistry","type":"bool"}],"name":"restrictRegistryUpdate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"primaryReserveToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxStakedBalanceEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"reserveRatio","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"connectors","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint32"},{"name":"","type":"bool"},{"name":"","type":"bool"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_primaryReserveToken","type":"address"},{"name":"_primaryReserveOracle","type":"address"},{"name":"_secondaryReserveOracle","type":"address"}],"name":"activate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasETHReserve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"disableMaxStakedBalances","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"connectorTokens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_reserveToken","type":"address"}],"name":"reserveWeight","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sourceToken","type":"address"},{"name":"_targetToken","type":"address"},{"name":"_amount","type":"uint256"}],"name":"getReturn","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferTokenOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"priceOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_reserveToken","type":"address"}],"name":"reserveAmplifiedBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_poolToken","type":"address"}],"name":"liquidationLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"onlyOwnerCanUpdateRegistry","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptTokenOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawFromAnchor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"converterType","outputs":[{"name":"","type":"uint16"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_reserve1MaxStakedBalance","type":"uint256"},{"name":"_reserve2MaxStakedBalance","type":"uint256"}],"name":"setMaxStakedBalances","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"updateRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_whitelist","type":"address"}],"name":"setConversionWhitelist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_reserveToken","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"}],"name":"addLiquidity","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_reserveToken","type":"address"}],"name":"poolToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"conversionFee","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"prevRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferAnchorOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_poolToken","type":"address"},{"name":"_amount","type":"uint256"}],"name":"removeLiquidityReturnAndFee","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"withdrawETH","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_dynamicFeeFactor","type":"uint256"}],"name":"setDynamicFeeFactor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_weight","type":"uint32"}],"name":"addReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"connectorTokenCount","outputs":[{"name":"","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"registry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxConversionFee","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"maxStakedBalances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"reserveTokenCount","outputs":[{"name":"","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"referenceRate","outputs":[{"name":"n","type":"uint256"},{"name":"d","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_sourceToken","type":"address"},{"name":"_targetToken","type":"address"},{"name":"_amount","type":"uint256"}],"name":"targetAmountAndFee","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"restoreRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"conversionsEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_reserveToken","type":"address"},{"name":"_balance","type":"uint256"}],"name":"setReserveStakedBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"referenceRateUpdateTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"conversionWhitelist","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptAnchorOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reserveTokens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isV28OrHigher","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"anchor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"upgrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"amplificationFactor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"reserves","outputs":[{"name":"balance","type":"uint256"},{"name":"weight","type":"uint32"},{"name":"deprecated1","type":"bool"},{"name":"deprecated2","type":"bool"},{"name":"isSet","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_connectorToken","type":"address"}],"name":"getConnectorBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"effectiveTokensRate","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"secondaryReserveToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_reserveToken","type":"address"}],"name":"reserveBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_poolToken","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"}],"name":"removeLiquidity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dynamicFeeFactor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_sourceToken","type":"address"},{"name":"_targetToken","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_trader","type":"address"},{"name":"_beneficiary","type":"address"}],"name":"convert","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"effectiveReserveWeights","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_conversionFee","type":"uint32"}],"name":"setConversionFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"lastConversionRate","outputs":[{"name":"n","type":"uint256"},{"name":"d","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_poolTokensContainer","type":"address"},{"name":"_registry","type":"address"},{"name":"_maxConversionFee","type":"uint32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_prevFactor","type":"uint256"},{"indexed":false,"name":"_newFactor","type":"uint256"}],"name":"DynamicFeeFactorUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_provider","type":"address"},{"indexed":true,"name":"_reserveToken","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_newBalance","type":"uint256"},{"indexed":false,"name":"_newSupply","type":"uint256"}],"name":"LiquidityAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_provider","type":"address"},{"indexed":true,"name":"_reserveToken","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_newBalance","type":"uint256"},{"indexed":false,"name":"_newSupply","type":"uint256"}],"name":"LiquidityRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_type","type":"uint16"},{"indexed":true,"name":"_anchor","type":"address"},{"indexed":true,"name":"_activated","type":"bool"}],"name":"Activation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_fromToken","type":"address"},{"indexed":true,"name":"_toToken","type":"address"},{"indexed":true,"name":"_trader","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_return","type":"uint256"},{"indexed":false,"name":"_conversionFee","type":"int256"}],"name":"Conversion","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_token1","type":"address"},{"indexed":true,"name":"_token2","type":"address"},{"indexed":false,"name":"_rateN","type":"uint256"},{"indexed":false,"name":"_rateD","type":"uint256"}],"name":"TokenRateUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_prevFee","type":"uint32"},{"indexed":false,"name":"_newFee","type":"uint32"}],"name":"ConversionFeeUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_prevOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"OwnerUpdate","type":"event"}];
    let oldConverter = new web3.eth.Contract(oldConverterABI, OLD_CONVERTER_ADDRESS);

    let oldConverterStateBefore = await getConverterState(oldConverter);  
    console.log("\n\nThe old converter state before upgrading:", oldConverterStateBefore, '\n');

    let contractRegistry = deployed(web3, 'ContractRegistry', getConfig().contractRegistry.addr);
    let upgrader = await web3Func(deploy, 'converterUpgrader', 'ConverterUpgrader', [getConfig().contractRegistry.addr, addresses.ETH]);
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('SovrynSwapConverterUpgrader'), upgrader._address));

    let liquidityPoolV2ConverterFactory = await web3Func(deploy, 'liquidityPoolV2ConverterFactory','LiquidityPoolV2ConverterFactory', []);
    let converterFactory = deployed(web3, 'ConverterFactory', getConfig().converterFactory.addr);
    await execute(converterFactory.methods.registerTypedConverterFactory(liquidityPoolV2ConverterFactory._address));

    let newConverter = await upgradeConverter(web3, upgrader, oldConverter, NEW_CONVERTER_CONTRACT);
    console.log("The new converter address:", newConverter._address, '\n');
    console.log("The new converter methods:", newConverter.methods, '\n');
    
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
