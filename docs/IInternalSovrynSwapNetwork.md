# IInternalSovrynSwapNetwork.sol

View Source: [contracts/converter/ConverterBase.sol](../solidity/contracts/converter/ConverterBase.sol)

**↗ Extends: [IConverter](IConverter.md), [TokenHandler](TokenHandler.md), [TokenHolder](TokenHolder.md), [ContractRegistryClient](ContractRegistryClient.md), [ReentrancyGuard](ReentrancyGuard.md)**

**IInternalSovrynSwapNetwork**

ConverterBase
 * The converter contains the main logic for conversions between different ERC20 tokens.
 * It is also the upgradable part of the mechanism (note that upgrades are opt-in).
 * The anchor must be set on construction and cannot be changed afterwards.
Wrappers are provided for some of the anchor's functions, for easier access.
 * Once the converter accepts ownership of the anchor, it becomes the anchor's sole controller
and can execute any of its functions.
 * To upgrade the converter, anchor ownership must be transferred to a new converter, along with
any relevant data.
 * Note that the converter can transfer anchor ownership to a new converter that
doesn't allow upgrades anymore, for finalizing the relationship between the converter
and the anchor.
 * Converter types (defined as uint16 type) -
0 = liquid token converter
1 = liquidity pool v1 converter
2 = liquidity pool v2 converter
 * Note that converters don't currently support tokens with transfer fees.

## Constructor

used by sub-contracts to initialize a new converter
	 *

```js
constructor(IConverterAnchor _anchor) internal
```

**Arguments**

## Structs
### Reserve

```js
struct Reserve {
 uint256 balance,
 uint32 weight,
 bool deprecated1,
 bool deprecated2,
 bool isSet
}
```

### Settings

```js
struct Settings {
 address wrbtcAddress,
 address sovTokenAddress,
 address feesController
}
```

## Contract Members
**Constants & Variables**

```js
//internal members
uint32 internal constant WEIGHT_RESOLUTION;
uint32 internal constant CONVERSION_FEE_RESOLUTION;
address internal constant ETH_RESERVE_ADDRESS;
uint32 internal constant PROTOCOL_FEE_RESOLUTION;

//public members
uint16 public constant version;
contract IConverterAnchor public anchor;
contract IWhitelist public conversionWhitelist;
contract IERC20Token[] public reserveTokens;
mapping(address => struct ConverterBase.Reserve) public reserves;
uint32 public reserveRatio;
uint32 public maxConversionFee;
uint32 public conversionFee;
bool public constant conversionsEnabled;
mapping(address => uint256) public protocolFeeTokensHeld;

```

**Events**

```js
event Activation(uint16 indexed _type, IConverterAnchor indexed _anchor, bool indexed _activated);
event Conversion(address indexed _fromToken, address indexed _toToken, address indexed _trader, uint256  _amount, uint256  _return, int256  _conversionFee, int256  _protocolFee);
event TokenRateUpdate(address indexed _token1, address indexed _token2, uint256  _rateN, uint256  _rateD);
event ConversionFeeUpdate(uint32  _prevFee, uint32  _newFee);
event WithdrawFees(address indexed sender, address indexed receiver, address  token, uint256  protocolFeeAmount, uint256  wRBTCConverted);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _anchor | IConverterAnchor |  | 

## Modifiers

- [onlyOwner](#onlyowner)
- [active](#active)
- [inactive](#inactive)
- [validReserve](#validreserve)
- [validConversionFee](#validconversionfee)
- [validReserveWeight](#validreserveweight)

### onlyOwner

Throws if called by any account other than the owner.

```js
modifier onlyOwner() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### active

```js
modifier active() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### inactive

```js
modifier inactive() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### validReserve

```js
modifier validReserve(IERC20Token _address) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | IERC20Token |  | 

### validConversionFee

```js
modifier validConversionFee(uint32 _conversionFee) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _conversionFee | uint32 |  | 

### validReserveWeight

```js
modifier validReserveWeight(uint32 _weight) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _weight | uint32 |  | 

## Functions

- [_active()](#_active)
- [_inactive()](#_inactive)
- [_validReserve(IERC20Token _address)](#_validreserve)
- [_validConversionFee(uint32 _conversionFee)](#_validconversionfee)
- [_validReserveWeight(uint32 _weight)](#_validreserveweight)
- [constructor()](#constructor)
- [withdrawETH(address _to)](#withdraweth)
- [isV28OrHigher()](#isv28orhigher)
- [setConversionWhitelist(IWhitelist _whitelist)](#setconversionwhitelist)
- [isActive()](#isactive)
- [transferAnchorOwnership(address _newOwner)](#transferanchorownership)
- [acceptAnchorOwnership()](#acceptanchorownership)
- [withdrawFromAnchor(IERC20Token _token, address _to, uint256 _amount)](#withdrawfromanchor)
- [setConversionFee(uint32 _conversionFee)](#setconversionfee)
- [withdrawTokens(IERC20Token _token, address _to, uint256 _amount)](#withdrawtokens)
- [upgrade()](#upgrade)
- [reserveTokenCount()](#reservetokencount)
- [addReserve(IERC20Token _token, uint32 _weight)](#addreserve)
- [reserveWeight(IERC20Token _reserveToken)](#reserveweight)
- [reserveBalance(IERC20Token _reserveToken)](#reservebalance)
- [hasETHReserve()](#hasethreserve)
- [convert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary)](#convert)
- [doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary)](#doconvert)
- [calculateFee(uint256 _targetAmount)](#calculatefee)
- [calculateProtocolFee(address _targetToken, uint256 _targetAmount)](#calculateprotocolfee)
- [getProtocolFeeFromSwapSettings()](#getprotocolfeefromswapsettings)
- [getWrbtcAddressFromSwapSettings()](#getwrbtcaddressfromswapsettings)
- [getSOVTokenAddressFromSwapSettings()](#getsovtokenaddressfromswapsettings)
- [getFeesControllerFromSwapSettings()](#getfeescontrollerfromswapsettings)
- [syncReserveBalance(IERC20Token _reserveToken)](#syncreservebalance)
- [syncReserveBalances()](#syncreservebalances)
- [dispatchConversionEvent(IERC20Token _sourceToken, IERC20Token _targetToken, address _trader, uint256 _amount, uint256 _returnAmount, uint256 _feeAmount, uint256 _protocolFeeAmount)](#dispatchconversionevent)
- [token()](#token)
- [transferTokenOwnership(address _newOwner)](#transfertokenownership)
- [acceptTokenOwnership()](#accepttokenownership)
- [connectors(address _address)](#connectors)
- [connectorTokens(uint256 _index)](#connectortokens)
- [connectorTokenCount()](#connectortokencount)
- [getConnectorBalance(IERC20Token _connectorToken)](#getconnectorbalance)
- [getProtocolFeeTokensHeld(address _token)](#getprotocolfeetokensheld)
- [getReturn(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)](#getreturn)
- [withdrawFees(address receiver)](#withdrawfees)
- [conversionPath(IERC20Token _sourceToken, IERC20Token _targetToken)](#conversionpath)
- [rateByPath(IERC20Token[] _path, uint256 _amount)](#ratebypath)
- [convert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn)](#convert)
- [protocolFee()](#protocolfee)
- [wrbtcAddress()](#wrbtcaddress)
- [sovTokenAddress()](#sovtokenaddress)
- [feesController()](#feescontroller)
- [transferTokens(address _token, uint96 _amount)](#transfertokens)

---    

> ### _active

```solidity
function _active() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _active() internal view {
		require(isActive(), "ERR_INACTIVE");
	}
```
</details>

---    

> ### _inactive

```solidity
function _inactive() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _inactive() internal view {
		require(!isActive(), "ERR_ACTIVE");
	}
```
</details>

---    

> ### _validReserve

```solidity
function _validReserve(IERC20Token _address) internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | IERC20Token |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _validReserve(IERC20Token _address) internal view {
		require(reserves[_address].isSet, "ERR_INVALID_RESERVE");
	}
```
</details>

---    

> ### _validConversionFee

```solidity
function _validConversionFee(uint32 _conversionFee) internal pure
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _conversionFee | uint32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _validConversionFee(uint32 _conversionFee) internal pure {
		require(_conversionFee <= CONVERSION_FEE_RESOLUTION, "ERR_INVALID_CONVERSION_FEE");
	}
```
</details>

---    

> ### _validReserveWeight

```solidity
function _validReserveWeight(uint32 _weight) internal pure
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _weight | uint32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _validReserveWeight(uint32 _weight) internal pure {
		require(_weight > 0 && _weight <= WEIGHT_RESOLUTION, "ERR_INVALID_RESERVE_WEIGHT");
	}
```
</details>

---    

> ### constructor

⤾ overrides [IConverter constructor](IConverter.md#constructor)

deposits ether
can only be called if the converter has an ETH reserve

```solidity
function () external payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function() external payable {
		require(reserves[ETH_RESERVE_ADDRESS].isSet, "ERR_INVALID_RESERVE"); // require(hasETHReserve(), "ERR_INVALID_RESERVE");
		// a workaround for a problem when running solidity-coverage
		// see https://github.com/sc-forks/solidity-coverage/issues/487
	}
```
</details>

---    

> ### withdrawETH

⤾ overrides [IConverter.withdrawETH](IConverter.md#withdraweth)

withdraws ether
can only be called by the owner if the converter is inactive or by upgrader contract
can only be called after the upgrader contract has accepted the ownership of this contract
can only be called if the converter has an ETH reserve
	 *

```solidity
function withdrawETH(address _to) public nonpayable protected ownerOnly validReserve 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | address to send the ETH to | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdrawETH(address _to) public protected ownerOnly validReserve(IERC20Token(ETH_RESERVE_ADDRESS)) {
		address converterUpgrader = addressOf(CONVERTER_UPGRADER);

		// verify that the converter is inactive or that the owner is the upgrader contract
		require(!isActive() || owner == converterUpgrader, "ERR_ACCESS_DENIED");
		_to.transfer(address(this).balance);

		// sync the ETH reserve balance
		syncReserveBalance(IERC20Token(ETH_RESERVE_ADDRESS));
	}
```
</details>

---    

> ### isV28OrHigher

checks whether or not the converter version is 28 or higher
	 *

```solidity
function isV28OrHigher() public pure
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isV28OrHigher() public pure returns (bool) {
		return true;
	}
```
</details>

---    

> ### setConversionWhitelist

⤾ overrides [IConverter.setConversionWhitelist](IConverter.md#setconversionwhitelist)

allows the owner to update & enable the conversion whitelist contract address
when set, only addresses that are whitelisted are actually allowed to use the converter
note that the whitelist check is actually done by the SovrynSwapNetwork contract
	 *

```solidity
function setConversionWhitelist(IWhitelist _whitelist) public nonpayable ownerOnly notThis 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _whitelist | IWhitelist | address of a whitelist contract | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setConversionWhitelist(IWhitelist _whitelist) public ownerOnly notThis(_whitelist) {
		conversionWhitelist = _whitelist;
	}
```
</details>

---    

> ### isActive

⤾ overrides [IConverter.isActive](IConverter.md#isactive)

⤿ Overridden Implementation(s): [LiquidityPoolV2Converter.isActive](LiquidityPoolV2Converter.md#isactive)

returns true if the converter is active, false otherwise
	 *

```solidity
function isActive() public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isActive() public view returns (bool) {
		return anchor.owner() == address(this);
	}
```
</details>

---    

> ### transferAnchorOwnership

⤾ overrides [IConverter.transferAnchorOwnership](IConverter.md#transferanchorownership)

transfers the anchor ownership
the new owner needs to accept the transfer
can only be called by the converter upgrder while the upgrader is the owner
note that prior to version 28, you should use 'transferAnchorOwnership' instead
	 *

```solidity
function transferAnchorOwnership(address _newOwner) public nonpayable ownerOnly only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _newOwner | address | new token owner | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferAnchorOwnership(address _newOwner) public ownerOnly only(CONVERTER_UPGRADER) {
		anchor.transferOwnership(_newOwner);
	}
```
</details>

---    

> ### acceptAnchorOwnership

⤾ overrides [IConverter.acceptAnchorOwnership](IConverter.md#acceptanchorownership)

⤿ Overridden Implementation(s): [LiquidityPoolConverter.acceptAnchorOwnership](LiquidityPoolConverter.md#acceptanchorownership),[LiquidityPoolV1Converter.acceptAnchorOwnership](LiquidityPoolV1Converter.md#acceptanchorownership),[LiquidityPoolV1ConverterMultiAsset.acceptAnchorOwnership](LiquidityPoolV1ConverterMultiAsset.md#acceptanchorownership),[LiquidTokenConverter.acceptAnchorOwnership](LiquidTokenConverter.md#acceptanchorownership)

accepts ownership of the anchor after an ownership transfer
most converters are also activated as soon as they accept the anchor ownership
can only be called by the contract owner
note that prior to version 28, you should use 'acceptTokenOwnership' instead

```solidity
function acceptAnchorOwnership() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function acceptAnchorOwnership() public ownerOnly {
		// verify the the converter has at least one reserve
		require(reserveTokenCount() > 0, "ERR_INVALID_RESERVE_COUNT");
		anchor.acceptOwnership();
		syncReserveBalances();
	}
```
</details>

---    

> ### withdrawFromAnchor

withdraws tokens held by the anchor and sends them to an account
can only be called by the owner
	 *

```solidity
function withdrawFromAnchor(IERC20Token _token, address _to, uint256 _amount) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | ERC20 token contract address | 
| _to | address | ken   ERC20 token contract address | 
| _amount | uint256 | amount to withdraw | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdrawFromAnchor(
		IERC20Token _token,
		address _to,
		uint256 _amount
	) public ownerOnly {
		anchor.withdrawTokens(_token, _to, _amount);
	}
```
</details>

---    

> ### setConversionFee

⤾ overrides [IConverter.setConversionFee](IConverter.md#setconversionfee)

updates the current conversion fee
can only be called by the contract owner
	 *

```solidity
function setConversionFee(uint32 _conversionFee) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _conversionFee | uint32 | new conversion fee, represented in ppm | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setConversionFee(uint32 _conversionFee) public ownerOnly {
		require(_conversionFee <= maxConversionFee, "ERR_INVALID_CONVERSION_FEE");
		emit ConversionFeeUpdate(conversionFee, _conversionFee);
		conversionFee = _conversionFee;
	}
```
</details>

---    

> ### withdrawTokens

⤾ overrides [TokenHolder.withdrawTokens](TokenHolder.md#withdrawtokens)

withdraws tokens held by the converter and sends them to an account
can only be called by the owner
note that reserve tokens can only be withdrawn by the owner while the converter is inactive
unless the owner is the converter upgrader contract
	 *

```solidity
function withdrawTokens(IERC20Token _token, address _to, uint256 _amount) public nonpayable protected ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | ERC20 token contract address | 
| _to | address | ken   ERC20 token contract address | 
| _amount | uint256 | amount to withdraw | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

---    

> ### upgrade

upgrades the converter to the latest version
can only be called by the owner
note that the owner needs to call acceptOwnership on the new converter after the upgrade

```solidity
function upgrade() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgrade() public ownerOnly {
		IConverterUpgrader converterUpgrader = IConverterUpgrader(addressOf(CONVERTER_UPGRADER));

		// trigger de-activation event
		emit Activation(converterType(), anchor, false);

		transferOwnership(converterUpgrader);
		converterUpgrader.upgrade(version);
		acceptOwnership();
	}
```
</details>

---    

> ### reserveTokenCount

returns the number of reserve tokens defined
note that prior to version 17, you should use 'connectorTokenCount' instead
	 *

```solidity
function reserveTokenCount() public view
returns(uint16)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reserveTokenCount() public view returns (uint16) {
		return uint16(reserveTokens.length);
	}
```
</details>

---    

> ### addReserve

⤾ overrides [IConverter.addReserve](IConverter.md#addreserve)

⤿ Overridden Implementation(s): [LiquidityPoolV1Converter.addReserve](LiquidityPoolV1Converter.md#addreserve),[LiquidityPoolV2Converter.addReserve](LiquidityPoolV2Converter.md#addreserve),[LiquidTokenConverter.addReserve](LiquidTokenConverter.md#addreserve)

defines a new reserve token for the converter
can only be called by the owner while the converter is inactive
	 *

```solidity
function addReserve(IERC20Token _token, uint32 _weight) public nonpayable ownerOnly inactive validAddress notThis validReserveWeight 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | address of the reserve token | 
| _weight | uint32 | reserve weight, represented in ppm, 1-1000000 | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

---    

> ### reserveWeight

returns the reserve's weight
added in version 28
	 *

```solidity
function reserveWeight(IERC20Token _reserveToken) public view validReserve 
returns(uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token contract address 	 * | 

**Returns**

reserve weight

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reserveWeight(IERC20Token _reserveToken) public view validReserve(_reserveToken) returns (uint32) {
		return reserves[_reserveToken].weight;
	}
```
</details>

---    

> ### reserveBalance

⤾ overrides [IConverter.reserveBalance](IConverter.md#reservebalance)

returns the reserve's balance
note that prior to version 17, you should use 'getConnectorBalance' instead
	 *

```solidity
function reserveBalance(IERC20Token _reserveToken) public view validReserve 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token contract address 	 * | 

**Returns**

reserve balance

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reserveBalance(IERC20Token _reserveToken) public view validReserve(_reserveToken) returns (uint256) {
		return reserves[_reserveToken].balance;
	}
```
</details>

---    

> ### hasETHReserve

checks whether or not the converter has an ETH reserve
	 *

```solidity
function hasETHReserve() public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function hasETHReserve() public view returns (bool) {
		return reserves[ETH_RESERVE_ADDRESS].isSet;
	}
```
</details>

---    

> ### convert

⤾ overrides [IConverter.convert](IConverter.md#convert)

converts a specific amount of source tokens to target tokens
can only be called by the SovrynSwap network contract
	 *

```solidity
function convert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary) public payable protected only 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source ERC20 token | 
| _targetToken | IERC20Token | target ERC20 token | 
| _amount | uint256 | amount of tokens to convert (in units of the source token) | 
| _trader | address | address of the caller who executed the conversion | 
| _beneficiary | address | wallet to receive the conversion result 	 * | 

**Returns**

amount of tokens received (in units of the target token)

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

---    

> ### doConvert

⤿ Overridden Implementation(s): [LiquidityPoolV1Converter.doConvert](LiquidityPoolV1Converter.md#doconvert),[LiquidityPoolV1ConverterMultiAsset.doConvert](LiquidityPoolV1ConverterMultiAsset.md#doconvert),[LiquidityPoolV2Converter.doConvert](LiquidityPoolV2Converter.md#doconvert),[LiquidTokenConverter.doConvert](LiquidTokenConverter.md#doconvert)

converts a specific amount of source tokens to target tokens
called by ConverterBase and allows the inherited contracts to implement custom conversion logic
	 *

```solidity
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary) internal nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source ERC20 token | 
| _targetToken | IERC20Token | target ERC20 token | 
| _amount | uint256 | amount of tokens to convert (in units of the source token) | 
| _trader | address | address of the caller who executed the conversion | 
| _beneficiary | address | wallet to receive the conversion result 	 * | 

**Returns**

amount of tokens received (in units of the target token)

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function doConvert(
		IERC20Token _sourceToken,
		IERC20Token _targetToken,
		uint256 _amount,
		address _trader,
		address _beneficiary
	) internal returns (uint256);
```
</details>

---    

> ### calculateFee

returns the conversion fee for a given target amount
	 *

```solidity
function calculateFee(uint256 _targetAmount) internal view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _targetAmount | uint256 | target amount 	 * | 

**Returns**

conversion fee

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateFee(uint256 _targetAmount) internal view returns (uint256) {
		return _targetAmount.mul(conversionFee).div(CONVERSION_FEE_RESOLUTION);
	}
```
</details>

---    

> ### calculateProtocolFee

returns the protocol fee for a given target amount
	 *

```solidity
function calculateProtocolFee(address _targetToken, uint256 _targetAmount) internal nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _targetToken | address |  | 
| _targetAmount | uint256 | target amount 	 * | 

**Returns**

calculated protocol fee

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateProtocolFee(address _targetToken, uint256 _targetAmount) internal returns (uint256) {
		uint256 _protocolFee = getProtocolFeeFromSwapSettings();
		uint256 calculatedProtocolFee = _targetAmount.mul(_protocolFee).div(PROTOCOL_FEE_RESOLUTION);
		protocolFeeTokensHeld[_targetToken] = protocolFeeTokensHeld[_targetToken].add(calculatedProtocolFee);
		return calculatedProtocolFee;
	}
```
</details>

---    

> ### getProtocolFeeFromSwapSettings

get the protocol fee from the SovrynSwapNetwork using the registry.
	 *

```solidity
function getProtocolFeeFromSwapSettings() internal view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProtocolFeeFromSwapSettings() internal view returns (uint256) {
		return ISwapSettings(IContractRegistry(registry).addressOf(bytes32("SwapSettings"))).protocolFee();
	}
```
</details>

---    

> ### getWrbtcAddressFromSwapSettings

get the wrbtc address from sovryn swap network
	 *

```solidity
function getWrbtcAddressFromSwapSettings() internal view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getWrbtcAddressFromSwapSettings() internal view returns (address) {
		return ISwapSettings(IContractRegistry(registry).addressOf(bytes32("SwapSettings"))).wrbtcAddress();
	}
```
</details>

---    

> ### getSOVTokenAddressFromSwapSettings

get the sov token address from sovryn swap network
	 *

```solidity
function getSOVTokenAddressFromSwapSettings() internal view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSOVTokenAddressFromSwapSettings() internal view returns (address) {
		return ISwapSettings(IContractRegistry(registry).addressOf(bytes32("SwapSettings"))).sovTokenAddress();
	}
```
</details>

---    

> ### getFeesControllerFromSwapSettings

get the feesController address from sovryn swap network
	 *

```solidity
function getFeesControllerFromSwapSettings() internal view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getFeesControllerFromSwapSettings() internal view returns (address) {
		return ISwapSettings(IContractRegistry(registry).addressOf(bytes32("SwapSettings"))).feesController();
	}
```
</details>

---    

> ### syncReserveBalance

syncs the stored reserve balance for a given reserve with the real reserve balance
	 *

```solidity
function syncReserveBalance(IERC20Token _reserveToken) internal nonpayable validReserve 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | address of the reserve token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function syncReserveBalance(IERC20Token _reserveToken) internal validReserve(_reserveToken) {
		if (_reserveToken == ETH_RESERVE_ADDRESS) reserves[_reserveToken].balance = address(this).balance;
		else reserves[_reserveToken].balance = _reserveToken.balanceOf(this).sub(protocolFeeTokensHeld[_reserveToken]);
	}
```
</details>

---    

> ### syncReserveBalances

syncs all stored reserve balances

```solidity
function syncReserveBalances() internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function syncReserveBalances() internal {
		uint256 reserveCount = reserveTokens.length;
		for (uint256 i = 0; i < reserveCount; i++) syncReserveBalance(reserveTokens[i]);
	}
```
</details>

---    

> ### dispatchConversionEvent

helper, dispatches the Conversion event
	 *

```solidity
function dispatchConversionEvent(IERC20Token _sourceToken, IERC20Token _targetToken, address _trader, uint256 _amount, uint256 _returnAmount, uint256 _feeAmount, uint256 _protocolFeeAmount) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source ERC20 token | 
| _targetToken | IERC20Token | target ERC20 token | 
| _trader | address | address of the caller who executed the conversion | 
| _amount | uint256 | amount purchased/sold (in the source token) | 
| _returnAmount | uint256 | amount returned (in the target token) | 
| _feeAmount | uint256 | dedicated fee for converter | 
| _protocolFeeAmount | uint256 | dedicated fee for sovryn protocol | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

---    

> ### token

⤾ overrides [IConverter.token](IConverter.md#token)

deprecated since version 28, backward compatibility - use only for earlier versions

```solidity
function token() public view
returns(contract IConverterAnchor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function token() public view returns (IConverterAnchor) {
		return anchor;
	}
```
</details>

---    

> ### transferTokenOwnership

⤾ overrides [IConverter.transferTokenOwnership](IConverter.md#transfertokenownership)

deprecated, backward compatibility

```solidity
function transferTokenOwnership(address _newOwner) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _newOwner | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferTokenOwnership(address _newOwner) public ownerOnly {
		transferAnchorOwnership(_newOwner);
	}
```
</details>

---    

> ### acceptTokenOwnership

⤾ overrides [IConverter.acceptTokenOwnership](IConverter.md#accepttokenownership)

deprecated, backward compatibility

```solidity
function acceptTokenOwnership() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function acceptTokenOwnership() public ownerOnly {
		acceptAnchorOwnership();
	}
```
</details>

---    

> ### connectors

⤾ overrides [IConverter.connectors](IConverter.md#connectors)

deprecated, backward compatibility

```solidity
function connectors(address _address) public view
returns(uint256, uint32, bool, bool, bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
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
```
</details>

---    

> ### connectorTokens

⤾ overrides [IConverter.connectorTokens](IConverter.md#connectortokens)

deprecated, backward compatibility

```solidity
function connectorTokens(uint256 _index) public view
returns(contract IERC20Token)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function connectorTokens(uint256 _index) public view returns (IERC20Token) {
		return ConverterBase.reserveTokens[_index];
	}
```
</details>

---    

> ### connectorTokenCount

⤾ overrides [IConverter.connectorTokenCount](IConverter.md#connectortokencount)

deprecated, backward compatibility

```solidity
function connectorTokenCount() public view
returns(uint16)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function connectorTokenCount() public view returns (uint16) {
		return reserveTokenCount();
	}
```
</details>

---    

> ### getConnectorBalance

⤾ overrides [IConverter.getConnectorBalance](IConverter.md#getconnectorbalance)

deprecated, backward compatibility

```solidity
function getConnectorBalance(IERC20Token _connectorToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _connectorToken | IERC20Token |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConnectorBalance(IERC20Token _connectorToken) public view returns (uint256) {
		return reserveBalance(_connectorToken);
	}
```
</details>

---    

> ### getProtocolFeeTokensHeld

get how many protocol fees held in the converter.
	 *

```solidity
function getProtocolFeeTokensHeld(address _token) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | address | token fee. 	 * | 

**Returns**

total protocol fees held.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getProtocolFeeTokensHeld(address _token) external view returns(uint256) {
		return protocolFeeTokensHeld[_token];
	}
```
</details>

---    

> ### getReturn

deprecated, backward compatibility

```solidity
function getReturn(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) public view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token |  | 
| _targetToken | IERC20Token |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReturn(
		IERC20Token _sourceToken,
		IERC20Token _targetToken,
		uint256 _amount
	) public view returns (uint256, uint256) {
		return targetAmountAndFee(_sourceToken, _targetToken, _amount);
	}
```
</details>

---    

> ### withdrawFees

The feesController calls this function to withdraw fees
from sources: protocolFeeTokensHeld.
The fees will be converted to wRBTC
	 *

```solidity
function withdrawFees(address receiver) external nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| receiver | address | address which will received the protocol fee (would be feesController/feeSharingProxy) 	 * | 

**Returns**

The withdrawn total amount in wRBTC

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdrawFees(address receiver) external returns (uint256) {
		require(msg.sender == getFeesControllerFromSwapSettings(), "unauthorized");

		IERC20Token _token;
		uint256 _tokenAmount;
		uint256 amountConvertedToWRBTC;
		IInternalSovrynSwapNetwork sovrynSwapNetwork = IInternalSovrynSwapNetwork(addressOf(SOVRYNSWAP_NETWORK));

		for (uint256 i = 0; i < reserveTokens.length; i++) {
			uint256 tempAmountConvertedToWRBTC;

			_token = IERC20Token(reserveTokens[i]);
			_tokenAmount = protocolFeeTokensHeld[address(_token)];
			if(_tokenAmount <= 0) continue;

			protocolFeeTokensHeld[address(_token)] = 0;

			if (_token == getSOVTokenAddressFromSwapSettings()) {
				_token.approve(getFeesControllerFromSwapSettings(), _tokenAmount);
				IFeeSharingProxy(getFeesControllerFromSwapSettings()).transferTokens(getSOVTokenAddressFromSwapSettings(), uint96(_tokenAmount));
				tempAmountConvertedToWRBTC = 0;
			} else {
				if (_token == getWrbtcAddressFromSwapSettings()) {
					tempAmountConvertedToWRBTC = _tokenAmount;
				} else {
					bool successOfApprove = _token.approve(addressOf(SOVRYNSWAP_NETWORK), _tokenAmount);
					require(successOfApprove, "ERR_APPROVAL_FAILED");

					IERC20Token[] memory path = sovrynSwapNetwork.conversionPath(_token, IERC20Token(getWrbtcAddressFromSwapSettings()));

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

		safeTransfer(IERC20Token(getWrbtcAddressFromSwapSettings()), receiver, amountConvertedToWRBTC);

		return amountConvertedToWRBTC;
	}
```
</details>

---    

> ### conversionPath

```solidity
function conversionPath(IERC20Token _sourceToken, IERC20Token _targetToken) external view
returns(contract IERC20Token[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token |  | 
| _targetToken | IERC20Token |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function conversionPath(
		IERC20Token _sourceToken,
		IERC20Token _targetToken
	) external view returns (IERC20Token[] memory);
```
</details>

---    

> ### rateByPath

```solidity
function rateByPath(IERC20Token[] _path, uint256 _amount) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function rateByPath(
		IERC20Token[] _path,
		uint256 _amount
	) external view returns (uint256);
```
</details>

---    

> ### convert

```solidity
function convert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn) external payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convert(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn
	) external payable returns (uint256);
```
</details>

---    

> ### protocolFee

```solidity
function protocolFee() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function protocolFee() external view returns (uint256);
```
</details>

---    

> ### wrbtcAddress

```solidity
function wrbtcAddress() external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function wrbtcAddress() external view returns (address);
```
</details>

---    

> ### sovTokenAddress

```solidity
function sovTokenAddress() external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function sovTokenAddress() external view returns (address);
```
</details>

---    

> ### feesController

```solidity
function feesController() external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function feesController() external view returns (address);
```
</details>

---    

> ### transferTokens

```solidity
function transferTokens(address _token, uint96 _amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | address |  | 
| _amount | uint96 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferTokens(address _token, uint96 _amount) external;
```
</details>

## Contracts

* [BProOracle](BProOracle.md)
* [ChainlinkBTCToUSDOracle](ChainlinkBTCToUSDOracle.md)
* [ChainlinkETHToETHOracle](ChainlinkETHToETHOracle.md)
* [ChainlinkUSDToBTCOracle](ChainlinkUSDToBTCOracle.md)
* [ContractRegistry](ContractRegistry.md)
* [ContractRegistryClient](ContractRegistryClient.md)
* [ConversionPathFinder](ConversionPathFinder.md)
* [ConverterBase](ConverterBase.md)
* [ConverterFactory](ConverterFactory.md)
* [ConverterRegistry](ConverterRegistry.md)
* [ConverterRegistryData](ConverterRegistryData.md)
* [ConverterUpgrader](ConverterUpgrader.md)
* [ConverterV27OrLowerWithFallback](ConverterV27OrLowerWithFallback.md)
* [ConverterV27OrLowerWithoutFallback](ConverterV27OrLowerWithoutFallback.md)
* [ConverterV28OrHigherWithFallback](ConverterV28OrHigherWithFallback.md)
* [ConverterV28OrHigherWithoutFallback](ConverterV28OrHigherWithoutFallback.md)
* [ERC20Token](ERC20Token.md)
* [EtherToken](EtherToken.md)
* [FeeSharingProxyMockup](FeeSharingProxyMockup.md)
* [IConsumerPriceOracle](IConsumerPriceOracle.md)
* [IContractRegistry](IContractRegistry.md)
* [IConversionPathFinder](IConversionPathFinder.md)
* [IConverter](IConverter.md)
* [IConverterAnchor](IConverterAnchor.md)
* [IConverterFactory](IConverterFactory.md)
* [IConverterMockup](IConverterMockup.md)
* [IConverterRegistry](IConverterRegistry.md)
* [IConverterRegistryData](IConverterRegistryData.md)
* [IConverterUpgrader](IConverterUpgrader.md)
* [IERC20Token](IERC20Token.md)
* [IEtherToken](IEtherToken.md)
* [IFeeSharingProxy](IFeeSharingProxy.md)
* [IInternalSovrynSwapNetwork](IInternalSovrynSwapNetwork.md)
* [ILegacyConverter](ILegacyConverter.md)
* [ILiquidityPoolV1Converter](ILiquidityPoolV1Converter.md)
* [ILiquidityPoolV2Converter](ILiquidityPoolV2Converter.md)
* [IMoCState](IMoCState.md)
* [IOracle](IOracle.md)
* [IOwned](IOwned.md)
* [IPoolTokensContainer](IPoolTokensContainer.md)
* [IPriceOracle](IPriceOracle.md)
* [ISmartToken](ISmartToken.md)
* [ISovrynSwapFormula](ISovrynSwapFormula.md)
* [ISovrynSwapNetwork](ISovrynSwapNetwork.md)
* [ISovrynSwapX](ISovrynSwapX.md)
* [ISovrynSwapXUpgrader](ISovrynSwapXUpgrader.md)
* [ISwapSettings](ISwapSettings.md)
* [ITokenHolder](ITokenHolder.md)
* [ITypedConverterAnchorFactory](ITypedConverterAnchorFactory.md)
* [ITypedConverterCustomFactory](ITypedConverterCustomFactory.md)
* [ITypedConverterFactory](ITypedConverterFactory.md)
* [IWhitelist](IWhitelist.md)
* [LiquidityPoolConverter](LiquidityPoolConverter.md)
* [LiquidityPoolV1Converter](LiquidityPoolV1Converter.md)
* [LiquidityPoolV1ConverterFactory](LiquidityPoolV1ConverterFactory.md)
* [LiquidityPoolV1ConverterMultiAsset](LiquidityPoolV1ConverterMultiAsset.md)
* [LiquidityPoolV2Converter](LiquidityPoolV2Converter.md)
* [LiquidityPoolV2ConverterAnchorFactory](LiquidityPoolV2ConverterAnchorFactory.md)
* [LiquidityPoolV2ConverterCustomFactory](LiquidityPoolV2ConverterCustomFactory.md)
* [LiquidityPoolV2ConverterFactory](LiquidityPoolV2ConverterFactory.md)
* [LiquidTokenConverter](LiquidTokenConverter.md)
* [LiquidTokenConverterFactory](LiquidTokenConverterFactory.md)
* [Medianizer](Medianizer.md)
* [MocBTCToBTCOracle](MocBTCToBTCOracle.md)
* [MocBTCToUSDOracle](MocBTCToUSDOracle.md)
* [MoCMedianizerMock](MoCMedianizerMock.md)
* [MoCStateMock](MoCStateMock.md)
* [MocUSDToBTCOracle](MocUSDToBTCOracle.md)
* [MultiSigWallet](MultiSigWallet.md)
* [NewConverter](NewConverter.md)
* [NonStandardToken](NonStandardToken.md)
* [NonStandardTokenDetailed](NonStandardTokenDetailed.md)
* [OldConverter](OldConverter.md)
* [Oracle](Oracle.md)
* [Owned](Owned.md)
* [PoolTokensContainer](PoolTokensContainer.md)
* [PriceOracle](PriceOracle.md)
* [ReentrancyGuard](ReentrancyGuard.md)
* [SafeMath](SafeMath.md)
* [SmartToken](SmartToken.md)
* [SovrynSwapFormula](SovrynSwapFormula.md)
* [SovrynSwapNetwork](SovrynSwapNetwork.md)
* [SovrynSwapNetworkMockup](SovrynSwapNetworkMockup.md)
* [SovrynSwapX](SovrynSwapX.md)
* [SwapSettings](SwapSettings.md)
* [TestChainlinkPriceOracle](TestChainlinkPriceOracle.md)
* [TestContractRegistryClient](TestContractRegistryClient.md)
* [TestConverterFactory](TestConverterFactory.md)
* [TestConverterRegistry](TestConverterRegistry.md)
* [TestLiquidityPoolConverter](TestLiquidityPoolConverter.md)
* [TestLiquidityPoolV2Converter](TestLiquidityPoolV2Converter.md)
* [TestNonStandardToken](TestNonStandardToken.md)
* [TestNonStandardTokenWithoutDecimals](TestNonStandardTokenWithoutDecimals.md)
* [TestReentrancyGuard](TestReentrancyGuard.md)
* [TestReentrancyGuardAttacker](TestReentrancyGuardAttacker.md)
* [TestSafeMath](TestSafeMath.md)
* [TestSovrynSwapFormula](TestSovrynSwapFormula.md)
* [TestSovrynSwapNetwork](TestSovrynSwapNetwork.md)
* [TestStandardToken](TestStandardToken.md)
* [TestTokenHandler](TestTokenHandler.md)
* [TestTypedConverterAnchorFactory](TestTypedConverterAnchorFactory.md)
* [TokenHandler](TokenHandler.md)
* [TokenHolder](TokenHolder.md)
* [Utils](Utils.md)
* [Whitelist](Whitelist.md)
* [XTransferRerouter](XTransferRerouter.md)
