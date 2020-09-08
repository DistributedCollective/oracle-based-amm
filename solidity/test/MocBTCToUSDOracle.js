const { expect } = require('chai');
const { BN, time, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const { duration, latest, increase } = time;

const MocBTCToUSDOracle = artifacts.require('MocBTCToUSDOracle');
const MoCOracleMock = artifacts.require('MoCOracleMock');

contract('MocBTCToUSDOracle', ([owner, unauthorizedAccount]) => {
    let oracleConsumer;
    let mocOracle;
    let value = new BN(10000);

    beforeEach(async () => {
        mocOracle = await MoCOracleMock.new();
        await mocOracle.setHas(true);
        await mocOracle.setValue(value)
        oracleConsumer = await MocBTCToUSDOracle.new(mocOracle.address);
    });

    it('should be initialized with mocOracle address', async () => {
        expect(await oracleConsumer.mocOracleAddress()).to.be.eql(mocOracle.address);
    });

    it('should always return value for latestAnswer', async () => {
        expect(await oracleConsumer.latestAnswer.call()).to.be.bignumber.equal(value);
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