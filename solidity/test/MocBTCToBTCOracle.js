const { expect } = require("chai");
const { BN, time } = require("@openzeppelin/test-helpers");

const { duration, latest, increase } = time;

const MocBTCToBTCOracle = artifacts.require("MocBTCToBTCOracle");

contract("MocBTCToBTCOracle", () => {
	let oracle;

	beforeEach(async () => {
		oracle = await MocBTCToBTCOracle.new();
	});

	it("should always return 1 for latestAnswer", async () => {
		expect(await oracle.latestAnswer.call()).to.be.bignumber.equal(new BN(1));
	});

	it("should always return the current time for latestTimestamp", async () => {
		expect(await oracle.latestTimestamp.call()).to.be.bignumber.equal(await latest());

		await increase(duration.days(1));

		expect(await oracle.latestTimestamp.call()).to.be.bignumber.equal(await latest());
	});
});
