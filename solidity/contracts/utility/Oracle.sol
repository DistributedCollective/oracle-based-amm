pragma solidity 0.4.26;
import "./Owned.sol";
import "./SafeMath.sol";

contract Oracle is Owned {
	using SafeMath for uint256;

	uint64 public blockNumber;
	uint64 public timestamp;
	uint256 public ema0;
	uint256 public ema1;
	uint256 public lastCumulativePrice0;
	uint256 public lastCumulativePrice1;
	uint256 public k;

	address public liquidityPool;

	event ObservationsUpdated(
		uint256 ema0,
		uint256 ema1,
		uint64 blockNumber,
		uint64 timestamp,
		uint256 lastCumulativePrice0,
		uint256 lastCumulativePrice1
	);

	event KValueUpdate(uint256 _k);
	event PoolAddressUpdate(address _liquidityPool);

	// ensures that the values are written by pool contract
	modifier validPool() {
		require(msg.sender == liquidityPool, "ERR_INVALID_POOL_ADDRESS");
		_;
	}

	function setK(uint256 _k) public ownerOnly {
		require(_k != 0 && _k < 100, "ERR_INVALID_K_VALUE");
		k = _k;
		emit KValueUpdate(_k);
	}

	function setLiquidityPool(address _liquidityPool) public ownerOnly {
		require(_liquidityPool != address(0), "ERR_ZERO_POOL_ADDRESS");
		liquidityPool = _liquidityPool;
		emit PoolAddressUpdate(_liquidityPool);
	}

	function write(uint256 reserves0Balance, uint256 reserves1Balance) external validPool {
		if (blockNumber == uint256(block.number)) return;

		uint256 price0 = (reserves1Balance).mul(1e18).div(reserves0Balance);
		uint256 price1 = (reserves0Balance).mul(1e18).div(reserves1Balance);

		if (lastCumulativePrice1 == 0 && lastCumulativePrice0 == 0) {
			ema0 = 0;
			ema1 = 0;
		} else {
			ema0 = k * price0 + (1 - k) * (lastCumulativePrice0);
			ema1 = k * price1 + (1 - k) * (lastCumulativePrice1);
		}

		blockNumber = uint64(block.number);
		timestamp = uint64(block.timestamp);
		lastCumulativePrice0 = price0;
		lastCumulativePrice1 = price1;

		emit ObservationsUpdated(ema0, ema1, blockNumber, timestamp, lastCumulativePrice0, lastCumulativePrice1);
	}

	function read()
		external
		view
		returns (
			uint256,
			uint256,
			uint64,
			uint64,
			uint256,
			uint256
		)
	{
		return (ema0, ema1, blockNumber, timestamp, lastCumulativePrice0, lastCumulativePrice1);
	}
}
