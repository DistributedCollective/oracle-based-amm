# ConversionPathFinder.sol

View Source: [contracts/ConversionPathFinder.sol](../contracts/ConversionPathFinder.sol)

**↗ Extends: [IConversionPathFinder](IConversionPathFinder.md), [ContractRegistryClient](ContractRegistryClient.md)**

**ConversionPathFinder**

The ConversionPathFinder contract allows generating a conversion path between any token pair in the SovrynSwap Network.
The path can then be used in various functions in the SovrynSwapNetwork contract.
 * See the SovrynSwapNetwork contract for conversion path format.

## Constructor

initializes a new ConversionPathFinder instance
	 *

```js
constructor(IContractRegistry _registry) public
```

**Arguments**

## Contract Members
**Constants & Variables**

```js
address public anchorToken;

```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _registry | IContractRegistry | address of a contract registry contract | 

## Functions

- [setAnchorToken(address _anchorToken)](#setanchortoken)
- [findPath(address _sourceToken, address _targetToken)](#findpath)
- [getPath(address _token, IConverterRegistry _converterRegistry)](#getpath)
- [getShortestPath(address[] _sourcePath, address[] _targetPath)](#getshortestpath)
- [getInitialArray(address _item)](#getinitialarray)
- [getExtendedArray(address _item0, address _item1, address[] _array)](#getextendedarray)
- [getPartialArray(address[] _array, uint256 _length)](#getpartialarray)

### setAnchorToken

updates the anchor token
	 *

```js
function setAnchorToken(address _anchorToken) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _anchorToken | address | address of the anchor token | 

### findPath

⤾ overrides [IConversionPathFinder.findPath](IConversionPathFinder.md#findpath)

generates a conversion path between a given pair of tokens in the SovrynSwap Network
	 *

```js
function findPath(address _sourceToken, address _targetToken) public view
returns(address[])
```

**Returns**

a path from the source token to the target token

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | address | address of the source token | 
| _targetToken | address | address of the target token
	 * | 

### getPath

generates a conversion path between a given token and the anchor token
	 *

```js
function getPath(address _token, IConverterRegistry _converterRegistry) private view
returns(address[])
```

**Returns**

a path from the input token to the anchor token

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | address | address of the token | 
| _converterRegistry | IConverterRegistry | address of the converter registry
	 * | 

### getShortestPath

merges two paths with a common suffix into one
	 *

```js
function getShortestPath(address[] _sourcePath, address[] _targetPath) private pure
returns(address[])
```

**Returns**

merged path

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourcePath | address[] | address of the source path | 
| _targetPath | address[] | address of the target path
	 * | 

### getInitialArray

creates a new array containing a single item
	 *

```js
function getInitialArray(address _item) private pure
returns(address[])
```

**Returns**

initial array

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _item | address | item
	 * | 

### getExtendedArray

prepends two items to the beginning of an array
	 *

```js
function getExtendedArray(address _item0, address _item1, address[] _array) private pure
returns(address[])
```

**Returns**

extended array

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _item0 | address | first item | 
| _item1 | address | second item | 
| _array | address[] | initial array
	 * | 

### getPartialArray

extracts the prefix of a given array
	 *

```js
function getPartialArray(address[] _array, uint256 _length) private pure
returns(address[])
```

**Returns**

partial array

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _array | address[] | given array | 
| _length | uint256 | prefix length
	 * | 

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
