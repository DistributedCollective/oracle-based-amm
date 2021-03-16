const { expect } = require('chai');
const { BN, time, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const { duration, latest, increase } = time;

const MocUSDToBTCOracle = artifacts.require('MocUSDToBTCOracle');
const MoCOracleMock = artifacts.require('MoCMedianizerMock');

contract('MocUSDToBTCOracle', ([owner, unauthorizedAccount]) => {
    let oracleConsumer;
    let mocOracle;
    let a = 10000 * 10**18;
    const DECIMALS = new BN(18);
    const ONE = new BN(10).pow(DECIMALS);
    let value = new BN(10000).mul(ONE);

    beforeEach(async () => {
        mocOracle = await MoCOracleMock.new();
        await mocOracle.setHas(true);
        await mocOracle.setValue(value)
        oracleConsumer = await MocUSDToBTCOracle.new(mocOracle.address);
    });

    it('should be initialized with mocOracle address', async () => {
        expect(await oracleConsumer.mocOracleAddress()).to.be.eql(mocOracle.address);
    });

    it('should always return value for latestAnswer', async () => {
        const expectedValue = ONE.div(value).mul(ONE);
        expect(await oracleConsumer.latestAnswer.call()).to.be.bignumber.equal(expectedValue);
    });

    it('should always return the current time for latestTimestamp', async () => {
        expect(await oracleConsumer.latestTimestamp.call()).to.be.bignumber.equal(await latest());

        await increase(duration.days(1));

        expect(await oracleConsumer.latestTimestamp.call()).to.be.bignumber.equal(await latest());
    });

    it('should be possible to change oracle address', async () => {
        const res = await oracleConsumer.setMoCOracleAddress(oracleConsumer.address);
        expect(await oracleConsumer.mocOracleAddress()).to.be.eql(oracleConsumer.address);

        expectEvent(res, 'SetMoCOracleAddress', {
            mocOracleAddress: oracleConsumer.address,
            changerAddress: owner
        });
    });

    it('should fail if an unauthorized user tries to change oracle address', async () => {
        await expectRevert(oracleConsumer.setMoCOracleAddress(oracleConsumer.address, { from: unauthorizedAccount }),
            'ERR_ACCESS_DENIED');
    });
});
