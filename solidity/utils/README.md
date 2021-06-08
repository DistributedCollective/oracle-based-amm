
## Utilities

### [Prerequisites](../../README.md#prerequisites)

### [Installation](../../README.md#installation)

### Compile contracts
1. Run from root dir `npx truffle compile`

### Test Deployment

Deploys a set of contracts for testing purpose; can be used on both private and public networks:
```bash
node deployment_rsk.js
    Configuration file name
    Output file name
```

To test on ganache, also use ```test_deployment_rsk.js``` 

You can take the commands from commands.txt.

The configuration file is updated during the process, in order to allow resuming a prematurely-terminated execution. This means, if you want to start a fresh deployment, you need to delete the phase and all of the deployed contract addresses from the config file.

Here is an example of the initial configuration file which should be provided to the process:
```json
{
    "privateKey": "0x",
    "nodeURL": "https://public-node.testnet.rsk.co",
    "reserves": [
        {
            "symbol": "RBTC",
            "decimals": 18,
            "address": "0xDfB1074C1F0e626de1ECB2C74Bbea3b3935bC883"
        },
        {
            "symbol": "SUSD",
            "decimals": 18,
            "address": "0x73Bc0184c3385c373E76375A2F53Dd3A1696eb42"
        }
    ],
    "converters": [
        {
            "type": 2,
            "symbol": "sUSDrBTC",
            "decimals": 18,
            "fee": "0.1%",
            "reserves": [
                {
                    "symbol": "RBTC",
                    "weight": "50%",
                    "balance": "0.1"
                },
                {
                    "symbol": "SUSD",
                    "weight": "50%",
                    "balance": "1000"
                }
            ]
        }
    ]
}

```

If deploying on testnet or mainnet, the medianizer address needs to be set in the config as well.

```
"mocMedianizer": "0x667bd3d048FaEBb85bAa0E9f9D87cF4c8CDFE849"
```
If no medianizer address is specified, a medianizer mockup is deployed.

Note: Before running the deployment (even on ganache), the token addresses must already exist! Run the deployment of the Sovryn Trading Protocol first! (repository Sovryn-smart-contracts)

### Adding converters

To add converters to an existing swap network, use ```addConverter.js```.

For USDT on rsk network, it is: ```node addConverter.js USDT rsk```

For BPro on rsk test network, it is: ```node addConverter.js BPro rsk-testnet```

The config will be read from ```add_bpro_rsk-testnet.json``` or ```add_usdt_rsk.json``` which will be automatically read by the script

Please set private key and node URL in the config file before running the script.

If an oracle for a token was already deployed, set the address in the reserve object within the converter object in the config. Remember that the wallet needs to posses WRBTC if WRBTC is used as second currency.

In case of BPro, add the MoC State address as  ```underlyingOracleAddress``` to the config file.

If the script breaks somewhere in the process and needs to be resumed, don't forget to comment out the line deploying the new converter. (someone should prettify this)

### Upgrading converters

To upgrade existing converters on swap network, use ```upgradeConverter.js```.

The command will look like: ```node upgradeConverter.js configFile.json```

The config will be read from `./solidity/utils/` directory.

Please set private key and node URL in the config file before running the script.

Here is an example of the initial configuration file which should be provided to the process:
```json
{
    "privateKey": "0x",
    "nodeURL": "https://public-node.testnet.rsk.co",
    "type": 1,
    "reserves": [
        {
            "symbol": "RBTC",
            "decimals": 18,
            "address": "0xDfB1074C1F0e626de1ECB2C74Bbea3b3935bC883"
        },
        {
            "symbol": "SUSD",
            "decimals": 18,
            "address": "0x73Bc0184c3385c373E76375A2F53Dd3A1696eb42"
        }
    ],
    "converters": [
        {
            "type": 1,
            "symbol": "sUSDrBTC",
            "decimals": 18,
            "fee": "0.1%",
            "reserves": [
                {
                    "symbol": "RBTC",
                    "weight": "50%",
                    "balance": "0.1"
                },
                {
                    "symbol": "SUSD",
                    "weight": "50%",
                    "balance": "1000"
                }
            ]
        }
    ],
    "converterFactory": {
        "name": "ConverterFactory",
        "addr": "0x73Bc0184c3385c373E76375A2F53Dd3A1696eb42",
        "args": ""
    },
    "converterUpgrader": {
        "name": "ConverterUpgrader",
        "addr": "0x73Bc0184c3385c373E76375A2F53Dd3A1696eb42",
        "args": ""
    },
    "converterRegistry": {
        "name": "ConverterRegistry",
        "addr": "0x73Bc0184c3385c373E76375A2F53Dd3A1696eb42",
        "args": ""
    },
    "converterContract": {
        "name": "LiquidityPoolV1Converter",
        "addr": "0x73Bc0184c3385c373E76375A2F53Dd3A1696eb42",
        "args": ""
    }
}

```