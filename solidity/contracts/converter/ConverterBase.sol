pragma solidity 0.4.26;
import "./interfaces/IConverter.sol";
import "./interfaces/IConverterAnchor.sol";
import "./interfaces/IConverterUpgrader.sol";
import "./interfaces/ISovrynSwapFormula.sol";
import "../ISovrynSwapNetwork.sol";
import "../utility/ContractRegistryClient.sol";
import "../utility/ReentrancyGuard.sol";
import "../utility/SafeMath.sol";
import "../utility/TokenHandler.sol";
import "../utility/TokenHolder.sol";
import "../token/interfaces/IEtherToken.sol";
import "../sovrynswapx/interfaces/ISovrynSwapX.sol";

/**
 * @dev ConverterBase
 *
 * The converter contains the main logic for conversions between different ERC20 tokens.
 *
 * It is also the upgradable part of the mechanism (note that upgrades are opt-in).
 *
 * The anchor must be set on construction and cannot be changed afterwards.
 * Wrappers are provided for some of the anchor's functions, for easier access.
 *
 * Once the converter accepts ownership of the anchor, it becomes the anchor's sole controller
 * and can execute any of its functions.
 *
 * To upgrade the converter, anchor ownership must be transferred to a new converter, along with
 * any relevant data.
 *
 * Note that the converter can transfer anchor ownership to a new converter that
 * doesn't allow upgrades anymore, for finalizing the relationship between the converter
 * and the anchor.
 *
 * Converter types (defined as uint16 type) -
 * 0 = liquid token converter
 * 1 = liquidity pool v1 converter
 * 2 = liquidity pool v2 converter
 *
 * Note that converters don't currently support tokens with transfer fees.
 */
contract ConverterBase is IConverter, TokenHandler, TokenHolder, ContractRegistryClient, ReentrancyGuard {
	using SafeMath for uint256;

	uint32 internal constant WEIGHT_RESOLUTION = 1000000;
	uint32 internal constant CONVERSION_FEE_RESOLUTION = 1000000;
	address internal constant ETH_RESERVE_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

	struct Reserve {
		uint256 balance; // reserve balance
		uint32 weight; // reserve weight, represented in ppm, 1-1000000
		bool deprecated1; // deprecated
		bool deprecated2; // deprecated
		bool isSet; // true if the reserve is valid, false otherwise
	}

	struct Settings {
		address wrbtcAddress;
		address sovTokenAddress;
		address feesController;
	}

	/**
	 * @dev version number
	 */
	uint16 public constant version = 32;

	IConverterAnchor public anchor; // converter anchor contract
	IWhitelist public conversionWhitelist; // whitelist contract with list of addresses that are allowed to use the converter
	IERC20Token[] public reserveTokens; // ERC20 standard token addresses (prior version 17, use 'connectorTokens' instead)
	mapping(address => Reserve) public reserves; // reserve token addresses -> reserve data (prior version 17, use 'connectors' instead)
	uint32 public reserveRatio = 0; // ratio between the reserves and the market cap, equal to the total reserve weights
	uint32 public maxConversionFee = 0; // maximum conversion fee for the lifetime of the contract,
	// represented in ppm, 0...1000000 (0 = no fee, 100 = 0.01%, 1000000 = 100%)
	uint32 public conversionFee = 0; // current conversion fee, represented in ppm, 0...maxConversionFee
	bool public constant conversionsEnabled = true; // deprecated, backward compatibility
	mapping(address => uint256) public protocolFeeTokensHeld; /// Total conversion fees (reserveTokens[1]) received and not withdrawn.

	/**
	 * @dev triggered when the converter is activated
	 *
	 * @param _type        converter type
	 * @param _anchor      converter anchor
	 * @param _activated   true if the converter was activated, false if it was deactivated
	 */
	event Activation(uint16 indexed _type, IConverterAnchor indexed _anchor, bool indexed _activated);

	/**
	 * @dev triggered when a conversion between two tokens occurs
	 *
	 * @param _fromToken       source ERC20 token
	 * @param _toToken         target ERC20 token
	 * @param _trader          wallet that initiated the trade
	 * @param _amount          amount converted, in the source token
	 * @param _return          amount returned, minus conversion fee
	 * @param _conversionFee   conversion fee
	 */
	event Conversion(
		address indexed _fromToken,
		address indexed _toToken,
		address indexed _trader,
		uint256 _amount,
		uint256 _return,
		int256 _conversionFee,
		int256 _protocolFee
	);

	/**
	 * @dev triggered when the rate between two tokens in the converter changes
	 * note that the event might be dispatched for rate updates between any two tokens in the converter
	 * note that prior to version 28, you should use the 'PriceDataUpdate' event instead
	 *
	 * @param  _token1 address of the first token
	 * @param  _token2 address of the second token
	 * @param  _rateN  rate of 1 unit of `_token1` in `_token2` (numerator)
	 * @param  _rateD  rate of 1 unit of `_token1` in `_token2` (denominator)
	 */
	event TokenRateUpdate(address indexed _token1, address indexed _token2, uint256 _rateN, uint256 _rateD);

	/**
	 * @dev triggered when the conversion fee is updated
	 *
	 * @param  _prevFee    previous fee percentage, represented in ppm
	 * @param  _newFee     new fee percentage, represented in ppm
	 */
	event ConversionFeeUpdate(uint32 _prevFee, uint32 _newFee);

	/**
	 * @dev triggered when feesController / feeSharingProxy withdraw the collected protocol fees
	 *
	 * @param sender the feesController itself.
	 * @param receiver the receipient of the token (feeSharingProxy).
	 * @param token address of the withdrawn token.
	 * @param protocolFeeAmount the total amount of protocol fee.
	 * @param wRBTCConverted the total converted wrbtc from protocol fee token.
	 */
	event WithdrawFees(
		address indexed sender,
		address indexed receiver,
		address token,
		uint256 protocolFeeAmount,
		uint256 wRBTCConverted
	);

	/**
	 * @dev used by sub-contracts to initialize a new converter
	 *
	 * @param  _anchor             anchor governed by the converter
	 * @param  _registry           address of a contract registry contract
	 * @param  _maxConversionFee   maximum conversion fee, represented in ppm
	 */
	constructor(
		IConverterAnchor _anchor,
		IContractRegistry _registry,
		uint32 _maxConversionFee
	) internal validAddress(_anchor) ContractRegistryClient(_registry) validConversionFee(_maxConversionFee) {
		anchor = _anchor;
		maxConversionFee = _maxConversionFee;
	}

	/**
	 * @dev Throws if called by any account other than the owner.
	 */
	modifier onlyOwner() {
		require(msg.sender == owner, "ERR_ACCESS_DENIED");
		_;
	}

	// ensures that the converter is active
	modifier active() {
		_active();
		_;
	}

	// error message binary size optimization
	function _active() internal view {
		require(isActive(), "ERR_INACTIVE");
	}

	// ensures that the converter is not active
	modifier inactive() {
		_inactive();
		_;
	}

	// error message binary size optimization
	function _inactive() internal view {
		require(!isActive(), "ERR_ACTIVE");
	}

	// validates a reserve token address - verifies that the address belongs to one of the reserve tokens
	modifier validReserve(IERC20Token _address) {
		_validReserve(_address);
		_;
	}

	// error message binary size optimization
	function _validReserve(IERC20Token _address) internal view {
		require(reserves[_address].isSet, "ERR_INVALID_RESERVE");
	}

	// validates conversion fee
	modifier validConversionFee(uint32 _conversionFee) {
		_validConversionFee(_conversionFee);
		_;
	}

	// error message binary size optimization
	function _validConversionFee(uint32 _conversionFee) internal pure {
		require(_conversionFee <= CONVERSION_FEE_RESOLUTION, "ERR_INVALID_CONVERSION_FEE");
	}

	// validates reserve weight
	modifier validReserveWeight(uint32 _weight) {
		_validReserveWeight(_weight);
		_;
	}

	// error message binary size optimization
	function _validReserveWeight(uint32 _weight) internal pure {
		require(_weight > 0 && _weight <= WEIGHT_RESOLUTION, "ERR_INVALID_RESERVE_WEIGHT");
	}

	/**
	 * @dev deposits ether
	 * can only be called if the converter has an ETH reserve
	 */
	function() external payable {
		require(reserves[ETH_RESERVE_ADDRESS].isSet, "ERR_INVALID_RESERVE"); // require(hasETHReserve(), "ERR_INVALID_RESERVE");
		// a workaround for a problem when running solidity-coverage
		// see https://github.com/sc-forks/solidity-coverage/issues/487
	}

	/**
	 * @dev withdraws ether
	 * can only be called by the owner if the converter is inactive or by upgrader contract
	 * can only be called after the upgrader contract has accepted the ownership of this contract
	 * can only be called if the converter has an ETH reserve
	 *
	 * @param _to  address to send the ETH to
	 */
	function withdrawETH(address _to) public protected ownerOnly validReserve(IERC20Token(ETH_RESERVE_ADDRESS)) {
		address converterUpgrader = addressOf(CONVERTER_UPGRADER);

		// verify that the converter is inactive or that the owner is the upgrader contract
		require(!isActive() || owner == converterUpgrader, "ERR_ACCESS_DENIED");
		_to.transfer(address(this).balance);

		// sync the ETH reserve balance
		syncReserveBalance(IERC20Token(ETH_RESERVE_ADDRESS));
	}

	/**
	 * @dev checks whether or not the converter version is 28 or higher
	 *
	 * @return true, since the converter version is 28 or higher
	 */
	function isV28OrHigher() public pure returns (bool) {
		return true;
	}

	/**
	 * @dev allows the owner to update & enable the conversion whitelist contract address
	 * when set, only addresses that are whitelisted are actually allowed to use the converter
	 * note that the whitelist check is actually done by the SovrynSwapNetwork contract
	 *
	 * @param _whitelist    address of a whitelist contract
	 */
	function setConversionWhitelist(IWhitelist _whitelist) public ownerOnly notThis(_whitelist) {
		conversionWhitelist = _whitelist;
	}

	/**
	 * @dev returns true if the converter is active, false otherwise
	 *
	 * @return true if the converter is active, false otherwise
	 */
	function isActive() public view returns (bool) {
		return anchor.owner() == address(this);
	}

	/**
	 * @dev transfers the anchor ownership
	 * the new owner needs to accept the transfer
	 * can only be called by the converter upgrder while the upgrader is the owner
	 * note that prior to version 28, you should use 'transferAnchorOwnership' instead
	 *
	 * @param _newOwner    new token owner
	 */
	function transferAnchorOwnership(address _newOwner) public ownerOnly only(CONVERTER_UPGRADER) {
		anchor.transferOwnership(_newOwner);
	}

	/**
	 * @dev accepts ownership of the anchor after an ownership transfer
	 * most converters are also activated as soon as they accept the anchor ownership
	 * can only be called by the contract owner
	 * note that prior to version 28, you should use 'acceptTokenOwnership' instead
	 */
	function acceptAnchorOwnership() public ownerOnly {
		// verify the the converter has at least one reserve
		require(reserveTokenCount() > 0, "ERR_INVALID_RESERVE_COUNT");
		anchor.acceptOwnership();
		syncReserveBalances();
	}

	/**
	 * @dev withdraws tokens held by the anchor and sends them to an account
	 * can only be called by the owner
	 *
	 * @param _token   ERC20 token contract address
	 * @param _to      account to receive the new amount
	 * @param _amount  amount to withdraw
	 */
	function withdrawFromAnchor(
		IERC20Token _token,
		address _to,
		uint256 _amount
	) public ownerOnly {
		anchor.withdrawTokens(_token, _to, _amount);
	}

	/**
	 * @dev updates the current conversion fee
	 * can only be called by the contract owner
	 *
	 * @param _conversionFee new conversion fee, represented in ppm
	 */
	function setConversionFee(uint32 _conversionFee) public ownerOnly {
		require(_conversionFee <= maxConversionFee, "ERR_INVALID_CONVERSION_FEE");
		emit ConversionFeeUpdate(conversionFee, _conversionFee);
		conversionFee = _conversionFee;
	}

	/**
	 * @dev withdraws tokens held by the converter and sends them to an account
	 * can only be called by the owner
	 * note that reserve tokens can only be withdrawn by the owner while the converter is inactive
	 * unless the owner is the converter upgrader contract
	 *
	 * @param _token   ERC20 token contract address
	 * @param _to      account to receive the new amount
	 * @param _amount  amount to withdraw
	 */
	function withdrawTokens(
		IERC20Token _token,
		address _to,
		uint256 _amount
	) public protected ownerOnly {
		address converterUpgrader = addressOf(CONVERTER_UPGRADER);

		// if the token is not a reserve token, allow withdrawal
		// otherwise verify that the converter is inactive or that the owner is the upgrader contract
		require(!reserves[_token].isSet || !isActive() || owner == converterUpgrader, "ERR_ACCESS_DENIED");
		super.withdrawTokens(_token, _to, _amount);

		// if the token is a reserve token, sync the reserve balance
		if (reserves[_token].isSet) syncReserveBalance(_token);
	}

	/**
	 * @dev upgrades the converter to the latest version
	 * can only be called by the owner
	 * note that the owner needs to call acceptOwnership on the new converter after the upgrade
	 */
	function upgrade() public ownerOnly {
		IConverterUpgrader converterUpgrader = IConverterUpgrader(addressOf(CONVERTER_UPGRADER));

		// trigger de-activation event
		emit Activation(converterType(), anchor, false);

		transferOwnership(converterUpgrader);
		converterUpgrader.upgrade(version);
		acceptOwnership();
	}

	/**
	 * @dev returns the number of reserve tokens defined
	 * note that prior to version 17, you should use 'connectorTokenCount' instead
	 *
	 * @return number of reserve tokens
	 */
	function reserveTokenCount() public view returns (uint16) {
		return uint16(reserveTokens.length);
	}

	/**
	 * @dev defines a new reserve token for the converter
	 * can only be called by the owner while the converter is inactive
	 *
	 * @param _token   address of the reserve token
	 * @param _weight  reserve weight, represented in ppm, 1-1000000
	 */
	function addReserve(IERC20Token _token, uint32 _weight)
		public
		ownerOnly
		inactive
		validAddress(_token)
		notThis(_token)
		validReserveWeight(_weight)
	{
		// validate input
		require(_token != address(anchor) && !reserves[_token].isSet, "ERR_INVALID_RESERVE");
		require(_weight <= WEIGHT_RESOLUTION - reserveRatio, "ERR_INVALID_RESERVE_WEIGHT");
		require(reserveTokenCount() < uint16(-1), "ERR_INVALID_RESERVE_COUNT");

		Reserve storage newReserve = reserves[_token];
		newReserve.balance = 0;
		newReserve.weight = _weight;
		newReserve.isSet = true;
		reserveTokens.push(_token);
		reserveRatio += _weight;
	}

	/**
	 * @dev returns the reserve's weight
	 * added in version 28
	 *
	 * @param _reserveToken    reserve token contract address
	 *
	 * @return reserve weight
	 */
	function reserveWeight(IERC20Token _reserveToken) public view validReserve(_reserveToken) returns (uint32) {
		return reserves[_reserveToken].weight;
	}

	/**
	 * @dev returns the reserve's balance
	 * note that prior to version 17, you should use 'getConnectorBalance' instead
	 *
	 * @param _reserveToken    reserve token contract address
	 *
	 * @return reserve balance
	 */
	function reserveBalance(IERC20Token _reserveToken) public view validReserve(_reserveToken) returns (uint256) {
		return reserves[_reserveToken].balance;
	}

	/**
	 * @dev checks whether or not the converter has an ETH reserve
	 *
	 * @return true if the converter has an ETH reserve, false otherwise
	 */
	function hasETHReserve() public view returns (bool) {
		return reserves[ETH_RESERVE_ADDRESS].isSet;
	}

	/**
	 * @dev converts a specific amount of source tokens to target tokens
	 * can only be called by the SovrynSwap network contract
	 *
	 * @param _sourceToken source ERC20 token
	 * @param _targetToken target ERC20 token
	 * @param _amount      amount of tokens to convert (in units of the source token)
	 * @param _trader      address of the caller who executed the conversion
	 * @param _beneficiary wallet to receive the conversion result
	 *
	 * @return amount of tokens received (in units of the target token)
	 */
	function convert(
		IERC20Token _sourceToken,
		IERC20Token _targetToken,
		uint256 _amount,
		address _trader,
		address _beneficiary
	) public payable protected only(SOVRYNSWAP_NETWORK) returns (uint256) {
		// validate input
		require(_sourceToken != _targetToken, "ERR_SAME_SOURCE_TARGET");

		// if a whitelist is set, verify that both and trader and the beneficiary are whitelisted
		require(
			conversionWhitelist == address(0) || (conversionWhitelist.isWhitelisted(_trader) && conversionWhitelist.isWhitelisted(_beneficiary)),
			"ERR_NOT_WHITELISTED"
		);

		return doConvert(_sourceToken, _targetToken, _amount, _trader, _beneficiary);
	}

	/**
	 * @dev converts a specific amount of source tokens to target tokens
	 * called by ConverterBase and allows the inherited contracts to implement custom conversion logic
	 *
	 * @param _sourceToken source ERC20 token
	 * @param _targetToken target ERC20 token
	 * @param _amount      amount of tokens to convert (in units of the source token)
	 * @param _trader      address of the caller who executed the conversion
	 * @param _beneficiary wallet to receive the conversion result
	 *
	 * @return amount of tokens received (in units of the target token)
	 */
	function doConvert(
		IERC20Token _sourceToken,
		IERC20Token _targetToken,
		uint256 _amount,
		address _trader,
		address _beneficiary
	) internal returns (uint256);

	/**
	 * @dev returns the conversion fee for a given target amount
	 *
	 * @param _targetAmount  target amount
	 *
	 * @return conversion fee
	 */
	function calculateFee(uint256 _targetAmount) internal view returns (uint256) {
		return _targetAmount.mul(conversionFee).div(CONVERSION_FEE_RESOLUTION);
	}

	/**
	 * @dev returns the protocol fee for a given target amount
	 *
	 * @param _targetAmount target amount
	 *
	 * @return calculated protocol fee
	 */
	function calculateProtocolFee(address _targetToken, uint256 _targetAmount) internal returns (uint256) {
		uint256 _protocolFee = getProtocolFeeFromSwapSettings();
		uint256 calculatedProtocolFee = _targetAmount.mul(_protocolFee).div(1e20);
		protocolFeeTokensHeld[_targetToken] = protocolFeeTokensHeld[_targetToken].add(calculatedProtocolFee);
		return calculatedProtocolFee;
	}

	function swapSettingsContractName() public constant returns(bytes32) {
		return "SwapSettings";
	}

	/**
	 * @dev get the protocol fee from the SovrynSwapNetwork using the registry.
	 *
	 * @return protocol fee.
	 */
	function getProtocolFeeFromSwapSettings() public view returns (uint256) {
		address swapSettingsAddress = IContractRegistry(registry).addressOf(swapSettingsContractName());
		return ISwapSettings(swapSettingsAddress).protocolFee();
	}

	/**
	 * @dev get the wrbtc address from sovryn swap network
	 *
	 * @return wrbtc address
	 */
	function getWrbtcAddressFromSwapSettings() public view returns (address) {
		address swapSettingsAddress = IContractRegistry(registry).addressOf(swapSettingsContractName());
		return ISwapSettings(swapSettingsAddress).wrbtcAddress();
	}

	/**
	 * @dev get the sov token address from sovryn swap network
	 *
	 * @return sov token address
	 */
	function getSOVTokenAddressFromSwapSettings() public view returns (address) {
		address swapSettingsAddress = IContractRegistry(registry).addressOf(swapSettingsContractName());
		return ISwapSettings(swapSettingsAddress).sovTokenAddress();
	}

	/**
	 * @dev get the feesController address from sovryn swap network
	 *
	 * @return feesController address (protocol feeSharingProxy) 
	 */
	function getFeesControllerFromSwapSettings() public view returns (address) {
		address swapSettingsAddress = IContractRegistry(registry).addressOf(swapSettingsContractName());
		return ISwapSettings(swapSettingsAddress).feesController();
	}


	/**
	 * @dev syncs the stored reserve balance for a given reserve with the real reserve balance
	 *
	 * @param _reserveToken    address of the reserve token
	 */
	function syncReserveBalance(IERC20Token _reserveToken) internal validReserve(_reserveToken) {
		if (_reserveToken == ETH_RESERVE_ADDRESS) reserves[_reserveToken].balance = address(this).balance;
		else reserves[_reserveToken].balance = _reserveToken.balanceOf(this);
	}

	/**
	 * @dev syncs all stored reserve balances
	 */
	function syncReserveBalances() internal {
		uint256 reserveCount = reserveTokens.length;
		for (uint256 i = 0; i < reserveCount; i++) syncReserveBalance(reserveTokens[i]);
	}

	/**
	 * @dev helper, dispatches the Conversion event
	 *
	 * @param _sourceToken     source ERC20 token
	 * @param _targetToken     target ERC20 token
	 * @param _trader          address of the caller who executed the conversion
	 * @param _amount          amount purchased/sold (in the source token)
	 * @param _returnAmount    amount returned (in the target token)
	 * @param _feeAmount			 dedicated fee for converter
	 * @param _protocolFeeAmount dedicated fee for sovryn protocol
	 */
	function dispatchConversionEvent(
		IERC20Token _sourceToken,
		IERC20Token _targetToken,
		address _trader,
		uint256 _amount,
		uint256 _returnAmount,
		uint256 _feeAmount,
		uint256 _protocolFeeAmount
	) internal {
		// fee amount is converted to 255 bits -
		// negative amount means the fee is taken from the source token, positive amount means its taken from the target token
		// currently the fee is always taken from the target token
		// since we convert it to a signed number, we first ensure that it's capped at 255 bits to prevent overflow
		assert(_feeAmount < 2**255);
		emit Conversion(_sourceToken, _targetToken, _trader, _amount, _returnAmount, int256(_feeAmount), int256(_protocolFeeAmount));
	}

	/**
	 * @dev deprecated since version 28, backward compatibility - use only for earlier versions
	 */
	function token() public view returns (IConverterAnchor) {
		return anchor;
	}

	/**
	 * @dev deprecated, backward compatibility
	 */
	function transferTokenOwnership(address _newOwner) public ownerOnly {
		transferAnchorOwnership(_newOwner);
	}

	/**
	 * @dev deprecated, backward compatibility
	 */
	function acceptTokenOwnership() public ownerOnly {
		acceptAnchorOwnership();
	}

	/**
	 * @dev deprecated, backward compatibility
	 */
	function connectors(address _address)
		public
		view
		returns (
			uint256,
			uint32,
			bool,
			bool,
			bool
		)
	{
		Reserve memory reserve = reserves[_address];
		return (reserve.balance, reserve.weight, false, false, reserve.isSet);
	}

	/**
	 * @dev deprecated, backward compatibility
	 */
	function connectorTokens(uint256 _index) public view returns (IERC20Token) {
		return ConverterBase.reserveTokens[_index];
	}

	/**
	 * @dev deprecated, backward compatibility
	 */
	function connectorTokenCount() public view returns (uint16) {
		return reserveTokenCount();
	}

	/**
	 * @dev deprecated, backward compatibility
	 */
	function getConnectorBalance(IERC20Token _connectorToken) public view returns (uint256) {
		return reserveBalance(_connectorToken);
	}

	/**
	 * @dev deprecated, backward compatibility
	 */
	function getReturn(
		IERC20Token _sourceToken,
		IERC20Token _targetToken,
		uint256 _amount
	) public view returns (uint256, uint256) {
		return targetAmountAndFee(_sourceToken, _targetToken, _amount);
	}

	/**
	 * @notice The feesController calls this function to withdraw fees
	 * from sources: protocolFeeTokensHeld.
	 * The fees will be converted to wRBTC
	 *
	 * @param receiver address which will received the protocol fee (would be feesController/feeSharingProxy)
	 *
	 * @return The withdrawn total amount in wRBTC
	 * */
	function withdrawFees(address receiver) external returns (uint256) {
		// We got stack too deep issues here, so utilize struct here is one of the solution.
		Settings memory settings = Settings({
			wrbtcAddress: getWrbtcAddressFromSwapSettings(),
			sovTokenAddress: getSOVTokenAddressFromSwapSettings(),
			feesController: getFeesControllerFromSwapSettings()
		});

		require(msg.sender == settings.feesController, "unauthorized");

		IERC20Token _token;
		uint256 _tokenAmount;
		IInternalSovrynSwapNetwork sovrynSwapNetwork = IInternalSovrynSwapNetwork(addressOf(SOVRYNSWAP_NETWORK));

		for (uint256 i = 0; i < reserveTokens.length; i++) {
			uint256 amountConvertedToWRBTC;
			uint256 tempAmountConvertedToWRBTC;

			_token = IERC20Token(reserveTokens[i]);
			_tokenAmount = protocolFeeTokensHeld[address(_token)];
			if(_tokenAmount <= 0) continue;

			protocolFeeTokensHeld[address(_token)] = 0;

			if (_token == settings.sovTokenAddress) {
				_token.approve(settings.feesController, _tokenAmount);
				IFeeSharingProxy(settings.feesController).transferTokens(settings.sovTokenAddress, uint96(_tokenAmount));
				tempAmountConvertedToWRBTC = 0;
			} else {
				if (_token == settings.wrbtcAddress) {
					tempAmountConvertedToWRBTC = _tokenAmount;
				} else {
					bool successOfApprove = _token.approve(addressOf(SOVRYNSWAP_NETWORK), _tokenAmount);
					require(successOfApprove, "ERR_APPROVAL_FAILED");

					IERC20Token[] memory path = sovrynSwapNetwork.conversionPath(_token, IERC20Token(settings.wrbtcAddress));

					tempAmountConvertedToWRBTC = sovrynSwapNetwork.convert(
						path,
						_tokenAmount,
						1
					);
				}

				amountConvertedToWRBTC = amountConvertedToWRBTC.add(tempAmountConvertedToWRBTC);	

			}

			emit WithdrawFees(msg.sender, receiver, _token, _tokenAmount, tempAmountConvertedToWRBTC);
		}

		safeTransfer(IERC20Token(settings.wrbtcAddress), receiver, amountConvertedToWRBTC);

		return amountConvertedToWRBTC;
	}
}

interface IInternalSovrynSwapNetwork {
	function conversionPath(
		IERC20Token _sourceToken,
		IERC20Token _targetToken
	) external view returns (IERC20Token[] memory);

	function rateByPath(
		IERC20Token[] _path,
		uint256 _amount
	) external view returns (uint256);

	function convert(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn
	) external payable returns (uint256);
}

interface ISwapSettings {
	function protocolFee() external view returns (uint256);

	function wrbtcAddress() external view returns (address);

	function sovTokenAddress() external view returns (address);

	function feesController() external view returns (address);
}

interface IFeeSharingProxy {
	function transferTokens(address _token, uint96 _amount) external;
}
