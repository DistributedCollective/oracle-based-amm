pragma solidity >=0.5.16 <0.6.0;

import "../WRBTC.sol";

contract WRBTCMockup is WRBTC {
    function sendRBTC(address payable recipient, uint256 amount) external {
      recipient.transfer(amount);
    }
}
