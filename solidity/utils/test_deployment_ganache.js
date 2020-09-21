const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const ganache = require("ganache-cli");//todo

const CFG_FILE_NAME = process.argv[2];
const NODE_ADDRESS = process.argv[3];
const PRIVATE_KEY = process.argv[4];

const ARTIFACTS_DIR = path.resolve(__dirname, '../build');

const MIN_GAS_LIMIT = 100000;

const getConfig = () => {
    return JSON.parse(fs.readFileSync(CFG_FILE_NAME, { encoding: 'utf8' }));
};

const setConfig = (record) => {
    fs.writeFileSync(CFG_FILE_NAME, JSON.stringify({ ...getConfig(), ...record }, null, 4));
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
        const hash = await scan('Enter transaction-hash or leave empty to retry: ');
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
            console.log("gasEstimate: "+gasEstimate);
            const tx = {
                to: transaction._parent._address,
                data: transaction.encodeABI(),
                gas: Math.max(gasEstimate, MIN_GAS_LIMIT),
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
        setConfig({ [contractId]: { name: contractName, addr: receipt.contractAddress, args: args } });
    }
    return deployed(web3, contractName, getConfig()[contractId].addr);
};

const deployed = (web3, contractName, contractAddr) => {
    const abi = fs.readFileSync(path.join(ARTIFACTS_DIR, contractName + '.abi'), { encoding: 'utf8' });
    return new web3.eth.Contract(JSON.parse(abi), contractAddr);
};

const decimalToInteger = (value, decimals) => {
    const parts = [...value.split('.'), ''];
    return parts[0] + parts[1].padEnd(decimals, '0');
};

const percentageToPPM = (value) => {
    return decimalToInteger(value.replace('%', ''), 4);
};

const run = async () => {
    let web3;
    // Use empty string ('') as the NODE_ADDRESS arg to
    // skip connecting to an URL and use the ganache provider instead
    if (NODE_ADDRESS) {
        web3 = new Web3(NODE_ADDRESS);
    } else {
        web3 = new Web3(ganache.provider({ accounts:[{ balance: 0xffffffffffffffffffff, secretKey: PRIVATE_KEY }],  gasLimit: 10000000 }));
    }

    console.log(await web3.eth.getAccounts());
    const gasPrice = await getGasPrice(web3);
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    const web3Func = (func, ...args) => func(web3, account, gasPrice, ...args);

    const addresses = { ETH: Web3.utils.toChecksumAddress('0x'.padEnd(42, 'e')) };
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

    // main contracts
    const contractRegistry = await web3Func(deploy, 'contractRegistry', 'ContractRegistry', []);
    const converterFactory = await web3Func(deploy, 'converterFactory', 'ConverterFactory', []);
    const sovrynSwapFormula = await web3Func(deploy, 'sovrynSwapFormula', 'SovrynSwapFormula', []);
    const sovrynSwapNetwork = await web3Func(deploy, 'sovrynSwapNetwork', 'SovrynSwapNetwork', [contractRegistry._address]);
    const conversionPathFinder = await web3Func(deploy, 'conversionPathFinder', 'ConversionPathFinder', [contractRegistry._address]);
    const converterUpgrader = await web3Func(deploy, 'converterUpgrader', 'ConverterUpgrader', [contractRegistry._address, addresses.ETH]);
    const converterRegistry = await web3Func(deploy, 'converterRegistry', 'ConverterRegistry', [contractRegistry._address]);
    const converterRegistryData = await web3Func(deploy, 'converterRegistryData', 'ConverterRegistryData', [contractRegistry._address]);
    const liquidTokenConverterFactory = await web3Func(deploy, 'liquidTokenConverterFactory', 'LiquidTokenConverterFactory', []);
    const liquidityPoolV1ConverterFactory = await web3Func(deploy, 'liquidityPoolV1ConverterFactory', 'LiquidityPoolV1ConverterFactory', []);
    const liquidityPoolV2ConverterFactory = await web3Func(deploy, 'liquidityPoolV2ConverterFactory', 'LiquidityPoolV2ConverterFactory', []);
    const liquidityPoolV2ConverterAnchorFactory = await web3Func(deploy, 'liquidityPoolV2ConverterAnchorFactory', 'LiquidityPoolV2ConverterAnchorFactory', []);
    const liquidityPoolV2ConverterCustomFactory = await web3Func(deploy, 'liquidityPoolV2ConverterCustomFactory', 'LiquidityPoolV2ConverterCustomFactory', []);
    const oracleWhitelist = await web3Func(deploy, 'oracleWhitelist', 'Whitelist', []);

    // contract deployment for etherscan verification only
    const smartToken = await web3Func(deploy, 'smartToken', 'SmartToken', ["Token1", "TKN1", 18]);
    const smartToken2 = await web3Func(deploy, 'smartToken2', 'SmartToken', ["Token2", "TKN2", 18]);
    const poolTokensContainer = await web3Func(deploy, 'poolTokensContainer', 'PoolTokensContainer', ["Pool", "POOL", 18]);
    const mocOracleMock = await web3Func(deploy, 'mocOracleMock', 'MoCOracleMock', []);
    const mocOracle1 = await web3Func(deploy, 'mocOracle1', 'MocBTCToBTCOracle', []);
    const mocOracle2 = await web3Func(deploy, 'mocOracle2', 'MocBTCToBTCOracle', []);
    
    await web3Func(deploy, 'priceOracle', 'PriceOracle', [smartToken._address, smartToken2._address, mocOracle1._address, mocOracle2._address]);
    
    await web3Func(deploy, 'liquidTokenConverter', 'LiquidTokenConverter', [smartToken._address, contractRegistry._address, 1000]);
    await web3Func(deploy, 'liquidityPoolV1Converter', 'LiquidityPoolV1Converter', [smartToken2._address, contractRegistry._address, 1000]);
    await web3Func(deploy, 'liquidityPoolV2Converter', 'LiquidityPoolV2Converter', [poolTokensContainer._address, contractRegistry._address, 1000]);

    // initialize contract registry
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('ContractRegistry'), contractRegistry._address));
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('ConverterFactory'), converterFactory._address));
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('SovrynSwapFormula'), sovrynSwapFormula._address));
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('SovrynSwapNetwork'), sovrynSwapNetwork._address));
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('ConversionPathFinder'), conversionPathFinder._address));
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('SovrynSwapConverterUpgrader'), converterUpgrader._address));
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('SovrynSwapConverterRegistry'), converterRegistry._address));
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('SovrynSwapConverterRegistryData'), converterRegistryData._address));
    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('ChainlinkOracleWhitelist'), oracleWhitelist._address));

    // initialize converter factory
    await execute(converterFactory.methods.registerTypedConverterFactory(liquidTokenConverterFactory._address));
    await execute(converterFactory.methods.registerTypedConverterFactory(liquidityPoolV1ConverterFactory._address));
    await execute(converterFactory.methods.registerTypedConverterFactory(liquidityPoolV2ConverterFactory._address));
    await execute(converterFactory.methods.registerTypedConverterAnchorFactory(liquidityPoolV2ConverterAnchorFactory._address));
    await execute(converterFactory.methods.registerTypedConverterCustomFactory(liquidityPoolV2ConverterCustomFactory._address));

    //intialize mock MoC Oracle
    await execute(mocOracleMock.methods.setValue(1));
    await execute(mocOracleMock.methods.setHas(true));

    for (const reserve of getConfig().reserves) {
        if (reserve.address) {
            addresses[reserve.symbol] = reserve.address;
            tokenDecimals[reserve.symbol] = reserve.decimals;
            continue;
        }

        const name = reserve.symbol + ' ERC20 Token';
        const symbol = reserve.symbol;
        const decimals = reserve.decimals;
        const supply = decimalToInteger(reserve.supply, decimals);
        const token = await web3Func(deploy, 'erc20Token' + symbol, 'ERC20Token', [name, symbol, decimals, supply]);
        addresses[reserve.symbol] = token._address;
        tokenDecimals[reserve.symbol] = reserve.decimals;
    }

    for (const converter of getConfig().converters) {
        const type = converter.type;
        const name = converter.symbol + (type == 0 ? ' Liquid Token' : ' Liquidity Pool');
        const symbol = converter.symbol;
        const decimals = converter.decimals;
        const fee = percentageToPPM(converter.fee);
        const tokens = converter.reserves.map(reserve => addresses[reserve.symbol]);
        const weights = converter.reserves.map(reserve => percentageToPPM(reserve.weight));
        const amounts = converter.reserves.map(reserve => decimalToInteger(reserve.balance, tokenDecimals[reserve.symbol]));
        const value = amounts[converter.reserves.findIndex(reserve => reserve.symbol === 'ETH')];
        
        const newConverter = await converterRegistry.methods.newConverter(type, name, symbol, decimals, '1000000', tokens, weights).call();
        console.log('New Converter is  ', newConverter);

        await execute(converterRegistry.methods.newConverter(type, name, symbol, decimals, '1000000', tokens, weights));
        await execute(converterRegistry.methods.setupConverter(type, tokens, weights, newConverter));

        console.log("done. doing the settings now");

        const anchor = deployed(web3, 'IConverterAnchor', (await converterRegistry.methods.getAnchors().call()).slice(-1)[0]);
        const converterBase = deployed(web3, 'ConverterBase', await anchor.methods.owner().call());
        await execute(converterBase.methods.acceptOwnership());
        await execute(converterBase.methods.setConversionFee(fee));


        if (type !== 0 && amounts.every(amount => amount > 0)) {
            for (let i = 0; i < converter.reserves.length; i++) {
                const reserve = converter.reserves[i];
                if (reserve.symbol !== 'ETH') {
                    await execute(deployed(web3, 'ERC20Token', tokens[i]).methods.approve(converterBase._address, amounts[i]));
                }

                if (type == 2) {
                    console.log("setting the oracle");
                    if (!reserve.oracle) {
                        console.log("no oracle existing, yet.");
                        // can be used to deploy test (static) oracles
                        //else coment out
                        const mocPriceOracle = await web3Func(deploy, 'mocPriceOracle' + converter.symbol + reserve.symbol, 'MocBTCToBTCOracle', []);
                        reserve.oracle = mocPriceOracle._address;

                    }
                    console.log("adding the oracle to the whitelist "+reserve.oracle);
                    await execute(oracleWhitelist.methods.addAddress(reserve.oracle));
                    console.log("done with oracle part");
                }
            }

            if (type == 1) {
                await execute(deployed(web3, 'LiquidityPoolV1Converter', converterBase._address).methods.addLiquidity(tokens, amounts, 1), value);
            }
            else if (type == 2) {
                console.log("activating the v2 pool");
                const deployedConverter = deployed(web3, 'LiquidityPoolV2Converter', converterBase._address);
                await execute(deployedConverter.methods.activate(tokens[0], converter.reserves[0].oracle, converter.reserves[1].oracle));
                console.log("adding liquidity to the pool");
                for (let i = 0; i < converter.reserves.length; i++) {
                    await execute(deployedConverter.methods.addLiquidity(tokens[i], amounts[i], 1), value);
                }
            }
        }

        addresses[converter.symbol] = anchor._address;
    }

    await execute(contractRegistry.methods.registerAddress(Web3.utils.asciiToHex('BNTToken'), addresses.RBTC));
    await execute(conversionPathFinder.methods.setAnchorToken(addresses.RBTC));
    await execute(sovrynSwapFormula.methods.init());

    if (web3.currentProvider.constructor.name === 'WebsocketProvider') {
        web3.currentProvider.connection.close();
    }
};

run();