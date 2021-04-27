pragma solidity 0.5.16;

import "../interfaces/IERC20Token.sol";

contract LiquidityMining{
    address rewardToken;

    constructor(address rewardTokenAddress) public{
        rewardToken = rewardTokenAddress;
    }
    /**
	 * @notice deposits pool tokens
	 * @param _poolToken the address of pool token
	 * @param _amount the amount of pool tokens
	 * @param _user the address of user, tokens will be deposited to it or to msg.sender
	 */
	function deposit(address _poolToken, uint256 _amount, address _user) public {
        IERC20Token(_poolToken).transferFrom(address(msg.sender), address(this), _amount);
    }

    /**
	 * @notice withdraws pool tokens and transfers reward tokens
	 * @param _poolToken the address of pool token
	 * @param _amount the amount of pool tokens
	 */
	function withdraw(address _poolToken, uint256 _amount, address _user) public {
        IERC20Token(_poolToken).transferFrom(address(this), address(msg.sender), _amount);
        IERC20Token(rewardToken).transferFrom(address(this), address(msg.sender), _amount);
    }
}