# Add V1 AMM Pools

//TODO: update the description with the latest changes

## Overview

Basic flow:

NOTE: ALL SCRIPTS SHOULD RUN FROM ```solidity/utils``` folder

Prepare config [e.g. sampleETH.json](solidity/utils/sampleETH.json)

**NOTE: TO REDEPLOY CONVERTER, YOU NEED TO UNREGISTER IT FIRST!**   

//TODO: add description how to unregister converter

Deploy a set of contracts for testing purpose; can be used on both private and public networks:
[deployment_rsk.js](solidity/utils/deployment_rsk.js)  

```bash
node deployment_rsk.js
    Configuration file name #should contain only *reserves* and *converters*
    Ethereum node address
    Account private key
```  

To test on ganache, also use ```deployment_rsk.js```

You can take the commands from [commands.txt](solidity/utils/command.txt)  

## Config

[sampleETH.json](solidity/utils/sampleETH.json)

```json
/// ADDRESSES NEED TO FOLLOW ETHEREUM NETWORK FORMAT ELSE THE SCRIPT WILL FAIL
/// TO MAKE SURE, BEFORE WRITING AN ADDRESS TO CONFIG, FIRST PUT IT INTO SEARCH IN E.G. https://etherscan.io/
/// THEN COPY FROM THERE
{
    "reserves": [
        {
            "symbol": "WRBTC", // always goes first
            "decimals": 18,
            "address": "" // for WRBTC needs relevant address else if empty the token will be created
        },
        {
            "symbol": "ETHs",
            "decimals": 18,
            "address": "" // for mainnet/testnet deployments we sould have addresses; if empty the token will be created  
        }
    ],
    "converters": [
        {
            "type": 1, // 1 for v1 amm pool
            "symbol": "WRBTC/ETHs",
            "decimals": 18,
            "fee": "0.3%", // always 0.3%
            "reserves": [ // both tokens of the pair should be ERC20
                {
                    "symbol": "WRBTC", // always goes first in the pair
                    "weight": "50%",
                    "balance": "0.01" // initial balance amount to be added to the pool
                },
                {
                    "symbol": "ETHs", // second pair token
                    "weight": "50%",
                    "balance": "0.1167268" // balance BTC * ETH ex_rate, should be set right before deployment 
                }
            ]
        }
    ]
}
``` 

### Local testing

[deployment_rsk.js](solidity/utils/deployment_rsk.js) to deploy contracts needed for testing  

The configuration file is updated during the process, in order to allow resuming a prematurely-terminated execution. This means, if you want to start a fresh deployment, you need to delete the "phase" section and all of the deployed contract addresses from the config file.  

### Adding LM pools to the testnet and mainnet (only needed if contracts' abi were changed)

1. Before adding pools we need to make sure having updated comipled contracts in [./solidity/build](./solidity/build)
   - Change contract folder in script Compile contracts `../../scripts/compile.sh`
   - Run from root dir `./scripts/compile.sh`
2. Top up RBTC and WRBTC account with some RBTC to pay for tx and **WRBTC** amount for initial deposit (0.01 usually)

To add converters to an existing swap network, use ```addConverter.js```.

Example creation v1 pool WRBTC/ETH  

Note: `data_testnet.json` and `data_mainnet.json` store contracts addresses participating in converter creation.

testnet:  

```node addConverter.js ETH addETHs_testnet.json data_testnet.json https://public-node.testnet.rsk.co <private key>```  

mainnet:  

```node addConverter.js ETH addETHs_mainnet.json data_mainnet.json https://mainnet2.sovryn.app/rpc <private key>```

```TODO: check if the following is for v2 pools only```

If an oracle for a token was already deployed, set the address in the reserve object within the converter object in the config. Remember that the wallet needs to posses WRBTC if WRBTC is used as second currency.  

```TODO: check if the following is for v2 pools only```

In case of BPro, add the MoC State address as  ```underlyingOracleAddress``` to the config file.

If the script breaks somewhere in the process and needs to be resumed - go ahead, run it again.

[Commands to run](solidity/utils/command.txt)

The solidity version of the Sovryn Swap smart contracts is composed of many different components that work together to create the SovrynSwap Network deployment.

The main contracts are the SovrynSwapNetwork contract (entry point to the system) and the different converter contracts (implementation of liquidity pools and their reserves).

## Upgradeability

All smart contract functions are public and all upgrades are opt-in. If significant improvements are made to the system a new version will be released. Token owners can choose between moving to the new system or staying in the old one. If possible, new versions will be backwards compatible and able to interact with the old versions.

## Language

The terms “reserves” and “connectors” have the same meaning throughout SovrynSwap’s smart contract code and documentation. “Reserve ratio” and “connector weight” are also used interchangeably. “Connector balance” refers to the token inventories held in a Smart Token’s reserve.

## Warning

Sovryn Swap is a work in progress. Make sure you understand the risks before using it.

## Testing

### Prerequisites

* node 10.16.0
* npm 6.9.0
* python 3.7.3
* web3.py 4.9.2

### Installation

* `npm install`

### Verification

* Verifying all the contracts:
  * `npm test` (quick testing)
  * `npm run coverage` (full coverage)
* [Verifying the SovrynSwapFormula contract](solidity/python/README.md)

### [Utilities](solidity/utils/README.md)

## MoC Integraton

//TODO: v2 only?  

There are three MoC SCs files:
1. MocBTCToBTCOracle: it is used only for tests purposes. It has a hardcoded rate of 1.
2. MocBTCToUSDOracle: it is the original MoC contract to get BTC/USD pair price.
3. MocUSDToBTCOracle: it returns USD/BTC price doing `1/(BTC/USD price)`.

To do the integration:

1. Get MoC medianizer SC address (BTC to USD)
  - Testnet: 0x667bd3d048FaEBb85bAa0E9f9D87cF4c8CDFE849
  - Mainnet: See [MoC Contracts verification.md](https://github.com/money-on-chain/main-RBTC-contract/blob/master/Contracts%20verification.md)
2. Deploy the neccesary oracles passing the medianizer address as constructor argument.

## License

SovrynSwap Protocol is open source and distributed under the Apache License v2.0
