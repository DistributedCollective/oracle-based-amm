pragma solidity 0.4.26;

import "./interfaces/IConsumerPriceOracle.sol";
import "./Owned.sol";
import "./SafeMath.sol";

interface Medianizer {
    function peek() external view returns (bytes32, bool);
    function getLastPublicationBlock() external view returns (uint256);
}

contract MocBTCToUSDOracle is IConsumerPriceOracle, Owned {
    using SafeMath for uint256;

    uint256 public blockTime = 30;

    address public mocOracleAddress;

    event SetMoCOracleAddress(address indexed mocOracleAddress, address changerAddress);

    /**
      * @dev initializes a ne MoC oracle
      *
      * @param _mocOracleAddress MoC oracle address
    */
    constructor(address _mocOracleAddress) public {
        setMoCOracleAddress(_mocOracleAddress);
    }

    /**
      * @dev returns the USD/BTC rate.
      *
      * @return MoC medianizer rate
    */
    function latestAnswer() external view returns (int256) {
        (bytes32 value, bool hasValue) = Medianizer(mocOracleAddress).peek();
        require(hasValue, "Doesn't has value");
        return int256(value);
    }

    /**
      * @dev returns the USD/BTC update time.
      *
      * @return returns the approximate timestamp of the latest publication block
    */
    function latestTimestamp() external view returns (uint256) {
        uint256 latestPublicationBlockNumber = Medianizer(mocOracleAddress).getLastPublicationBlock();
        require(block.number >= latestPublicationBlockNumber, "latest block number larger than current block number");
        // uint256 latestTimestamp_ = block.timestamp - ( block.number - latestPublicationBlockNumber ) * blockTime;
        uint256 latestTimestamp_ = block.timestamp.sub(block.number.sub(latestPublicationBlockNumber).mul(blockTime));
        return latestTimestamp_; 
    }

    /**
      * @dev set MoC oracle address
      *
      * @param _mocOracleAddress MoC oracle address
    */
    function setMoCOracleAddress(address _mocOracleAddress) public ownerOnly {
        require(_mocOracleAddress != address(0), "_mocOracleAddress shall not be zero address");
        mocOracleAddress = _mocOracleAddress;
        emit SetMoCOracleAddress(mocOracleAddress, msg.sender);
    }

    function setBlockTime(uint256 _blockTime) public ownerOnly {
        blockTime = _blockTime;
    }
}
