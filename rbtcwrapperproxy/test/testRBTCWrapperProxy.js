require("@openzeppelin/test-helpers/configure")({
	provider: web3.currentProvider,
	singletons: {
		abstraction: "truffle",
	},
});

const { decodeLogs } = require("../../solidity/test/helpers/lib.js");
const WRBTC = artifacts.require("./WRBTC.sol");

const fs = require("fs");

const assert = require("chai").assert;
const { expectRevert, expectEvent, BN, constants } = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const { expect } = require("chai");

const RBTCWrapperProxy = artifacts.require("../RBTCWrapperProxy.sol");
const IERC20Token = artifacts.require("../interfaces/IERC20Token.sol");
const ISmartToken = artifacts.require("../interfaces/ISmartToken.sol");
const ISovrynSwapNetwork = artifacts.require("../interfaces/ISovrynSwapNetwork.sol");
const ILiquidityPoolV1Converter = artifacts.require("../interfaces/ILiquidityPoolV1Converter.sol");
// const ILiquidityPoolV2Converter = artifacts.require("../interfaces/ILiquidityPoolV2Converter.sol");
const LiquidityMining = artifacts.require("../mockups/LiquidityMining.sol");
const LoanToken = artifacts.require("../mockups/LoanToken.sol");
const IERC20 = artifacts.require("../interfaces/IERC20.sol");

const getConfig = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/config_rsk.json", { encoding: "utf8" }));
};

const getConfigFromSOV = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/addSOV.json", { encoding: "utf8" }));
};

const getConfigFromSUSDSOV = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/addUSDSOV.json", { encoding: "utf8" }));
};

const liquidityPoolV1ConverterAddress = getConfigFromSOV()["newLiquidityPoolV1Converter"].addr;
const liquidityPoolV1ConverterUSDSOV = getConfigFromSUSDSOV()["newLiquidityPoolV1Converter"].addr;
// const liquidityPoolV2ConverterAddress = getConfig()["newLiquidityPoolV2Converter"].addr;
const sovrynSwapNetworkAddress = getConfig()["sovrynSwapNetwork"].addr;
const wrbtcAddress = getConfig()["RBTC"].addr;
const sovTokenAddress = getConfigFromSOV()["SOV"].addr;
const usdTokenAddress = getConfig()["SUSD"].addr;

contract("RBTCWrapperProxy", async (accounts) => {
	let rbtcWrapperProxy, liquidityPoolV1Converter, liquidityPoolV2Converter, poolTokenV1Address, wrbtcPoolTokenV2Address, poolTokenV1, wrbtcPoolTokenV2, sovToken, usdToken, wrbtcToken, sovrynSwapNetwork;

	before(async () => {
		rbtcWrapperProxy = await RBTCWrapperProxy.deployed();
		liquidityPoolV1Converter = await ILiquidityPoolV1Converter.at(liquidityPoolV1ConverterAddress);
		// liquidityPoolV2Converter = await ILiquidityPoolV2Converter.at(liquidityPoolV2ConverterAddress);
		poolTokenV1Address = await liquidityPoolV1Converter.token();
		poolTokenV1 = await ISmartToken.at(poolTokenV1Address);
		// wrbtcPoolTokenV2Address = await liquidityPoolV2Converter.poolToken(wrbtcAddress);
		// wrbtcPoolTokenV2 = await ISmartToken.at(wrbtcPoolTokenV2Address);
		// usdPoolTokenV2Address = await liquidityPoolV2Converter.poolToken(usdTokenAddress);
		// usdPoolTokenV2 = await ISmartToken.at(usdPoolTokenV2Address);
		sovToken = await IERC20Token.at(sovTokenAddress);
		usdToken = await IERC20Token.at(usdTokenAddress);
		wrbtcToken = await WRBTC.at(wrbtcAddress);
		sovrynSwapNetwork = await ISovrynSwapNetwork.at(sovrynSwapNetworkAddress);
		liquidityMining = await LiquidityMining.deployed();
		usdLoanToken = await LoanToken.deployed();
		await sovToken.transfer(liquidityMining.address, web3.utils.toWei("100","Ether"));
	});

	it("verifies that users could send RBTC and SOV, and then add liquidity to get pool token 1", async () => {
		var sovAmountBefore = await sovToken.balanceOf(accounts[0]);
		var poolTokenV1AmountBefore = await poolTokenV1.balanceOf(accounts[0]);

		var rbtcAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		var sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);

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
 
		var addedPoolTokenV1Amount = new BN(result.logs[0].args._poolTokenAmount);
		var expectedBalance = new BN(sovAmountBefore.toString()).sub(sovAmount)
		assert.equal(
			(await sovToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
			"Wrong SOV balance"
		);
		
		assert.equal(
			(await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address)).toString(),
			addedPoolTokenV1Amount.toString(),
			"Wrong pool token balance on LM contract"
		);
		
		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [wrbtcAddress, sovTokenAddress],
			_reserveAmounts: [rbtcAmount, sovAmount], 
			_poolTokenAmount: addedPoolTokenV1Amount,
		});

		var sovAmountAfter = await sovToken.balanceOf(accounts[0]);

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
	
		addedPoolTokenV1Amount = addedPoolTokenV1Amount.add(new BN(result.logs[0].args._poolTokenAmount));
		expectedBalance = new BN(sovAmountAfter.toString()).sub(web3.utils.toBN(sovAmount));

		assert.equal(
			(await sovToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
			"Wrong SOV balance (2)"
		);
		
		assert.equal(
			(await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address)).toString(),
			addedPoolTokenV1Amount.toString(),
			"Wrong pool token balance on LM contract"
		);

		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [wrbtcAddress, sovTokenAddress],
			_reserveAmounts: [rbtcAmount, web3.utils.toBN(sovAmount * 2)]
		});
	});

	it("verifies that users could remove liquidity to burn pool token 1 and then get RBTC and SOV", async () => {
		poolTokenBalance = await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address);
		assert(poolTokenBalance > 0, "incorrect test setup");

		rbtcAmountBefore = await web3.eth.getBalance(accounts[0]);
		sovAmountBefore = await sovToken.balanceOf(accounts[0]);

		var result = await rbtcWrapperProxy.removeLiquidityFromV1(liquidityPoolV1ConverterAddress, poolTokenBalance, [wrbtcAddress, sovTokenAddress], [1, 1]);

		var gasCost = new BN(result.receipt.gasUsed).mul( new BN((await web3.eth.getGasPrice()).toString()));
		var addedRBTCAmount = result.logs[0].args._reserveAmounts[0];
		var addedSOVAmount = result.logs[0].args._reserveAmounts[1];

		await expectEvent(result.receipt, "LiquidityRemovedFromV1", {
			_provider: accounts[0],
			_reserveTokens: [wrbtcAddress, sovTokenAddress],
			_reserveAmounts: [addedRBTCAmount, addedSOVAmount]
		});

		expectedBalance = new BN(rbtcAmountBefore).add(new BN(addedRBTCAmount)).sub(gasCost);
		assert.equal(
			await web3.eth.getBalance(accounts[0]),
			expectedBalance.toString(),
			"Wrong RBTC balance"
		);

		//adding the pool token balance because of the reward being paid out
		expectedBalance = new BN(sovAmountBefore).add(addedSOVAmount).add(poolTokenBalance);
		assert.equal(
			(await sovToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
			"Wrong SOV balance"
		);
	});

	// it("verifies that users could send RBTC and then add liquidity to get pool token 2", async () => {
	// 	var rbtcAmountBefore = await web3.eth.getBalance(accounts[0]);
	// 	var wrbtcPoolTokenV2AmountBefore = await wrbtcPoolTokenV2.balanceOf(accounts[0]);

	// 	var result = await rbtcWrapperProxy.addLiquidityToV2(liquidityPoolV2ConverterAddress, wrbtcAddress, web3.utils.toBN(1e16), 1, {
	// 		from: accounts[0],
	// 		to: RBTCWrapperProxy.address,
	// 		value: 1e16,
	// 	});

	// 	var gasCost = new BN(result.receipt.gasUsed).mul( new BN((await web3.eth.getGasPrice()).toString()));
	// 	var addedWrbtcPoolTokenV2Amount = new BN(result.logs[0].args._poolTokenAmount);
	// 	var expectedBalance = new BN(rbtcAmountBefore.toString()).sub(gasCost).sub(new BN((10**16).toString()));
		
	// 	assert.equal(await web3.eth.getBalance(accounts[0]), expectedBalance, "Wrong RBTC balance");

	// 	assert.equal(
	// 		(await liquidityMining.userLPBalance(accounts[0], wrbtcPoolTokenV2Address)).toString(),
	// 		addedWrbtcPoolTokenV2Amount.toString(),
	// 		"Wrong pool token balance on LM contract"
	// 	);
	// 	await expectEvent(result.receipt, "LiquidityAdded", {
	// 		_provider: accounts[0],
	// 		_reserveAmount: web3.utils.toBN(1e16),
	// 		_poolTokenAmount: addedWrbtcPoolTokenV2Amount,
	// 	});
	// });

	// it("verifies that users could add USD liquidity to the v2 pool", async () => {
	// 	var usdAmountBefore = await usdToken.balanceOf(accounts[0]);

	// 	await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e16), { from: accounts[0] });

	// 	var result = await rbtcWrapperProxy.addLiquidityToV2(liquidityPoolV2ConverterAddress, usdTokenAddress, web3.utils.toBN(1e16), 1);

	// 	var addedUsdPoolTokenV2Amount = new BN(result.logs[0].args._poolTokenAmount);
	// 	var expectedBalance = usdAmountBefore.sub(new BN((10**16).toString()));

	// 	assert.equal((await usdToken.balanceOf(accounts[0])).toString(), expectedBalance.toString(), "Wrong USD balance");

	// 	assert.equal(
	// 		(await liquidityMining.userLPBalance(accounts[0], usdPoolTokenV2Address)).toString(),
	// 		addedUsdPoolTokenV2Amount.toString(),
	// 		"Wrong pool token balance"
	// 	);
	// 	await expectEvent(result.receipt, "LiquidityAdded", {
	// 		_provider: accounts[0],
	// 		_reserveAmount: web3.utils.toBN(1e16),
	// 		_poolTokenAmount: addedUsdPoolTokenV2Amount,
	// 	});
	// });

	// it("verifies that users could remove liquidity to burn pool token 2 and then get RBTC", async () => {
	// 	poolTokenBalance = await liquidityMining.userLPBalance(accounts[0], wrbtcPoolTokenV2Address);
	// 	assert(poolTokenBalance > 0, "incorrect test setup");

	// 	var sovAmountBefore = await sovToken.balanceOf(accounts[0]);

	// 	var rbtcAmountBefore = await web3.eth.getBalance(accounts[0]);
	// 	var result = await rbtcWrapperProxy.removeLiquidityFromV2(liquidityPoolV2ConverterAddress, wrbtcAddress, poolTokenBalance, 1, {
	// 		from: accounts[0],
	// 		to: RBTCWrapperProxy.address,
	// 	});

	// 	var gasCost = new BN(result.receipt.gasUsed).mul( new BN((await web3.eth.getGasPrice()).toString()));
	// 	var addedRBTCAmount = web3.utils.BN(result.logs[0].args._reserveAmount);
	// 	var expectedBalance = new BN(rbtcAmountBefore).add(addedRBTCAmount).sub(gasCost);
		
	// 	assert.equal(
	// 		await web3.eth.getBalance(accounts[0]),
	// 		expectedBalance.toString(),
	// 		"Wrong RBTC balance"
	// 	);

	// 	//checking if the LM reward being paid out
	// 	expectedBalance = new BN(sovAmountBefore).add(poolTokenBalance);
	// 	assert.equal(
	// 		(await sovToken.balanceOf(accounts[0])).toString(),
	// 		expectedBalance.toString(),
	// 		"Wrong SOV balance"
	// 	);
		
	// 	await expectEvent(result.receipt, "LiquidityRemoved", {
	// 		_provider: accounts[0],
	// 		_reserveAmount: addedRBTCAmount,
	// 		_poolTokenAmount: poolTokenBalance,
	// 	});
	// });

	// it("verifies that users could remove liquidity to burn pool token 2 and then get RBTC", async () => {
	// 	poolTokenBalance = await liquidityMining.userLPBalance(accounts[0], usdPoolTokenV2Address);
	// 	assert(poolTokenBalance > 0, "incorrect test setup");

	// 	var sovAmountBefore = await sovToken.balanceOf(accounts[0]);

	// 	var usdAmountBefore = await usdToken.balanceOf(accounts[0]);
	// 	var result = await rbtcWrapperProxy.removeLiquidityFromV2(liquidityPoolV2ConverterAddress, usdTokenAddress, poolTokenBalance, 1, {
	// 		from: accounts[0],
	// 		to: RBTCWrapperProxy.address,
	// 	});

	// 	var addedUSDAmount = web3.utils.BN(result.logs[0].args._reserveAmount);
	// 	var expectedBalance = usdAmountBefore.add(addedUSDAmount);
		
	// 	assert.equal(
	// 		await usdToken.balanceOf(accounts[0]),
	// 		expectedBalance.toString(),
	// 		"Wrong USD balance"
	// 	);
		
	// 	//checking if the LM reward being paid out
	// 	expectedBalance = new BN(sovAmountBefore).add(poolTokenBalance);
	// 	assert.equal(
	// 		(await sovToken.balanceOf(accounts[0])).toString(),
	// 		expectedBalance.toString(),
	// 		"Wrong SOV balance"
	// 	);
		
	// 	await expectEvent(result.receipt, "LiquidityRemoved", {
	// 		_provider: accounts[0],
	// 		_reserveAmount: addedUSDAmount,
	// 		_poolTokenAmount: poolTokenBalance,
	// 	});
	// });

	it("verifies that users could send RBTC and then swap it to DoC", async () => {
		var rbtcAmountBefore = await web3.eth.getBalance(accounts[0]);
		var usdTokenAmountBefore = await usdToken.balanceOf(accounts[0]);

		var pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, usdTokenAddress);
		var result = await rbtcWrapperProxy.convertByPath(pathWRBTCToDoC, web3.utils.toBN(1e16), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 1e16
		});

		var gasCost = new BN(result.receipt.gasUsed).mul(new BN((await web3.eth.getGasPrice()).toString()));
		var addedDoCTokenAmount = web3.utils.BN(result.logs[0].args._targetTokenAmount);
		var expectedBalance = new BN(rbtcAmountBefore).sub(gasCost).sub(new BN((10**16).toString()));
		assert.equal(await web3.eth.getBalance(accounts[0]), expectedBalance.toString(), "Wrong RBTC balance");
		expectedBalance = new BN(usdTokenAmountBefore).add(addedDoCTokenAmount);
		assert.equal(
			await usdToken.balanceOf(accounts[0]),
			expectedBalance.toString(),
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
		var rbtcAmountBefore = await web3.eth.getBalance(accounts[0]);
		var usdTokenAmountBefore = await usdToken.balanceOf(accounts[0]);

		await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e20), { from: accounts[0] });

		var pathDoCToWRBTC = await sovrynSwapNetwork.conversionPath(usdTokenAddress, wrbtcAddress);
		var rbtcAmountBefore = await web3.eth.getBalance(accounts[0]);
		
		var result = await rbtcWrapperProxy.convertByPath(pathDoCToWRBTC, web3.utils.toBN(1e20), 1, {
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});

		var gasCost = new BN(result.receipt.gasUsed).mul( new BN((await web3.eth.getGasPrice()).toString()));;
		var addedRBTCAmount = new BN(result.logs[0].args._targetTokenAmount);
		var expectedBalance = new BN(rbtcAmountBefore).add(addedRBTCAmount).sub(gasCost);
		assert.equal(
			await web3.eth.getBalance(accounts[0]),
			expectedBalance.toString(),
			"Wrong RBTC balance"
		);

		expectedBalance = new BN(usdTokenAmountBefore).sub(web3.utils.toBN(1e20));
		assert.equal(
			web3.utils.BN(await usdToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
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

	// it("should revert when calling the addLIquidity() without sending RBTC", async () => {
	// 	await expectRevert.unspecified(
	// 		rbtcWrapperProxy.addLiquidityToV2(liquidityPoolV2ConverterAddress, wrbtcAddress, web3.utils.toBN(1e16), 1, {
	// 			from: accounts[0],
	// 			to: RBTCWrapperProxy.address,
	// 		}),
	// 		"No RBTC"
	// 	);
	// });

	// it("should revert when amount param not identical to msg.value to call addLiquidityToV2()", async () => {
	// 	await expectRevert.unspecified(
	// 		rbtcWrapperProxy.addLiquidityToV2(liquidityPoolV2ConverterAddress, wrbtcAddress, web3.utils.toBN(1e16), 1, {
	// 			from: accounts[0],
	// 			to: RBTCWrapperProxy.address,
	// 			value: 1e8,
	// 		}),
	// 		"The provided amount not identical to msg.value"
	// 	);
	// });

	it("should revert when passing wrong path param to convertByPath()", async () => {
		var pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, usdTokenAddress);
		var pathDoCToWRBTC = await sovrynSwapNetwork.conversionPath(usdTokenAddress, wrbtcAddress);
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

	it("Should revert when providing wrbtc / wrbtc as the pairs", async() => {
		const rbtcAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		const sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);
		await expectRevert.unspecified(rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterAddress, 
			[wrbtcAddress, wrbtcAddress],
			[rbtcAmount, rbtcAmount],
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: rbtcAmount
		}));
	})

	it("Should revert when providing rbtc in non-wrbtc pairs", async() => {
		const rbtcAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		const sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);
		await expectRevert(rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterAddress, 
			[usdTokenAddress, sovTokenAddress],
			[rbtcAmount, sovAmount],
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: rbtcAmount
		}), "RBTC is not allowed for non-wrbtc pairs");
	})

	it("Should revert when providing 0 amount (0 index)", async() => {
		const sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);
		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await sovToken.approve(RBTCWrapperProxy.address, sovAmount, { from: accounts[0] });
		await expectRevert(rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterUSDSOV, 
			[usdTokenAddress, sovTokenAddress],
			[0, sovAmount],
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		}), "ERR_INVALID_AMOUNT");
	})

	it("Should revert when providing 0 amount (1 index)", async() => {
		const usdAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await usdToken.approve(RBTCWrapperProxy.address, usdAmount, { from: accounts[0] });
		await expectRevert(rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterUSDSOV, 
			[usdTokenAddress, sovTokenAddress],
			[usdAmount, 0],
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		}), "ERR_INVALID_AMOUNT");
	})

	it("Should revert rbtc sent not the same as the value params (wrbtc 0 index)", async() => {
		const rbtcAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		const sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);
		await expectRevert(rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterAddress, 
			[wrbtcAddress, sovTokenAddress],
			[rbtcAmount, sovAmount],
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 1
		}), "The provided amount of RBTC should be identical to msg.value");
	})

	it("Should revert rbtc sent not the same as the value params (wrbtc 1 index)", async() => {
		const rbtcAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		const sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);

		await wrbtcToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await sovToken.approve(RBTCWrapperProxy.address, sovAmount, { from: accounts[0] });
		await expectRevert(rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterAddress,
			[sovTokenAddress, wrbtcAddress],
			[sovAmount, rbtcAmount],
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 1
		}), "The provided amount of RBTC should be identical to msg.value");
	})

	it("Should revert if sending 0 as amount when removing liquidity", async() => {
		await expectRevert(rbtcWrapperProxy.removeLiquidityFromV1(liquidityPoolV1ConverterAddress, 0, [wrbtcAddress, sovTokenAddress], [1, 1]), "The amount should larger than zero");
	})

	it("Should failed if passing the wrong token pair to the converter", async() => {
		var usdAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		var sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);

		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await sovToken.approve(RBTCWrapperProxy.address, sovAmount, { from: accounts[0] });

		await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await usdToken.approve(RBTCWrapperProxy.address, usdAmount, { from: accounts[0] })

		await expectRevert(rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterAddress, 
			[usdTokenAddress,sovTokenAddress], 
			[usdAmount, sovAmount],
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
			value: 0
		}), "ERR_INVALID_RESERVE");
	})

	it("verifies that users could send a non-rbtc based pair (USD - SOV) and then add liquidity to get pool token v1 (SOV refunded)", async () => {
		var sovAmountBefore = await sovToken.balanceOf(accounts[0]);
		var usdAmountBefore = await usdToken.balanceOf(accounts[0]);

		liquidityPoolV1Converter = await ILiquidityPoolV1Converter.at(liquidityPoolV1ConverterUSDSOV);
		poolTokenV1Address = await liquidityPoolV1Converter.token();
		poolTokenV1 = await ISmartToken.at(poolTokenV1Address);
		var poolTokenV1AmountBefore = await poolTokenV1.balanceOf(accounts[0]);

		var usdAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		var sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);

		const pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, usdTokenAddress);

		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(sovAmount * 4), { from: accounts[0] });

		await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(usdAmount * 4), { from: accounts[0] });

		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterUSDSOV, 
			[usdTokenAddress,sovTokenAddress], 
			[usdAmount, sovAmount], 
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});

		var usdAmountAfter = await usdToken.balanceOf(accounts[0]);

		expect(usdAmountAfter.toString()).to.equal( (usdAmountBefore.sub(usdAmount)).toString() );

		let decode = decodeLogs(result.receipt.rawLogs, IERC20, "Transfer");
		let refundTx = decode[decode.length - 1].args;
		let refundedSOV = refundTx.to === accounts[0] ? refundTx.value : 0;

		var addedPoolTokenV1Amount = new BN(result.logs[0].args._poolTokenAmount);
		var expectedBalance = new BN(sovAmountBefore.toString()).sub(sovAmount).add(new BN(refundedSOV));

		assert.equal(
			(await sovToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
			"Wrong SOV balance"
		);
		
		assert.equal(
			(await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address)).toString(),
			addedPoolTokenV1Amount.toString(),
			"Wrong pool token balance on LM contract (1)"
		);
		
		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [usdTokenAddress, sovTokenAddress],
			_reserveAmounts: [usdAmount, sovAmount], 
			_poolTokenAmount: addedPoolTokenV1Amount,
		});

		var sovAmountAfter = await sovToken.balanceOf(accounts[0]);

		usdAmountBefore = await usdToken.balanceOf(accounts[0]);
		// Send 2x SOV, User should get 1x SOV back
		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterUSDSOV, 
			[usdTokenAddress,sovTokenAddress], 
			[usdAmount, web3.utils.toBN(sovAmount * 2)], 
			2, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});

		usdAmountAfter = await usdToken.balanceOf(accounts[0]);
		expect(usdAmountAfter.toString()).to.equal( (usdAmountBefore.sub(usdAmount)).toString() );

		addedPoolTokenV1Amount = addedPoolTokenV1Amount.add(new BN(result.logs[0].args._poolTokenAmount));
		expectedBalance = new BN(sovAmountAfter.toString()).sub(web3.utils.toBN(sovAmount)).add(new BN(refundedSOV));

		assert.equal(
			(await sovToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
			"Wrong SOV balance (2)"
		);
		
		assert.equal(
			(await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address)).toString(),
			addedPoolTokenV1Amount.toString(),
			"Wrong pool token balance on LM contract (2)"
		);

		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [usdTokenAddress, sovTokenAddress],
			_reserveAmounts: [usdAmount, web3.utils.toBN(sovAmount * 2)]
		});
	});


	it("verifies that users could send USDT and SOV, and then add liquidity to get pool token 1 (USD Refunded)", async () => {
		var sovAmountBefore = await sovToken.balanceOf(accounts[0]);
		var usdAmountBefore = await usdToken.balanceOf(accounts[0]);

		liquidityPoolV1Converter = await ILiquidityPoolV1Converter.at(liquidityPoolV1ConverterUSDSOV);
		poolTokenV1Address = await liquidityPoolV1Converter.token();
		poolTokenV1 = await ISmartToken.at(poolTokenV1Address);
		var poolTokenV1AmountBefore = await poolTokenV1.balanceOf(accounts[0]);
		var totalLPTokenInLMBefore = await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address);

		var usdAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		var sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);

		const pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, usdTokenAddress);

		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(sovAmount * 4), { from: accounts[0] });

		await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(usdAmount * 4), { from: accounts[0] });

		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterUSDSOV, 
			[usdTokenAddress,sovTokenAddress], 
			[usdAmount, sovAmount], 
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});

		var usdAmountAfter = await usdToken.balanceOf(accounts[0]);

		expect(usdAmountAfter.toString()).to.equal( (usdAmountBefore.sub(usdAmount)).toString() );

		let decode = decodeLogs(result.receipt.rawLogs, IERC20, "Transfer");
		let refundTx = decode[decode.length - 1].args;
		let refundedSOV = refundTx.to === accounts[0] ? decode[decode.length - 1].args.value : 0;

		var addedPoolTokenV1Amount = new BN(result.logs[0].args._poolTokenAmount);
		var expectedBalance = new BN(sovAmountBefore.toString()).sub(sovAmount).add(new BN(refundedSOV))
		assert.equal(
			(await sovToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
			"Wrong SOV balance"
		);
		
		assert.equal(
			(await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address)).toString(),
			addedPoolTokenV1Amount.add(totalLPTokenInLMBefore).toString(),
			"Wrong pool token balance on LM contract (1)"
		);

		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [usdTokenAddress, sovTokenAddress],
			_reserveAmounts: [usdAmount, sovAmount], 
			_poolTokenAmount: addedPoolTokenV1Amount,
		});

		var sovAmountAfter = await sovToken.balanceOf(accounts[0]);
		totalLPTokenInLMBefore = await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address);

		usdAmountBefore = await usdToken.balanceOf(accounts[0]);
		// Send 2x USD, User should get 1x USD back
		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterUSDSOV, 
			[usdTokenAddress,sovTokenAddress], 
			[web3.utils.toBN(usdAmount * 2), web3.utils.toBN(sovAmount)], 
			2, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});

		let decode2 = decodeLogs(result.receipt.rawLogs, IERC20, "Transfer");
		let refundTx2 = decode2[decode2.length - 1].args;
		let refundedUSD = decode2[2].args.value;

		// 8th event is the refund
		let refundedSOV2 = decode2.length == 8 ? refundTx2.value : 0;

		usdAmountAfter = await usdToken.balanceOf(accounts[0]);
		expect(usdAmountAfter.toString()).to.equal( (usdAmountBefore.sub(new BN(refundedUSD))).toString() );

		addedPoolTokenV1Amount = new BN(result.logs[0].args._poolTokenAmount);
		expectedBalance = new BN(sovAmountAfter.toString()).sub(web3.utils.toBN(sovAmount)).add(new BN(refundedSOV2));

		assert.equal(
			(await sovToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
			"Wrong SOV balance (2)"
		);
		
		assert.equal(
			(await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address)).toString(),
			addedPoolTokenV1Amount.add(totalLPTokenInLMBefore).toString(),
			"Wrong pool token balance on LM contract (2)"
		);

		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [usdTokenAddress, sovTokenAddress],
			_reserveAmounts: [web3.utils.toBN(usdAmount * 2), sovAmount]
		});
	});


	it("verifies that users could remove liquidity to burn pool token 1 and then get SUSD and SOV", async () => {
		liquidityPoolV1Converter = await ILiquidityPoolV1Converter.at(liquidityPoolV1ConverterUSDSOV);
		poolTokenV1Address = await liquidityPoolV1Converter.token();
		poolTokenV1 = await ISmartToken.at(poolTokenV1Address);
		var poolTokenV1AmountBefore = await poolTokenV1.balanceOf(accounts[0]);

		poolTokenBalance = await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address);
		assert(poolTokenBalance > 0, "incorrect test setup");

		usdAmountBefore = await usdToken.balanceOf(accounts[0]);
		sovAmountBefore = await sovToken.balanceOf(accounts[0]);

		var result = await rbtcWrapperProxy.removeLiquidityFromV1(liquidityPoolV1ConverterUSDSOV, poolTokenBalance, [usdTokenAddress, sovTokenAddress], [1, 1]);

		var addedUSDAmount = result.logs[0].args._reserveAmounts[0];
		var addedSOVAmount = result.logs[0].args._reserveAmounts[1];

		await expectEvent(result.receipt, "LiquidityRemovedFromV1", {
			_provider: accounts[0],
			_reserveTokens: [usdTokenAddress, sovTokenAddress],
			_reserveAmounts: [addedUSDAmount, addedSOVAmount]
		});

		expectedUSDBalance = new BN(usdAmountBefore).add(new BN(addedUSDAmount));
		latestUSDBalance = await usdToken.balanceOf(accounts[0]);

		expectedSOVBalance = new BN(sovAmountBefore).add(new BN(addedSOVAmount)).add(poolTokenBalance);
		latestSOVBalance = await sovToken.balanceOf(accounts[0]);
		expect(latestSOVBalance.toString()).to.equal(expectedSOVBalance.toString())
	});

	it("verifies user can swap / trade to the non-rbtc pairs", async () => {
		var sovAmountBefore = await sovToken.balanceOf(accounts[0]);
		var usdAmountBefore = await usdToken.balanceOf(accounts[0]);

		liquidityPoolV1Converter = await ILiquidityPoolV1Converter.at(liquidityPoolV1ConverterUSDSOV);
		poolTokenV1Address = await liquidityPoolV1Converter.token();
		poolTokenV1 = await ISmartToken.at(poolTokenV1Address);
		var poolTokenV1AmountBefore = await poolTokenV1.balanceOf(accounts[0]);

		var usdAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][0]["balance"] * 1e14);
		var sovAmount = web3.utils.toBN(getConfigFromSOV()["converters"][0]["reserves"][1]["balance"] * 1e14);

		const pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, usdTokenAddress);

		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await sovToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(sovAmount * 4), { from: accounts[0] });

		await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(0), { from: accounts[0] });
		await usdToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(usdAmount * 4), { from: accounts[0] });

		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterUSDSOV, 
			[usdTokenAddress,sovTokenAddress], 
			[usdAmount, sovAmount], 
			1, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});

		var usdAmountAfter = await usdToken.balanceOf(accounts[0]);

		expect(usdAmountAfter.toString()).to.equal( (usdAmountBefore.sub(usdAmount)).toString() );

		let decode = decodeLogs(result.receipt.rawLogs, IERC20, "Transfer");
		let refundTx = decode[decode.length - 1].args;
		let refundedSOV = refundTx.to === accounts[0] ? refundTx.value : 0;

		var addedPoolTokenV1Amount = new BN(result.logs[0].args._poolTokenAmount);
		var expectedBalance = new BN(sovAmountBefore.toString()).sub(sovAmount).add(new BN(refundedSOV))
		assert.equal(
			(await sovToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
			"Wrong SOV balance"
		);
		
		assert.equal(
			(await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address)).toString(),
			addedPoolTokenV1Amount.toString(),
			"Wrong pool token balance on LM contract (1)"
		);
		
		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [usdTokenAddress, sovTokenAddress],
			_reserveAmounts: [usdAmount, sovAmount], 
			_poolTokenAmount: addedPoolTokenV1Amount,
		});

		var sovAmountAfter = await sovToken.balanceOf(accounts[0]);

		usdAmountBefore = await usdToken.balanceOf(accounts[0]);
		// Send 2x SOV, User should get 1x SOV back
		var result = await rbtcWrapperProxy.addLiquidityToV1(
			liquidityPoolV1ConverterUSDSOV, 
			[usdTokenAddress,sovTokenAddress], 
			[usdAmount, web3.utils.toBN(sovAmount * 2)], 
			2, 
		{
			from: accounts[0],
			to: RBTCWrapperProxy.address,
		});

		usdAmountAfter = await usdToken.balanceOf(accounts[0]);
		expect(usdAmountAfter.toString()).to.equal( (usdAmountBefore.sub(usdAmount)).toString() );

		addedPoolTokenV1Amount = addedPoolTokenV1Amount.add(new BN(result.logs[0].args._poolTokenAmount));
		expectedBalance = new BN(sovAmountAfter.toString()).sub(web3.utils.toBN(sovAmount)).add(new BN(refundedSOV));

		assert.equal(
			(await sovToken.balanceOf(accounts[0])).toString(),
			expectedBalance.toString(),
			"Wrong SOV balance (2)"
		);
		
		assert.equal(
			(await liquidityMining.userLPBalance(accounts[0], poolTokenV1Address)).toString(),
			addedPoolTokenV1Amount.toString(),
			"Wrong pool token balance on LM contract (2)"
		);

		await expectEvent(result.receipt, "LiquidityAddedToV1", {
			_provider: accounts[0],
			_reserveTokens: [usdTokenAddress, sovTokenAddress],
			_reserveAmounts: [usdAmount, web3.utils.toBN(sovAmount * 2)]
		});

		// SWAP / TRADE
		var pathSUSDToSOV = await sovrynSwapNetwork.conversionPath(usdTokenAddress, sovTokenAddress);

		await usdToken.approve(sovrynSwapNetwork.address, web3.utils.toBN(0), { from: accounts[0] });
		await usdToken.approve(sovrynSwapNetwork.address, web3.utils.toBN(1e14), { from: accounts[0] });

		const previousSOVBalance = await sovToken.balanceOf(accounts[0]);
		const previousUSDBalance = await usdToken.balanceOf(accounts[0]);
		const amountSwap = web3.utils.toBN(1e14);

		var result = await sovrynSwapNetwork.convertByPath(
			pathSUSDToSOV, // path
			amountSwap, // amount
			1, // minReturn
			accounts[0], // recipient
			ZERO_ADDRESS, // affiliate Account
			0, // affiliate fee
		);

		decode = decodeLogs(result.receipt.rawLogs, ISovrynSwapNetwork, "Conversion");
		conversionData = decode[0].args;
		totalConverted = conversionData._toAmount;

		expect(conversionData._fromToken).to.equal(usdTokenAddress);
		expect(conversionData._toToken).to.equal(sovTokenAddress);
		expect(conversionData._fromAmount).to.equal(amountSwap.toString());
		expect(conversionData._trader).to.equal(accounts[0]);

		const latestSOVBalance = await sovToken.balanceOf(accounts[0]);
		const latestUSDBalance = await usdToken.balanceOf(accounts[0]);
		expect(latestSOVBalance.toString()).to.equal(previousSOVBalance.add(new BN(totalConverted)).toString());
		expect(latestUSDBalance.toString()).to.equal(previousUSDBalance.sub(amountSwap).toString());
	});
});