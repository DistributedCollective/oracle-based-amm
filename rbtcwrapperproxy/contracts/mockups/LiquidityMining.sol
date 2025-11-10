pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
    // Empty internal constructor, to prevent people from mistakenly deploying
    // an instance of this contract, which should be used via inheritance.
    constructor() internal {}

    // solhint-disable-previous-line no-empty-blocks

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

/**
 * @dev Interface of the ERC20 standard as defined in the EIP. Does not include
 * the optional functions; to access them see {ERC20Detailed}.
 */
interface IERC20_ {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     *
     * _Available since v2.4.0._
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b != 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Integer division of two numbers, rounding up and truncating the quotient
     */
    function divCeil(uint256 a, uint256 b) internal pure returns (uint256) {
        return divCeil(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Integer division of two numbers, rounding up and truncating the quotient
     */
    function divCeil(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b != 0, errorMessage);

        if (a == 0) {
            return 0;
        }
        uint256 c = ((a - 1) / b) + 1;

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     *
     * _Available since v2.4.0._
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }

    function min256(uint256 _a, uint256 _b) internal pure returns (uint256) {
        return _a < _b ? _a : _b;
    }
}

/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20Mintable}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin guidelines: functions revert instead
 * of returning `false` on failure. This behavior is nonetheless conventional
 * and does not conflict with the expectations of ERC20 applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract ERC20 is Context, IERC20_ {
    using SafeMath for uint256;

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20};
     *
     * Requirements:
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for `sender`'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(
            sender,
            _msgSender(),
            _allowances[sender][_msgSender()].sub(
                amount,
                "ERC20: transfer amount exceeds allowance"
            )
        );
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender].sub(
                subtractedValue,
                "ERC20: decreased allowance below zero"
            )
        );
        return true;
    }

    /**
     * @dev Moves tokens `amount` from `sender` to `recipient`.
     *
     * This is internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _balances[sender] = _balances[sender].sub(
            amount,
            "ERC20: transfer amount exceeds balance"
        );
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements
     *
     * - `to` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner`s tokens.
     *
     * This is internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`.`amount` is then deducted
     * from the caller's allowance.
     *
     * See {_burn} and {_approve}.
     */
    function _burnFrom(address account, uint256 amount) internal {
        _burn(account, amount);
        _approve(
            account,
            _msgSender(),
            _allowances[account][_msgSender()].sub(amount, "ERC20: burn amount exceeds allowance")
        );
    }
}

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            codehash := extcodehash(account)
        }
        return (codehash != accountHash && codehash != 0x0);
    }

    /**
     * @dev Converts an `address` into `address payable`. Note that this is
     * simply a type cast: the actual underlying value is not changed.
     *
     * _Available since v2.4.0._
     */
    function toPayable(address account) internal pure returns (address payable) {
        return address(uint160(account));
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html
     *   #use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     *
     * _Available since v2.4.0._
     */
    function sendValue(address recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-call-value
        (bool success, ) = recipient.call.value(amount)("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}

contract IERC20 {
    string public name;
    uint8 public decimals;
    string public symbol;

    function totalSupply() public view returns (uint256);

    function balanceOf(address _who) public view returns (uint256);

    function allowance(address _owner, address _spender) public view returns (uint256);

    function approve(address _spender, uint256 _value) public returns (bool);

    function transfer(address _to, uint256 _value) public returns (bool);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for ERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        callOptionalReturn(
            token,
            abi.encodeWithSelector(token.transferFrom.selector, from, to, value)
        );
    }

    function safeApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        // solhint-disable-next-line max-line-length
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender).add(value);
        callOptionalReturn(
            token,
            abi.encodeWithSelector(token.approve.selector, spender, newAllowance)
        );
    }

    function safeDecreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance =
            token.allowance(address(this), spender).sub(
                value,
                "SafeERC20: decreased allowance below zero"
            );
        callOptionalReturn(
            token,
            abi.encodeWithSelector(token.approve.selector, spender, newAllowance)
        );
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves.

        // A Solidity high level call has three parts:
        //  1. The target address is checked to verify it contains contract code
        //  2. The call itself is made, and success asserted
        //  3. The return value is decoded, which in turn checks the size of the returned data.
        // solhint-disable-next-line max-line-length
        require(address(token).isContract(), "SafeERC20: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "SafeERC20: low-level call failed");

        if (returndata.length > 0) {
            // Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

/**
 *  @title The Locked SOV Interface.
 *  @author Franklin Richards - powerhousefrank@protonmail.com
 *  @notice This interface is an incomplete yet useful for future migration of LockedSOV Contract.
 *  @dev Only use it if you know what you are doing.
 */
interface ILockedSOV {
    /**
     * @notice Adds SOV to the user balance (Locked and Unlocked Balance based on `_basisPoint`).
     * @param _userAddress The user whose locked balance has to be updated with `_sovAmount`.
     * @param _sovAmount The amount of SOV to be added to the locked and/or unlocked balance.
     * @param _basisPoint The % (in Basis Point)which determines how much will be unlocked immediately.
     */
    function deposit(
        address _userAddress,
        uint256 _sovAmount,
        uint256 _basisPoint
    ) external;

    /**
     * @notice Adds SOV to the locked balance of a user.
     * @param _userAddress The user whose locked balance has to be updated with _sovAmount.
     * @param _sovAmount The amount of SOV to be added to the locked balance.
     */
    function depositSOV(address _userAddress, uint256 _sovAmount) external;

    /**
     * @notice Withdraws unlocked tokens and Stakes Locked tokens for a user who already have a vesting created.
     * @param _userAddress The address of user tokens will be withdrawn.
     */
    function withdrawAndStakeTokensFrom(address _userAddress) external;

    function cliff() external view returns (uint256);

    function duration() external view returns (uint256);

    function getLockedBalance(address _addr) external view returns (uint256 _balance);

    function getUnlockedBalance(address _addr) external view returns (uint256 _balance);
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner(), "unauthorized");
        _;
    }

    /**
     * @dev Returns true if the caller is the current owner.
     */
    function isOwner() public view returns (bool) {
        return _msgSender() == _owner;
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

contract AdminRole is Ownable {
    /// @dev user => flag whether user has admin role.
    mapping(address => bool) public admins;

    event AdminAdded(address admin);
    event AdminRemoved(address admin);

    /**
     * @dev Throws if called by any account other than the owner or admin.
     * or on our own overriding sovrynOwnable.
     */
    modifier onlyAuthorized() {
        require(isOwner() || admins[msg.sender], "unauthorized");
        _;
    }

    /**
     * @notice Add account to ACL.
     * @param _admin The addresses of the account to grant permissions.
     * */
    function addAdmin(address _admin) public onlyOwner {
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    /**
     * @notice Remove account from ACL.
     * @param _admin The addresses of the account to revoke permissions.
     * */
    function removeAdmin(address _admin) public onlyOwner {
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }
}

contract LiquidityMiningStorage is AdminRole {
    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many pool tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 accumulatedReward; //Reward that's ready to be transferred
        //
        // We do some fancy math here. Basically, any point in time, the amount of reward tokens
        // entitled to a user but is accumulated to be distributed is:
        //
        //   accumulated reward = (user.amount * pool.accumulatedRewardPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accumulatedRewardPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the accumulated reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 poolToken; // Address of LP token contract.
        uint96 allocationPoint; // How many allocation points assigned to this pool. Amount of reward tokens to distribute per block.
        uint256 lastRewardBlock; // Last block number that reward tokens distribution occurs.
        uint256 accumulatedRewardPerShare; // Accumulated amount of reward tokens per share, times 1e12. See below.
    }

    // Rewards tokens created per block.
    uint256 public rewardTokensPerBlock;
    // The block number when reward token mining starts.
    uint256 public startBlock;
    // Block number when bonus reward token period ends.
    uint256 public bonusEndBlock;
    // Block number when reward token period ends.
    uint256 public endBlock;

    //Wrapper contract which will be a proxy between user and LM
    address public wrapper;

    // Info of each pool.
    PoolInfo[] public poolInfoList;
    // Mapping pool token address => pool id
    mapping(address => uint256) poolIdList;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocationPoint;

    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfoMap;
    // Total balance this contract should have to handle withdrawal for all users
    uint256 public totalUsersBalance;

    /// @dev The SOV token
    IERC20 public SOV;

    /// @dev The locked vault contract to deposit LP's rewards into.
    ILockedSOV public lockedSOV;

    // The % which determines how much will be unlocked immediately.
    /// @dev 10000 is 100%
    uint256 public unlockedImmediatelyPercent;

    /// @dev overwrite the unlockedImmediatelyPercent for specific token.
    mapping(address => uint256) public poolTokensUnlockedImmediatelyPercent;
}

interface ILiquidityMining {
    function withdraw(
        address _poolToken,
        uint256 _amount,
        address _user
    ) external;

    function onTokensDeposited(address _user, uint256 _amount) external;

    function getUserPoolTokenBalance(address _poolToken, address _user)
        external
        view
        returns (uint256);
}

contract LiquidityMining is ILiquidityMining, LiquidityMiningStorage {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /* Constants */

    uint256 public constant PRECISION = 1e12;
    // Bonus multiplier for early liquidity providers.
    // During bonus period each passed block will be calculated like N passed blocks, where N = BONUS_MULTIPLIER
    uint256 public constant BONUS_BLOCK_MULTIPLIER = 10;

    uint256 public constant SECONDS_PER_BLOCK = 30;

    /* Events */

    event SOVTransferred(address indexed receiver, uint256 amount);
    event PoolTokenAdded(address indexed user, address indexed poolToken, uint256 allocationPoint);
    event PoolTokenUpdated(
        address indexed user,
        address indexed poolToken,
        uint256 newAllocationPoint,
        uint256 oldAllocationPoint
    );
    event Deposit(address indexed user, address indexed poolToken, uint256 amount);
    event RewardClaimed(address indexed user, address indexed poolToken, uint256 amount);
    event Withdraw(address indexed user, address indexed poolToken, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        address indexed poolToken,
        uint256 amount,
        uint256 accumulatedReward
    );

    /* Functions */

    /**
     * @notice Initialize mining.
     *
     * @param _SOV The SOV token.
     * @param _rewardTokensPerBlock The number of reward tokens per block.
     * @param _startDelayBlocks The number of blocks should be passed to start
     *   mining.
     * @param _numberOfBonusBlocks The number of blocks when each block will
     *   be calculated as N blocks (BONUS_BLOCK_MULTIPLIER).
     * @param _lockedSOV The contract instance address of the lockedSOV vault.
     *   SOV rewards are not paid directly to liquidity providers. Instead they
     *   are deposited into a lockedSOV vault contract.
     * @param _unlockedImmediatelyPercent The % which determines how much will be unlocked immediately.
     */
    function initialize(
        IERC20 _SOV,
        uint256 _rewardTokensPerBlock,
        uint256 _startDelayBlocks,
        uint256 _numberOfBonusBlocks,
        address _wrapper,
        ILockedSOV _lockedSOV,
        uint256 _unlockedImmediatelyPercent
    ) external onlyAuthorized {
        /// @dev Non-idempotent function. Must be called just once.
        require(address(SOV) == address(0), "Already initialized");
        require(address(_SOV) != address(0), "Invalid token address");
        require(_startDelayBlocks > 0, "Invalid start block");
        require(
            _unlockedImmediatelyPercent < 10000,
            "Unlocked immediately percent has to be less than 10000."
        );

        SOV = _SOV;
        rewardTokensPerBlock = _rewardTokensPerBlock;
        startBlock = block.number + _startDelayBlocks;
        bonusEndBlock = startBlock + _numberOfBonusBlocks;
        wrapper = _wrapper;
        lockedSOV = _lockedSOV;
        unlockedImmediatelyPercent = _unlockedImmediatelyPercent;
    }

    /**
     * @notice Sets lockedSOV contract.
     * @param _lockedSOV The contract instance address of the lockedSOV vault.
     */
    function setLockedSOV(ILockedSOV _lockedSOV) external onlyAuthorized {
        require(address(_lockedSOV) != address(0), "Invalid lockedSOV Address.");
        lockedSOV = _lockedSOV;
    }

    /**
     * @notice Sets unlocked immediately percent.
     * @param _unlockedImmediatelyPercent The % which determines how much will be unlocked immediately.
     * @dev 10000 is 100%
     */
    function setUnlockedImmediatelyPercent(uint256 _unlockedImmediatelyPercent)
        external
        onlyAuthorized
    {
        require(
            _unlockedImmediatelyPercent <= 10000,
            "Unlocked immediately percent has to be less than equal to 10000."
        );
        unlockedImmediatelyPercent = _unlockedImmediatelyPercent;
    }

    /**
     * @notice Sets unlocked immediately percent overwrite for specific pool token.
     * @param _poolToken the address of pool token
     * @param _poolTokenUnlockedImmediatelyPercent The % which determines how much will be unlocked immediately.
     * @dev 10000 is 100%
     */
    function setPoolTokenUnlockedImmediatelyPercent(
        address _poolToken,
        uint256 _poolTokenUnlockedImmediatelyPercent
    ) external onlyAuthorized {
        require(
            _poolTokenUnlockedImmediatelyPercent <= 10000,
            "Unlocked immediately percent has to be less than equal to 10000."
        );
        poolTokensUnlockedImmediatelyPercent[_poolToken] = _poolTokenUnlockedImmediatelyPercent;
    }

    /**
     * @notice sets wrapper proxy contract
     * @dev can be set to zero address to remove wrapper
     */
    function setWrapper(address _wrapper) external onlyAuthorized {
        wrapper = _wrapper;
    }

    /**
     * @notice stops mining by setting end block
     */
    function stopMining() external onlyAuthorized {
        require(endBlock == 0, "Already stopped");

        endBlock = block.number;
    }

    /**
     * @notice Transfers SOV tokens to given address.
     *   Owner use this function to withdraw SOV from LM contract
     *   into another account.
     * @param _receiver The address of the SOV receiver.
     * @param _amount The amount to be transferred.
     * */
    function transferSOV(address _receiver, uint256 _amount) external onlyAuthorized {
        require(_receiver != address(0), "Receiver address invalid");
        require(_amount != 0, "Amount invalid");

        /// @dev Do not transfer more SOV than available.
        uint256 SOVBal = SOV.balanceOf(address(this));
        if (_amount > SOVBal) {
            _amount = SOVBal;
        }

        /// @dev The actual transfer.
        require(SOV.transfer(_receiver, _amount), "Transfer failed");

        /// @dev Event log.
        emit SOVTransferred(_receiver, _amount);
    }

    /**
     * @notice Get the missed SOV balance of LM contract.
     *
     * @return The amount of SOV tokens according to totalUsersBalance
     *   in excess of actual SOV balance of the LM contract.
     * */
    function getMissedBalance() external view returns (uint256) {
        uint256 balance = SOV.balanceOf(address(this));
        return balance >= totalUsersBalance ? 0 : totalUsersBalance.sub(balance);
    }

    /**
     * @notice adds a new lp to the pool. Can only be called by the owner or an admin
     * @param _poolToken the address of pool token
     * @param _allocationPoint the allocation point (weight) for the given pool
     * @param _withUpdate the flag whether we need to update all pools
     */
    function add(
        address _poolToken,
        uint96 _allocationPoint,
        bool _withUpdate
    ) external onlyAuthorized {
        require(_allocationPoint > 0, "Invalid allocation point");
        require(_poolToken != address(0), "Invalid token address");
        require(poolIdList[_poolToken] == 0, "Token already added");

        if (_withUpdate) {
            updateAllPools();
        }

        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocationPoint = totalAllocationPoint.add(_allocationPoint);

        poolInfoList.push(
            PoolInfo({
                poolToken: IERC20(_poolToken),
                allocationPoint: _allocationPoint,
                lastRewardBlock: lastRewardBlock,
                accumulatedRewardPerShare: 0
            })
        );
        //indexing starts from 1 in order to check whether token was already added
        poolIdList[_poolToken] = poolInfoList.length;

        emit PoolTokenAdded(msg.sender, _poolToken, _allocationPoint);
    }

    /**
     * @notice updates the given pool's reward tokens allocation point
     * @param _poolToken the address of pool token
     * @param _allocationPoint the allocation point (weight) for the given pool
     * @param _updateAllFlag the flag whether we need to update all pools
     */
    function update(
        address _poolToken,
        uint96 _allocationPoint,
        bool _updateAllFlag
    ) external onlyAuthorized {
        if (_updateAllFlag) {
            updateAllPools();
        } else {
            updatePool(_poolToken);
        }
        _updateToken(_poolToken, _allocationPoint);
    }

    function _updateToken(address _poolToken, uint96 _allocationPoint) internal {
        uint256 poolId = _getPoolId(_poolToken);

        uint256 previousAllocationPoint = poolInfoList[poolId].allocationPoint;
        totalAllocationPoint = totalAllocationPoint.sub(previousAllocationPoint).add(
            _allocationPoint
        );
        poolInfoList[poolId].allocationPoint = _allocationPoint;

        emit PoolTokenUpdated(msg.sender, _poolToken, _allocationPoint, previousAllocationPoint);
    }

    /**
     * @notice updates the given pools' reward tokens allocation points
     * @param _poolTokens array of addresses of pool tokens
     * @param _allocationPoints array of allocation points (weight) for the given pools
     * @param _updateAllFlag the flag whether we need to update all pools
     */
    function updateTokens(
        address[] calldata _poolTokens,
        uint96[] calldata _allocationPoints,
        bool _updateAllFlag
    ) external onlyAuthorized {
        require(_poolTokens.length == _allocationPoints.length, "Arrays mismatch");

        if (_updateAllFlag) {
            updateAllPools();
        }
        uint256 length = _poolTokens.length;
        for (uint256 i = 0; i < length; i++) {
            if (!_updateAllFlag) {
                updatePool(_poolTokens[i]);
            }
            _updateToken(_poolTokens[i], _allocationPoints[i]);
        }
    }

    /**
     * @notice returns reward multiplier over the given _from to _to block
     * @param _from the first block for a calculation
     * @param _to the last block for a calculation
     */
    function _getPassedBlocksWithBonusMultiplier(uint256 _from, uint256 _to)
        internal
        view
        returns (uint256)
    {
        if (_from < startBlock) {
            _from = startBlock;
        }
        if (endBlock > 0 && _to > endBlock) {
            _to = endBlock;
        }
        if (_to <= bonusEndBlock) {
            return _to.sub(_from).mul(BONUS_BLOCK_MULTIPLIER);
        } else if (_from >= bonusEndBlock) {
            return _to.sub(_from);
        } else {
            return
                bonusEndBlock.sub(_from).mul(BONUS_BLOCK_MULTIPLIER).add(_to.sub(bonusEndBlock));
        }
    }

    function _getUserAccumulatedReward(uint256 _poolId, address _user)
        internal
        view
        returns (uint256)
    {
        PoolInfo storage pool = poolInfoList[_poolId];
        UserInfo storage user = userInfoMap[_poolId][_user];

        uint256 accumulatedRewardPerShare = pool.accumulatedRewardPerShare;
        uint256 poolTokenBalance = pool.poolToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && poolTokenBalance != 0) {
            (, uint256 accumulatedRewardPerShare_) = _getPoolAccumulatedReward(pool);
            accumulatedRewardPerShare = accumulatedRewardPerShare.add(accumulatedRewardPerShare_);
        }

        return
            user.accumulatedReward.add(
                user.amount.mul(accumulatedRewardPerShare).div(PRECISION).sub(user.rewardDebt)
            );
    }

    /**
     * @notice returns accumulated reward
     * @param _poolToken the address of pool token
     * @param _user the user address
     */
    function getUserAccumulatedReward(address _poolToken, address _user)
        external
        view
        returns (uint256)
    {
        uint256 poolId = _getPoolId(_poolToken);
        return _getUserAccumulatedReward(poolId, _user);
    }

    /**
     * @notice returns estimated reward
     * @param _poolToken the address of pool token
     * @param _amount the amount of tokens to be deposited
     * @param _duration the duration of liquidity providing in seconds
     */
    function getEstimatedReward(
        address _poolToken,
        uint256 _amount,
        uint256 _duration
    ) external view returns (uint256) {
        uint256 poolId = _getPoolId(_poolToken);
        PoolInfo storage pool = poolInfoList[poolId];
        uint256 start = block.number;
        uint256 end = start.add(_duration.div(SECONDS_PER_BLOCK));
        (, uint256 accumulatedRewardPerShare) =
            _getPoolAccumulatedReward(pool, _amount, start, end);
        return _amount.mul(accumulatedRewardPerShare).div(PRECISION);
    }

    /**
     * @notice Updates reward variables for all pools.
     * @dev Be careful of gas spending!
     */
    function updateAllPools() public {
        uint256 length = poolInfoList.length;
        for (uint256 i = 0; i < length; i++) {
            _updatePool(i);
        }
    }

    /**
     * @notice Updates reward variables of the given pool to be up-to-date
     * @param _poolToken the address of pool token
     */
    function updatePool(address _poolToken) public {
        uint256 poolId = _getPoolId(_poolToken);
        _updatePool(poolId);
    }

    function _updatePool(uint256 _poolId) internal {
        PoolInfo storage pool = poolInfoList[_poolId];

        //this pool has been updated recently
        if (block.number <= pool.lastRewardBlock) {
            return;
        }

        uint256 poolTokenBalance = pool.poolToken.balanceOf(address(this));
        if (poolTokenBalance == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }

        (uint256 accumulatedReward_, uint256 accumulatedRewardPerShare_) =
            _getPoolAccumulatedReward(pool);
        pool.accumulatedRewardPerShare = pool.accumulatedRewardPerShare.add(
            accumulatedRewardPerShare_
        );
        pool.lastRewardBlock = block.number;

        totalUsersBalance = totalUsersBalance.add(accumulatedReward_);
    }

    function _getPoolAccumulatedReward(PoolInfo storage _pool)
        internal
        view
        returns (uint256, uint256)
    {
        return _getPoolAccumulatedReward(_pool, 0, _pool.lastRewardBlock, block.number);
    }

    function _getPoolAccumulatedReward(
        PoolInfo storage _pool,
        uint256 _additionalAmount,
        uint256 _startBlock,
        uint256 _endBlock
    ) internal view returns (uint256, uint256) {
        uint256 passedBlocks = _getPassedBlocksWithBonusMultiplier(_startBlock, _endBlock);
        uint256 accumulatedReward =
            passedBlocks.mul(rewardTokensPerBlock).mul(_pool.allocationPoint).div(
                totalAllocationPoint
            );

        uint256 poolTokenBalance = _pool.poolToken.balanceOf(address(this));
        poolTokenBalance = poolTokenBalance.add(_additionalAmount);
        uint256 accumulatedRewardPerShare = accumulatedReward.mul(PRECISION).div(poolTokenBalance);
        return (accumulatedReward, accumulatedRewardPerShare);
    }

    /**
     * @notice deposits pool tokens
     * @param _poolToken the address of pool token
     * @param _amount the amount of pool tokens
     * @param _user the address of user, tokens will be deposited to it or to msg.sender
     */
    function deposit(
        address _poolToken,
        uint256 _amount,
        address _user
    ) external {
        _deposit(_poolToken, _amount, _user, false);
    }

    /**
     * @notice if the lending pools directly mint/transfer tokens to this address, process it like a user deposit
     * @dev only callable by the pool which issues the tokens
     * @param _user the user address
     * @param _amount the minted amount
     */
    function onTokensDeposited(address _user, uint256 _amount) external {
        //the msg.sender is the pool token. if the msg.sender is not a valid pool token, _deposit will revert
        _deposit(msg.sender, _amount, _user, true);
    }

    /**
     * @notice internal function for depositing pool tokens
     * @param _poolToken the address of pool token
     * @param _amount the amount of pool tokens
     * @param _user the address of user, tokens will be deposited to it
     * @param alreadyTransferred true if the pool tokens have already been transferred
     */
    function _deposit(
        address _poolToken,
        uint256 _amount,
        address _user,
        bool alreadyTransferred
    ) internal {
        require(poolIdList[_poolToken] != 0, "Pool token not found");
        address userAddress = _user != address(0) ? _user : msg.sender;

        uint256 poolId = _getPoolId(_poolToken);
        PoolInfo storage pool = poolInfoList[poolId];
        UserInfo storage user = userInfoMap[poolId][userAddress];

        _updatePool(poolId);
        //sends reward directly to the user
        _updateReward(pool, user);

        if (_amount > 0) {
            //receives pool tokens from msg.sender, it can be user or WrapperProxy contract
            if (!alreadyTransferred)
                pool.poolToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            user.amount = user.amount.add(_amount);
        }
        _updateRewardDebt(pool, user);
        emit Deposit(userAddress, _poolToken, _amount);
    }

    /**
     * @notice transfers reward tokens
     * @param _poolToken the address of pool token
     * @param _user the address of user to claim reward from (can be passed only by wrapper contract)
     */
    function claimReward(address _poolToken, address _user) external {
        address userAddress = _getUserAddress(_user);

        uint256 poolId = _getPoolId(_poolToken);
        _claimReward(poolId, userAddress, true);
    }

    function _claimReward(
        uint256 _poolId,
        address _userAddress,
        bool _isStakingTokens
    ) internal {
        PoolInfo storage pool = poolInfoList[_poolId];
        UserInfo storage user = userInfoMap[_poolId][_userAddress];

        _updatePool(_poolId);
        _updateReward(pool, user);
        _transferReward(address(pool.poolToken), user, _userAddress, _isStakingTokens, true);
        _updateRewardDebt(pool, user);
    }

    /**
     * @notice transfers reward tokens from all pools
     * @param _user the address of user to claim reward from (can be passed only by wrapper contract)
     */
    function claimRewardFromAllPools(address _user) external {
        address userAddress = _getUserAddress(_user);

        uint256 length = poolInfoList.length;
        for (uint256 i = 0; i < length; i++) {
            uint256 poolId = i;
            _claimReward(poolId, userAddress, false);
        }

        if (
            lockedSOV.getLockedBalance(userAddress) > 0 ||
            lockedSOV.getUnlockedBalance(userAddress) > 0
        ) {
            lockedSOV.withdrawAndStakeTokensFrom(userAddress);
        }
    }

    /**
     * @notice withdraws pool tokens and transfers reward tokens
     * @param _poolToken the address of pool token
     * @param _amount the amount of pool tokens
     * @param _user the user address will be used to process a withdrawal (can be passed only by wrapper contract)
     */
    function withdraw(
        address _poolToken,
        uint256 _amount,
        address _user
    ) external {
        require(poolIdList[_poolToken] != 0, "Pool token not found");
        address userAddress = _getUserAddress(_user);

        uint256 poolId = _getPoolId(_poolToken);
        PoolInfo storage pool = poolInfoList[poolId];
        UserInfo storage user = userInfoMap[poolId][userAddress];
        require(user.amount >= _amount, "Not enough balance");

        _updatePool(poolId);
        _updateReward(pool, user);
        _transferReward(_poolToken, user, userAddress, false, false);

        user.amount = user.amount.sub(_amount);

        //msg.sender is wrapper -> send to wrapper
        if (msg.sender == wrapper) {
            pool.poolToken.safeTransfer(address(msg.sender), _amount);
        }
        //msg.sender is user or pool token (lending pool) -> send to user
        else {
            pool.poolToken.safeTransfer(userAddress, _amount);
        }

        _updateRewardDebt(pool, user);
        emit Withdraw(userAddress, _poolToken, _amount);
    }

    function _getUserAddress(address _user) internal view returns (address) {
        address userAddress = msg.sender;
        if (_user != address(0)) {
            //only wrapper can pass _user parameter
            require(
                msg.sender == wrapper || poolIdList[msg.sender] != 0,
                "only wrapper or pools may withdraw for a user"
            );
            userAddress = _user;
        }
        return userAddress;
    }

    function _updateReward(PoolInfo storage pool, UserInfo storage user) internal {
        //update user accumulated reward
        if (user.amount > 0) {
            //add reward for the previous amount of deposited tokens
            uint256 accumulatedReward =
                user.amount.mul(pool.accumulatedRewardPerShare).div(PRECISION).sub(
                    user.rewardDebt
                );
            user.accumulatedReward = user.accumulatedReward.add(accumulatedReward);
        }
    }

    function _updateRewardDebt(PoolInfo storage pool, UserInfo storage user) internal {
        //reward accumulated before amount update (should be subtracted during next reward calculation)
        user.rewardDebt = user.amount.mul(pool.accumulatedRewardPerShare).div(PRECISION);
    }

    /**
     * @notice Send reward in SOV to the lockedSOV vault.
     * @param _user The user info, to get its reward share.
     * @param _userAddress The address of the user, to send SOV in its behalf.
     * @param _isStakingTokens The flag whether we need to stake tokens
     * @param _isCheckingBalance The flag whether we need to throw error or don't process reward if SOV balance isn't enough
     */
    function _transferReward(
        address _poolToken,
        UserInfo storage _user,
        address _userAddress,
        bool _isStakingTokens,
        bool _isCheckingBalance
    ) internal {
        uint256 userAccumulatedReward = _user.accumulatedReward;
        /// @dev get unlock immediate percent of the pool token.
        uint256 calculatedUnlockedImmediatelyPercent = calcUnlockedImmediatelyPercent(_poolToken);

        /// @dev Transfer if enough SOV balance on this LM contract.
        uint256 balance = SOV.balanceOf(address(this));
        if (balance >= userAccumulatedReward) {
            totalUsersBalance = totalUsersBalance.sub(userAccumulatedReward);
            _user.accumulatedReward = 0;

            /// @dev If calculatedUnlockedImmediatelyPercent is 100%, transfer the reward to the LP (user).
            ///   else, deposit it into lockedSOV vault contract, but first
            ///   SOV deposit must be approved to move the SOV tokens
            ///   from this LM contract into the lockedSOV vault.
            if (calculatedUnlockedImmediatelyPercent == 10000) {
                SOV.transfer(_userAddress, userAccumulatedReward);
            } else {
                require(SOV.approve(address(lockedSOV), userAccumulatedReward), "Approve failed");
                lockedSOV.deposit(
                    _userAddress,
                    userAccumulatedReward,
                    calculatedUnlockedImmediatelyPercent
                );

                if (_isStakingTokens) {
                    lockedSOV.withdrawAndStakeTokensFrom(_userAddress);
                }
            }

            /// @dev Event log.
            emit RewardClaimed(_userAddress, _poolToken, userAccumulatedReward);
        } else {
            require(!_isCheckingBalance, "Claiming reward failed");
        }
    }

    /**
     * @notice withdraws pool tokens without transferring reward tokens
     * @param _poolToken the address of pool token
     * @dev EMERGENCY ONLY
     */
    function emergencyWithdraw(address _poolToken) external {
        uint256 poolId = _getPoolId(_poolToken);
        PoolInfo storage pool = poolInfoList[poolId];
        UserInfo storage user = userInfoMap[poolId][msg.sender];

        _updatePool(poolId);
        _updateReward(pool, user);

        totalUsersBalance = totalUsersBalance.sub(user.accumulatedReward);
        uint256 userAmount = user.amount;
        uint256 userAccumulatedReward = user.accumulatedReward;
        user.amount = 0;
        user.rewardDebt = 0;
        user.accumulatedReward = 0;
        pool.poolToken.safeTransfer(address(msg.sender), userAmount);

        emit EmergencyWithdraw(msg.sender, _poolToken, userAmount, userAccumulatedReward);
    }

    /**
     * @notice returns pool id
     * @param _poolToken the address of pool token
     */
    function getPoolId(address _poolToken) external view returns (uint256) {
        return _getPoolId(_poolToken);
    }

    function _getPoolId(address _poolToken) internal view returns (uint256) {
        uint256 poolId = poolIdList[_poolToken];
        require(poolId > 0, "Pool token not found");
        return poolId - 1;
    }

    /**
     * @notice returns count of pool tokens
     */
    function getPoolLength() external view returns (uint256) {
        return poolInfoList.length;
    }

    /**
     * @notice returns list of pool token's info
     */
    function getPoolInfoList() external view returns (PoolInfo[] memory) {
        return poolInfoList;
    }

    /**
     * @notice returns pool info for the given token
     * @param _poolToken the address of pool token
     */
    function getPoolInfo(address _poolToken) external view returns (PoolInfo memory) {
        uint256 poolId = _getPoolId(_poolToken);
        return poolInfoList[poolId];
    }

    /**
     * @notice returns list of [amount, accumulatedReward] for the given user for each pool token
     * @param _user the address of the user
     */
    function getUserBalanceList(address _user) external view returns (uint256[2][] memory) {
        uint256 length = poolInfoList.length;
        uint256[2][] memory userBalanceList = new uint256[2][](length);
        for (uint256 i = 0; i < length; i++) {
            userBalanceList[i][0] = userInfoMap[i][_user].amount;
            userBalanceList[i][1] = _getUserAccumulatedReward(i, _user);
        }
        return userBalanceList;
    }

    /**
     * @notice returns UserInfo for the given pool and user
     * @param _poolToken the address of pool token
     * @param _user the address of the user
     */
    function getUserInfo(address _poolToken, address _user) public view returns (UserInfo memory) {
        uint256 poolId = _getPoolId(_poolToken);
        return userInfoMap[poolId][_user];
    }

    /**
     * @notice returns list of UserInfo for the given user for each pool token
     * @param _user the address of the user
     */
    function getUserInfoList(address _user) external view returns (UserInfo[] memory) {
        uint256 length = poolInfoList.length;
        UserInfo[] memory userInfoList = new UserInfo[](length);
        for (uint256 i = 0; i < length; i++) {
            userInfoList[i] = userInfoMap[i][_user];
        }
        return userInfoList;
    }

    /**
     * @notice returns accumulated reward for the given user for each pool token
     * @param _user the address of the user
     */
    function getUserAccumulatedRewardList(address _user) external view returns (uint256[] memory) {
        uint256 length = poolInfoList.length;
        uint256[] memory rewardList = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            rewardList[i] = _getUserAccumulatedReward(i, _user);
        }
        return rewardList;
    }

    /**
     * @notice returns the pool token balance a user has on the contract
     * @param _poolToken the address of pool token
     * @param _user the address of the user
     */
    function getUserPoolTokenBalance(address _poolToken, address _user)
        external
        view
        returns (uint256)
    {
        UserInfo memory ui = getUserInfo(_poolToken, _user);
        return ui.amount;
    }

    /**
     * @notice returns the accumulated liquid reward for the given user for each pool token
     * @param _user the address of the user
     */
    function getUserAccumulatedRewardToBePaidLiquid(address _user)
        external
        view
        returns (uint256)
    {
        uint256 length = poolInfoList.length;
        uint256 result;
        for (uint256 i = 0; i < length; i++) {
            address _poolToken = address(poolInfoList[i].poolToken);
            uint256 calculatedUnlockedImmediatelyPercent =
                calcUnlockedImmediatelyPercent(_poolToken);
            result = result.add(
                calculatedUnlockedImmediatelyPercent.mul(_getUserAccumulatedReward(i, _user)).div(
                    10000
                )
            );
        }

        return result;
    }

    /**
     * @notice returns the accumulated vested reward for the given user for each pool token
     * @param _user the address of the user
     */
    function getUserAccumulatedRewardToBeVested(address _user) external view returns (uint256) {
        uint256 length = poolInfoList.length;
        uint256 result;
        for (uint256 i = 0; i < length; i++) {
            address _poolToken = address(poolInfoList[i].poolToken);
            uint256 calculatedUnlockedImmediatelyPercent =
                calcUnlockedImmediatelyPercent(_poolToken);
            result = result.add(
                (10000 - calculatedUnlockedImmediatelyPercent)
                    .mul(_getUserAccumulatedReward(i, _user))
                    .div(10000)
            );
        }

        return result;
    }

    /**
     * @dev calculate the unlocked immediate percentage of specific pool token
     * use the poolTokensUnlockedImmediatelyPercent by default, if it is not set, then use the unlockedImmediatelyPercent
     */
    function calcUnlockedImmediatelyPercent(address _poolToken) public view returns (uint256) {
        uint256 poolTokenUnlockedImmediatelyPercent =
            poolTokensUnlockedImmediatelyPercent[_poolToken];
        return
            poolTokenUnlockedImmediatelyPercent > 0
                ? poolTokenUnlockedImmediatelyPercent
                : unlockedImmediatelyPercent;
    }
}