pragma solidity 0.4.26;

interface IRSKOracle {

    function updatePrice(uint price, uint timestamp) external;

    function getPricing() external view returns(uint, uint);

    function setOracleAddress(address addr) external;

    function clearOracleAddress() external;

}