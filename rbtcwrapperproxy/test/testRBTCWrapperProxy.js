require("@openzeppelin/test-helpers/configure")({
	provider: web3.currentProvider,
	singletons: {
		abstraction: "truffle",
	},
});
const fs = require("fs");

const assert = require("chai").assert;
const { expectRevert, expectEvent, BN } = require("@openzeppelin/test-helpers");

const RBTCWrapperProxy = artifacts.require("../RBTCWrapperProxy.sol");
const IERC20Token = artifacts.require("../interfaces/IERC20Token.sol");
const ISmartToken = artifacts.require("../interfaces/ISmartToken.sol");
const ISovrynSwapNetwork = artifacts.require("../interfaces/ISovrynSwapNetwork.sol");
const ILiquidityPoolV1Converter = artifacts.require("../interfaces/ILiquidityPoolV1Converter.sol");
const ILiquidityPoolV2Converter = artifacts.require("../interfaces/ILiquidityPoolV2Converter.sol");

const getConfig = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/config_rsk.json", { encoding: "utf8" }));
};

const getConfigFromSOV = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/addSOV.json", { encoding: "utf8" }));
};

const liquidityPoolV1ConverterAddress = getConfigFromSOV()["newLiquidityPoolV1Converter"].addr;
const liquidityPoolV2ConverterAddress = getConfig()["newLiquidityPoolV2Converter"].addr;
const sovrynSwapNetworkAddress = getConfig()["sovrynSwapNetwork"].addr;
const wrbtcAddress = getConfig()["RBTC"].addr;
const sovTokenAddress = getConfigFromSOV()["SOV"].addr;
const docTokenAddress = getConfig()["SUSD"].addr;

contract("RBTCWrapperProxy", async (accounts) => {
	let rbtcWrapperProxy, liquidityPoolV1Converter, liquidityPoolV2Converter, poolToken1Address, poolToken2Address, poolToken1, poolToken2, sovToken, docToken, sovrynSwapNetwork;

	beforeEach(async () => {
		rbtcWrapperProxy = await RBTCWrapperProxy.deployed();
		liquidityPoolV1Converter = await ILiquidityPoolV1Converter.at(liquidityPoolV1ConverterAddress);
		liquidityPoolV2Converter = await ILiquidityPoolV2Converter.at(liquidityPoolV2ConverterAddress);
		poolToken1Address = await liquidityPoolV1Converter.token();
		poolToken1 = await ISmartToken.at(poolToken1Address);
		poolToken2Address = await liquidityPoolV2Converter.poolToken(wrbtcAddress);
		poolToken2 = await ISmartToken.at(poolToken2Address);
		sovToken = await IERC20Token.at(sovTokenAddress);
		docToken = await IERC20Token.at(docTokenAddress);
		sovrynSwapNetwork = await ISovrynSwapNetwork.at(sovrynSwapNetworkAddress);
	});

	it("verifies that users could send RBTC and SOV, and then add liquidity to get pool token 1", async () => {
		var sovAmountBefore = web3.utils.fromWei(await sovToken.balanceOf(accounts[0]));
		var poolToken1AmountBefore = web3.utils.fromWei(await poolToken1.balanceOf(accounts[0]));

		var rbtcAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		var sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);

		console.log("sovAmountBefore "+sovAmountBefore);
		console.log("poolToken1AmountBefore "+poolToken1AmountBefore);
		console.log("rbtcAmount "+web3.utils.fromWei(rbtcAmount));
		console.log("sovAmount "+web3.utils.fromWei(sovAmount));
		console.log("liquidityPoolV1ConverterAddress "+liquidityPoolV1ConverterAddress);
		console.log("wrbtcAddress "+wrbtcAddress);
		console.log("sovTokenAddress "+sovTokenAddress);

		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(sovAmount * 4), { from: accounts[0] }); 

		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterAddress, 
			[wrbtcAddress,sovTokenAddress], 
			[rbtcAmount, sovAmount], 
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: rbtcAmount
		});
 
		var addedPoolToken1Amount = web3.utils.fromWei(result.logs[0].args._poolTokenAmount);

		assert.equal(
			web3.utils.fromWei(await sovToken.balanceOf(accounts[0])),
			(sovAmountBefore  - web3.utils.fromWei(sovAmount)).toFixed(6),
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
			_reserveAmounts: [rbtcAmount, sovAmount], 
			_poolTokenAmount: web3.utils.toWei(addedPoolToken1Amount),
		});

		var sovAmountAfter = web3.utils.fromWei(await sovToken.balanceOf(accounts[0]));
		var poolToken1AmountAfter = web3.utils.fromWei(await poolToken1.balanceOf(accounts[0]));

		// Send 2x SOV, User should get 1x SOV back
		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterAddress, 
			[wrbtcAddress,sovTokenAddress], 
			[rbtcAmount, web3.utils.toBN(sovAmount * 2)], 
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: rbtcAmount
		});
	
		var addedPoolToken1Amount = web3.utils.fromWei(result.logs[0].args._poolTokenAmount);

		assert.equal(
			web3.utils.fromWei(await sovToken.balanceOf(accounts[0])),
			(sovAmountAfter  - web3.utils.fromWei(sovAmount)).toFixed(6),
			"Wrong SOV balance"
		);

		assert.equal(
			web3.utils.BN(await poolToken1.balanceOf(accounts[0])).toString(),
			parseInt(web3.utils.toWei(poolToken1AmountAfter)) + parseInt(web3.utils.toWei(addedPoolToken1Amount)),
			"Wrong pool token balance"
		);

		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [wrbtcAddress, sovTokenAddress],
			_reserveAmounts: [rbtcAmount, web3.utils.toBN(sovAmount * 2)], 
			_poolTokenAmount: web3.utils.toWei(addedPoolToken1Amount),
		});
	});

	it("verifies that users could remove liquidity to burn pool token 1 and then get RBTC and SOV", async () => {
		await poolToken1.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e14), { from: accounts[0] });

		rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		sovAmountBefore = web3.utils.fromWei(await sovToken.balanceOf(accounts[0]));
		poolToken1AmountBefore = web3.utils.fromWei(await poolToken1.balanceOf(accounts[0]));

		var result = await rbtcWrapperProxy.removeLiquidityFromV1(liquidityPoolV1ConverterAddress, web3.utils.toBN(1e14), [wrbtcAddress, sovTokenAddress], [1, 1]);

		assert.equal(await poolToken1.balanceOf(accounts[0]), web3.utils.toWei(poolToken1AmountBefore) - 1e14, "Wrong pool token balance");

		var gasCost = result.receipt.gasUsed * (await web3.eth.getGasPrice());
		var addedRBTCAmount = result.logs[0].args._reserveAmounts[0];
		var addedSOVAmount = result.logs[0].args._reserveAmounts[1];

		await expectEvent(result.receipt, "LiquidityRemovedFromV1", {
			_provider: accounts[0],
			_reserveTokens: [wrbtcAddress, sovTokenAddress],
			_reserveAmounts: [addedRBTCAmount, addedSOVAmount]
		});

		assert.equal(
			parseFloat(web3.utils.fromWei(await web3.eth.getBalance(accounts[0]))).toFixed(9),
			(parseFloat(rbtcAmountBefore) + parseFloat(web3.utils.fromWei(addedRBTCAmount)) - parseFloat(web3.utils.fromWei(gasCost.toString()))).toFixed(9),
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

		var result = await rbtcWrapperProxy.addLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 1e16,
		});

		var gasCost = result.receipt.gasUsed * (await web3.eth.getGasPrice());
		var addedPoolToken2Amount = web3.utils.fromWei(result.logs[0].args._poolTokenAmount);
		assert.equal(await web3.eth.getBalance(accounts[0]), web3.utils.toWei(rbtcAmountBefore) - gasCost - 1e16, "Wrong RBTC balance");
		assert.equal(
			parseInt(web3.utils.BN(await poolToken2.balanceOf(accounts[0])).toString()),
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
		var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		var poolToken2AmountBefore = web3.utils.fromWei(await poolToken2.balanceOf(accounts[0]));

		await poolToken2.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e16), { from: accounts[0] });

		rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		var result = await rbtcWrapperProxy.removeLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});

		var gasCost = result.receipt.gasUsed * (await web3.eth.getGasPrice());
		var addedRBTCAmount = web3.utils.BN(result.logs[0].args._reserveAmount).toString();
		
		assert.equal(
			parseFloat(web3.utils.fromWei(await web3.eth.getBalance(accounts[0]))).toFixed(9),
			(parseFloat(rbtcAmountBefore) + parseFloat(web3.utils.fromWei(addedRBTCAmount)) - parseFloat(web3.utils.fromWei(gasCost.toString()))).toFixed(9),
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

		var pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, docTokenAddress);
		var result = await rbtcWrapperProxy.convertByPath(pathWRBTCToDoC, web3.utils.toBN(1e16), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 1e16
		});

		rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
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
		var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		var docTokenAmountBefore = web3.utils.fromWei(await docToken.balanceOf(accounts[0]));

		await docToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e20), { from: accounts[0] });

		var pathDoCToWRBTC = await sovrynSwapNetwork.conversionPath(docTokenAddress, wrbtcAddress);
		var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
		
		var result = await rbtcWrapperProxy.convertByPath(pathDoCToWRBTC, web3.utils.toBN(1), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});

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
