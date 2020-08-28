pragma solidity 0.4.26;

import "./interfaces/IChainlinkPriceOracle.sol";

/**
  * @dev Provides the BTC/USD rate to be used with other TKN/BTC rates
*/
contract ChainlinkBTCToUSDOracle is IChainlinkPriceOracle {
    int256 private constant USD_RATE = 10000;

    /**
      * @dev returns the BTC/USD rate.
      *
      * @return always returns the trivial rate of 10000
    */
    function latestAnswer() external view returns (int256) {
        return USD_RATE;
    }

    /**
      * @dev returns the BTC/USD update time.
      *
      * @return always returns current block's timestamp
    */
    function latestTimestamp() external view returns (uint256) {
        return now;
    }
}
