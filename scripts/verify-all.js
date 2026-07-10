const WORK_DIR = './solidity';
const NODE_DIR = '../node_modules';
const INPUT_FILE = process.argv[2];

const fs = require('fs');
const path = require('path');
const request = require('request');
const spawnSync = require('child_process').spawnSync;

const input = JSON.parse(fs.readFileSync(INPUT_FILE, { encoding: 'utf8' }));
const verificationInput = input.verification ? { ...input, ...input.verification } : input;
//  input example:
//  {
//      "verifier"       : "etherscan", // "etherscan" or "blockscout"
//      "network"        : "api", // use "api" for mainnet or "api-<testnet>" for testnet
//      "apiUrl"         : "https://rootstock.blockscout.com/api/v2", // required for blockscout, optional for etherscan
//      "apiKey"         : "",    // generate this value at https://etherscan.io/myapikey
//      "compilerVersion": "v0.4.26+commit.4563c3fc",
//      "optimization"   : {"used": 1, "runs": 200},
//      "contracts"      : {
//          "ContractA1": {"name": "ContractA", "addr": "0x0000000000000000000000000000000000000001", "args": "<abi-encoded constructor arguments>"},
//          "ContractA2": {"name": "ContractA", "addr": "0x0000000000000000000000000000000000000002", "args": "<abi-encoded constructor arguments>"},
//          "ContractB1": {"name": "ContractB", "addr": "0x0000000000000000000000000000000000000003", "args": "<abi-encoded constructor arguments>"},
//          "ContractC1": {"name": "ContractC", "addr": "0x0000000000000000000000000000000000000004", "args": "<abi-encoded constructor arguments>"},
//      }
//  }

const run = () => {
    const contracts = getContracts();
    for (const pathName of getPathNames('contracts')) {
        const contractName = path.basename(pathName, '.sol');
        for (const contractId of Object.keys(contracts)) {
            if (contracts[contractId].name === contractName) {
                post(contractId, contracts[contractId], getSourceCode(pathName));
            }
        }
    }
};

const getContracts = () => {
    if (verificationInput.contracts) {
        return verificationInput.contracts;
    }
    if (input.verification && input.verification.contracts) {
        return input.verification.contracts;
    }
    throw new Error('No contracts found. Provide "contracts" or "verification.contracts" in the input JSON.');
};

const getPathNames = (dirName) => {
    let pathNames = [];
    for (const fileName of fs.readdirSync(WORK_DIR + '/' + dirName)) {
        if (fs.statSync(WORK_DIR + '/' + dirName + '/' + fileName).isDirectory()) {
            pathNames = pathNames.concat(getPathNames(dirName + '/' + fileName));
        }
        else if (fileName.endsWith('.sol')) {
            pathNames.push(dirName + '/' + fileName);
        }
    }
    return pathNames;
};

const getSourceCode = (pathName) => {
    const result = spawnSync('node', [NODE_DIR + '/truffle-flattener/index.js', pathName], {
        cwd: WORK_DIR,
        env: { ...process.env, NODE_NO_WARNINGS: '1' }
    });
    if (result.status !== 0) {
        throw new Error(result.stderr.toString() || result.stdout.toString());
    }
    return result.stdout.toString();
};

const post = (contractId, contract, sourceCode) => {
    if (verificationInput.verifier === 'blockscout') {
        postBlockscout(contractId, contract, sourceCode);
    } else {
        postEtherscan(contractId, contract, sourceCode);
    }
};

const postEtherscan = (contractId, contract, sourceCode) => {
    console.log(contractId + ': sending verification request...');
    request.post({
        url: verificationInput.apiUrl || 'https://' + verificationInput.network + '.etherscan.io/api',
        form: {
            module: 'contract',
            action: 'verifysourcecode',
            sourceCode: sourceCode,
            apikey: verificationInput.apiKey,
            compilerversion: verificationInput.compilerVersion,
            optimizationUsed: verificationInput.optimization.used,
            runs: verificationInput.optimization.runs,
            contractname: contract.name,
            contractaddress: contract.addr,
            constructorArguements: contract.args
        }
    },
    (error, response, body) => {
        if (error) {
            console.log(contractId + ': ' + error);
        }
        else {
            body = parse(body);
            if (body.status === '1') {
                get(contractId, body.result);
            }
            else {
                console.log(contractId + ': ' + body.result);
            }
        }
    });
};

const postBlockscout = (contractId, contract, sourceCode) => {
    if (!verificationInput.apiUrl) {
        throw new Error('Blockscout verification requires "apiUrl", for example "https://rootstock.blockscout.com/api/v2"');
    }

    const url = verificationInput.apiUrl.replace(/\/$/, '') + '/smart-contracts/' + contract.addr + '/verification/via/flattened-code';
    console.log(contractId + ': sending Blockscout verification request...');

    request.post({
        url,
        json: {
            compiler_version: verificationInput.compilerVersion,
            license_type: verificationInput.licenseType || 'none',
            source_code: sourceCode,
            is_optimization_enabled: verificationInput.optimization.used === 1 || verificationInput.optimization.used === true,
            optimization_runs: verificationInput.optimization.runs,
            constructor_args: contract.args || '',
            contract_name: contract.name,
            autodetect_constructor_args: true
        }
    },
    (error, response, body) => {
        if (error) {
            console.log(contractId + ': ' + error);
        }
        else if (response.statusCode >= 200 && response.statusCode < 300) {
            console.log(contractId + ': ' + (body && body.message ? body.message : 'verification request accepted'));
        }
        else {
            console.log(contractId + ': HTTP ' + response.statusCode + ' ' + JSON.stringify(body));
        }
    });
};

const get = (contractId, guid) => {
    console.log(contractId + ': checking verification status...');
    request.get(
        (verificationInput.apiUrl || 'https://' + verificationInput.network + '.etherscan.io/api') + '?module=contract&action=checkverifystatus&guid=' + guid,
        (error, response, body) => {
            if (error) {
                console.log(contractId + ': ' + error);
            }
            else {
                body = parse(body);
                if (body.result === 'Pending in queue' || (body.result && body.result.startsWith('Max rate limit reached'))) {
                    get(contractId, guid);
                }
                else {
                    console.log(contractId + ': ' + body.result);
                }
            }
        }
    );
};

const parse = (str) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        return {};
    }
};

run();
