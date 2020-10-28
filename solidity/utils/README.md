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

The configuration file is updated during the process, in order to allow resuming a prematurely-terminated execution.

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
If no medianizer address is specified, a medianizer mockup is deployed.
