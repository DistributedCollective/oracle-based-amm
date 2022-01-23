# ILegacyConverter.sol

View Source: [contracts/SovrynSwapNetwork.sol](../contracts/SovrynSwapNetwork.sol)

**↗ Extends: [ISovrynSwapNetwork](ISovrynSwapNetwork.md), [TokenHolder](TokenHolder.md), [ContractRegistryClient](ContractRegistryClient.md), [ReentrancyGuard](ReentrancyGuard.md)**

**ILegacyConverter**

## Constructor

initializes a new SovrynSwapNetwork instance
	 *

```js
constructor(IContractRegistry _registry) public
```

**Arguments**

## Structs
### ConversionStep

```js
struct ConversionStep {
 contract IConverter converter,
 contract IConverterAnchor anchor,
 contract IERC20Token sourceToken,
 contract IERC20Token targetToken,
 address beneficiary,
 bool isV28OrHigherConverter,
 bool processAffiliateFee
}
```

## Contract Members
**Constants & Variables**

```js
//private members
uint256 private constant CONVERSION_FEE_RESOLUTION;
uint256 private constant AFFILIATE_FEE_RESOLUTION;
address private constant ETH_RESERVE_ADDRESS;
bytes4 private constant GET_RETURN_FUNC_SELECTOR;
bytes4 private constant IS_V28_OR_HIGHER_FUNC_SELECTOR;

//public members
uint256 public maxAffiliateFee;
mapping(address => bool) public etherTokens;

```

**Events**

```js
event Conversion(address indexed _smartToken, address indexed _fromToken, address indexed _toToken, uint256  _fromAmount, uint256  _toAmount, address  _trader);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _registry | IContractRegistry | address of a contract registry contract | 

## Functions

- [change(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, uint256 _minReturn)](#change)
- [setMaxAffiliateFee(uint256 _maxAffiliateFee)](#setmaxaffiliatefee)
- [registerEtherToken(IEtherToken _token, bool _register)](#registerethertoken)
- [conversionPath(IERC20Token _sourceToken, IERC20Token _targetToken)](#conversionpath)
- [rateByPath(IERC20Token[] _path, uint256 _amount)](#ratebypath)
- [convertByPath(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee)](#convertbypath)
- [xConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, bytes32 _targetBlockchain, bytes32 _targetAccount, uint256 _conversionId)](#xconvert)
- [xConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, bytes32 _targetBlockchain, bytes32 _targetAccount, uint256 _conversionId, address _affiliateAccount, uint256 _affiliateFee)](#xconvert2)
- [completeXConversion(IERC20Token[] _path, ISovrynSwapX _sovrynSwapX, uint256 _conversionId, uint256 _minReturn, address _beneficiary)](#completexconversion)
- [doConversion(struct SovrynSwapNetwork.ConversionStep[] _data, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee)](#doconversion)
- [handleSourceToken(IERC20Token _sourceToken, IConverterAnchor _anchor, uint256 _amount)](#handlesourcetoken)
- [handleTargetToken(struct SovrynSwapNetwork.ConversionStep[] _data, uint256 _amount, address _beneficiary)](#handletargettoken)
- [createConversionData(IERC20Token[] _conversionPath, address _beneficiary, bool _affiliateFeeEnabled)](#createconversiondata)
- [ensureAllowance(IERC20Token _token, address _spender, uint256 _value)](#ensureallowance)
- [getConverterEtherTokenAddress(IConverter _converter)](#getconverterethertokenaddress)
- [getConverterTokenAddress(IConverter _converter, IERC20Token _token)](#getconvertertokenaddress)
- [getReturn(address _dest, address _sourceToken, address _targetToken, uint256 _amount)](#getreturn)
- [isV28OrHigherConverter(IConverter _converter)](#isv28orhigherconverter)
- [getReturnByPath(IERC20Token[] _path, uint256 _amount)](#getreturnbypath)
- [convert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn)](#convert)
- [convert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee)](#convert2)
- [convertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary)](#convertfor)
- [convertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee)](#convertfor2)
- [claimAndConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn)](#claimandconvert)
- [claimAndConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee)](#claimandconvert2)
- [claimAndConvertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary)](#claimandconvertfor)
- [claimAndConvertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee)](#claimandconvertfor2)

### change

```js
function change(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, uint256 _minReturn) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token |  | 
| _targetToken | IERC20Token |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

### setMaxAffiliateFee

allows the owner to update the maximum affiliate-fee
	 *

```js
function setMaxAffiliateFee(uint256 _maxAffiliateFee) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _maxAffiliateFee | uint256 | maximum affiliate-fee | 

### registerEtherToken

allows the owner to register/unregister ether tokens
	 *

```js
function registerEtherToken(IEtherToken _token, bool _register) public nonpayable ownerOnly validAddress notThis 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IEtherToken | ether token contract address | 
| _register | bool | true to register, false to unregister | 

### conversionPath

⤿ Overridden Implementation(s): [SovrynSwapNetworkMockup.conversionPath](SovrynSwapNetworkMockup.md#conversionpath)

returns the conversion path between two tokens in the network
note that this method is quite expensive in terms of gas and should generally be called off-chain
	 *

```js
function conversionPath(IERC20Token _sourceToken, IERC20Token _targetToken) public view
returns(address[])
```

**Returns**

conversion path between the two tokens

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source token address | 
| _targetToken | IERC20Token | target token address
	 * | 

### rateByPath

⤿ Overridden Implementation(s): [SovrynSwapNetworkMockup.rateByPath](SovrynSwapNetworkMockup.md#ratebypath)

returns the expected target amount of converting a given amount on a given path
note that there is no support for circular paths
	 *

```js
function rateByPath(IERC20Token[] _path, uint256 _amount) public view
returns(uint256)
```

**Returns**

expected target amount

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path (see conversion path format above) | 
| _amount | uint256 | amount of _path[0] tokens received from the sender
	 * | 

### convertByPath

converts the token to any other token in the sovrynSwap network by following
a predefined conversion path and transfers the result tokens to a target account
affiliate account/fee can also be passed in to receive a conversion fee (on top of the liquidity provider fees)
note that the network should already have been given allowance of the source token (if not ETH)
	 *

```js
function convertByPath(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee) public payable protected greaterThanZero 
returns(uint256)
```

**Returns**

amount of tokens received from the conversion

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path, see conversion path format above | 
| _amount | uint256 | amount to convert from, in the source token | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero | 
| _beneficiary | address | account that will receive the conversion result or 0x0 to send the result to the sender account | 
| _affiliateAccount | address | wallet address to receive the affiliate fee or 0x0 to disable affiliate fee | 
| _affiliateFee | uint256 | affiliate fee in PPM or 0 to disable affiliate fee
	 * | 

### xConvert

converts any other token to BNT in the sovrynSwap network by following
a predefined conversion path and transfers the result to an account on a different blockchain
note that the network should already have been given allowance of the source token (if not ETH)
      *

```js
function xConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, bytes32 _targetBlockchain, bytes32 _targetAccount, uint256 _conversionId) public payable
returns(uint256)
```

**Returns**

the amount of BNT received from this conversion

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path, see conversion path format above | 
| _amount | uint256 | amount to convert from, in the source token | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero | 
| _targetBlockchain | bytes32 | blockchain BNT will be issued on | 
| _targetAccount | bytes32 | address/account on the target blockchain to send the BNT to | 
| _conversionId | uint256 | pre-determined unique (if non zero) id which refers to this transaction
      * | 

### xConvert2

converts any other token to BNT in the sovrynSwap network by following
a predefined conversion path and transfers the result to an account on a different blockchain
note that the network should already have been given allowance of the source token (if not ETH)
      *

```js
function xConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, bytes32 _targetBlockchain, bytes32 _targetAccount, uint256 _conversionId, address _affiliateAccount, uint256 _affiliateFee) public payable greaterThanZero 
returns(uint256)
```

**Returns**

the amount of BNT received from this conversion

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path, see conversion path format above | 
| _amount | uint256 | amount to convert from, in the source token | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero | 
| _targetBlockchain | bytes32 | blockchain BNT will be issued on | 
| _targetAccount | bytes32 | address/account on the target blockchain to send the BNT to | 
| _conversionId | uint256 | pre-determined unique (if non zero) id which refers to this transaction | 
| _affiliateAccount | address | affiliate account | 
| _affiliateFee | uint256 | affiliate fee in PPM
      * | 

### completeXConversion

allows a user to convert a token that was sent from another blockchain into any other
token on the SovrynSwapNetwork
ideally this transaction is created before the previous conversion is even complete, so
so the input amount isn't known at that point - the amount is actually take from the
SovrynSwapX contract directly by specifying the conversion id
	 *

```js
function completeXConversion(IERC20Token[] _path, ISovrynSwapX _sovrynSwapX, uint256 _conversionId, uint256 _minReturn, address _beneficiary) public nonpayable
returns(uint256)
```

**Returns**

amount of tokens received from the conversion

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path | 
| _sovrynSwapX | ISovrynSwapX | address of the SovrynSwapX contract for the source token | 
| _conversionId | uint256 | pre-determined unique (if non zero) id which refers to this conversion | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be nonzero | 
| _beneficiary | address | wallet to receive the conversion result
	 * | 

### doConversion

executes the actual conversion by following the conversion path
	 *

```js
function doConversion(struct SovrynSwapNetwork.ConversionStep[] _data, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee) private nonpayable
returns(uint256)
```

**Returns**

amount of tokens received from the conversion

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _data | struct SovrynSwapNetwork.ConversionStep[] | conversion data, see ConversionStep struct above | 
| _amount | uint256 | amount to convert from, in the source token | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero | 
| _affiliateAccount | address | affiliate account | 
| _affiliateFee | uint256 | affiliate fee in PPM
	 * | 

### handleSourceToken

validates msg.value and prepares the conversion source token for the conversion
	 *

```js
function handleSourceToken(IERC20Token _sourceToken, IConverterAnchor _anchor, uint256 _amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source token of the first conversion step | 
| _anchor | IConverterAnchor | converter anchor of the first conversion step | 
| _amount | uint256 | amount to convert from, in the source token | 

### handleTargetToken

handles the conversion target token if the network still holds it at the end of the conversion
	 *

```js
function handleTargetToken(struct SovrynSwapNetwork.ConversionStep[] _data, uint256 _amount, address _beneficiary) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _data | struct SovrynSwapNetwork.ConversionStep[] | conversion data, see ConversionStep struct above | 
| _amount | uint256 | conversion target amount | 
| _beneficiary | address | wallet to receive the conversion result | 

### createConversionData

creates a memory cache of all conversion steps data to minimize logic and external calls during conversions
	 *

```js
function createConversionData(IERC20Token[] _conversionPath, address _beneficiary, bool _affiliateFeeEnabled) private view
returns(struct SovrynSwapNetwork.ConversionStep[])
```

**Returns**

cached conversion data to be ingested later on by the conversion flow

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _conversionPath | IERC20Token[] | conversion path, see conversion path format above | 
| _beneficiary | address | wallet to receive the conversion result | 
| _affiliateFeeEnabled | bool | true if affiliate fee was requested by the sender, false if not
	 * | 

### ensureAllowance

utility, checks whether allowance for the given spender exists and approves one if it doesn't.
Note that we use the non standard erc-20 interface in which `approve` has no return value so that
this function will work for both standard and non standard tokens
	 *

```js
function ensureAllowance(IERC20Token _token, address _spender, uint256 _value) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | token to check the allowance in | 
| _spender | address | approved address | 
| _value | uint256 | allowance amount | 

### getConverterEtherTokenAddress

⤿ Overridden Implementation(s): [LiquidityPoolV1Converter.acceptAnchorOwnership](LiquidityPoolV1Converter.md#acceptanchorownership),[LiquidityPoolV1ConverterMultiAsset.acceptAnchorOwnership](LiquidityPoolV1ConverterMultiAsset.md#acceptanchorownership)

```js
function getConverterEtherTokenAddress(IConverter _converter) private view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 

### getConverterTokenAddress

```js
function getConverterTokenAddress(IConverter _converter, IERC20Token _token) private view
returns(contract IERC20Token)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 
| _token | IERC20Token |  | 

### getReturn

```js
function getReturn(address _dest, address _sourceToken, address _targetToken, uint256 _amount) internal view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _dest | address |  | 
| _sourceToken | address |  | 
| _targetToken | address |  | 
| _amount | uint256 |  | 

### isV28OrHigherConverter

```js
function isV28OrHigherConverter(IConverter _converter) internal view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 

### getReturnByPath

deprecated, backward compatibility

```js
function getReturnByPath(IERC20Token[] _path, uint256 _amount) public view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 

### convert

⤾ overrides [ISovrynSwapNetwork.convert](ISovrynSwapNetwork.md#convert)

⤿ Overridden Implementation(s): [SovrynSwapNetworkMockup.convert](SovrynSwapNetworkMockup.md#convert)

deprecated, backward compatibility

```js
function convert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

### convert2

⤾ overrides [ISovrynSwapNetwork.convert2](ISovrynSwapNetwork.md#convert2)

deprecated, backward compatibility

```js
function convert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

### convertFor

⤾ overrides [ISovrynSwapNetwork.convertFor](ISovrynSwapNetwork.md#convertfor)

deprecated, backward compatibility

```js
function convertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _beneficiary | address |  | 

### convertFor2

⤾ overrides [ISovrynSwapNetwork.convertFor2](ISovrynSwapNetwork.md#convertfor2)

deprecated, backward compatibility

```js
function convertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee) public payable greaterThanZero 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _beneficiary | address |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

### claimAndConvert

⤾ overrides [ISovrynSwapNetwork.claimAndConvert](ISovrynSwapNetwork.md#claimandconvert)

deprecated, backward compatibility

```js
function claimAndConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

### claimAndConvert2

⤾ overrides [ISovrynSwapNetwork.claimAndConvert2](ISovrynSwapNetwork.md#claimandconvert2)

deprecated, backward compatibility

```js
function claimAndConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

### claimAndConvertFor

⤾ overrides [ISovrynSwapNetwork.claimAndConvertFor](ISovrynSwapNetwork.md#claimandconvertfor)

deprecated, backward compatibility

```js
function claimAndConvertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _beneficiary | address |  | 

### claimAndConvertFor2

⤾ overrides [ISovrynSwapNetwork.claimAndConvertFor2](ISovrynSwapNetwork.md#claimandconvertfor2)

deprecated, backward compatibility

```js
function claimAndConvertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _beneficiary | address |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

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
