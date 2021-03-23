require("@openzeppelin/test-helpers/configure")({
	provider: web3.currentProvider,
	singletons: {
		abstraction: "truffle",
	},
});

const { expect } = require("chai");
const { BN, time } = require("@openzeppelin/test-helpers");

const { duration, latest, increase } = time;

const BProOracle = artifacts.require("BProOracle");

contract("BProOracle", () => {
	let bproOracle;

	beforeEach(async () => {
		bproOracle = await BProOracle.deployed();
	});

	it("should always return BPro USD Price for latestAnswer", async () => {
		const bproUSDPrice = await bproOracle.latestAnswer.call();

		expect(bproUSDPrice).to.be.above(0, "The Bpro USD Price must be larger than 0");

		if (bproUSDPrice > 0) {
			console.log("The BPro USD Price is:", bproUSDPrice);
		}
	});

	it("should always return the current time for latestTimestamp", async () => {
		expect(await bproOracle.latestTimestamp.call()).to.be.bignumber.equal(await latest());

		await increase(duration.days(1));

		expect(await bproOracle.latestTimestamp.call()).to.be.bignumber.equal(await latest());
	});
});
