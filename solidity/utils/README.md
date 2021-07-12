
## Utilities

### [Prerequisites](../../README.md#prerequisites)

### [Installation](../../README.md#installation)

### Compile contracts
1. Change contract folder in script Compile contracts `../../scripts/compile.sh`
2. Run from root dir `./scripts/compile.sh`

### Test Deployment

Deploys a set of contracts for testing purpose; can be used on both private and public networks:
```bash
node test_deployment_rsk.js
    Configuration file name
    Ethereum node address
    Account private key
```

To test on ganache, also use ```test_deployment_rsk.js``` 

You can take the commands from commands.txt.

The configuration file is updated during the process, in order to allow resuming a prematurely-terminated execution. This means, if you want to start a fresh deployment, you need to delete the phase and all of the deployed contract addresses from the config file.

Here is an example of the initial configuration file which should be provided to the process:
```json
{
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

!!!SYNTAX CHANGED!!!  
  
For ETH it is:  
```
node addConverter.js ETH <config e.g. addETH_testnet.json> <execution data e.g. data_testnet> <node address e.g. for rsk testnet: https://public-node.testnet.rsk.co>  <private key>
```

For USDT it is: 
```
node addConverter.js USDT <ethereum node address> <private key>
```

For BPro it is: 
```
node addConverter.js BPro <ethereum node address> <private key>
```

For SOV it is: 
```
node addConverter.js SOV <ethereum node address> <private key>
```

The config will be read from ```addBPro.jon``` or ```addUSDT.json```.

If an oracle for a token was already deployed, set the address in the reserve object within the converter object in the config. Remember that the wallet needs to posses WRBTC if WRBTC is used as second currency.

In case of BPro, add the MoC State address as  ```underlyingOracleAddress``` to the config file.

If the script breaks somewhere in the process and needs to be resumed, don't forget to comment out the line deploying the new converter. (someone should prettify this)

### Upgrading Converters:

Upgrades converter to latest smart contract; can be used on both private and public networks:
```bash
node upgradeConverter.js
    Configuration file name
    action
```
Action is used to represent part of the upgrade process. First part is used for upgrading the pool which generates a new converter address. This address is used by the second part of the script to setup the new converter with oracle and transfer the ownership to multisig.