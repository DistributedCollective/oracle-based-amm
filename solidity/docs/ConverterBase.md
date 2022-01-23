# ConverterBase.sol

View Source: [contracts/converter/ConverterBase.sol](../contracts/converter/ConverterBase.sol)

**↗ Extends: [IConverter](IConverter.md), [TokenHandler](TokenHandler.md), [TokenHolder](TokenHolder.md), [ContractRegistryClient](ContractRegistryClient.md), [ReentrancyGuard](ReentrancyGuard.md)**
**↘ Derived Contracts: [LiquidityPoolConverter](LiquidityPoolConverter.md), [LiquidTokenConverter](LiquidTokenConverter.md)**

**ConverterBase**

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
- [()](#)
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

### _active

```js
function _active() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _inactive

```js
function _inactive() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _validReserve

```js
function _validReserve(IERC20Token _address) internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | IERC20Token |  | 

### _validConversionFee

```js
function _validConversionFee(uint32 _conversionFee) internal pure
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _conversionFee | uint32 |  | 

### _validReserveWeight

```js
function _validReserveWeight(uint32 _weight) internal pure
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _weight | uint32 |  | 

### 

undefined

deposits ether
can only be called if the converter has an ETH reserve

```js
function () external payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### withdrawETH

undefined

withdraws ether
can only be called by the owner if the converter is inactive or by upgrader contract
can only be called after the upgrader contract has accepted the ownership of this contract
can only be called if the converter has an ETH reserve
	 *

```js
function withdrawETH(address _to) public nonpayable protected ownerOnly validReserve 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | address to send the ETH to | 

### isV28OrHigher

checks whether or not the converter version is 28 or higher
	 *

```js
function isV28OrHigher() public pure
returns(bool)
```

**Returns**

true, since the converter version is 28 or higher

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### setConversionWhitelist

undefined

allows the owner to update & enable the conversion whitelist contract address
when set, only addresses that are whitelisted are actually allowed to use the converter
note that the whitelist check is actually done by the SovrynSwapNetwork contract
	 *

```js
function setConversionWhitelist(IWhitelist _whitelist) public nonpayable ownerOnly notThis 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _whitelist | IWhitelist | address of a whitelist contract | 

### isActive

undefined

⤿ Overridden Implementation(s): [LiquidityPoolV2Converter.isActive](LiquidityPoolV2Converter.md#isactive)

returns true if the converter is active, false otherwise
	 *

```js
function isActive() public view
returns(bool)
```

**Returns**

true if the converter is active, false otherwise

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### transferAnchorOwnership

undefined

transfers the anchor ownership
the new owner needs to accept the transfer
can only be called by the converter upgrder while the upgrader is the owner
note that prior to version 28, you should use 'transferAnchorOwnership' instead
	 *

```js
function transferAnchorOwnership(address _newOwner) public nonpayable ownerOnly only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _newOwner | address | new token owner | 

### acceptAnchorOwnership

undefined

⤿ Overridden Implementation(s): [LiquidityPoolConverter.acceptAnchorOwnership](LiquidityPoolConverter.md#acceptanchorownership),[LiquidityPoolV1Converter.acceptAnchorOwnership](LiquidityPoolV1Converter.md#acceptanchorownership),[LiquidityPoolV1ConverterMultiAsset.acceptAnchorOwnership](LiquidityPoolV1ConverterMultiAsset.md#acceptanchorownership),[LiquidTokenConverter.acceptAnchorOwnership](LiquidTokenConverter.md#acceptanchorownership)

accepts ownership of the anchor after an ownership transfer
most converters are also activated as soon as they accept the anchor ownership
can only be called by the contract owner
note that prior to version 28, you should use 'acceptTokenOwnership' instead

```js
function acceptAnchorOwnership() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### withdrawFromAnchor

withdraws tokens held by the anchor and sends them to an account
can only be called by the owner
	 *

```js
function withdrawFromAnchor(IERC20Token _token, address _to, uint256 _amount) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | ERC20 token contract address | 
| _to | address | ken   ERC20 token contract address | 
| _amount | uint256 | amount to withdraw | 

### setConversionFee

undefined

updates the current conversion fee
can only be called by the contract owner
	 *

```js
function setConversionFee(uint32 _conversionFee) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _conversionFee | uint32 | new conversion fee, represented in ppm | 

### withdrawTokens

undefined

withdraws tokens held by the converter and sends them to an account
can only be called by the owner
note that reserve tokens can only be withdrawn by the owner while the converter is inactive
unless the owner is the converter upgrader contract
	 *

```js
function withdrawTokens(IERC20Token _token, address _to, uint256 _amount) public nonpayable protected ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | ERC20 token contract address | 
| _to | address | ken   ERC20 token contract address | 
| _amount | uint256 | amount to withdraw | 

### upgrade

upgrades the converter to the latest version
can only be called by the owner
note that the owner needs to call acceptOwnership on the new converter after the upgrade

```js
function upgrade() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### reserveTokenCount

returns the number of reserve tokens defined
note that prior to version 17, you should use 'connectorTokenCount' instead
	 *

```js
function reserveTokenCount() public view
returns(uint16)
```

**Returns**

number of reserve tokens

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### addReserve

undefined

⤿ Overridden Implementation(s): [LiquidityPoolV1Converter.addReserve](LiquidityPoolV1Converter.md#addreserve),[LiquidityPoolV2Converter.addReserve](LiquidityPoolV2Converter.md#addreserve),[LiquidTokenConverter.addReserve](LiquidTokenConverter.md#addreserve)

defines a new reserve token for the converter
can only be called by the owner while the converter is inactive
	 *

```js
function addReserve(IERC20Token _token, uint32 _weight) public nonpayable ownerOnly inactive validAddress notThis validReserveWeight 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | address of the reserve token | 
| _weight | uint32 | reserve weight, represented in ppm, 1-1000000 | 

### reserveWeight

returns the reserve's weight
added in version 28
	 *

```js
function reserveWeight(IERC20Token _reserveToken) public view validReserve 
returns(uint32)
```

**Returns**

reserve weight

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token contract address
	 * | 

### reserveBalance

undefined

returns the reserve's balance
note that prior to version 17, you should use 'getConnectorBalance' instead
	 *

```js
function reserveBalance(IERC20Token _reserveToken) public view validReserve 
returns(uint256)
```

**Returns**

reserve balance

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token contract address
	 * | 

### hasETHReserve

checks whether or not the converter has an ETH reserve
	 *

```js
function hasETHReserve() public view
returns(bool)
```

**Returns**

true if the converter has an ETH reserve, false otherwise

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### convert

undefined

converts a specific amount of source tokens to target tokens
can only be called by the SovrynSwap network contract
	 *

```js
function convert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary) public payable protected only 
returns(uint256)
```

**Returns**

amount of tokens received (in units of the target token)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source ERC20 token | 
| _targetToken | IERC20Token | target ERC20 token | 
| _amount | uint256 | amount of tokens to convert (in units of the source token) | 
| _trader | address | address of the caller who executed the conversion | 
| _beneficiary | address | wallet to receive the conversion result
	 * | 

### doConvert

⤿ Overridden Implementation(s): [LiquidityPoolV1Converter.doConvert](LiquidityPoolV1Converter.md#doconvert),[LiquidityPoolV1ConverterMultiAsset.doConvert](LiquidityPoolV1ConverterMultiAsset.md#doconvert),[LiquidityPoolV2Converter.doConvert](LiquidityPoolV2Converter.md#doconvert),[LiquidTokenConverter.doConvert](LiquidTokenConverter.md#doconvert)

converts a specific amount of source tokens to target tokens
called by ConverterBase and allows the inherited contracts to implement custom conversion logic
	 *

```js
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary) internal nonpayable
returns(uint256)
```

**Returns**

amount of tokens received (in units of the target token)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source ERC20 token | 
| _targetToken | IERC20Token | target ERC20 token | 
| _amount | uint256 | amount of tokens to convert (in units of the source token) | 
| _trader | address | address of the caller who executed the conversion | 
| _beneficiary | address | wallet to receive the conversion result
	 * | 

### calculateFee

returns the conversion fee for a given target amount
	 *

```js
function calculateFee(uint256 _targetAmount) internal view
returns(uint256)
```

**Returns**

conversion fee

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _targetAmount | uint256 | target amount
	 * | 

### calculateProtocolFee

returns the protocol fee for a given target amount
	 *

```js
function calculateProtocolFee(address _targetToken, uint256 _targetAmount) internal nonpayable
returns(uint256)
```

**Returns**

calculated protocol fee

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _targetToken | address |  | 
| _targetAmount | uint256 | target amount
	 * | 

### getProtocolFeeFromSwapSettings

get the protocol fee from the SovrynSwapNetwork using the registry.
	 *

```js
function getProtocolFeeFromSwapSettings() internal view
returns(uint256)
```

**Returns**

protocol fee.

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getWrbtcAddressFromSwapSettings

get the wrbtc address from sovryn swap network
	 *

```js
function getWrbtcAddressFromSwapSettings() internal view
returns(address)
```

**Returns**

wrbtc address

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getSOVTokenAddressFromSwapSettings

get the sov token address from sovryn swap network
	 *

```js
function getSOVTokenAddressFromSwapSettings() internal view
returns(address)
```

**Returns**

sov token address

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getFeesControllerFromSwapSettings

get the feesController address from sovryn swap network
	 *

```js
function getFeesControllerFromSwapSettings() internal view
returns(address)
```

**Returns**

feesController address (protocol feeSharingProxy)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### syncReserveBalance

syncs the stored reserve balance for a given reserve with the real reserve balance
	 *

```js
function syncReserveBalance(IERC20Token _reserveToken) internal nonpayable validReserve 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | address of the reserve token | 

### syncReserveBalances

syncs all stored reserve balances

```js
function syncReserveBalances() internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### dispatchConversionEvent

helper, dispatches the Conversion event
	 *

```js
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

### token

undefined

deprecated since version 28, backward compatibility - use only for earlier versions

```js
function token() public view
returns(contract IConverterAnchor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### transferTokenOwnership

undefined

deprecated, backward compatibility

```js
function transferTokenOwnership(address _newOwner) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _newOwner | address |  | 

### acceptTokenOwnership

undefined

deprecated, backward compatibility

```js
function acceptTokenOwnership() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### connectors

undefined

deprecated, backward compatibility

```js
function connectors(address _address) public view
returns(uint256, uint32, bool, bool, bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 

### connectorTokens

undefined

deprecated, backward compatibility

```js
function connectorTokens(uint256 _index) public view
returns(contract IERC20Token)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

### connectorTokenCount

undefined

deprecated, backward compatibility

```js
function connectorTokenCount() public view
returns(uint16)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getConnectorBalance

undefined

deprecated, backward compatibility

```js
function getConnectorBalance(IERC20Token _connectorToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _connectorToken | IERC20Token |  | 

### getProtocolFeeTokensHeld

get how many protocol fees held in the converter.
	 *

```js
function getProtocolFeeTokensHeld(address _token) external view
returns(uint256)
```

**Returns**

total protocol fees held.

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | address | token fee.
	 * | 

### getReturn

deprecated, backward compatibility

```js
function getReturn(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) public view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token |  | 
| _targetToken | IERC20Token |  | 
| _amount | uint256 |  | 

### withdrawFees

The feesController calls this function to withdraw fees
from sources: protocolFeeTokensHeld.
The fees will be converted to wRBTC
	 *

```js
function withdrawFees(address receiver) external nonpayable
returns(uint256)
```

**Returns**

The withdrawn total amount in wRBTC

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| receiver | address | address which will received the protocol fee (would be feesController/feeSharingProxy)
	 * | 

### conversionPath

```js
function conversionPath(IERC20Token _sourceToken, IERC20Token _targetToken) external view
returns(contract IERC20Token[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token |  | 
| _targetToken | IERC20Token |  | 

### rateByPath

```js
function rateByPath(IERC20Token[] _path, uint256 _amount) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 

### convert

```js
function convert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn) external payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

### protocolFee

```js
function protocolFee() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### wrbtcAddress

```js
function wrbtcAddress() external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### sovTokenAddress

```js
function sovTokenAddress() external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### feesController

```js
function feesController() external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### transferTokens

```js
function transferTokens(address _token, uint96 _amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | address |  | 
| _amount | uint96 |  | 

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
