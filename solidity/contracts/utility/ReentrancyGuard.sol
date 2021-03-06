pragma solidity 0.4.26;

/**
 * @dev ReentrancyGuard
 *
 * The contract provides protection against re-entrancy - calling a function (directly or
 * indirectly) from within itself.
 */
contract ReentrancyGuard {
	uint256 private constant UNLOCKED = 1;
	uint256 private constant LOCKED = 2;

	// LOCKED while protected code is being executed, UNLOCKED otherwise
	uint256 private state = UNLOCKED;

	/**
	 * @dev ensures instantiation only by sub-contracts
	 */
	constructor() internal {}

	// protects a function against reentrancy attacks
	modifier protected() {
		_protected();
		state = LOCKED;
		_;
		state = UNLOCKED;
	}

	// error message binary size optimization
	function _protected() internal view {
		require(state == UNLOCKED, "ERR_REENTRANCY");
	}
}
