const { expect } = require("chai");
const { expectRevert, expectEvent, BN, ether, constants } = require("@openzeppelin/test-helpers");
const { latest, latestBlock } = require("@openzeppelin/test-helpers/src/time");

const { ZERO_ADDRESS } = constants;

const Oracle = artifacts.require("Oracle");

contract("Oracle", (accounts) => {
  let oracle;
  let price0 = ether("1");
  let price1 = ether("0.5");

  const pool = accounts[1];

  beforeEach(async () => {
    oracle = await Oracle.new();
    await oracle.setLiquidityPool(pool);
  });

  it("should revert if k value not set by owner", async () => {
    await expectRevert(oracle.setK(10, { from: accounts[2] }), "ERR_ACCESS_DENIED");
  });

  it("should revert if k value do not lie within a valid range", async () => {
    await expectRevert(oracle.setK(100000), "ERR_INVALID_K_VALUE");
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
    await expectRevert(oracle.write(price0, price1), "ERR_INVALID_POOL_ADDRESS");
  });

  it("should set initial observations", async () => {
    const receipt = await oracle.write(price0, price1, { from: pool });

    const timestamp = await latest();
    const lastCumulativePrice0 = price0.mul(timestamp);
    const lastCumulativePrice1 = price1.mul(timestamp);

    expectEvent(receipt, "ObservationsUpdated", {
      ema0: price0,
      ema1: price1,
      blockNumber: await latestBlock(),
      timestamp,
      lastCumulativePrice0: lastCumulativePrice0.toString(),
      lastCumulativePrice1: lastCumulativePrice1.toString()
    });
  });

  it("should update observations", async () => {
    const k = await oracle.k.call();

    await oracle.write(price0, price1, { from: pool });

    const timestamp = await latest();
    let lastCumulativePrice0 = price0.mul(timestamp);
    let lastCumulativePrice1 = price1.mul(timestamp);

    const receipt = await oracle.write(price0, price1, { from: pool });

    const newTimestamp = await latest();
    lastCumulativePrice0 = lastCumulativePrice0.add(price0.mul(newTimestamp.sub(timestamp)));
    lastCumulativePrice1 = lastCumulativePrice1.add(price1.mul(newTimestamp.sub(timestamp)));

    const ema0 = (k * price0 + ((10000 - k) * (price0)) / 10000).toString();
    const ema1 = (k * price1 + ((10000 - k) * (price1)) / 10000).toString();

    expectEvent(receipt, "ObservationsUpdated", {
      ema0,
      ema1,
      blockNumber: await latestBlock(),
      timestamp: await latest(),
      lastCumulativePrice0,
      lastCumulativePrice1
    });
  });

});
