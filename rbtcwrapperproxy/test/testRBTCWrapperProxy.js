require("@openzeppelin/test-helpers/configure")({
	provider: web3.currentProvider,
	singletons: {
		abstraction: "truffle",
	},
});

const assert = require("chai").assert;
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { before } = require("lodash");

const RBTCWrapperProxy = artifacts.require("../RBTCWrapperProxy.sol");
const IERC20Token = artifacts.require("../interfaces/IERC20Token.sol");
const ISmartToken = artifacts.require("../interfaces/ISmartToken.sol");
const ISovrynSwapNetwork = artifacts.require("../interfaces/ISovrynSwapNetwork.sol");
const ILiquidityPoolV1Converter = artifacts.require("../interfaces/ILiquidityPoolV1Converter.sol");
const ILiquidityPoolV2Converter = artifacts.require("../interfaces/ILiquidityPoolV2Converter.sol");

// Update following addresses
const liquidityPoolV1ConverterAddress = '0xD15A759318a392806702fded10cf3ffabcC89B4B';
const liquidityPoolV2ConverterAddress = '0x9F2A62fB86ae58086cC76e134de723c90894d5da';
const sovrynSwapNetworkAddress = '0x3B9BFeC104021662b6A2d7430533D4D29398f6E1';
const wrbtcAddress = '0x602C71e4DAC47a042Ee7f46E0aee17F94A3bA0B6';
const sovTokenAddress = '0x64B334435888bb5E44D890a7B319981c4Bb4B47d';
const docTokenAddress = '0x3194cBDC3dbcd3E11a07892e7bA5c3394048Cc87';


contract("RBTCWrapperProxy", async (accounts) => {
	let rbtcWrapperProxy, liquidityPoolV1Converter, liquidityPoolV2Converter, poolToken1Address, poolToken2Address, poolToken1, poolToken2, sovToken, docToken, sovrynSwapNetwork;

	beforeEach(async () => {
		rbtcWrapperProxy = await RBTCWrapperProxy.deployed();
		liquidityPoolV1Converter = await ILiquidityPoolV1Converter.at(liquidityPoolV1ConverterAddress);
		liquidityPoolV2Converter = await ILiquidityPoolV2Converter.at(liquidityPoolV2ConverterAddress);
		poolToken1Address = await liquidityPoolV1Converter.token();
		poolToken1 = await ISmartToken.at(poolToken1Address);
		poolToken2Address = await liquidityPoolV2Converter.poolToken(docTokenAddress);
		poolToken2 = await ISmartToken.at(poolToken2Address);
		sovToken = await IERC20Token.at(sovTokenAddress);
		docToken = await IERC20Token.at(docTokenAddress);
		sovrynSwapNetwork = await ISovrynSwapNetwork.at(sovrynSwapNetworkAddress);
	});

	it("verifies that users could send RBTC and SOV, and then add liquidity to get pool token 1", async () => {
		var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		var sovAmountBefore = web3.utils.fromWei(await sovToken.balanceOf(accounts[0]));
		var poolToken1AmountBefore = web3.utils.fromWei(await poolToken1.balanceOf(accounts[0]));
		console.log("The account address:", accounts[0]);
		console.log("The amount of RBTC of the account:", rbtcAmountBefore);
		console.log("The amount of SOV of the account:", sovAmountBefore);
		console.log("The amount of pool token 1 of the account:", poolToken1AmountBefore);

		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(4e16), { from: accounts[0] });






		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterAddress, 
			[wrbtcAddress,sovTokenAddress], 
			[web3.utils.toBN(1e14), web3.utils.toBN(1e16)], 
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 1e14
		});
		console.log("The amount of RBTC of the account after sending 0.01 RBTC:", web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
		console.log("The amount of SOV of the account after sending 0.01 SOV:", web3.utils.fromWei(await sovToken.balanceOf(accounts[0])));
		console.log("The amount of pool token 1 of the account:", web3.utils.fromWei(await poolToken1.balanceOf(accounts[0])));

		var addedPoolToken1Amount = web3.utils.fromWei(result.logs[0].args._poolTokenAmount);
		assert.equal(
			await sovToken.balanceOf(accounts[0]),
			parseInt(web3.utils.toWei(sovAmountBefore)) - 1e16,
			"Wrong SOV balance"
		);
		assert.equal(
			web3.utils.BN(await poolToken1.balanceOf(accounts[0])).toString(),
			parseInt(web3.utils.toWei(poolToken1AmountBefore)) + parseInt(web3.utils.toWei(addedPoolToken1Amount)),
			"Wrong pool token balance"
		);
		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [wrbtcAddress, sovTokenAddress],
			_reserveAmounts: [web3.utils.toBN(1e14), web3.utils.toBN(1e16)],
			_poolTokenAmount: web3.utils.toWei(addedPoolToken1Amount),
		});





		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterAddress, 
			[wrbtcAddress,sovTokenAddress], 
			[web3.utils.toBN(1e14), web3.utils.toBN(2e16)], 
			1, 
			{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 1e14
		});
		console.log("The amount of RBTC of the account after sending 0.01 RBTC again:", web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
		console.log("The amount of SOV of the account after sending 0.01 SOV again:", web3.utils.fromWei(await sovToken.balanceOf(accounts[0])));
		console.log("The amount of pool token 1 of the account:", web3.utils.fromWei(await poolToken1.balanceOf(accounts[0])));

		var addedPoolToken1Amount = web3.utils.fromWei(result.logs[0].args._poolTokenAmount);

		console.log("xxs", web3.utils.fromWei(await sovToken.balanceOf(rbtcWrapperProxy.address)), 
					"dws", web3.utils.fromWei(await sovToken.balanceOf(liquidityPoolV1ConverterAddress)));
	});
 
	it("verifies that users could remove liquidity to burn pool token 1 and then get RBTC and SOV", async () => {
		await poolToken1.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e15), { from: accounts[0] });

		rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		sovAmountBefore = web3.utils.fromWei(await sovToken.balanceOf(accounts[0]));
		poolToken1AmountBefore = web3.utils.fromWei(await poolToken1.balanceOf(accounts[0]));

		var result = await rbtcWrapperProxy.removeLiquidityFromV1(liquidityPoolV1ConverterAddress, web3.utils.toBN(1e15), [wrbtcAddress, sovTokenAddress], [1, 1]);
		console.log("The amount of RBTC of the account after burning 0.001 pool token 1:", web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
		console.log(
			"The amount of pool token 1 of the account after burning 0.001 pool token 1:",
			web3.utils.fromWei(await poolToken1.balanceOf(accounts[0]))
		);

		assert.equal(await poolToken1.balanceOf(accounts[0]), web3.utils.toWei(poolToken1AmountBefore) - 1e15, "Wrong pool token balance");

		var gasCost = result.receipt.gasUsed * (await web3.eth.getGasPrice());
		var addedRBTCAmount = result.logs[0].args._reserveAmounts[0];
		var addedSOVAmount = result.logs[0].args._reserveAmounts[1];

		await expectEvent(result.receipt, "LiquidityRemovedFromV1", {
			_provider: accounts[0],
			_reserveTokens: [wrbtcAddress, sovTokenAddress],
			_reserveAmounts: [addedRBTCAmount, addedSOVAmount]
		});

		assert.equal(
			await web3.eth.getBalance(accounts[0]),
			parseInt(web3.utils.toWei(rbtcAmountBefore)) + parseInt(addedRBTCAmount) - gasCost,
			"Wrong RBTC balance"
		);
		assert.equal(
			await sovToken.balanceOf(accounts[0]),
			parseInt(web3.utils.toWei(sovAmountBefore)) + parseInt(addedSOVAmount),
			"Wrong SOV balance"
		);
	});

	it("verifies that users could send RBTC and then add liquidity to get pool token 2", async () => {
		var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		var poolToken2AmountBefore = web3.utils.fromWei(await poolToken2.balanceOf(accounts[0]));
		console.log("The account address:", accounts[0]);
		console.log("The amount of RBTC of the account:", rbtcAmountBefore);
		console.log("The amount of pool token of the account:", poolToken2AmountBefore);

		var result = await rbtcWrapperProxy.addLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 1e16,
		});
		console.log("The amount of RBTC of the account after sending 0.01 RBTC:", web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
		console.log("The amount of pool token 2 of the account after sending 0.01 RBTC:", web3.utils.fromWei(await poolToken2.balanceOf(accounts[0])));

		var gasCost = result.receipt.gasUsed * (await web3.eth.getGasPrice());
		var addedPoolToken2Amount = web3.utils.fromWei(result.logs[0].args._poolTokenAmount);
		assert.equal(await web3.eth.getBalance(accounts[0]), web3.utils.toWei(rbtcAmountBefore) - gasCost - 1e16, "Wrong RBTC balance");
		assert.equal(
			web3.utils.BN(await poolToken2.balanceOf(accounts[0])).toString(),
			parseInt(web3.utils.toWei(poolToken2AmountBefore)) + parseInt(web3.utils.toWei(addedPoolToken2Amount)),
			"Wrong pool token balance"
		);
		await expectEvent(result.receipt, "LiquidityAdded", {
			_provider: accounts[0],
			_reserveAmount: web3.utils.toBN(1e16),
			_poolTokenAmount: web3.utils.toWei(addedPoolToken2Amount),
		});
	});

	it("verifies that users could remove liquidity to burn pool token 2 and then get RBTC", async () => {
		console.log("The account address:", accounts[0]);
		console.log("The amount of RBTC of the account:", rbtcAmountBefore);
		console.log("The amount of pool token of the account:", poolToken2AmountBefore);

		await poolToken2.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e16), { from: accounts[0] });
		console.log(
			"The allowance of pool token that the RBTCWrapperProxy smart contract could spend:",
			web3.utils.fromWei(await poolToken2.allowance(accounts[0], RBTCWrapperProxy.address))
		);
		var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		var poolToken2AmountBefore = web3.utils.fromWei(await poolToken2.balanceOf(accounts[0]));

		var result = await rbtcWrapperProxy.removeLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});
		console.log("The amount of RBTC of the account after burning 0.01 pool token:", web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
		console.log(
			"The amount of pool token 2 of the account after burning 0.01 pool token:",
			web3.utils.fromWei(await poolToken2.balanceOf(accounts[0]))
		);

		var gasCost = result.receipt.gasUsed * (await web3.eth.getGasPrice());
		var addedRBTCAmount = web3.utils.BN(result.logs[0].args._reserveAmount).toString();
		assert.equal(
			await web3.eth.getBalance(accounts[0]),
			parseInt(web3.utils.toWei(rbtcAmountBefore)) + parseInt(addedRBTCAmount) - gasCost,
			"Wrong RBTC balance"
		);
		assert.equal(await poolToken2.balanceOf(accounts[0]), web3.utils.toWei(poolToken2AmountBefore) - 1e16, "Wrong pool token balance");
		await expectEvent(result.receipt, "LiquidityRemoved", {
			_provider: accounts[0],
			_reserveAmount: addedRBTCAmount,
			_poolTokenAmount: web3.utils.toBN(1e16),
		});
	});

	it("verifies that users could send RBTC and then swap it to DoC", async () => {
		var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		var docTokenAmountBefore = web3.utils.fromWei(await docToken.balanceOf(accounts[0]));
		console.log("The account address:", accounts[0]);
		console.log("The amount of RBTC of the account:", rbtcAmountBefore);
		console.log("The amount of DoC of the account:", docTokenAmountBefore);

		var pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, docTokenAddress);
		var result = await rbtcWrapperProxy.convertByPath(pathWRBTCToDoC, web3.utils.toBN(1e16), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 1e16,
		});
		console.log("The amount of RBTC of the account after sending 0.01 RBTC:", web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
		console.log("The amount of DoC of the account after sending 0.01 RBTC:", web3.utils.fromWei(await docToken.balanceOf(accounts[0])));

		var gasCost = result.receipt.gasUsed * (await web3.eth.getGasPrice());
		var addedDoCTokenAmount = web3.utils.BN(result.logs[0].args._targetTokenAmount).toString();
		assert.equal(await web3.eth.getBalance(accounts[0]), parseInt(web3.utils.toWei(rbtcAmountBefore)) - gasCost - 1e16, "Wrong RBTC balance");
		assert.equal(
			web3.utils.BN(await docToken.balanceOf(accounts[0])).toString(),
			parseInt(web3.utils.toWei(docTokenAmountBefore)) + parseInt(addedDoCTokenAmount),
			"Wrong DoC token balance"
		);
		await expectEvent(result.receipt, "TokenConverted", {
			_beneficiary: accounts[0],
			_sourceTokenAmount: web3.utils.toBN(1e16),
			_targetTokenAmount: addedDoCTokenAmount,
			_path: pathWRBTCToDoC,
		});
	});

	it("verifies that users could send DoC and then swap it to RBTC", async () => {
		console.log("The account address:", accounts[0]);
		console.log("The amount of RBTC of the account:", rbtcAmountBefore);
		console.log("The amount of DoC of the account:", docTokenAmountBefore);

		await docToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e20), { from: accounts[0] });
		console.log(
			"The allowance of DoC that the RBTCWrapperProxy smart contract could spend:",
			web3.utils.fromWei((await docToken.allowance(accounts[0], RBTCWrapperProxy.address)).toString())
		);
		var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		var docTokenAmountBefore = web3.utils.fromWei(await docToken.balanceOf(accounts[0]));

		var pathDoCToWRBTC = await sovrynSwapNetwork.conversionPath(docTokenAddress, wrbtcAddress);
		var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		var result = await rbtcWrapperProxy.convertByPath(pathDoCToWRBTC, web3.utils.toBN(1e20), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});
		console.log("The amount of RBTC of the account after sending 100 DoC:", web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
		console.log("The amount of DoC of the account after sending 100 DoC:", web3.utils.fromWei(await docToken.balanceOf(accounts[0])));

		var gasCost = result.receipt.gasUsed * (await web3.eth.getGasPrice());
		var addedRBTCAmount = web3.utils.BN(result.logs[0].args._targetTokenAmount).toString();
		assert.equal(
			await web3.eth.getBalance(accounts[0]),
			parseInt(web3.utils.toWei(rbtcAmountBefore)) + parseInt(addedRBTCAmount) - gasCost,
			"Wrong RBTC balance"
		);
		assert.equal(
			web3.utils.BN(await docToken.balanceOf(accounts[0])).toString(),
			parseInt(web3.utils.toWei(docTokenAmountBefore)) - 1e20,
			"Wrong DoC token balance"
		);
		await expectEvent(result.receipt, "TokenConverted", {
			_beneficiary: accounts[0],
			_sourceTokenAmount: web3.utils.toBN(1e20),
			_targetTokenAmount: addedRBTCAmount,
			_path: pathDoCToWRBTC,
		});
	});

	it("should revert when sending rBTC to this smart contract from user directly", async () => {
		await expectRevert.unspecified(rbtcWrapperProxy.send(web3.utils.toBN(1e16)));
	});

	it("should revert when calling the addLIquidity() without sending RBTC", async () => {
		await expectRevert.unspecified(
			rbtcWrapperProxy.addLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {
				from: accounts[0],
				to: RBTCWrapperProxy.address,
			}),
			"No RBTC"
		);
	});

	it("should revert when amount param not identical to msg.value to call addLiquidity()", async () => {
		await expectRevert.unspecified(
			rbtcWrapperProxy.addLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {
				from: accounts[0],
				to: RBTCWrapperProxy.address,
				value: 1e8,
			}),
			"The provided amount not identical to msg.value"
		);
	});

	it("should revert when passing wrong path param to convertByPath()", async () => {
		var pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, docTokenAddress);
		var pathDoCToWRBTC = await sovrynSwapNetwork.conversionPath(docTokenAddress, wrbtcAddress);
		await expectRevert.unspecified(
			rbtcWrapperProxy.convertByPath(pathDoCToWRBTC, web3.utils.toBN(1e16), 1, {
				from: accounts[0],
				to: RBTCWrapperProxy.address,
				value: 1e16,
			}),
			"Wrong path param"
		);
		await expectRevert.unspecified(
			rbtcWrapperProxy.convertByPath(pathWRBTCToDoC, web3.utils.toBN(1e20), 1, { from: accounts[0], to: RBTCWrapperProxy.address }),
			"Wrong path param"
		);
	});
});
