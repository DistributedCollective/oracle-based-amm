const { expect } = require("chai");
const BN = require("bn.js");

const {
	parseUnits,
	formatUnits,
	getReserveDecimals,
	minReturnWithSlippage,
	decimalLength,
	roundDiv,
	geometricMean,
} = require("../utils/calcMinDepositReturn");

describe("calcMinDepositReturn", () => {
	const config = {
		reserves: [
			{
				symbol: "(WR)BTC",
				decimals: 18,
				address: "0x542fda317318ebf1d3deaf76e0b632741a7e677d",
			},
			{
				symbol: "USDT0",
				decimals: 6,
				address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
			},
		],
		converters: [
			{
				type: 1,
				reserves: [
					{ symbol: "(WR)BTC", weight: "50%", balance: "0.0009" },
					{ symbol: "USDT0", weight: "50%", balance: "100" },
				],
			},
		],
	};

	it("uses top-level reserve decimals when converter reserve entries omit decimals", () => {
		const converter = config.converters[0];

		expect(getReserveDecimals(config, converter.reserves[0])).to.equal(18);
		expect(getReserveDecimals(config, converter.reserves[1])).to.equal(6);
	});

	it("parses USDT0 amounts with 6 decimals", () => {
		expect(parseUnits("100", 6).toString()).to.equal("100000000");
		expect(parseUnits("123.456789", 6).toString()).to.equal("123456789");
		expect(parseUnits("0.000001", 6).toString()).to.equal("1");
		expect(() => parseUnits("0.0000001", 6)).to.throw("too many decimal places");
	});

	it("formats raw LP token amounts without Number precision loss", () => {
		const raw = new BN("123456789012345678901234567890");

		expect(formatUnits(raw, 18)).to.equal("123456789012.34567890123456789");
	});

	it("computes 99% minReturn using integer math", () => {
		const expectedLP = new BN("123456789012345678901234567890");
		const expected = expectedLP.mul(new BN(9900)).div(new BN(10000));

		expect(minReturnWithSlippage(expectedLP).toString()).to.equal(expected.toString());
	});

	it("matches the converter digit-length geometricMean helper for empty pools", () => {
		const wrbtcAmount = parseUnits("0.0009", 18);
		const usdt0Amount = parseUnits("100", 6);

		expect(decimalLength(wrbtcAmount).toString()).to.equal("15");
		expect(decimalLength(usdt0Amount).toString()).to.equal("9");
		expect(roundDiv(new BN(24), new BN(2)).toString()).to.equal("12");
		expect(geometricMean([wrbtcAmount, usdt0Amount]).toString()).to.equal("100000000000");
	});

	it("computes 99% minReturn for the empty-pool geometricMean result", () => {
		const expectedLP = geometricMean([parseUnits("0.0009", 18), parseUnits("100", 6)]);

		expect(minReturnWithSlippage(expectedLP).toString()).to.equal("99000000000");
	});
});
