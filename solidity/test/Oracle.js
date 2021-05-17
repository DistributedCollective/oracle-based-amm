const { expect } = require("chai");
const { expectRevert, expectEvent, BN, ether, constants } = require("@openzeppelin/test-helpers");
const { latest, latestBlock } = require("@openzeppelin/test-helpers/src/time");

const { ZERO_ADDRESS } = constants;

const Oracle = artifacts.require("Oracle");

contract("Oracle", (accounts) => {
	let oracle;
	let reserves0Balance = ether("1");
	let reserves1Balance = ether("2");

	const pool = accounts[1];

	beforeEach(async () => {
		oracle = await Oracle.new();
		await oracle.setLiquidityPool(pool);
	});

	it("should revert if k value not set by owner", async () => {
		await expectRevert(oracle.setK(10, { from: accounts[2] }), "ERR_ACCESS_DENIED");
	});

	it("should revert if k value do not lie within a valid range", async () => {
		await expectRevert(oracle.setK(1000), "ERR_INVALID_K_VALUE");
	});

	it("should set k value", async () => {
		const k = new BN("30");
		const receipt = await oracle.setK(k);
		expect(await oracle.k.call()).to.be.bignumber.equal(k);
		expectEvent(receipt, "KValueUpdate", {
			_k: k
		});
	});

	it("should revert if pool address is not set by owner", async () => {
		await expectRevert(oracle.setLiquidityPool(accounts[1], { from: accounts[2] }), "ERR_ACCESS_DENIED");
	});

	it("should revert if pool address is set as zero address", async () => {
		await expectRevert(oracle.setLiquidityPool(ZERO_ADDRESS), "ERR_ZERO_POOL_ADDRESS");
	});

	it("should set pool address", async () => {
		const receipt = await oracle.setLiquidityPool(accounts[1]);
		expect(await oracle.liquidityPool.call()).to.be.equal(accounts[1]);
		expectEvent(receipt, "PoolAddressUpdate", {
			_liquidityPool: accounts[1]
		});
	});

	it("should revert if observations are not written by pool", async () => {
		await expectRevert(oracle.write(reserves0Balance, reserves1Balance), "ERR_INVALID_POOL_ADDRESS");
	});

	it("should set initial observations", async () => {
		const receipt = await oracle.write(reserves0Balance, reserves1Balance, { from: pool });

		const lastCumulativePrice0 = (new BN(reserves1Balance) * 10 ** 18) / reserves0Balance;
		const lastCumulativePrice1 = (new BN(reserves0Balance) * 10 ** 18) / reserves1Balance;

		expectEvent(receipt, "ObservationsUpdated", {
			ema0: new BN("0"),
			ema1: new BN("0"),
			blockNumber: await latestBlock(),
			timestamp: await latest(),
			lastCumulativePrice0: lastCumulativePrice0.toString(),
			lastCumulativePrice1: lastCumulativePrice1.toString()
		});
	});

	it("should update observations", async () => {
		const k = await oracle.k.call();

		await oracle.write(reserves0Balance, reserves1Balance, { from: pool });
		const receipt = await oracle.write(reserves0Balance, reserves1Balance, { from: pool });

		const lastCumulativePrice0 = await oracle.lastCumulativePrice0.call();
		const lastCumulativePrice1 = await oracle.lastCumulativePrice1.call();

		const price0 = (new BN(reserves1Balance) * 10 ** 18) / reserves0Balance;
		const price1 = (new BN(reserves0Balance) * 10 ** 18) / reserves1Balance;

		const ema0 = (k * price0 + (1 - k) * (lastCumulativePrice0)).toString();
		const ema1 = (k * price1 + (1 - k) * (lastCumulativePrice1)).toString();

		expectEvent(receipt, "ObservationsUpdated", {
			ema0,
			ema1,
			blockNumber: await latestBlock(),
			timestamp: await latest(),
			lastCumulativePrice0: price0.toString(),
			lastCumulativePrice1: price1.toString()
		});
	});

});
