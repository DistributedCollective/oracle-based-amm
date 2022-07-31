# Reproducing steps to tests the RBTC-Wrapper-Proxy

## Introduction

The RBTCWrraperProxy contract, actually is not a "Proxy" contract, in other words it do not do delegate calls to an implementation or logic contract, in spite of its name.  

However, this contract fulfills a very important interface function: build on top of the Bancor's AMM platfrom for Sovryn, the RBTCWrapperProxy helps to serve as an interface between the Sovryn protocol and the AMM pools.

That's why this contract evolved as a separated repository, **inside** the AMM repository, and therefore the mechanics for testing and deploying are somehow tricky.

This document intends to describe how to use a short set of scripts built to make it easier the performance of tests for this contract in **truffle** suite.

## 1.- Clone AMM repo:  

`$ git clone https://github.com/DistributedCollective/oracle-based-amm`  
`$ cd oracle-based-amm`


## 2.- Reset the repo to the latest commit with changes relevant to the respective test.  

In this case we develope on top of the following commit:  

`$ git reset --hard de1a83dcb590d3e60810ed593c7a40baed57ed46`  
`$ git log -1 --stat`  

We do this in the case we have an actual deployment on chain coming from that specific commit.

## 3.- Install dependencies  

`$ npm ci --legacy-peer-deps`

## 4.- Go to each of these directories and run "truffle compile":  

`$ cd solidity`  
`$ truffle compile`  

`$ cd ..`  
`$ cd rbtcwrapperproxy`  

### but in this point we need first a "private-key" file:  

`$ touch private-key`  
`$ notepad private-key`  		

fill this "private-key" file with a private key string, without the '0x' prefix. And now we can do:  

`$ truffle compile`

## 5.- In the main folder run: "yarn export":  

`$ cd ..`  
`$ yarn export`  

## 6.- In a separate console, and located in the root directory of the repository, run:  

`$ ganache-cli`		

you can stop this local node with "`Ctrl + c`"

or, run:

`$ truffle develop`  

you can stop this local node with "`Ctrl + d`"

	6.1.- make sure you copied the private keys...
	NOTE: each time "$ ganache-cli" is run, a different set of private keys is generated
	but if you choose "$ truffle develop" the same set of private keys is always generated

	Private Keys (EXAMPLE for ganache)

    NEVER USE THIS KEYS IN PRODUCTION!!!    
	==================
	(0) 0x7f9f9401347299dad25336422033bcd1b5e765cbbdfd2dca775a7c08d9addc2c
	(1) 0x26a8a03f66007e63b37ad387dabf3954a937946c8aaefb2e70b21b23bff17148
	(2) 0x277f735af83fbf556a2a688984d296ed421d4f0f2def99eca15bb11b0f166caf
	(3) 0x9c44ffce6ba11cf548e8f370c3a1daae756963d8292a4f2df946274aeeb46693
	(4) 0x8992e423ef6b9c61b90a3365db316f0efbe99f28289853a0d83b674a443070f0
	(5) 0x37b616ca75526519a55f1b9accd9e0d01712d68d9871702cf54865d6f4442148
	(6) 0xe4aa1ea85ed3cf889bfe61ba164b4cacee8ebbf902cd6cfe3bda8a49c364fb4a
	(7) 0xb9395bb5e05befe100070ca107b6984803e0bd8108788add24bf060bdc895323
	(8) 0xd7103b6f9588836aa8cd210205894a12e976c861675522f8d6f65f231ca2c578
	(9) 0x02f9c08e441730cb375ee7514c2b895e7828c3b413e32c94a98a1c857b2009d4

	6.2.- also make sure you get the URL of the local node... in this case:
	
	Listening on 127.0.0.1:8545

## 7.- Back in the other terminal, run the following script (if you ran Ganache):  

`$ node solidity/utils/deployment_rsk.js solidity/utils/config_rsk.json http://127.0.0.1:8545/ 0x7f9f9401347299dad25336422033bcd1b5e765cbbdfd2dca775a7c08d9addc2c`

if a prompt appears, like this:  

"Enter gas-price or leave empty to use 20000000000:"  <-- just hit enter, or a valid value for gas price

if you choose the truffle node you may need to enter this:  

`$ node solidity/utils/deployment_rsk.js solidity/utils/config_rsk.json http://127.0.0.1:9545/ 0x275f3a7cb8bff8bd4dcbf38f2e1e4ae1ba76a187a74835b3de8e85b87ea742c2`

Check that the URL:port of Truffle Develop corresponds to http://127.0.0.1:9545/

	Private Keys (EXAMPLE for truffle... remember to add the '0x' prefx)

    NEVER USE THIS KEYS IN PRODUCTION!!!

	(0) 275f3a7cb8bff8bd4dcbf38f2e1e4ae1ba76a187a74835b3de8e85b87ea742c2
	(1) ff072b5ac8ff422b39e41d54d5065cc839f98d4513261b622cb2046ae5254004
	(2) b625192cee5528c989b2cae465a0ffd0b081b4c92d7c8b612bc3db346df21686
	(3) cbda5561df909f9a6bca7d030000ab012db99bc913e66bf53ca19547208108a1
	(4) fd835256930a99b31f6f19ea3eceff6e4885840d46cfc3a19658c51ad6ac171e
	(5) 63ef58b8044b26f4184bb6190eccc4b94cc4ab0a7f661e0a28759fad82f4c722
	(6) ba77d78bcf8db6c10a31b4fe0a1306059b0176b5415400058055143ef7d7ddea
	(7) b1391e9c1b36a631c3fbb33f82eace7b9672d70252f6222cb5a4221b6cc887f3
	(8) 576edb1bd6b458bb6147ff26625e1e255410c2b94d88da0e84b4dd749419088a
	(9) 3a27dacfb53ade8fc60cc1f00174ba733eadea60b7fbd8ee2f88eb4d5def76a7

## 8.- Run: 	

`$ yarn SOV`

## 9.- Run (similar to step 7):  

`$ node solidity/utils/deployment_rsk.js solidity/utils/addSOV.json <URL-of-your-local-node> <private-key-managed-by-your-local-node>`

in the former example you would run, for ganache:  

`$ node solidity/utils/deployment_rsk.js solidity/utils/addSOV.json http://127.0.0.1:8545/ 0x7f9f9401347299dad25336422033bcd1b5e765cbbdfd2dca775a7c08d9addc2c`

in the former example you would run, for truffle node:  

`$ node solidity/utils/deployment_rsk.js solidity/utils/addSOV.json http://127.0.0.1:9545/ 0x275f3a7cb8bff8bd4dcbf38f2e1e4ae1ba76a187a74835b3de8e85b87ea742c2`

## 10.- Run:  

`$ yarn USDSOV`

## 11.- Run (slightly different to step 7):  

`$ node solidity/utils/deployment_rsk.js solidity/utils/addUSDSOV.json <URL-of-your-local-node> <private-key-managed-by-your-local-node> false`

**IT IS VERY IMPORTANT THIS LAST "false" PARAMETER.**

in the former example you would run, for ganache:  

`$ node solidity/utils/deployment_rsk.js solidity/utils/addUSDSOV.json http://127.0.0.1:8545/ 0x7f9f9401347299dad25336422033bcd1b5e765cbbdfd2dca775a7c08d9addc2c false`

in the former example you would run, for truffle node:  

`$ node solidity/utils/deployment_rsk.js solidity/utils/addUSDSOV.json http://127.0.0.1:9545/ 0x275f3a7cb8bff8bd4dcbf38f2e1e4ae1ba76a187a74835b3de8e85b87ea742c2 false`

in some point you'll be prompted with this message:

"Please, provide the WRBTC address:"

Then take the address shown immediately above (if everything went right), paste it there, and hit enter.

If you have another message like this:

"Invalid JSON RPC response: "" " <--- just hit enter

## 12.- Run:  

`$ cd rbtcwrapperproxy`

## 13.- 	if you choose a truffle node, please run:  

`$ truffle test --network truffle`

## but if you choose a ganache node, please run:  

`$ truffle test`