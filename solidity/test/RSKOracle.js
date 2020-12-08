require('@openzeppelin/test-helpers/configure')({
    provider: web3.currentProvider,
    singletons: {
      abstraction: 'truffle',
    },
  });

const { expect } = require('chai');
const { BN, time } = require('@openzeppelin/test-helpers');

const { duration, latest, increase } = time;

const RSKOracle = artifacts.require('RSKOracle');

contract('RSKOracle', () => {
    let rskOracle;

    beforeEach(async () => {
        rskOracle = await RSKOracle.deployed();
    });

    it('should always return Price for latestAnswer', async () => {
        const price = (await priceFeedRSKOracle.latestAnswer.call()).toNumber();

        expect(price).to.be.above(0, 'The price must be larger than 0');
        
        if (price > 0) {
            console.log('The price is:', price);}
    });

    it('should always return the current time for latestTimestamp', async () => {
        expect(await rskOracle.latestTimestamp.call()).to.be.bignumber.equal(await latest());

        await increase(duration.days(1));

        expect(await rskOracle.latestTimestamp.call()).to.be.bignumber.equal(await latest());
    });
});
