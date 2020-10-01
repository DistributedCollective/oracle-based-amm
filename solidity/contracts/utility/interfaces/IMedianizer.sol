pragma solidity 0.4.26;

interface IMedianizer {
    function peek() external view returns (bytes32, bool);
}
