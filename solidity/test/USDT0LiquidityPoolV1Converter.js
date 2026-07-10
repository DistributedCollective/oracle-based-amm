const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");

const { registry } = require("./helpers/Constants");

const LiquidityPoolV1Converter = artifacts.require("LiquidityPoolV1Converter");
const SmartToken = artifacts.require("SmartToken");
const SovrynSwapFormula = artifacts.require("SovrynSwapFormula");
const ContractRegistry = artifacts.require("ContractRegistry");
const ERC20Token = artifacts.require("ERC20Token");
const SwapSettings = artifacts.require("SwapSettings");

contract("USDT0 LiquidityPoolV1Converter", (accounts) => {
	const sender = accounts[0];
	const sender2 = accounts[9];
	const MIN_RETURN = new BN(1);

	const wrbtcSeed = new BN("900000000000000"); // 0.0009 WRBTC
	const usdt0Seed = new BN("100000000"); // 100 USDT0
	const wrbtcDeposit = new BN("9000000000000000"); // 0.009 WRBTC
	const usdt0Deposit = new BN("1000000000"); // 1,000 USDT0
	const usdt0ExcessDeposit = new BN("1200000000"); // 1,200 USDT0

	let contractRegistry;
	let sovrynSwapFormula;
	let converter;
	let poolToken;
	let wrbtcToken;
	let usdt0Token;

	const seedPool = async () => {
		await wrbtcToken.approve(converter.address, wrbtcSeed, { from: sender });
		await usdt0Token.approve(converter.address, usdt0Seed, { from: sender });
		await converter.addLiquidity([wrbtcToken.address, usdt0Token.address], [wrbtcSeed, usdt0Seed], MIN_RETURN, { from: sender });
	};

	before(async () => {
		sovrynSwapFormula = await SovrynSwapFormula.new();
		await sovrynSwapFormula.init();
		contractRegistry = await ContractRegistry.new();
		await contractRegistry.registerAddress(registry.SOVRYNSWAP_FORMULA, sovrynSwapFormula.address);
	});

	beforeEach(async () => {
		const swapSettings = await SwapSettings.new(
			accounts[1], // feesController
			accounts[1], // wrbtc
			accounts[1], // sov token
			0 // protocol fee
		);
		await contractRegistry.registerAddress(registry.SWAP_SETTINGS, swapSettings.address);

		poolToken = await SmartToken.new("(WR)BTC/USDT0", "WRBTCUSDT0", 18);
		converter = await LiquidityPoolV1Converter.new(poolToken.address, contractRegistry.address, 0);
		wrbtcToken = await ERC20Token.new("Wrapped RBTC", "WRBTC", 18, new BN("1000000000000000000000000"));
		usdt0Token = await ERC20Token.new("USDT0", "USDT0", 6, new BN("1000000000000000"));

		await converter.addReserve(wrbtcToken.address, 500000);
		await converter.addReserve(usdt0Token.address, 500000);
		await poolToken.transferOwnership(converter.address);
		await converter.acceptTokenOwnership();
	});

	it("seeds an empty V1 pool using raw 6-decimal USDT0 amounts", async () => {
		await seedPool();

		expect(await wrbtcToken.balanceOf.call(converter.address)).to.be.bignumber.equal(wrbtcSeed);
		expect(await usdt0Token.balanceOf.call(converter.address)).to.be.bignumber.equal(usdt0Seed);

		const lpSupply = await poolToken.totalSupply.call();
		expect(lpSupply).to.be.bignumber.gt(new BN(0));
	});

	it("mints the expected LP amount for a proportional USDT0 deposit", async () => {
		await seedPool();

		await wrbtcToken.transfer(sender2, wrbtcDeposit, { from: sender });
		await usdt0Token.transfer(sender2, usdt0Deposit, { from: sender });

		await wrbtcToken.approve(converter.address, wrbtcDeposit, { from: sender2 });
		await usdt0Token.approve(converter.address, usdt0Deposit, { from: sender2 });

		const supplyBefore = await poolToken.totalSupply.call();
		const reserveRatio = await converter.reserveRatio.call();
		const expectedLP = await sovrynSwapFormula.fundSupplyAmount.call(supplyBefore, wrbtcSeed, reserveRatio, wrbtcDeposit);

		await converter.addLiquidity([wrbtcToken.address, usdt0Token.address], [wrbtcDeposit, usdt0Deposit], expectedLP, { from: sender2 });

		expect(await poolToken.balanceOf.call(sender2)).to.be.bignumber.equal(expectedLP);
		expect(await wrbtcToken.balanceOf.call(converter.address)).to.be.bignumber.equal(wrbtcSeed.add(wrbtcDeposit));
		expect(await usdt0Token.balanceOf.call(converter.address)).to.be.bignumber.equal(usdt0Seed.add(usdt0Deposit));
	});

	it("uses only the proportional USDT0 amount from an oversized approval", async () => {
		await seedPool();

		await wrbtcToken.transfer(sender2, wrbtcDeposit, { from: sender });
		await usdt0Token.transfer(sender2, usdt0ExcessDeposit, { from: sender });

		await wrbtcToken.approve(converter.address, wrbtcDeposit, { from: sender2 });
		await usdt0Token.approve(converter.address, usdt0ExcessDeposit, { from: sender2 });

		await converter.addLiquidity([wrbtcToken.address, usdt0Token.address], [wrbtcDeposit, usdt0ExcessDeposit], MIN_RETURN, { from: sender2 });

		expect(await usdt0Token.balanceOf.call(converter.address)).to.be.bignumber.equal(usdt0Seed.add(usdt0Deposit));
		expect(await usdt0Token.allowance.call(sender2, converter.address)).to.be.bignumber.equal(usdt0ExcessDeposit.sub(usdt0Deposit));
	});
});
