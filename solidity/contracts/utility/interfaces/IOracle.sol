pragma solidity 0.4.26;

interface IOracle {
	function setK(uint256 _k) external;

	function write(uint256 reserves0Balance, uint256 reserves1Balance) external;

	function read()
		external
		returns (
			uint256 ema0,
			uint256 ema1,
			uint64 blockNumber,
			uint64 timestamp,
			uint256 lastCumulativePrice0,
			uint256 lastCumulativePrice1
		);
}
