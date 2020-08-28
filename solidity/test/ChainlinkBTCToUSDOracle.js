const { expect } = require('chai');
const { BN, time } = require('@openzeppelin/test-helpers');

const { duration, latest, increase } = time;

const ChainlinkBTCToUSDOracle = artifacts.require('ChainlinkBTCToUSDOracle');

contract('ChainlinkBTCToUSDOracle', () => {
    let oracle;

    beforeEach(async () => {
        oracle = await ChainlinkBTCToUSDOracle.new();
    });

    it('should always return 10000 for latestAnswer', async () => {
        expect(await oracle.latestAnswer.call()).to.be.bignumber.equal(new BN(10000));
    });

    it('should always return the current time for latestTimestamp', async () => {
        expect(await oracle.latestTimestamp.call()).to.be.bignumber.equal(await latest());

        await increase(duration.days(1));

        expect(await oracle.latestTimestamp.call()).to.be.bignumber.equal(await latest());
    });
});
