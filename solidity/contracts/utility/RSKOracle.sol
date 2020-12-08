pragma solidity 0.4.26;

import "./interfaces/IRSKOracle.sol";
import "./interfaces/IConsumerPriceOracle.sol";
import "./Owned.sol";

contract RSKOracle is IConsumerPriceOracle, Owned {
    address public rskOracleAddress;

    event SetRSKOracleAddress(address indexed rskOracleAddress, address changerAddress);

    /**
     * @dev initializes a new RSK Oracle
     *
     * @param _rskOracleAddress RSK Oracle address
     */
    constructor(address _rskOracleAddress) public {
        setRSKOracleAddress(_rskOracleAddress);
    }
    
    /**
     * @return price
     */
    function latestAnswer() external view returns (int256) {
        IRSKOracle _rskOracle = IRSKOracle(rskOracleAddress);
        (uint256 _price,) = _rskOracle.getPricing();
        return int256(_price);      
    }

    /**
     * @return latest time
     */
    function latestTimestamp() external view returns (uint256 _timestamp) {
        IRSKOracle _rskOracle = IRSKOracle(rskOracleAddress);
        (, _timestamp) = _rskOracle.getPricing();
    }

    /**
     * @dev set RSK Oracle address
     *
     * @param _rskOracleAddress RSK Oracle address
     */
    function setRSKOracleAddress(address _rskOracleAddress) public ownerOnly {
        require(_rskOracleAddress != address(0), "_rskOracleAddress shall not be zero address");
        rskOracleAddress = _rskOracleAddress;
        emit SetRSKOracleAddress(rskOracleAddress, msg.sender);
    }
}
