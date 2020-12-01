pragma solidity 0.4.26;

import "./interfaces/IConsumerPriceOracle.sol";
import "./Owned.sol";

interface Medianizer {
    function peek() external view returns (bytes32, bool);
    function getLastPublicationBlock() external view returns (uint256);
}

contract MocBTCToUSDOracle is IConsumerPriceOracle, Owned {

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
      * @return returns the latest block's timestamp
    */
    function latestTimestamp() external view returns (uint256) {
        require(block.number >= Medianizer(mocOracleAddress).getLastPublicationBlock(), "latest block number larger than current block numer");
        uint256 latestTimestamp_ = block.timestamp - ( block.number - Medianizer(mocOracleAddress).getLastPublicationBlock() ) * 30;
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
}
