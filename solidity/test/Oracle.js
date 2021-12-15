const { expect } = require("chai");
const { expectRevert, expectEvent, BN, ether } = require("@openzeppelin/test-helpers");
const { latest, latestBlock } = require("@openzeppelin/test-helpers/src/time");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");

const Oracle = artifacts.require("Oracle");

contract("Oracle", (accounts) => {
  let oracle;
  let price0 = ether("1");
  let price1 = ether("0.5");
  let k = new BN("3000");

  const btcAddress = ZERO_ADDRESS;
  const pool = accounts[1];

  const setupOracle = async () => {
    oracle = await Oracle.new(pool, btcAddress);
    await oracle.setK(k);
  }

  before(async () => {
    await setupOracle();
  });

  it("should revert if set pool address with zero address", async() => {
    await expectRevert(oracle.setLiquidityPool(ZERO_ADDRESS), "ERR_ZERO_POOL_ADDRESS");
  })

  it("should revert if set pool address with unauthorized owner", async() => {
    await expectRevert(oracle.setLiquidityPool(ZERO_ADDRESS, {from: accounts[7]}), "ERR_ACCESS_DENIED");
  })

  it("set new liquidity pool address", async() => {
    expect(await oracle.liquidityPool()).to.equal(accounts[1]);
    const receipt = await oracle.setLiquidityPool(accounts[2]);
    expect(await oracle.liquidityPool()).to.equal(accounts[2]);

    expectEvent(receipt, "LiquidityPoolUpdate", {
      sender: accounts[0],
      oldLiquidityPool: pool,
      newLiquidityPool: accounts[2]
    })

    await oracle.setLiquidityPool(pool);
  })

  it("should revert if k value not set by owner", async () => {
    await expectRevert(oracle.setK(k, { from: accounts[2] }), "ERR_ACCESS_DENIED");
  });

  it("should revert if k value do not lie within a valid range", async () => {
    let invalidK = new BN("1000000")
    await expectRevert(oracle.setK(invalidK), "ERR_INVALID_K_VALUE");
  });

  it("should set k value", async () => {
    const receipt = await oracle.setK(k);
    expect(await oracle.k.call()).to.be.bignumber.equal(k);
    expectEvent(receipt, "KValueUpdate", {
      _k: k
    });
  });

  it("should revert if observations are not written by pool", async () => {
    await expectRevert(oracle.write(price0, price1), "ERR_INVALID_POOL_ADDRESS");
  });

  it("should set initial observations", async () => {
    const receipt = await oracle.write(price0, price1, { from: pool });

    const timestamp = await latest();
    const lastCumulativePrice0 = price0;
    const lastCumulativePrice1 = price1;

    expectEvent(receipt, "ObservationsUpdated", {
      ema0: price0,
      ema1: price1,
      blockNumber: await latestBlock(),
      timestamp,
      lastCumulativePrice0: lastCumulativePrice0.toString(),
      lastCumulativePrice1: lastCumulativePrice1.toString()
    });
  });

  describe("should update observations for various prices ranges", () => {
    const priceDecimal = 18;
    const price0 = 1;

    beforeEach(async () => {
      await setupOracle();
    })

    for (let decimal = 0; decimal < priceDecimal; decimal++) {
      const price1 = 10 ** decimal;

      it(`(price0 = ${price0}, price1 = ${price1})`, async () => {
        await oracle.write(price0.toString(), price1.toString(), { from: pool });

        const ema0 = (await oracle.ema0.call()).toString();
        const ema1 = (await oracle.ema1.call()).toString();

        expect(ema0).to.be.bignumber.greaterThan('0');
        expect(ema1).to.be.bignumber.greaterThan('0');

        expect(ema0).to.be.bignumber.equal(price0.toString());
        expect(ema1).to.be.bignumber.equal(price1.toString());

      });
    }
  });

  describe("should update observations for below prices and calculate EMA as expected", () => {
    const prices = [5, 6, 8, 15, 16, 14, 17, 22, 25, 26, 10]

    //parsed according to decimals considered in tests
    const expectedEMA0 = [500000000, 530000000, 611000000, 877700000, 1094390000, 1186073000, 1340251100, 1598175770, 1868723039, 2088106127, 1761674288]
    const priceMultiplier = new BN(10 ** 8);

    before(async () => {
      await setupOracle();
    })

    for (let index = 0; index < prices.length; index++) {
      const testPrice0 = prices[index] * priceMultiplier;
      const testPrice1 = parseInt(priceMultiplier / prices[index]);

      it(`(price0 = ${testPrice0}, price1 = ${testPrice1})`, async () => {
        await oracle.write(testPrice0.toString(), testPrice1.toString(), { from: pool });

        const ema0 = (await oracle.ema0.call()).toString();
        expect(ema0).to.be.equal(expectedEMA0[index].toString())
      });
    }
  });
});
