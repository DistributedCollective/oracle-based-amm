const { expect } = require("chai");
const { expectRevert, expectEvent, constants, BN, balance } = require("@openzeppelin/test-helpers");

const { ETH_RESERVE_ADDRESS, registry } = require("./helpers/Constants");
const { ZERO_ADDRESS } = constants;

const SovrynSwapNetwork = artifacts.require("SovrynSwapNetwork");
const SovrynSwapNetworkMockup = artifacts.require("SovrynSwapNetworkMockup");
const LiquidityPoolV1Converter = artifacts.require("LiquidityPoolV1Converter");
const LiquidityPoolV1ConverterFactory = artifacts.require("LiquidityPoolV1ConverterFactory");
const SmartToken = artifacts.require("SmartToken");
const SovrynSwapFormula = artifacts.require("SovrynSwapFormula");
const ContractRegistry = artifacts.require("ContractRegistry");
const ERC20Token = artifacts.require("ERC20Token");
const FeeSharingProxy = artifacts.require("FeeSharingProxyMockup");
const TestNonStandardToken = artifacts.require("TestNonStandardToken");
const ConverterFactory = artifacts.require("ConverterFactory");
const ConverterUpgrader = artifacts.require("ConverterUpgrader");
const Oracle = artifacts.require("Oracle");
const SwapSettings = artifacts.require("SwapSettings");
const ConversionPathFinder = artifacts.require("ConversionPathFinder");
const ConverterRegistry = artifacts.require("ConverterRegistry");
const ConverterRegistryData = artifacts.require("ConverterRegistryData");
const wei = web3.utils.toWei;
const hunEth = new BN(wei("100", "ether"));
const protocolFeeResolution = new BN(wei("1", "mwei"));
const { decodeLogs } = require("./helpers/lib.js");

contract("LiquidityPoolV1Converter", (accounts) => {
	const createConverter = async (tokenAddress, registryAddress = contractRegistry.address, maxConversionFee = 0) => {
		return LiquidityPoolV1Converter.new(tokenAddress, registryAddress, maxConversionFee);
	};

	const initConverter = async (activate, isETHReserve, maxConversionFee = 0, maxWeight = false) => {
		token = await SmartToken.new("Token1", "TKN1", 2);
		tokenAddress = token.address;

		const converter = await createConverter(tokenAddress, contractRegistry.address, maxConversionFee);
		oracle = await Oracle.new(converter.address, getReserve1Address(isETHReserve));
		oracleAddress = oracle.address;

		await converter.setOracle(oracleAddress);

		if(maxWeight) {
			/// Since we limited the converter to only have 2 reserve tokens
			/// we need an option where those 2 reserve token have maximum weight.
			await converter.addReserve(getReserve1Address(isETHReserve), 600000);
			await converter.addReserve(reserveToken2.address, 400000);
		} else {
			await converter.addReserve(getReserve1Address(isETHReserve), 250000);
			await converter.addReserve(reserveToken2.address, 150000);
		}

		await reserveToken2.transfer(converter.address, 8000);
		await token.issue(sender, 20000);

		if (isETHReserve) {
			await converter.send(5000);
		} else {
			await reserveToken.transfer(converter.address, 5000);
		}

		if (activate) {
			await token.transferOwnership(converter.address);
			await converter.acceptTokenOwnership();
		}

		return converter;
	};

	const initConverter2 = async (activate, isETHReserve, maxConversionFee = 0, maxWeight = false) => {
		token = await SmartToken.new("Token1", "TKN1", 2);
		tokenAddress = token.address;

		const converter = await createConverter(tokenAddress, contractRegistry.address, maxConversionFee);
		oracle = await Oracle.new(converter.address, getReserve2Address(isETHReserve));
		oracleAddress = oracle.address;

		await converter.setOracle(oracleAddress);

		if(maxWeight) {
			/// Since we limited the converter to only have 2 reserve tokens
			/// we need an option where those 2 reserve token have maximum weight.
			await converter.addReserve(getReserve2Address(isETHReserve), 600000);
			await converter.addReserve(reserveToken.address, 400000);
		} else {
			await converter.addReserve(getReserve2Address(isETHReserve), 250000);
			await converter.addReserve(reserveToken.address, 150000);
		}

		await reserveToken.transfer(converter.address, 8000);
		await token.issue(sender, 20000);

		if (isETHReserve) {
			await converter.send(5000);
		} else {
			await reserveToken2.transfer(converter.address, 5000);
		}

		if (activate) {
			await token.transferOwnership(converter.address);
			await converter.acceptTokenOwnership();
		}

		return converter;
	};

	const getReserve1Address = (isETH) => {
		return isETH ? ETH_RESERVE_ADDRESS : reserveToken.address;
	};

	const getReserve2Address = (isETH) => {
		return isETH ? ETH_RESERVE_ADDRESS : reserveToken2.address;
	};

	const getBalance = async (token, address, account) => {
		if (address === ETH_RESERVE_ADDRESS) {
			return balance.current(account);
		}

		return token.balanceOf.call(account);
	};

	const getTransactionCost = async (txResult) => {
		const transaction = await web3.eth.getTransaction(txResult.tx);
		return new BN(transaction.gasPrice).mul(new BN(txResult.receipt.cumulativeGasUsed));
	};

	const convert = async (path, amount, minReturn, options = {}) => {
		return sovrynSwapNetwork.convertByPath(path, amount, minReturn, ZERO_ADDRESS, ZERO_ADDRESS, 0, options);
	};

	const divCeil = (num, d) => {
		const dm = num.divmod(d);
		if (dm.mod.isZero()) {
			return dm.div;
		}

		return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
	};

	let sovrynSwapNetwork;
	let token;
	let tokenAddress;
	let oracle;
	let oracleAddress;
	let contractRegistry;
	let reserveToken;
	let reserveToken2;
	let upgrader;
	let sovrynSwapFormula;
	let swapSettings;
	let pathFinder;
	let converterRegistry;
	const sender = accounts[0];
	const sender2 = accounts[9];

	const MIN_RETURN = new BN(1);
	const WEIGHT_RESOLUTION = new BN(1000000);

	before(async () => {
		// The following contracts are unaffected by the underlying tests, this can be shared.
		sovrynSwapFormula = await SovrynSwapFormula.new();
		await sovrynSwapFormula.init();
		contractRegistry = await ContractRegistry.new();

		await contractRegistry.registerAddress(registry.SOVRYNSWAP_FORMULA, sovrynSwapFormula.address);

		const factory = await ConverterFactory.new();
		await contractRegistry.registerAddress(registry.CONVERTER_FACTORY, factory.address);
	});

	beforeEach(async () => {
		sovrynSwapNetwork = await SovrynSwapNetwork.new(contractRegistry.address);
		await contractRegistry.registerAddress(registry.SOVRYNSWAP_NETWORK, sovrynSwapNetwork.address);

		// Set dummy address for swap settings at the first
		swapSettings = await SwapSettings.new(
			accounts[1], // feesController
			accounts[1], // wrbtc
			accounts[1], // sov token
			0, // protocol fee
		)

		await contractRegistry.registerAddress(registry.SWAP_SETTINGS, swapSettings.address);

		converterRegistry = await ConverterRegistry.new(contractRegistry.address);
		const converterRegistryData = await ConverterRegistryData.new(contractRegistry.address);
		await contractRegistry.registerAddress(registry.CONVERTER_REGISTRY, converterRegistry.address);
		await contractRegistry.registerAddress(registry.CONVERTER_REGISTRY_DATA, converterRegistryData.address);

		pathFinder = await ConversionPathFinder.new(contractRegistry.address);
		await contractRegistry.registerAddress(registry.CONVERSION_PATH_FINDER, pathFinder.address);

		upgrader = await ConverterUpgrader.new(contractRegistry.address, ZERO_ADDRESS);
		await contractRegistry.registerAddress(registry.CONVERTER_UPGRADER, upgrader.address);

		const token = await SmartToken.new("Token1", "TKN1", 2);
		tokenAddress = token.address;

		reserveToken = await ERC20Token.new("ERC Token 1", "ERC1", 18, 1000000000);
		reserveToken2 = await ERC20Token.new("ERC Token 2", "ERC2", 18, 2000000000);
	});

	it("verifies the Activation event after converter activation", async () => {
		const converter = await initConverter(false, false);
		await token.transferOwnership(converter.address);
		const res = await converter.acceptTokenOwnership();

		expectEvent(res, "Activation", {
			_type: new BN(1),
			_anchor: tokenAddress,
			_activated: true,
		});
	});

	it("verifies the TokenRateUpdate event after adding liquidity", async () => {
		const converter = await initConverter(true, false);

		const value = new BN(500);
		await reserveToken.approve(converter.address, value, { from: sender });
		await reserveToken2.approve(converter.address, value, { from: sender });

		const res = await converter.addLiquidity([reserveToken.address, reserveToken2.address], [value, value], MIN_RETURN);

		const poolTokenSupply = await token.totalSupply.call();
		const reserve1Balance = await converter.reserveBalance.call(reserveToken.address);
		const reserve1Weight = await converter.reserveWeight.call(reserveToken.address);
		const reserve2Balance = await converter.reserveBalance.call(reserveToken2.address);
		const reserve2Weight = await converter.reserveWeight.call(reserveToken2.address);

		expectEvent(res, "TokenRateUpdate", {
			_token1: tokenAddress,
			_token2: reserveToken.address,
			_rateN: reserve1Balance.mul(WEIGHT_RESOLUTION),
			_rateD: poolTokenSupply.mul(reserve1Weight),
		});

		expectEvent(res, "TokenRateUpdate", {
			_token1: tokenAddress,
			_token2: reserveToken2.address,
			_rateN: reserve2Balance.mul(WEIGHT_RESOLUTION),
			_rateD: poolTokenSupply.mul(reserve2Weight),
		});
	});

	it("verifies the TokenRateUpdate event after removing liquidity", async () => {
		const converter = await initConverter(true, false);

		const res = await converter.removeLiquidity(100, [reserveToken.address, reserveToken2.address], [MIN_RETURN, MIN_RETURN]);

		const poolTokenSupply = await token.totalSupply.call();
		const reserve1Balance = await converter.reserveBalance.call(reserveToken.address);
		const reserve1Weight = await converter.reserveWeight.call(reserveToken.address);
		const reserve2Balance = await converter.reserveBalance.call(reserveToken2.address);
		const reserve2Weight = await converter.reserveWeight.call(reserveToken2.address);

		expectEvent(res, "TokenRateUpdate", {
			_token1: tokenAddress,
			_token2: reserveToken.address,
			_rateN: reserve1Balance.mul(WEIGHT_RESOLUTION),
			_rateD: poolTokenSupply.mul(reserve1Weight),
		});

		expectEvent(res, "TokenRateUpdate", {
			_token1: tokenAddress,
			_token2: reserveToken2.address,
			_rateN: reserve2Balance.mul(WEIGHT_RESOLUTION),
			_rateD: poolTokenSupply.mul(reserve2Weight),
		});
	});

	it("gives the amount of tokens that will be received after removing liquidity", async () => {
		const converter = await initConverter(true, false);
		const expectedAmounts = await converter.getExpectedOutAmount(100);

		const initialBalance1 = await reserveToken.balanceOf.call(sender);
		const initialBalance2 = await reserveToken2.balanceOf.call(sender);

		await converter.removeLiquidity(100, [reserveToken.address, reserveToken2.address], [MIN_RETURN, MIN_RETURN]);
		const finalBalance1 = await reserveToken.balanceOf.call(sender);
		const finalBalance2 = await reserveToken2.balanceOf.call(sender);

		expect(finalBalance1).to.be.bignumber.equal(initialBalance1.add(expectedAmounts[0]));
		expect(finalBalance2).to.be.bignumber.equal(initialBalance2.add(expectedAmounts[1]));
	});

	for (let isETHReserve = 0; isETHReserve < 2; isETHReserve++) {
		describe(`${isETHReserve === 0 ? "(with ERC20 reserves)" : "(with ETH reserve)"}:`, () => {
			it("should revert if set protocol fee more than 100%", async() => {
				const invalidProtocolFee = new BN(wei("1001", "kwei")); // 100.1%
				await expectRevert(swapSettings.setProtocolFee(invalidProtocolFee.toString()), "ERR_PROTOCOL_FEE_TOO_HIGH");
				expect( (await swapSettings.protocolFee()).toString() ).to.equal( (new BN(0)).toString());
			})

			it("verify the protocol fee after setting up", async() => {
				const protocolFee = new BN(wei("100", "kwei")); // 10%
				await swapSettings.setProtocolFee(protocolFee.toString());
				expect( (await swapSettings.protocolFee()).toString() ).to.equal(protocolFee.toString());
			})

			it("verifies that convert returns valid amount and fee after converting", async () => {
				const converter = await initConverter(true, isETHReserve, 5000);
				const protocolFeePercentage = new BN(500)
				const conversionFeePercentage = new BN(3000)

				await converter.setConversionFee(conversionFeePercentage.toString());
				await swapSettings.setProtocolFee(protocolFeePercentage.toString());

				const amount = new BN(wei("50000", "wei"));
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				const targetAmountAndFee = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount = targetAmountAndFee[0];
				const conversionFeeAmount = targetAmountAndFee[1];
				const res = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				const protocolTokenHeld = await converter.protocolFeeTokensHeld(reserveToken2.address);
				const totalProtocolFee = conversionFeeAmount.mul(protocolFeePercentage).div(conversionFeePercentage);
				expectEvent(res, "Conversion", {
					_smartToken: token.address,
					_fromToken: getReserve1Address(isETHReserve),
					_toToken: reserveToken2.address,
					_fromAmount: amount,
					_toAmount: purchaseAmount,
				});

				expect((await swapSettings.protocolFee()).toString()).to.eql( (new BN(500)).toString() );
				expect(protocolTokenHeld.toString()).to.eql(totalProtocolFee.toString());
			});

			it("set wrbtc address in the swap network", async () => {
				const converter = await initConverter(true, isETHReserve, 5000);
				const wrbtc = await ERC20Token.new("WRBTC", "WRBTC", 8, 2000000000);
				await expectRevert(swapSettings.setWrbtcAddress(ZERO_ADDRESS), "ERR_ZERO_ADDRESS");
				await swapSettings.setWrbtcAddress(wrbtc.address);
				expect(await swapSettings.wrbtcAddress()).to.equal(wrbtc.address);
			})

			it("set SOV token address in the converter", async () => {
				const converter = await initConverter(true, 1, 5000);
				const sov = await ERC20Token.new("SOV", "SOV", 18, 2000000000);
				await expectRevert(swapSettings.setSOVTokenAddress(ZERO_ADDRESS), "ERR_ZERO_ADDRESS");
				await swapSettings.setSOVTokenAddress(sov.address);
				expect(await swapSettings.sovTokenAddress()).to.equal(sov.address);
			})

			it("withdraw protocol fees from the converter", async () => {
				const converter = await initConverter(true, isETHReserve, 5000);
				const protocolFeePercentage = new BN(500);
				const feesController = accounts[7];
				const totalSupplyWrbtc = 2000000000;
				const wrbtc = await ERC20Token.new("WRBTC", "WRBTC", 8, totalSupplyWrbtc);
				const mockConversionValue = 100;
				const conversionFee = new BN(3000);

				await converter.setConversionFee(conversionFee);
				await swapSettings.setProtocolFee(protocolFeePercentage.toString());

				const amount = new BN(wei("50000", "wei"));
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				const targetAmountAndFee = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount = targetAmountAndFee[0];
				const conversionFeeAmount = targetAmountAndFee[1];
				const res = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				const protocolTokenHeld = await converter.protocolFeeTokensHeld(reserveToken2.address);
				const totalProtocolFee = conversionFeeAmount.mul(protocolFeePercentage).div(conversionFee);
				expectEvent(res, "Conversion", {
					_smartToken: token.address,
					_fromToken: getReserve1Address(isETHReserve),
					_toToken: reserveToken2.address,
					_fromAmount: amount,
					_toAmount: purchaseAmount,
				});

				expect((await swapSettings.protocolFee()).toString()).to.eql( (new BN(500)).toString() );
				expect(protocolTokenHeld.toString()).to.eql(totalProtocolFee.toString());

				// withdraw protocol fee from the converter
				sovrynSwapNetwork = await SovrynSwapNetworkMockup.new(contractRegistry.address, mockConversionValue, wrbtc.address);
				await wrbtc.transfer(sovrynSwapNetwork.address, totalSupplyWrbtc)
				await contractRegistry.registerAddress(registry.SOVRYNSWAP_NETWORK, sovrynSwapNetwork.address);
				await swapSettings.setFeesController(feesController);
				await swapSettings.setWrbtcAddress(wrbtc.address);
				expect(await swapSettings.feesController()).to.equal(feesController);

				const previousWrbtcBalanceSovrynSwapNetwork = await wrbtc.balanceOf(sovrynSwapNetwork.address);
				const previousWrbtcBalanceFeesController = await wrbtc.balanceOf(feesController);

				const resWithdrawFees = await converter.withdrawFees(feesController, {from: feesController});

				const latestWrbtcBalanceSovrynSwapNetwork = await wrbtc.balanceOf(sovrynSwapNetwork.address);
				const latestWrbtcBalanceFeesController = await wrbtc.balanceOf(feesController);

				expect(latestWrbtcBalanceSovrynSwapNetwork.toString()).to.equal( (previousWrbtcBalanceSovrynSwapNetwork.sub(new BN(mockConversionValue))).toString() )
				expect(latestWrbtcBalanceFeesController.toString()).to.equal( (previousWrbtcBalanceFeesController.add(new BN(mockConversionValue))).toString() )
				expect( (await converter.protocolFeeTokensHeld(reserveToken2.address)).toString() ).to.equal(new BN(0).toString());
				expectEvent(resWithdrawFees, "WithdrawFees", {
					sender: feesController,
					receiver: feesController,
					token: reserveToken2.address,
					protocolFeeAmount: totalProtocolFee,
					wRBTCConverted: new BN(mockConversionValue)
				});
			});


			it("withdraw protocol fees from the converter with WRBTC swapped (Real Converter)", async () => {
				/** TODO: SUPPORT ETH RESERVE TEST CASE */
				if(isETHReserve) return;
				const converter = await initConverter(true, isETHReserve, 5000);
				const conversionFeePercentage = new BN(3000);
				const protocolFeePercentage = new BN(500);
				const feesController = accounts[7];
				const totalSupplyWrbtc = 2000000000;
				const wrbtc = await ERC20Token.new("WRBTC", "WRBTC", 8, totalSupplyWrbtc);

				await converter.setConversionFee(conversionFeePercentage);
				await swapSettings.setProtocolFee(protocolFeePercentage.toString());

				const amount = new BN(wei("50000", "wei"));
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				const previousProtocolFeesHeld1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				const previousProtocolFeesHeld2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				const previousToken1ReserveBalance = await converter.reserveBalance(reserveToken.address);
				const previousToken2ReserveBalance = await converter.reserveBalance(reserveToken2.address);

				expect(await previousProtocolFeesHeld1.toString()).to.equal(new BN("0").toString());
				expect(await previousProtocolFeesHeld2.toString()).to.equal(new BN("0").toString());
				expect(await previousToken1ReserveBalance.toString()).to.equal(new BN("5000").toString());
				expect(await previousToken2ReserveBalance.toString()).to.equal(new BN("8000").toString());
				
				console.log("previous protcol fee held 1: ", previousProtocolFeesHeld1.toString());
				console.log("previous protcol fee held 2: ", previousProtocolFeesHeld2.toString());

				console.log("previous reserve balkance 1: ", previousToken1ReserveBalance.toString())
				console.log("previous reserve balkance 2: ", previousToken2ReserveBalance.toString())

				const targetAmountAndFee = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount = targetAmountAndFee[0];
				const conversionFeeAmount = targetAmountAndFee[1];
				const res = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				const protocolTokenHeld = await converter.protocolFeeTokensHeld(reserveToken2.address);
				const totalProtocolFee = conversionFeeAmount.mul(protocolFeePercentage).div(conversionFeePercentage);

				const protocolFeesHeldAfterSwap1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				const protocolFeesHeldAfterSwap2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				const tokenReserveBalanceAfterSwap1 = await converter.reserveBalance(reserveToken.address);
				const tokenReserveBalanceAfterSwap2 = await converter.reserveBalance(reserveToken2.address);

				const balanceToken2InConverterAfterSwap = await reserveToken2.balanceOf(converter.address);
				const balanceToken2InFeesControllerAfterSwap = await reserveToken2.balanceOf(feesController);

				expect(protocolFeesHeldAfterSwap1.toString()).to.equal(new BN("0").toString());
				expect(protocolFeesHeldAfterSwap2.toString()).to.equal(totalProtocolFee.toString());
				expect(tokenReserveBalanceAfterSwap1.toString()).to.equal(new BN("5000").add(amount).toString());
				expect(tokenReserveBalanceAfterSwap2.toString()).to.equal(new BN("8000").sub(purchaseAmount).sub(protocolFeesHeldAfterSwap2).toString());
				expect(balanceToken2InFeesControllerAfterSwap.toString()).to.equal(new BN("0").toString())
				expect(balanceToken2InConverterAfterSwap.sub(tokenReserveBalanceAfterSwap2).toString()).to.equal(totalProtocolFee.toString())

				expectEvent(res, "Conversion", {
					_smartToken: token.address,
					_fromToken: getReserve1Address(isETHReserve),
					_toToken: reserveToken2.address,
					_fromAmount: amount,
					_toAmount: purchaseAmount,
				});

				expect((await swapSettings.protocolFee()).toString()).to.eql(protocolFeePercentage.toString() );
				expect(protocolTokenHeld.toString()).to.eql(totalProtocolFee.toString());

				// withdraw protocol fee from the converter
				await swapSettings.setFeesController(feesController);

				// Consider reserveToken2 as wrbtc
				await swapSettings.setWrbtcAddress(reserveToken2.address);
				expect(await swapSettings.feesController()).to.equal(feesController);

				/** WITHDRAW FEES */
				const resWithdrawFees = await converter.withdrawFees(feesController, {from: feesController});

				const latestToken1FeesHeldBalance = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				const latestToken2FeesHeldBalance = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				const latestToken1ReserveBalance = await converter.reserveBalance(reserveToken.address);
				const latestToken2ReserveBalance = await converter.reserveBalance(reserveToken2.address);

				const balanceToken2InConverterAfterWithdrawal = await reserveToken2.balanceOf(converter.address);
				const balanceToken2InFeesControllerAfterWithdrawal = await reserveToken2.balanceOf(feesController);

				expect(latestToken1FeesHeldBalance.toString()).to.equal(new BN("0").toString());
				expect(latestToken2FeesHeldBalance.toString()).to.equal(new BN("0").toString());

				/** AFTER WITHDRAWAL FEES, RESERVE TOKEN & BALANCE CONVERTER SHOULD BE SAME (SYNCED) */
				expect(balanceToken2InConverterAfterWithdrawal.toString()).to.equal(latestToken2ReserveBalance.toString())
				expect(balanceToken2InFeesControllerAfterSwap.add(totalProtocolFee).toString()).to.equal(balanceToken2InFeesControllerAfterWithdrawal.toString())

				expectEvent(resWithdrawFees, "WithdrawFees", {
					sender: feesController,
					receiver: feesController,
					token: reserveToken2.address,
					protocolFeeAmount: totalProtocolFee,
					wRBTCConverted: new BN(totalProtocolFee)
				});
			});

			it("withdraw protocol fees from the converter with WRBTC multiple swapped (Real Converter)", async () => {
				/** TODO: SUPPORT ETH RESERVE TEST CASE */
				if(isETHReserve) return;
				const converter = await initConverter(true, isETHReserve, 5000);
				const conversionFeePercentage = new BN(3000);
				const protocolFeePercentage = new BN(500);
				const feesController = accounts[7];
				const totalSupplyWrbtc = 2000000000;
				const wrbtc = await ERC20Token.new("WRBTC", "WRBTC", 8, totalSupplyWrbtc);

				await converter.setConversionFee(conversionFeePercentage);
				await swapSettings.setProtocolFee(protocolFeePercentage.toString());

				const amount = new BN(wei("5000", "wei"));
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				const previousProtocolFeesHeld1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				const previousProtocolFeesHeld2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				const previousToken1ReserveBalance = await converter.reserveBalance(reserveToken.address);
				const previousToken2ReserveBalance = await converter.reserveBalance(reserveToken2.address);

				expect(await previousProtocolFeesHeld1.toString()).to.equal(new BN("0").toString());
				expect(await previousProtocolFeesHeld2.toString()).to.equal(new BN("0").toString());
				expect(await previousToken1ReserveBalance.toString()).to.equal(new BN("5000").toString());
				expect(await previousToken2ReserveBalance.toString()).to.equal(new BN("8000").toString());
				
				console.log("previous protcol fee held 1: ", previousProtocolFeesHeld1.toString());
				console.log("previous protcol fee held 2: ", previousProtocolFeesHeld2.toString());

				console.log("previous reserve balkance 1: ", previousToken1ReserveBalance.toString())
				console.log("previous reserve balkance 2: ", previousToken2ReserveBalance.toString())

				const targetAmountAndFee = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount = targetAmountAndFee[0];
				const conversionFeeAmount = targetAmountAndFee[1];
				const res = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });

				/// Second swap
				let tokenReserveBalanceAfterSwap1 = await converter.reserveBalance(reserveToken.address);
				let tokenReserveBalanceAfterSwap2 = await converter.reserveBalance(reserveToken2.address);

				let protocolFeesHeldAfterSwap1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				let protocolFeesHeldAfterSwap2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				let balanceToken2InConverterAfterSwap = await reserveToken2.balanceOf(converter.address);
				let balanceToken2InFeesControllerAfterSwap = await reserveToken2.balanceOf(feesController);

				// ERR_INVALID_AMOUNT CHECK
				expect(balanceToken2InConverterAfterSwap.add(amount).sub(tokenReserveBalanceAfterSwap2).sub(protocolFeesHeldAfterSwap2).toString()).to.equal(amount.toString());
				await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				const targetAmountAndFee2 = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount2 = targetAmountAndFee2[0];
				const conversionFeeAmount2 = targetAmountAndFee2[1];
				const res2 = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				const totalProtocolFee = conversionFeeAmount.mul(protocolFeePercentage).div(conversionFeePercentage);
				const totalProtocolFee2 = conversionFeeAmount2.mul(protocolFeePercentage).div(conversionFeePercentage);
				let protocolTokenHeld = await converter.protocolFeeTokensHeld(reserveToken2.address);

				protocolFeesHeldAfterSwap1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				protocolFeesHeldAfterSwap2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				tokenReserveBalanceAfterSwap1 = await converter.reserveBalance(reserveToken.address);
				tokenReserveBalanceAfterSwap2 = await converter.reserveBalance(reserveToken2.address);

				balanceToken2InConverterAfterSwap = await reserveToken2.balanceOf(converter.address);
				balanceToken2InFeesControllerAfterSwap = await reserveToken2.balanceOf(feesController);

				expect(protocolFeesHeldAfterSwap1.toString()).to.equal(new BN("0").toString());
				expect(protocolFeesHeldAfterSwap2.toString()).to.equal(totalProtocolFee.add(totalProtocolFee2).toString());
				expect(tokenReserveBalanceAfterSwap1.toString()).to.equal(new BN("5000").add(amount).add(amount).toString());
				expect(tokenReserveBalanceAfterSwap2.toString()).to.equal(new BN("8000").sub(purchaseAmount.add(purchaseAmount2).add(protocolFeesHeldAfterSwap1).add(protocolFeesHeldAfterSwap2)).toString());
				expect(balanceToken2InFeesControllerAfterSwap.toString()).to.equal(new BN("0").toString())
				expect(balanceToken2InConverterAfterSwap.sub(tokenReserveBalanceAfterSwap2).toString()).to.equal(totalProtocolFee.add(totalProtocolFee2).toString())

				expectEvent(res, "Conversion", {
					_smartToken: token.address,
					_fromToken: getReserve1Address(isETHReserve),
					_toToken: reserveToken2.address,
					_fromAmount: amount,
					_toAmount: purchaseAmount,
				});

				expect((await swapSettings.protocolFee()).toString()).to.eql(protocolFeePercentage.toString() );
				expect(protocolTokenHeld.toString()).to.eql(totalProtocolFee.add(totalProtocolFee2).toString());

				// withdraw protocol fee from the converter
				await swapSettings.setFeesController(feesController);

				// Consider reserveToken2 as wrbtc
				await swapSettings.setWrbtcAddress(reserveToken2.address);
				expect(await swapSettings.feesController()).to.equal(feesController);

				/** WITHDRAW FEES */
				const resWithdrawFees = await converter.withdrawFees(feesController, {from: feesController});

				const latestToken1FeesHeldBalance = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				const latestToken2FeesHeldBalance = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				const latestToken1ReserveBalance = await converter.reserveBalance(reserveToken.address);
				const latestToken2ReserveBalance = await converter.reserveBalance(reserveToken2.address);

				const balanceToken2InConverterAfterWithdrawal = await reserveToken2.balanceOf(converter.address);
				const balanceToken2InFeesControllerAfterWithdrawal = await reserveToken2.balanceOf(feesController);

				console.log(latestToken1ReserveBalance.toString());
				console.log(latestToken2ReserveBalance.toString());

				expect(latestToken1FeesHeldBalance.toString()).to.equal(new BN("0").toString());
				expect(latestToken2FeesHeldBalance.toString()).to.equal(new BN("0").toString());

				/** AFTER WITHDRAWAL FEES, RESERVE TOKEN & BALANCE CONVERTER SHOULD BE SAME (SYNCED) */
				expect(balanceToken2InConverterAfterWithdrawal.toString()).to.equal(latestToken2ReserveBalance.toString())
				expect(balanceToken2InFeesControllerAfterSwap.add(totalProtocolFee).add(totalProtocolFee2).toString()).to.equal(balanceToken2InFeesControllerAfterWithdrawal.toString())

				expectEvent(resWithdrawFees, "WithdrawFees", {
					sender: feesController,
					receiver: feesController,
					token: reserveToken2.address,
					protocolFeeAmount: totalProtocolFee.add(totalProtocolFee2),
					wRBTCConverted: new BN(totalProtocolFee).add(totalProtocolFee2)
				});

				/// Third swap (#1 swap after withdrawal)
				// ERR_INVALID_AMOUNT CHECK
				expect(balanceToken2InConverterAfterSwap.add(amount).sub(tokenReserveBalanceAfterSwap2).sub(protocolFeesHeldAfterSwap2).toString()).to.equal(amount.toString());
				await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				const targetAmountAndFee3 = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount3 = targetAmountAndFee3[0];
				const conversionFeeAmount3 = targetAmountAndFee3[1];
				const res3 = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				const totalProtocolFee3 = conversionFeeAmount3.mul(protocolFeePercentage).div(conversionFeePercentage);
				protocolTokenHeld = await converter.protocolFeeTokensHeld(reserveToken2.address);
				
				tokenReserveBalanceAfterSwap1 = await converter.reserveBalance(reserveToken.address);
				tokenReserveBalanceAfterSwap2 = await converter.reserveBalance(reserveToken2.address);

				protocolFeesHeldAfterSwap1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				protocolFeesHeldAfterSwap2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				balanceToken2InConverterAfterSwap = await reserveToken2.balanceOf(converter.address);
				balanceToken2InFeesControllerAfterSwap = await reserveToken2.balanceOf(feesController);

				// ERR_INVALID_AMOUNT CHECK
				expect(balanceToken2InConverterAfterSwap.add(amount).sub(tokenReserveBalanceAfterSwap2).sub(protocolFeesHeldAfterSwap2).toString()).to.equal(amount.toString());
				expect(protocolFeesHeldAfterSwap1.toString()).to.equal(new BN("0").toString());
				expect(protocolFeesHeldAfterSwap2.toString()).to.equal(totalProtocolFee3.toString());
				expect(tokenReserveBalanceAfterSwap1.toString()).to.equal(new BN("5000").add(amount.mul(new BN(3))).toString());
				expect(tokenReserveBalanceAfterSwap2.toString()).to.equal(new BN("8000").sub(purchaseAmount.add(purchaseAmount2).add(purchaseAmount3).add(totalProtocolFee).add(totalProtocolFee2).add(totalProtocolFee3)).toString());
				expect(balanceToken2InConverterAfterSwap.sub(tokenReserveBalanceAfterSwap2).toString()).to.equal(totalProtocolFee3.toString())
			});

			it("withdraw protocol fees from the converter with !WRBTC swapped (Real Converter)", async () => {
				/** TODO: SUPPORT ETH RESERVE TEST CASE */
				if(isETHReserve) return;

				/** RESERVE TOKEN 1 CONSIDERED AS WRBTC */
				/** RESERVE TOKEN 2 CONSIDERED AS TOKEN */
				const converter = await initConverter2(true, isETHReserve, 5000);
				await converterRegistry.addConverter(converter.address);
				await pathFinder.setAnchorToken(reserveToken.address);
				const conversionFeePercentage = new BN(3000);
				const protocolFeePercentage = new BN(500);
				const feesController = accounts[7];

				await converter.setConversionFee(conversionFeePercentage);
				await swapSettings.setProtocolFee(protocolFeePercentage.toString());

				const amount = new BN(wei("50000", "wei"));
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				const previousProtocolFeesHeld1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				const previousProtocolFeesHeld2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				const previousToken1ReserveBalance = await converter.reserveBalance(reserveToken.address);
				const previousToken2ReserveBalance = await converter.reserveBalance(reserveToken2.address);

				expect(await previousProtocolFeesHeld1.toString()).to.equal(new BN("0").toString());
				expect(await previousProtocolFeesHeld2.toString()).to.equal(new BN("0").toString());
				expect(await previousToken1ReserveBalance.toString()).to.equal(new BN("8000").toString());
				expect(await previousToken2ReserveBalance.toString()).to.equal(new BN("5000").toString());

				const targetAmountAndFee = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount = targetAmountAndFee[0];
				const conversionFeeAmount = targetAmountAndFee[1];
				/** SWAP WRBTC TO TOKEN */
				const res = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				const protocolTokenHeld1 = await converter.protocolFeeTokensHeld(reserveToken.address);
				const protocolTokenHeld2 = await converter.protocolFeeTokensHeld(reserveToken2.address);
				const totalProtocolFee = conversionFeeAmount.mul(protocolFeePercentage).div(conversionFeePercentage);

				const protocolFeesHeldAfterSwap1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				const protocolFeesHeldAfterSwap2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				const tokenReserveBalanceAfterSwap1 = await converter.reserveBalance(reserveToken.address);
				const tokenReserveBalanceAfterSwap2 = await converter.reserveBalance(reserveToken2.address);

				const balanceToken2InConverterAfterSwap = await reserveToken2.balanceOf(converter.address);
				const balanceToken2InFeesControllerAfterSwap = await reserveToken2.balanceOf(feesController);

				const balanceToken1InConverterAfterSwap = await reserveToken.balanceOf(converter.address);
				const balanceToken1InFeesControllerAfterSwap = await reserveToken.balanceOf(feesController);

				expect(protocolFeesHeldAfterSwap1.toString()).to.equal(new BN("0").toString());
				expect(protocolFeesHeldAfterSwap2.toString()).to.equal(totalProtocolFee.toString());
				expect(tokenReserveBalanceAfterSwap1.toString()).to.equal(new BN("8000").add(amount).toString());
				expect(tokenReserveBalanceAfterSwap2.toString()).to.equal(new BN("5000").sub(purchaseAmount).sub(protocolFeesHeldAfterSwap2).toString());
				expect(balanceToken2InFeesControllerAfterSwap.toString()).to.equal(new BN("0").toString())
				expect(balanceToken2InConverterAfterSwap.sub(tokenReserveBalanceAfterSwap2).toString()).to.equal(totalProtocolFee.toString())
				expect(balanceToken1InConverterAfterSwap.toString()).to.equal(new BN("8000").add(amount).toString())

				expectEvent(res, "Conversion", {
					_smartToken: token.address,
					_fromToken: getReserve1Address(isETHReserve),
					_toToken: reserveToken2.address,
					_fromAmount: amount,
					_toAmount: purchaseAmount,
				});

				expect((await swapSettings.protocolFee()).toString()).to.eql( protocolFeePercentage.toString() );
				expect(protocolTokenHeld1.toString()).to.eql(new BN("0").toString());
				expect(protocolTokenHeld2.toString()).to.eql(totalProtocolFee.toString());

				// withdraw protocol fee from the converter
				await swapSettings.setFeesController(feesController);

				// Consider reserveToken as wrbtc
				await swapSettings.setWrbtcAddress(reserveToken.address);
				expect(await swapSettings.feesController()).to.equal(feesController);

				/** WITHDRAW FEES */
				const resWithdrawFees = await converter.withdrawFees(feesController, {from: feesController});

				const latestToken1FeesHeldBalance = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				const latestToken2FeesHeldBalance = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				const latestToken1ReserveBalance = await converter.reserveBalance(reserveToken.address);
				const latestToken2ReserveBalance = await converter.reserveBalance(reserveToken2.address);

				const balanceToken1InConverterAfterWithdrawal = await reserveToken.balanceOf(converter.address);
				const balanceToken1InFeesControllerAfterWithdrawal = await reserveToken.balanceOf(feesController);

				const balanceToken2InConverterAfterWithdrawal = await reserveToken2.balanceOf(converter.address);
				const balanceToken2InFeesControllerAfterWithdrawal = await reserveToken2.balanceOf(feesController);

				expect(latestToken1FeesHeldBalance.toString()).to.equal(new BN("0").toString());
				expect(latestToken2FeesHeldBalance.toString()).to.equal(new BN("0").toString());

				let decode = decodeLogs(resWithdrawFees.receipt.rawLogs, LiquidityPoolV1Converter, "WithdrawFees");
				let totalWrbtcWithdrawn = new BN(0);

				for(let i = 0; i < decode.length; i++) {
					totalWrbtcWithdrawn = totalWrbtcWithdrawn.add(new BN(decode[i].args["wRBTCConverted"]));
					let sender = decode[i].args["sender"]
					let receiver = decode[i].args["receiver"]
					let token = decode[i].args["token"]
					let protocolFeeAmount = decode[i].args["protocolFeeAmount"]
					let wRBTCConverted = decode[i].args["wRBTCConverted"]

					expect(sender).to.equal(feesController);
					expect(receiver).to.equal(feesController);
					if(i == 0) {
						expect(token).to.equal(reserveToken2.address);
						expect(protocolFeeAmount.toString()).to.equal(totalProtocolFee.toString());
					} else if(i == 1) {
						expect(token).to.equal(reserveToken.address);
						expect(wRBTCConverted).to.equal( (new BN(decode[0].args["wRBTCConverted"]).mul(protocolFeePercentage).div(conversionFeePercentage)).toString() );
					}
					
				}

				/** AFTER WITHDRAWAL FEES, RESERVE TOKEN & BALANCE CONVERTER SHOULD BE SAME (SYNCED) */
				expect(balanceToken1InConverterAfterWithdrawal.toString()).to.equal(latestToken1ReserveBalance.toString())
				expect(balanceToken2InConverterAfterWithdrawal.toString()).to.equal(latestToken2ReserveBalance.toString())
				expect(balanceToken1InFeesControllerAfterWithdrawal.toString()).to.equal(totalWrbtcWithdrawn.toString())
				expect(balanceToken2InFeesControllerAfterWithdrawal.toString()).to.equal(new BN("0").toString())

				expectEvent(resWithdrawFees, "WithdrawFees", {
					sender: feesController,
					receiver: feesController,
					token: reserveToken2.address,
					protocolFeeAmount: totalProtocolFee,
				});
			});

			it("withdraw protocol fees from the converter with !WRBTC multiple swapped (Real Converter)", async () => {
				/** TODO: SUPPORT ETH RESERVE TEST CASE */
				if(isETHReserve) return;

				/** RESERVE TOKEN 1 CONSIDERED AS WRBTC */
				/** RESERVE TOKEN 2 CONSIDERED AS TOKEN */
				const converter = await initConverter2(true, isETHReserve, 5000);
				await converterRegistry.addConverter(converter.address);
				await pathFinder.setAnchorToken(reserveToken.address);
				const conversionFeePercentage = new BN(3000);
				const protocolFeePercentage = new BN(500);
				const feesController = accounts[7];

				await converter.setConversionFee(conversionFeePercentage);
				await swapSettings.setProtocolFee(protocolFeePercentage.toString());

				const amount = new BN(wei("50000", "wei"));
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				let previousProtocolFeesHeld1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				let previousProtocolFeesHeld2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				let previousToken1ReserveBalance = await converter.reserveBalance(reserveToken.address);
				let previousToken2ReserveBalance = await converter.reserveBalance(reserveToken2.address);

				expect(await previousProtocolFeesHeld1.toString()).to.equal(new BN("0").toString());
				expect(await previousProtocolFeesHeld2.toString()).to.equal(new BN("0").toString());
				expect(await previousToken1ReserveBalance.toString()).to.equal(new BN("8000").toString());
				expect(await previousToken2ReserveBalance.toString()).to.equal(new BN("5000").toString());

				// Purchase amount here is including the protocol fee
				const targetAmountAndFee = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount = targetAmountAndFee[0];
				const conversionFeeAmount = targetAmountAndFee[1];
				/** SWAP WRBTC TO TOKEN */
				const res = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });

				// #2 Swap
				let tokenReserveBalanceAfterSwap1 = await converter.reserveBalance(reserveToken.address);
				let tokenReserveBalanceAfterSwap2 = await converter.reserveBalance(reserveToken2.address);

				let protocolFeesHeldAfterSwap1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				let protocolFeesHeldAfterSwap2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				let balanceToken2InConverterAfterSwap = await reserveToken2.balanceOf(converter.address);
				let balanceToken2InFeesControllerAfterSwap = await reserveToken2.balanceOf(feesController);

				let balanceToken1InConverterAfterSwap = await reserveToken.balanceOf(converter.address);
				let balanceToken1InFeesControllerAfterSwap = await reserveToken.balanceOf(feesController);

				// ERR_INVALID_AMOUNT CHECK
				expect(balanceToken2InConverterAfterSwap.add(amount).sub(tokenReserveBalanceAfterSwap2).sub(protocolFeesHeldAfterSwap2).toString()).to.equal(amount.toString());
				await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				const targetAmountAndFee2 = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount2 = targetAmountAndFee2[0];
				const conversionFeeAmount2 = targetAmountAndFee2[1];
				const res2 = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				let totalProtocolFee = conversionFeeAmount.mul(protocolFeePercentage).div(conversionFeePercentage);
				let totalProtocolFee2 = conversionFeeAmount2.mul(protocolFeePercentage).div(conversionFeePercentage);
				let protocolTokenHeld1 = await converter.protocolFeeTokensHeld(reserveToken.address);
				let protocolTokenHeld2 = await converter.protocolFeeTokensHeld(reserveToken2.address);

				protocolFeesHeldAfterSwap1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				protocolFeesHeldAfterSwap2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				tokenReserveBalanceAfterSwap1 = await converter.reserveBalance(reserveToken.address);
				tokenReserveBalanceAfterSwap2 = await converter.reserveBalance(reserveToken2.address);

				balanceToken2InConverterAfterSwap = await reserveToken2.balanceOf(converter.address);
				balanceToken2InFeesControllerAfterSwap = await reserveToken2.balanceOf(feesController);

				balanceToken1InConverterAfterSwap = await reserveToken.balanceOf(converter.address);
				balanceToken1InFeesControllerAfterSwap = await reserveToken.balanceOf(feesController);

				expect(protocolFeesHeldAfterSwap1.toString()).to.equal(new BN("0").toString());
				expect(protocolFeesHeldAfterSwap2.toString()).to.equal(totalProtocolFee.add(totalProtocolFee2).toString());
				expect(tokenReserveBalanceAfterSwap1.toString()).to.equal(new BN("8000").add(amount).add(amount).toString());
				expect(tokenReserveBalanceAfterSwap2.toString()).to.equal(new BN("5000").sub(purchaseAmount).sub(purchaseAmount2).sub(protocolFeesHeldAfterSwap2).toString());
				expect(tokenReserveBalanceAfterSwap2.toString()).to.equal(new BN("5000").sub(purchaseAmount).sub(purchaseAmount2).sub(totalProtocolFee).sub(totalProtocolFee2).toString());
				expect(balanceToken2InFeesControllerAfterSwap.toString()).to.equal(new BN("0").toString())
				expect(balanceToken2InConverterAfterSwap.sub(tokenReserveBalanceAfterSwap2).toString()).to.equal(totalProtocolFee.add(totalProtocolFee2).toString())
				expect(balanceToken1InConverterAfterSwap.toString()).to.equal(new BN("8000").add(amount).add(amount).toString())

				expectEvent(res, "Conversion", {
					_smartToken: token.address,
					_fromToken: getReserve1Address(isETHReserve),
					_toToken: reserveToken2.address,
					_fromAmount: amount,
					_toAmount: purchaseAmount,
				});

				expect((await swapSettings.protocolFee()).toString()).to.eql( protocolFeePercentage.toString() );
				expect(protocolTokenHeld1.toString()).to.eql(new BN("0").toString());
				expect(protocolTokenHeld2.toString()).to.eql(totalProtocolFee.add(totalProtocolFee2).toString());

				// withdraw protocol fee from the converter
				await swapSettings.setFeesController(feesController);

				// Consider reserveToken as wrbtc
				await swapSettings.setWrbtcAddress(reserveToken.address);
				expect(await swapSettings.feesController()).to.equal(feesController);

				/** WITHDRAW FEES */
				console.log("Withdrawing fees...");
				const resWithdrawFees = await converter.withdrawFees(feesController, {from: feesController});

				const latestToken1FeesHeldBalance = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				const latestToken2FeesHeldBalance = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				const latestToken1ReserveBalance = await converter.reserveBalance(reserveToken.address);
				const latestToken2ReserveBalance = await converter.reserveBalance(reserveToken2.address);

				let balanceToken1InConverterAfterWithdrawal = await reserveToken.balanceOf(converter.address);
				let balanceToken1InFeesControllerAfterWithdrawal = await reserveToken.balanceOf(feesController);

				const balanceToken2InConverterAfterWithdrawal = await reserveToken2.balanceOf(converter.address);
				const balanceToken2InFeesControllerAfterWithdrawal = await reserveToken2.balanceOf(feesController);

				// try to get the rate for token -> wrbtc
				const targetAmountForWithdrawal = (await converter.targetAmountAndFee.call(reserveToken2.address, getReserve1Address(isETHReserve), protocolFeesHeldAfterSwap2));
				const feeConversionForWithdrawal = targetAmountForWithdrawal[1];
				const protocolFeeCollectedWhenWhitdrawing = feeConversionForWithdrawal.mul(protocolFeePercentage).div(conversionFeePercentage);

				expect(latestToken1FeesHeldBalance.toString()).to.equal(new BN("0").toString());
				expect(latestToken2FeesHeldBalance.toString()).to.equal(new BN("0").toString());

				let decode = decodeLogs(resWithdrawFees.receipt.rawLogs, LiquidityPoolV1Converter, "WithdrawFees");
				let totalToken2Withdrawn = new BN(decode[0].args['protocolFeeAmount']);
				let totalWrbtcWithdrawn = new BN(0);

				for(let i = 0; i < decode.length; i++) {
					totalWrbtcWithdrawn = totalWrbtcWithdrawn.add(new BN(decode[i].args["wRBTCConverted"]));
					let sender = decode[i].args["sender"]
					let receiver = decode[i].args["receiver"]
					let token = decode[i].args["token"]
					let protocolFeeAmount = decode[i].args["protocolFeeAmount"]
					let wRBTCConverted = decode[i].args["wRBTCConverted"]

					expect(sender).to.equal(feesController);
					expect(receiver).to.equal(feesController);
					if(i == 0) {
						expect(token).to.equal(reserveToken2.address);
						expect(protocolFeeAmount.toString()).to.equal(totalProtocolFee.add(totalProtocolFee2).toString());	
					} else if(i == 1) {
						expect(token).to.equal(reserveToken.address);
						expect(wRBTCConverted).to.equal( protocolFeeCollectedWhenWhitdrawing.toString() );
					}
				}

				/** AFTER WITHDRAWAL FEES, RESERVE TOKEN & BALANCE CONVERTER SHOULD BE SAME (SYNCED) */
				expect(balanceToken1InConverterAfterWithdrawal.toString()).to.equal(latestToken1ReserveBalance.toString())
				expect(balanceToken2InConverterAfterWithdrawal.toString()).to.equal(latestToken2ReserveBalance.toString())
				expect(balanceToken1InFeesControllerAfterWithdrawal.toString()).to.equal(totalWrbtcWithdrawn.toString())
				expect(balanceToken2InFeesControllerAfterWithdrawal.toString()).to.equal(new BN("0").toString())

				expectEvent(resWithdrawFees, "WithdrawFees", {
					sender: feesController,
					receiver: feesController,
					token: reserveToken2.address,
					protocolFeeAmount: totalProtocolFee.add(totalProtocolFee2),
				});

				expect(tokenReserveBalanceAfterSwap2.toString()).to.equal(new BN("5000").sub(purchaseAmount).sub(purchaseAmount2).sub(protocolFeesHeldAfterSwap2).toString());

				/// Third swap (#1 swap after withdrawal)
				await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				const targetAmountAndFee3 = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount3 = targetAmountAndFee3[0];
				const conversionFeeAmount3 = targetAmountAndFee3[1];
				const res3 = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				const totalProtocolFee3 = conversionFeeAmount3.mul(protocolFeePercentage).div(conversionFeePercentage);
				protocolTokenHeld1 = await converter.protocolFeeTokensHeld(reserveToken.address);
				protocolTokenHeld2 = await converter.protocolFeeTokensHeld(reserveToken2.address);

				let decode2 = decodeLogs(res3.receipt.rawLogs, LiquidityPoolV1Converter, "Conversion");
				
				tokenReserveBalanceAfterSwap1 = await converter.reserveBalance(reserveToken.address);
				tokenReserveBalanceAfterSwap2 = await converter.reserveBalance(reserveToken2.address);

				protocolFeesHeldAfterSwap1 = await converter.getProtocolFeeTokensHeld(reserveToken.address);
				protocolFeesHeldAfterSwap2 = await converter.getProtocolFeeTokensHeld(reserveToken2.address);

				balanceToken2InConverterAfterSwap = await reserveToken2.balanceOf(converter.address);
				balanceToken2InFeesControllerAfterSwap = await reserveToken2.balanceOf(feesController);

				balanceToken1InConverterAfterSwap = await reserveToken.balanceOf(converter.address);
				balanceToken1InFeesControllerAfterSwap = await reserveToken.balanceOf(feesController);

				// ERR_INVALID_AMOUNT CHECK
				expect(balanceToken2InConverterAfterSwap.add(amount).sub(tokenReserveBalanceAfterSwap2).sub(protocolFeesHeldAfterSwap2).toString()).to.equal(amount.toString());
				expect(protocolFeesHeldAfterSwap1.toString()).to.equal(new BN("0").toString());
				expect(protocolFeesHeldAfterSwap2.toString()).to.equal(totalProtocolFee3.toString());
				/// Total reserve balance at this state should be (amount * 3) - total wrbtc withdrawn
				expect(tokenReserveBalanceAfterSwap1.toString()).to.equal(new BN("8000").add(amount.mul(new BN(3))).sub(totalWrbtcWithdrawn).toString());
				expect(tokenReserveBalanceAfterSwap2.toString()).to.equal(balanceToken2InConverterAfterSwap.sub(protocolTokenHeld2).toString());
				expect(tokenReserveBalanceAfterSwap2.toString()).to.equal(new BN("5000").sub(purchaseAmount).sub(purchaseAmount2).sub(purchaseAmount3).sub(totalProtocolFee).sub(totalProtocolFee2).sub(totalProtocolFee3).add(totalToken2Withdrawn).toString()); // Need to add by protocol fee #swap1 & #swap2 because we have withdrawan the protocol fee
				expect(balanceToken2InConverterAfterSwap.sub(tokenReserveBalanceAfterSwap2).add(totalToken2Withdrawn).toString()).to.equal(totalProtocolFee.add(totalProtocolFee2).add(totalProtocolFee3).toString())
				expect(balanceToken1InConverterAfterSwap.toString()).to.equal(new BN("8000").add(amount.mul(new BN(3))).sub(totalWrbtcWithdrawn).toString())
				expect(balanceToken1InFeesControllerAfterSwap.toString()).to.equal(totalWrbtcWithdrawn.toString())
			});

			it("withdraw protocol fees from the converter (WRBTC)", async () => {
				const converter = await initConverter(true, isETHReserve, 5000);
				const conversionFeePercentage = new BN(3000);
				const protocolFeePercentage = new BN(500);
				const feesController = accounts[7];

				// consider reserve token as wrbtc
				await swapSettings.setWrbtcAddress(reserveToken2.address);

				await converter.setConversionFee(conversionFeePercentage);
				await swapSettings.setProtocolFee(protocolFeePercentage.toString());

				const amount = new BN(wei("50000", "wei"));
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				const targetAmountAndFee = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount = targetAmountAndFee[0];
				const conversionFeeAmount = targetAmountAndFee[1];
				const res = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				const protocolTokenHeld = await converter.protocolFeeTokensHeld(reserveToken2.address);
				const totalProtocolFee = conversionFeeAmount.mul(protocolFeePercentage).div(conversionFeePercentage);
				expectEvent(res, "Conversion", {
					_smartToken: token.address,
					_fromToken: getReserve1Address(isETHReserve),
					_toToken: reserveToken2.address,
					_fromAmount: amount,
					_toAmount: purchaseAmount,
				});

				expect((await swapSettings.protocolFee()).toString()).to.eql( protocolFeePercentage.toString() );
				expect(protocolTokenHeld.toString()).to.eql(totalProtocolFee.toString());

				// withdraw protocol fee from the converter
				await reserveToken2.transfer(sovrynSwapNetwork.address, amount)
				await swapSettings.setFeesController(feesController);
				expect(await swapSettings.feesController()).to.equal(feesController);

				const previousWrbtcBalanceConverter = await reserveToken2.balanceOf(converter.address);
				const previousWrbtcBalanceFeesController = await reserveToken2.balanceOf(feesController);

				const resWithdrawFees = await converter.withdrawFees(feesController, {from: feesController});

				const latestWrbtcBalanceConverter = await reserveToken2.balanceOf(converter.address);
				const latestWrbtcBalanceFeesController = await reserveToken2.balanceOf(feesController);

				expect(latestWrbtcBalanceConverter.toString()).to.equal( (previousWrbtcBalanceConverter.sub(new BN(protocolTokenHeld))).toString() )
				expect(latestWrbtcBalanceFeesController.toString()).to.equal( (previousWrbtcBalanceFeesController.add(new BN(protocolTokenHeld))).toString() )
				expect( (await converter.protocolFeeTokensHeld(reserveToken2.address)).toString() ).to.equal(new BN(0).toString());

				expectEvent(resWithdrawFees, "WithdrawFees", {
					sender: feesController,
					receiver: feesController,
					token: reserveToken2.address,
					protocolFeeAmount: totalProtocolFee,
					wRBTCConverted: new BN(protocolTokenHeld)
				});
			});

			it("withdraw protocol fees from the converter (SOV)", async () => {
				const converter = await initConverter(true, isETHReserve, 5000);
				const conversionFeePercentage = new BN(3000);
				const protocolFeePercentage = new BN(500);
				const feeSharingProxy = await FeeSharingProxy.new();
				const feesController = feeSharingProxy.address;
				const totalSupplyWrbtc = 2000000000;
				const wrbtc = await ERC20Token.new("WRBTC", "WRBTC", 8, totalSupplyWrbtc);

				await swapSettings.setWrbtcAddress(wrbtc.address);
				// consider reserve token as sov
				await swapSettings.setSOVTokenAddress(reserveToken2.address);

				await converter.setConversionFee(conversionFeePercentage);
				await swapSettings.setProtocolFee(protocolFeePercentage.toString());

				const amount = new BN(wei("50000", "wei"));
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				const targetAmountAndFee = (await converter.targetAmountAndFee.call(getReserve1Address(isETHReserve), reserveToken2.address, amount));
				const purchaseAmount = targetAmountAndFee[0];
				const conversionFeeAmount = targetAmountAndFee[1];
				const res = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });
				const protocolTokenHeld = await converter.protocolFeeTokensHeld(reserveToken2.address);
				const totalProtocolFee = conversionFeeAmount.mul(protocolFeePercentage).div(conversionFeePercentage);
				expectEvent(res, "Conversion", {
					_smartToken: token.address,
					_fromToken: getReserve1Address(isETHReserve),
					_toToken: reserveToken2.address,
					_fromAmount: amount,
					_toAmount: purchaseAmount,
				});

				expect((await swapSettings.protocolFee()).toString()).to.eql( protocolFeePercentage.toString() );
				expect(protocolTokenHeld.toString()).to.eql(totalProtocolFee.toString());

				// withdraw protocol fee from the converter
				await reserveToken2.transfer(sovrynSwapNetwork.address, amount)
				await swapSettings.setFeesController(feesController);
				expect(await swapSettings.feesController()).to.equal(feesController);

				const resWithdrawFees = await feeSharingProxy.withdrawFees(converter.address, feesController);

				expectEvent(resWithdrawFees, "TokensTransferred", {
					sender: converter.address,
					token: reserveToken2.address,
					amount: totalProtocolFee
				});
			});

			it("verifies the TokenRateUpdate event after conversion", async () => {
				const converter = await initConverter(true, isETHReserve, 10000);
				await converter.setConversionFee(6000);

				const amount = new BN(500);
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				const res = await convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value });

				const poolTokenSupply = await token.totalSupply.call();
				const reserve1Balance = await converter.reserveBalance(getReserve1Address(isETHReserve));
				const reserve1Weight = await converter.reserveWeight(getReserve1Address(isETHReserve));
				const reserve2Balance = await converter.reserveBalance(reserveToken2.address);
				const reserve2Weight = await converter.reserveWeight(reserveToken2.address);

				const events = await converter.getPastEvents("TokenRateUpdate", {
					fromBlock: res.receipt.blockNumber,
					toBlock: res.receipt.blockNumber,
				});

				// TokenRateUpdate for [source, target):
				const { args: event1 } = events[0];
				expect(event1._token1).to.eql(getReserve1Address(isETHReserve));
				expect(event1._token2).to.eql(reserveToken2.address);
				expect(event1._rateN).to.be.bignumber.equal(reserve2Balance.mul(reserve1Weight));
				expect(event1._rateD).to.be.bignumber.equal(reserve1Balance.mul(reserve2Weight));

				// TokenRateUpdate for [source, pool token):
				const { args: event2 } = events[1];
				expect(event2._token1).to.eql(tokenAddress);
				expect(event2._token2).to.eql(getReserve1Address(isETHReserve));
				expect(event2._rateN).to.be.bignumber.equal(reserve1Balance.mul(WEIGHT_RESOLUTION));
				expect(event2._rateD).to.be.bignumber.equal(poolTokenSupply.mul(reserve1Weight));

				// TokenRateUpdate for [pool token, target):
				const { args: event3 } = events[2];
				expect(event3._token1).to.eql(tokenAddress);
				expect(event3._token2).to.eql(reserveToken2.address);
				expect(event3._rateN).to.be.bignumber.equal(reserve2Balance.mul(WEIGHT_RESOLUTION));
				expect(event3._rateD).to.be.bignumber.equal(poolTokenSupply.mul(reserve2Weight));
			});

			it("should revert when attempting to convert when the return is smaller than the minimum requested amount", async () => {
				const converter = await initConverter(true, isETHReserve, 5000);

				const amount = new BN(wei("50000", "wei"));
				const protocolFeePercentage = new BN(500);
				const conversionFeePercentage = new BN(3000);

				await converter.setConversionFee(conversionFeePercentage);
				await swapSettings.setProtocolFee(protocolFeePercentage);

				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				}

				await expectRevert(
					convert([getReserve1Address(isETHReserve), tokenAddress, reserveToken2.address], amount, 200000, { value }),
					"ERR_RETURN_TOO_LOW"
				);
			});

			for (const percent of [50, 75, 100]) {
				it(`verifies that fund executes when the reserve ratio equals ${percent}%`, async () => {
					const converter = await initConverter(false, isETHReserve);
					await reserveToken2.transfer(converter.address, 6000);

					await token.transferOwnership(converter.address);
					await converter.acceptTokenOwnership();

					const prevBalance = await token.balanceOf.call(sender);

					const amount = new BN(100000);
					let value = 0;
					if (isETHReserve) {
						value = amount;
					} else {
						await reserveToken.approve(converter.address, amount, { from: sender });
					}

					await reserveToken2.approve(converter.address, amount, { from: sender });

					const amount2 = new BN(100);
					await converter.fund(amount2, { value });

					const balance = await token.balanceOf.call(sender);
					expect(balance).to.be.bignumber.equal(prevBalance.add(amount2));
				});
			}

			it("verifies that fund gets the correct reserve balance amounts from the caller", async () => {
				const converter = await initConverter(false, isETHReserve);

				await token.transferOwnership(converter.address);
				await converter.acceptTokenOwnership();

				await reserveToken.transfer(sender2, 5000);
				await reserveToken2.transfer(sender2, 5000);

				const supply = await token.totalSupply.call();
				const percentage = new BN(0);
				const prevReserve1Balance = await converter.reserveBalance.call(getReserve1Address(isETHReserve));
				const prevReserve2Balance = await converter.reserveBalance.call(reserveToken2.address);
				const token1Amount = divCeil(prevReserve1Balance.mul(percentage), supply);
				const token2Amount = divCeil(prevReserve2Balance.mul(percentage), supply);

				const amount = new BN(100000);
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(converter.address, amount, { from: sender2 });
				}

				await reserveToken2.approve(converter.address, amount, { from: sender2 });
				await converter.fund(percentage, { from: sender2, value });

				const reserve1Balance = await converter.reserveBalance.call(getReserve1Address(isETHReserve));
				const reserve2Balance = await converter.reserveBalance.call(reserveToken2.address);

				expect(reserve1Balance).to.be.bignumber.equal(prevReserve1Balance.add(token1Amount));
				expect(reserve2Balance).to.be.bignumber.equal(prevReserve2Balance.add(token2Amount));
			});

			it("verifies that increasing the liquidity by a large amount gets the correct reserve balance amounts from the caller", async () => {
				const converter = await initConverter(false, isETHReserve);

				await token.transferOwnership(converter.address);
				await converter.acceptTokenOwnership();

				await reserveToken.transfer(sender2, 500000);
				await reserveToken2.transfer(sender2, 500000);

				const supply = await token.totalSupply.call();
				const percentage = new BN(0);
				const prevReserve1Balance = await converter.reserveBalance.call(getReserve1Address(isETHReserve));
				const prevReserve2Balance = await converter.reserveBalance.call(reserveToken2.address);

				const token1Amount = divCeil(prevReserve1Balance.mul(percentage), supply);
				const token2Amount = divCeil(prevReserve2Balance.mul(percentage), supply);

				const amount = new BN(100000);
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(converter.address, amount, { from: sender2 });
				}

				await reserveToken2.approve(converter.address, amount, { from: sender2 });
				await converter.fund(percentage, { from: sender2, value });

				const reserve1Balance = await converter.reserveBalance.call(getReserve1Address(isETHReserve));
				const reserve2Balance = await converter.reserveBalance.call(reserveToken2.address);

				expect(reserve1Balance).to.be.bignumber.equal(prevReserve1Balance.add(token1Amount));
				expect(reserve2Balance).to.be.bignumber.equal(prevReserve2Balance.add(token2Amount));
			});

			it("should revert when attempting to fund the converter with insufficient funds", async () => {
				const converter = await initConverter(false, isETHReserve);

				await token.transferOwnership(converter.address);
				await converter.acceptTokenOwnership();

				await reserveToken.transfer(sender2, 100);
				await reserveToken2.transfer(sender2, 100);

				const amount = new BN(100000);
				let value = 0;
				if (isETHReserve) {
					value = amount;
				} else {
					await reserveToken.approve(converter.address, amount, { from: sender2 });
				}

				await reserveToken2.approve(converter.address, amount, { from: sender2 });
				await converter.fund(5, { from: sender2, value });

				await expectRevert.unspecified(converter.fund(600, { from: sender2, value }));
			});

			for (const percent of [50, 75, 100]) {
				it(`verifies that liquidate executes when the reserve ratio equals ${percent}%`, async () => {
					const converter = await initConverter(false, isETHReserve);

					await token.transferOwnership(converter.address);
					await converter.acceptTokenOwnership();

					const prevSupply = await token.totalSupply.call();
					await converter.liquidate(100);
					const supply = await token.totalSupply.call();

					expect(prevSupply).to.be.bignumber.equal(supply.add(new BN(100)));
				});
			}

			it("verifies that liquidate sends the correct reserve balance amounts to the caller", async () => {
				const converter = await initConverter(false, isETHReserve, 0, true);

				await token.transferOwnership(converter.address);
				await converter.acceptTokenOwnership();

				await token.transfer(sender2, 100);

				const supply = await token.totalSupply.call();
				const percentage = new BN(19);
				const reserve1Balance = await converter.reserveBalance.call(getReserve1Address(isETHReserve));
				const reserve2Balance = await converter.reserveBalance.call(reserveToken2.address);
				const token1Amount = reserve1Balance.mul(percentage).div(supply);
				const token2Amount = reserve2Balance.mul(percentage).div(supply);

				const token1PrevBalance = await getBalance(reserveToken, getReserve1Address(isETHReserve), sender2);
				const token2PrevBalance = await reserveToken2.balanceOf.call(sender2);
				const res = await converter.liquidate(percentage, { from: sender2 });

				let transactionCost = new BN(0);
				if (isETHReserve) {
					transactionCost = await getTransactionCost(res);
				}

				const token1Balance = await getBalance(reserveToken, getReserve1Address(isETHReserve), sender2);
				const token2Balance = await reserveToken2.balanceOf.call(sender2);

				expect(token1Balance).to.be.bignumber.equal(token1PrevBalance.add(token1Amount.sub(transactionCost)));
				expect(token2Balance).to.be.bignumber.equal(token2PrevBalance.add(token2Amount));
			});

			it("verifies that liquidating a large amount sends the correct reserve balance amounts to the caller", async () => {
				const converter = await initConverter(false, isETHReserve, 0, true);

				await token.transferOwnership(converter.address);
				await converter.acceptTokenOwnership();

				await token.transfer(sender2, 15000);

				const supply = await token.totalSupply.call();
				const percentage = new BN(14854);
				const reserve1Balance = await converter.reserveBalance.call(getReserve1Address(isETHReserve));
				const reserve2Balance = await converter.reserveBalance.call(reserveToken2.address);
				const token1Amount = reserve1Balance.mul(percentage).div(supply);
				const token2Amount = reserve2Balance.mul(percentage).div(supply);

				const token1PrevBalance = await getBalance(reserveToken, getReserve1Address(isETHReserve), sender2);
				const token2PrevBalance = await reserveToken2.balanceOf.call(sender2);
				const res = await converter.liquidate(percentage, { from: sender2 });

				let transactionCost = new BN(0);
				if (isETHReserve) {
					transactionCost = await getTransactionCost(res);
				}

				const token1Balance = await getBalance(reserveToken, getReserve1Address(isETHReserve), sender2);
				const token2Balance = await reserveToken2.balanceOf.call(sender2);

				expect(token1Balance).to.be.bignumber.equal(token1PrevBalance.add(token1Amount.sub(transactionCost)));
				expect(token2Balance).to.be.bignumber.equal(token2PrevBalance.add(token2Amount));
			});

			it("verifies that liquidating the entire supply sends the full reserve balances to the caller", async () => {
				const converter = await initConverter(false, isETHReserve);

				await token.transferOwnership(converter.address);
				await converter.acceptTokenOwnership();

				await token.transfer(sender2, 20000);

				const reserve1Balance = await converter.reserveBalance.call(getReserve1Address(isETHReserve));
				const reserve2Balance = await converter.reserveBalance.call(reserveToken2.address);

				const token1PrevBalance = await getBalance(reserveToken, getReserve1Address(isETHReserve), sender2);
				const token2PrevBalance = await reserveToken2.balanceOf.call(sender2);
				const res = await converter.liquidate(20000, { from: sender2 });

				let transactionCost = new BN(0);
				if (isETHReserve) {
					transactionCost = await getTransactionCost(res);
				}

				const supply = await token.totalSupply.call();
				const token1Balance = await getBalance(reserveToken, getReserve1Address(isETHReserve), sender2);
				const token2Balance = await reserveToken2.balanceOf.call(sender2);

				expect(supply).to.be.bignumber.equal(new BN(0));
				expect(token1PrevBalance.add(reserve1Balance).sub(transactionCost)).to.be.bignumber.equal(token1Balance);
				expect(token2PrevBalance.add(reserve2Balance)).to.be.bignumber.equal(token2Balance);
			});

			it("should revert when attempting to liquidate with insufficient funds", async () => {
				const converter = await initConverter(false, isETHReserve);

				await token.transferOwnership(converter.address);
				await converter.acceptTokenOwnership();

				await token.transfer(sender2, 100);

				await converter.liquidate(5, { from: sender2 });

				await expectRevert.unspecified(converter.liquidate(600, { from: sender2 }));
			});
		});
	}

	it("verifies that it gives latest answer from oracle", async () => {
		const converter = await initConverter(true, false, 5000);
		await converter.setConversionFee(3000);

		const amount = new BN(500);
		await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });

		await convert([reserveToken.address, tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value: 0 });
		const ema0 = await oracle.ema0.call();
		const ema1 = await oracle.ema1.call();
		expect(await oracle.latestPrice.call(reserveToken.address)).to.be.bignumber.equal(ema0);
		expect(await oracle.latestPrice.call(reserveToken2.address)).to.be.bignumber.equal(ema1);
	});

	for (let decimal0 = 1; decimal0 <= 18; decimal0++) {
		for (let decimal1 = 1; decimal1 <= 18; decimal1++) {
			const maxConversionFee = 5000;
			const k = 5000;

			const setupConverter = async () => {
				reserveToken = await ERC20Token.new("ERC Token 1", "ERC1", decimal0, 1000000000);
				reserveToken2 = await TestNonStandardToken.new("ERC Token 2", "ERC2", decimal1, 2000000000);

				token = await SmartToken.new("Token1", "TKN1", 2);
				tokenAddress = token.address;

				const converter = await createConverter(tokenAddress, contractRegistry.address, maxConversionFee);
				oracle = await Oracle.new(converter.address, reserveToken.address);
				await oracle.setK(k);
				oracleAddress = oracle.address;

				await converter.setOracle(oracleAddress);

				await converter.addReserve(reserveToken.address, 250000);
				await converter.addReserve(reserveToken2.address, 150000);

				await reserveToken2.transfer(converter.address, 8000);
				await token.issue(sender, 20000);
				await reserveToken.transfer(converter.address, 5000);

				await token.transferOwnership(converter.address);
				await converter.acceptTokenOwnership();

				return converter;
			};

			const getObservations = async (converter, oracle, observation) => {
				const reserve0Balance = await converter.reserveBalance.call(reserveToken.address);
				const reserve0Weight = (await converter.reserves.call(reserveToken.address)).weight;
				const reserve1Balance = await converter.reserveBalance.call(reserveToken2.address);
				const reserve1Weight = (await converter.reserves.call(reserveToken2.address)).weight;
				const partialReserves0 = reserve0Balance.div(new BN(1000));
				const partialReserves1 = reserve1Balance.div(new BN(1000));

				let price0 = await sovrynSwapFormula.crossReserveTargetAmount.call(reserve0Balance, reserve0Weight, reserve1Balance, reserve1Weight, partialReserves0);
				let price1 = await sovrynSwapFormula.crossReserveTargetAmount.call(reserve1Balance, reserve1Weight, reserve0Balance, reserve0Weight, partialReserves1);

				price0 = price0.mul(new BN(10).pow(new BN(decimal0))).div(partialReserves0);
				price1 = price1.mul(new BN(10).pow(new BN(decimal1))).div(partialReserves1);

				if (observation === 1) return { ema0: price0, ema1: price1 };

				const previousEMA0 = await oracle.ema0.call();
				const previousEMA1 = await oracle.ema1.call();

				let ema0 = (new BN(k).mul(price0).add((new BN(10000 - k).mul(previousEMA0)))).div(new BN(10000));
				let ema1 = (new BN(k).mul(price1).add((new BN(10000 - k).mul(previousEMA1)))).div(new BN(10000));

				return { ema0, ema1 };
			}

			it("verifies that oracle gives non zero EMA for all decimal ranges", async () => {
				const converter = await setupConverter();
				await converter.setConversionFee(3000);

				let amount = new BN(50);
				const firstObservation = await getObservations(converter, oracle, 1);

				await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				await convert([reserveToken.address, tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value: 0 });

				let ema0 = await oracle.ema0.call();
				let ema1 = await oracle.ema1.call();

				expect(await oracle.latestPrice.call(reserveToken.address)).to.be.bignumber.equal(ema0);
				expect(await oracle.latestPrice.call(reserveToken2.address)).to.be.bignumber.equal(ema1);

				expect(ema0).to.be.bignumber.greaterThan('0');
				expect(ema1).to.be.bignumber.greaterThan('0');

				//verifies if initial swap results in EMA equal to the price
				expect(ema0).to.be.bignumber.equal(firstObservation.ema0.toString());
				expect(ema1).to.be.bignumber.equal(firstObservation.ema1.toString());

				amount = new BN(1000);
				const secondObservation = await getObservations(converter, oracle, 2);
				await reserveToken.approve(sovrynSwapNetwork.address, amount, { from: sender });
				await convert([reserveToken.address, tokenAddress, reserveToken2.address], amount, MIN_RETURN, { value: 0 });

				ema0 = await oracle.ema0.call();
				ema1 = await oracle.ema1.call();

				//verifies if second swap updates EMA
				expect(ema0).to.be.bignumber.equal(secondObservation.ema0.toString());
				expect(ema1).to.be.bignumber.equal(secondObservation.ema1.toString());
			});
		}
	}

	describe("verifies that the maximum possible liquidity is added", () => {
		let converter;
		let reserveToken1;
		let reserveToken2;

		const amounts = [
			[1000, 1200],
			[200, 240],
			[2000, 2400],
			[20000, 22000],
			[20000, 26000],
			[100000, 120000],
		];

		beforeEach(async () => {
			const token = await SmartToken.new("Token", "TKN", 0);
			converter = await LiquidityPoolV1Converter.new(token.address, contractRegistry.address, 0);
			reserveToken1 = await ERC20Token.new("ERC Token 1", "ERC1", 18, 1000000000);
			reserveToken2 = await ERC20Token.new("ERC Token 2", "ERC2", 18, 1000000000);
			await converter.addReserve(reserveToken1.address, 500000);
			await converter.addReserve(reserveToken2.address, 500000);
			await token.transferOwnership(converter.address);
			await converter.acceptTokenOwnership();
		});

		for (const [amount1, amount2] of amounts) {
			it(`addLiquidity(${[amount1, amount2]})`, async () => {
				await reserveToken1.approve(converter.address, amount1, { from: sender });
				await reserveToken2.approve(converter.address, amount2, { from: sender });
				await converter.addLiquidity([reserveToken1.address, reserveToken2.address], [amount1, amount2], 1);
				const balance1 = await reserveToken1.balanceOf.call(converter.address);
				const balance2 = await reserveToken2.balanceOf.call(converter.address);
				const a1b2 = new BN(amount1).mul(balance2);
				const a2b1 = new BN(amount2).mul(balance1);
				const expected1 = a1b2.lt(a2b1) ? new BN(0) : a1b2.sub(a2b1).div(balance2);
				const expected2 = a2b1.lt(a1b2) ? new BN(0) : a2b1.sub(a1b2).div(balance1);
				const actual1 = await reserveToken1.allowance.call(sender, converter.address);
				const actual2 = await reserveToken2.allowance.call(sender, converter.address);
				expect(actual1).to.be.bignumber.equal(expected1);
				expect(actual2).to.be.bignumber.equal(expected2);
			});
		}
	});

	describe("verifies no gain by adding/removing liquidity", () => {
		const addAmounts = [
			[1000, 1000],
			[1000, 2000],
			[2000, 1000],
		];

		const removePercents = [[100], [50, 50], [25, 75], [75, 25], [10, 20, 30, 40]];

		for (const amounts of addAmounts) {
			for (const percents of removePercents) {
				it(`(amounts = ${amounts}, percents = ${percents})`, async () => {
					const token = await SmartToken.new("Token", "TKN", 0);
					const converter = await LiquidityPoolV1Converter.new(token.address, contractRegistry.address, 0);
					const reserveToken1 = await ERC20Token.new("ERC Token 1", "ERC1", 18, 1000000000);
					const reserveToken2 = await ERC20Token.new("ERC Token 2", "ERC2", 18, 1000000000);
					await converter.addReserve(reserveToken1.address, 500000);
					await converter.addReserve(reserveToken2.address, 500000);
					await token.transferOwnership(converter.address);
					await converter.acceptTokenOwnership();
					let lastAmount = new BN(0);
					for (const amount of amounts) {
						await reserveToken1.transfer(sender2, amount, { from: sender });
						await reserveToken2.transfer(sender2, amount, { from: sender });
						await reserveToken1.approve(converter.address, amount, { from: sender2 });
						await reserveToken2.approve(converter.address, amount, { from: sender2 });
						await converter.addLiquidity([reserveToken1.address, reserveToken2.address], [amount, amount], MIN_RETURN, { from: sender2 });
						const balance = await token.balanceOf.call(sender2);
						lastAmount = balance.sub(lastAmount);
					}
					for (const percent of percents) {
						await converter.removeLiquidity(
							lastAmount.mul(new BN(percent)).div(new BN(100)),
							[reserveToken1.address, reserveToken2.address],
							[MIN_RETURN, MIN_RETURN],
							{ from: sender2 }
						);
					}
					const balance1 = await reserveToken1.balanceOf.call(sender2);
					const balance2 = await reserveToken2.balanceOf.call(sender2);
					const amount = new BN(amounts[1]);
					expect(balance1).to.be.bignumber.equal(amount);
					expect(balance2).to.be.bignumber.equal(amount);
				});
			}
		}
	});
});
