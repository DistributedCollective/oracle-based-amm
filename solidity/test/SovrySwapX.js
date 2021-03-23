const { expect } = require("chai");
const { expectRevert, expectEvent, BN, time } = require("@openzeppelin/test-helpers");

const SovrynSwapX = artifacts.require("SovrynSwapX");
const ERC20Token = artifacts.require("ERC20Token");
const ContractRegistry = artifacts.require("ContractRegistry");

const MAX_LOCK_LIMIT = new BN("1000000000000000000000"); // 1000 tokens
const MAX_RELEASE_LIMIT = new BN("1000000000000000000000"); // 1000 tokens
const MIN_LIMIT = new BN("1000000000000000000"); // 1 token
const LIM_INC_PER_BLOCK = new BN("1000000000000000000"); // 1 token
const TEST_AMOUNT = new BN("10000000000000000000"); // 10 tokens
const SUPPLY_AMOUNT = new BN("77492920201018469141404133");
const MIN_REQ_REPORTS = new BN(3);
const TRANSACTION_ID = new BN(12345678);
const X_TRANSFER_ID = new BN(87654321);

const EOS_ADDRESS = "0x3c69a194aaf415ba5d6afca734660d0a3d45acdc05d54cd1ca89a8988e7625b4";
const EOS_BLOCKCHAIN = "0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b";

contract("SovrynSwapX", (accounts) => {
	let sovrynSwapX;
	const reporter1 = accounts[1];
	const reporter2 = accounts[2];
	const reporter3 = accounts[3];
	const sender = accounts[0];
	const nonOwner = accounts[9];

	beforeEach(async () => {
		const contractRegistry = await ContractRegistry.new();
		const sovrynSwapXToken = await ERC20Token.new("SovrynSwap", "BNT", 18, SUPPLY_AMOUNT);

		sovrynSwapX = await SovrynSwapX.new(
			MAX_LOCK_LIMIT,
			MAX_RELEASE_LIMIT,
			MIN_LIMIT,
			LIM_INC_PER_BLOCK,
			MIN_REQ_REPORTS,
			contractRegistry.address,
			sovrynSwapXToken.address
		);

		// Grant sovrynSwapx allowance
		await sovrynSwapXToken.approve(sovrynSwapX.address, SUPPLY_AMOUNT);
	});

	it("should allow the owner to set reporters", async () => {
		await sovrynSwapX.setReporter(reporter1, true);
		await sovrynSwapX.setReporter(reporter2, true);
		await sovrynSwapX.setReporter(reporter3, true);

		expect(await sovrynSwapX.reporters.call(reporter1)).to.be.true();
		expect(await sovrynSwapX.reporters.call(reporter2)).to.be.true();
		expect(await sovrynSwapX.reporters.call(reporter3)).to.be.true();
	});

	it("should not allow a non-owner to set reporters", async () => {
		await expectRevert(sovrynSwapX.setReporter(reporter1, true, { from: nonOwner }), "ERR_ACCESS_DENIED");
		await expectRevert(sovrynSwapX.setReporter(reporter2, true, { from: nonOwner }), "ERR_ACCESS_DENIED");
		await expectRevert(sovrynSwapX.setReporter(reporter3, true, { from: nonOwner }), "ERR_ACCESS_DENIED");

		expect(await sovrynSwapX.reporters.call(reporter1)).to.be.false();
		expect(await sovrynSwapX.reporters.call(reporter2)).to.be.false();
		expect(await sovrynSwapX.reporters.call(reporter3)).to.be.false();
	});

	it("should allow the owner to set limits", async () => {
		const newMaxLockLimit = MAX_LOCK_LIMIT.add(new BN(1));
		const newMaxReleaseLimit = MAX_RELEASE_LIMIT.add(new BN(1));
		const newMinLimit = MIN_LIMIT.add(new BN(1));
		const newLimitIncPerBlock = LIM_INC_PER_BLOCK.add(new BN(1));
		const newMinRequiredReports = MIN_REQ_REPORTS.add(new BN(1));

		await sovrynSwapX.setMaxLockLimit(newMaxLockLimit);
		await sovrynSwapX.setMaxReleaseLimit(newMaxReleaseLimit);
		await sovrynSwapX.setMinLimit(newMinLimit);
		await sovrynSwapX.setLimitIncPerBlock(newLimitIncPerBlock);
		await sovrynSwapX.setMinRequiredReports(newMinRequiredReports);

		expect(await sovrynSwapX.maxLockLimit.call()).to.be.bignumber.equal(newMaxLockLimit);
		expect(await sovrynSwapX.maxReleaseLimit.call()).to.be.bignumber.equal(newMaxReleaseLimit);
		expect(await sovrynSwapX.minLimit.call()).to.be.bignumber.equal(newMinLimit);
		expect(await sovrynSwapX.limitIncPerBlock.call()).to.be.bignumber.equal(newLimitIncPerBlock);
		expect(await sovrynSwapX.minRequiredReports.call()).to.be.bignumber.equal(newMinRequiredReports);
	});

	it("should not allow a non-owner to set limits", async () => {
		const newMaxLockLimit = MAX_LOCK_LIMIT.add(new BN(1));
		const newMaxReleaseLimit = MAX_RELEASE_LIMIT.add(new BN(1));
		const newMinLimit = MIN_LIMIT.add(new BN(1));
		const newLimitIncPerBlock = LIM_INC_PER_BLOCK.add(new BN(1));
		const newMinRequiredReports = MIN_REQ_REPORTS.add(new BN(1));

		await expectRevert(sovrynSwapX.setMaxLockLimit(newMaxLockLimit, { from: nonOwner }), "ERR_ACCESS_DENIED");
		await expectRevert(sovrynSwapX.setMaxReleaseLimit(newMaxReleaseLimit, { from: nonOwner }), "ERR_ACCESS_DENIED");
		await expectRevert(sovrynSwapX.setMinLimit(newMinLimit, { from: nonOwner }), "ERR_ACCESS_DENIED");
		await expectRevert(sovrynSwapX.setLimitIncPerBlock(newLimitIncPerBlock, { from: nonOwner }), "ERR_ACCESS_DENIED");
		await expectRevert(sovrynSwapX.setMinRequiredReports(newMinRequiredReports, { from: nonOwner }), "ERR_ACCESS_DENIED");
	});

	it("should not be able to lock below the min limit", async () => {
		const amount = MIN_LIMIT.sub(new BN(1));
		await expectRevert(sovrynSwapX.xTransfer(EOS_BLOCKCHAIN, EOS_ADDRESS, amount), "ERR_AMOUNT_TOO_HIGH");
	});

	it("should not be able to lock above the max limit", async () => {
		const amount = MAX_LOCK_LIMIT.add(new BN(1));
		await expectRevert(sovrynSwapX.xTransfer(EOS_BLOCKCHAIN, EOS_ADDRESS, amount), "ERR_AMOUNT_TOO_HIGH");
	});

	it("should not be able to release below the min limit", async () => {
		const amount = MIN_LIMIT.sub(new BN(1));
		await sovrynSwapX.setReporter(reporter1, true);
		await sovrynSwapX.setReporter(reporter2, true);
		await sovrynSwapX.setReporter(reporter3, true);

		await sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, amount, X_TRANSFER_ID, { from: reporter1 });
		await sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, amount, X_TRANSFER_ID, { from: reporter2 });

		await expectRevert(
			sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, amount, X_TRANSFER_ID, { from: reporter3 }),
			"ERR_AMOUNT_TOO_HIGH"
		);
	});

	it("should not be able to release above the max limit", async () => {
		const amount = MAX_RELEASE_LIMIT.add(new BN(1));
		await sovrynSwapX.setReporter(reporter1, true);
		await sovrynSwapX.setReporter(reporter2, true);
		await sovrynSwapX.setReporter(reporter3, true);

		await sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, amount, X_TRANSFER_ID, { from: reporter1 });
		await sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, amount, X_TRANSFER_ID, { from: reporter2 });

		await expectRevert(
			sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, amount, X_TRANSFER_ID, { from: reporter3 }),
			"ERR_AMOUNT_TOO_HIGH"
		);
	});

	it("should emit an event when successfuly locking tokens", async () => {
		const amount = TEST_AMOUNT;
		const res = await sovrynSwapX.xTransfer(EOS_BLOCKCHAIN, EOS_ADDRESS, amount);

		expectEvent(res, "XTransfer", {
			_from: sender,
			_toBlockchain: EOS_BLOCKCHAIN,
			_to: EOS_ADDRESS,
			_amount: TEST_AMOUNT,
			_id: new BN(0),
		});
	});

	it("should properly calculate the current lock limit after a single transaction", async () => {
		const numOfTests = 10;
		const amount = LIM_INC_PER_BLOCK.mul(new BN(numOfTests));
		await sovrynSwapX.xTransfer(EOS_BLOCKCHAIN, EOS_ADDRESS, amount);

		for (let i = 0; i <= numOfTests; ++i) {
			expect(await sovrynSwapX.getCurrentLockLimit.call()).to.be.bignumber.equal(MAX_LOCK_LIMIT.sub(amount).add(MIN_LIMIT.mul(new BN(i))));

			await time.advanceBlock();
		}

		for (let i = 0; i < 3; i++) {
			expect(await sovrynSwapX.getCurrentLockLimit.call()).to.be.bignumber.equal(MAX_LOCK_LIMIT);

			await time.advanceBlock();
		}
	});

	it("should not allow a reporter to report the same transaction twice", async () => {
		await sovrynSwapX.setReporter(reporter1, true);
		await sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, TEST_AMOUNT, X_TRANSFER_ID, { from: reporter1 });

		await expectRevert(
			sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, TEST_AMOUNT, X_TRANSFER_ID, { from: reporter1 }),
			"ERR_ALREADY_REPORTED"
		);
	});

	it("should not allow two reporters to give conflicting transaction details", async () => {
		await sovrynSwapX.setReporter(reporter1, true);
		await sovrynSwapX.setReporter(reporter2, true);

		await sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, reporter1, TEST_AMOUNT, X_TRANSFER_ID, { from: reporter1 });
		await expectRevert(
			sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, reporter2, TEST_AMOUNT, X_TRANSFER_ID, { from: reporter2 }),
			"ERR_TX_MISMATCH"
		);
	});

	it("should not allow a non-reporter to report", async () => {
		await expectRevert(
			sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, TEST_AMOUNT, X_TRANSFER_ID, { from: reporter1 }),
			"ERR_ACCESS_DENIED"
		);
	});

	it("should not allow reports when disabled", async () => {
		await sovrynSwapX.setReporter(reporter1, true);
		await sovrynSwapX.enableReporting(false);

		await expectRevert(
			sovrynSwapX.reportTx(EOS_BLOCKCHAIN, TRANSACTION_ID, sender, TEST_AMOUNT, X_TRANSFER_ID, { from: reporter1 }),
			"ERR_DISABLED"
		);
	});

	it("should not allow xTransfers when disabled", async () => {
		await sovrynSwapX.enableXTransfers(false);

		await expectRevert(sovrynSwapX.xTransfer(EOS_BLOCKCHAIN, EOS_ADDRESS, TEST_AMOUNT), "ERR_DISABLED");
	});
});
