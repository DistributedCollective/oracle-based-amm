# ConverterRegistryData.sol

View Source: [contracts/converter/ConverterRegistryData.sol](../contracts/converter/ConverterRegistryData.sol)

**↗ Extends: [IConverterRegistryData](IConverterRegistryData.md), [ContractRegistryClient](ContractRegistryClient.md)**

**ConverterRegistryData**

The ConverterRegistryData contract is an integral part of the converter registry
as it serves as the database contract that holds all registry data.
 * The registry is separated into two different contracts for upgradability - the data contract
is harder to upgrade as it requires migrating all registry data into a new contract, while
the registry contract itself can be easily upgraded.
 * For that same reason, the data contract is simple and contains no logic beyond the basic data
access utilities that it exposes.

## Constructor

initializes a new ConverterRegistryData instance
	 *

```js
constructor(IContractRegistry _registry) public
```

**Arguments**

## Structs
### Item

```js
struct Item {
 bool valid,
 uint256 index
}
```

### Items

```js
struct Items {
 address[] array,
 mapping(address => struct ConverterRegistryData.Item) table
}
```

### List

```js
struct List {
 uint256 index,
 struct ConverterRegistryData.Items items
}
```

### Lists

```js
struct Lists {
 address[] array,
 mapping(address => struct ConverterRegistryData.List) table
}
```

## Contract Members
**Constants & Variables**

```js
struct ConverterRegistryData.Items private smartTokens;
struct ConverterRegistryData.Items private liquidityPools;
struct ConverterRegistryData.Lists private convertibleTokens;

```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _registry | IContractRegistry | address of a contract registry contract | 

## Functions

- [addSmartToken(address _smartToken)](#addsmarttoken)
- [removeSmartToken(address _smartToken)](#removesmarttoken)
- [addLiquidityPool(address _liquidityPool)](#addliquiditypool)
- [removeLiquidityPool(address _liquidityPool)](#removeliquiditypool)
- [addConvertibleToken(address _convertibleToken, address _smartToken)](#addconvertibletoken)
- [removeConvertibleToken(address _convertibleToken, address _smartToken)](#removeconvertibletoken)
- [getSmartTokenCount()](#getsmarttokencount)
- [getSmartTokens()](#getsmarttokens)
- [getSmartToken(uint256 _index)](#getsmarttoken)
- [isSmartToken(address _value)](#issmarttoken)
- [getLiquidityPoolCount()](#getliquiditypoolcount)
- [getLiquidityPools()](#getliquiditypools)
- [getLiquidityPool(uint256 _index)](#getliquiditypool)
- [isLiquidityPool(address _value)](#isliquiditypool)
- [getConvertibleTokenCount()](#getconvertibletokencount)
- [getConvertibleTokens()](#getconvertibletokens)
- [getConvertibleToken(uint256 _index)](#getconvertibletoken)
- [isConvertibleToken(address _value)](#isconvertibletoken)
- [getConvertibleTokenSmartTokenCount(address _convertibleToken)](#getconvertibletokensmarttokencount)
- [getConvertibleTokenSmartTokens(address _convertibleToken)](#getconvertibletokensmarttokens)
- [getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index)](#getconvertibletokensmarttoken)
- [isConvertibleTokenSmartToken(address _convertibleToken, address _value)](#isconvertibletokensmarttoken)
- [addItem(struct ConverterRegistryData.Items _items, address _value)](#additem)
- [removeItem(struct ConverterRegistryData.Items _items, address _value)](#removeitem)

### addSmartToken

⤾ overrides [IConverterRegistryData.addSmartToken](IConverterRegistryData.md#addsmarttoken)

adds a smart token
	 *

```js
function addSmartToken(address _smartToken) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartToken | address | smart token | 

### removeSmartToken

⤾ overrides [IConverterRegistryData.removeSmartToken](IConverterRegistryData.md#removesmarttoken)

removes a smart token
	 *

```js
function removeSmartToken(address _smartToken) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartToken | address | smart token | 

### addLiquidityPool

⤾ overrides [IConverterRegistryData.addLiquidityPool](IConverterRegistryData.md#addliquiditypool)

adds a liquidity pool
	 *

```js
function addLiquidityPool(address _liquidityPool) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _liquidityPool | address | liquidity pool | 

### removeLiquidityPool

⤾ overrides [IConverterRegistryData.removeLiquidityPool](IConverterRegistryData.md#removeliquiditypool)

removes a liquidity pool
	 *

```js
function removeLiquidityPool(address _liquidityPool) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _liquidityPool | address | liquidity pool | 

### addConvertibleToken

⤾ overrides [IConverterRegistryData.addConvertibleToken](IConverterRegistryData.md#addconvertibletoken)

adds a convertible token
	 *

```js
function addConvertibleToken(address _convertibleToken, address _smartToken) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _smartToken | address | associated smart token | 

### removeConvertibleToken

⤾ overrides [IConverterRegistryData.removeConvertibleToken](IConverterRegistryData.md#removeconvertibletoken)

removes a convertible token
	 *

```js
function removeConvertibleToken(address _convertibleToken, address _smartToken) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _smartToken | address | associated smart token | 

### getSmartTokenCount

⤾ overrides [IConverterRegistryData.getSmartTokenCount](IConverterRegistryData.md#getsmarttokencount)

returns the number of smart tokens
	 *

```js
function getSmartTokenCount() external view
returns(uint256)
```

**Returns**

number of smart tokens

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getSmartTokens

⤾ overrides [IConverterRegistryData.getSmartTokens](IConverterRegistryData.md#getsmarttokens)

returns the list of smart tokens
	 *

```js
function getSmartTokens() external view
returns(address[])
```

**Returns**

list of smart tokens

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getSmartToken

⤾ overrides [IConverterRegistryData.getSmartToken](IConverterRegistryData.md#getsmarttoken)

returns the smart token at a given index
	 *

```js
function getSmartToken(uint256 _index) external view
returns(address)
```

**Returns**

smart token at the given index

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

### isSmartToken

⤾ overrides [IConverterRegistryData.isSmartToken](IConverterRegistryData.md#issmarttoken)

checks whether or not a given value is a smart token
	 *

```js
function isSmartToken(address _value) external view
returns(bool)
```

**Returns**

true if the given value is a smart token, false if not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

### getLiquidityPoolCount

⤾ overrides [IConverterRegistryData.getLiquidityPoolCount](IConverterRegistryData.md#getliquiditypoolcount)

returns the number of liquidity pools
	 *

```js
function getLiquidityPoolCount() external view
returns(uint256)
```

**Returns**

number of liquidity pools

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getLiquidityPools

⤾ overrides [IConverterRegistryData.getLiquidityPools](IConverterRegistryData.md#getliquiditypools)

returns the list of liquidity pools
	 *

```js
function getLiquidityPools() external view
returns(address[])
```

**Returns**

list of liquidity pools

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getLiquidityPool

⤾ overrides [IConverterRegistryData.getLiquidityPool](IConverterRegistryData.md#getliquiditypool)

returns the liquidity pool at a given index
	 *

```js
function getLiquidityPool(uint256 _index) external view
returns(address)
```

**Returns**

liquidity pool at the given index

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

### isLiquidityPool

⤾ overrides [IConverterRegistryData.isLiquidityPool](IConverterRegistryData.md#isliquiditypool)

checks whether or not a given value is a liquidity pool
	 *

```js
function isLiquidityPool(address _value) external view
returns(bool)
```

**Returns**

true if the given value is a liquidity pool, false if not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

### getConvertibleTokenCount

⤾ overrides [IConverterRegistryData.getConvertibleTokenCount](IConverterRegistryData.md#getconvertibletokencount)

returns the number of convertible tokens
	 *

```js
function getConvertibleTokenCount() external view
returns(uint256)
```

**Returns**

number of convertible tokens

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getConvertibleTokens

⤾ overrides [IConverterRegistryData.getConvertibleTokens](IConverterRegistryData.md#getconvertibletokens)

returns the list of convertible tokens
	 *

```js
function getConvertibleTokens() external view
returns(address[])
```

**Returns**

list of convertible tokens

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getConvertibleToken

⤾ overrides [IConverterRegistryData.getConvertibleToken](IConverterRegistryData.md#getconvertibletoken)

returns the convertible token at a given index
	 *

```js
function getConvertibleToken(uint256 _index) external view
returns(address)
```

**Returns**

convertible token at the given index

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

### isConvertibleToken

⤾ overrides [IConverterRegistryData.isConvertibleToken](IConverterRegistryData.md#isconvertibletoken)

checks whether or not a given value is a convertible token
	 *

```js
function isConvertibleToken(address _value) external view
returns(bool)
```

**Returns**

true if the given value is a convertible token, false if not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

### getConvertibleTokenSmartTokenCount

⤾ overrides [IConverterRegistryData.getConvertibleTokenSmartTokenCount](IConverterRegistryData.md#getconvertibletokensmarttokencount)

returns the number of smart tokens associated with a given convertible token
	 *

```js
function getConvertibleTokenSmartTokenCount(address _convertibleToken) external view
returns(uint256)
```

**Returns**

number of smart tokens associated with the given convertible token

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 

### getConvertibleTokenSmartTokens

⤾ overrides [IConverterRegistryData.getConvertibleTokenSmartTokens](IConverterRegistryData.md#getconvertibletokensmarttokens)

returns the list of smart tokens associated with a given convertible token
	 *

```js
function getConvertibleTokenSmartTokens(address _convertibleToken) external view
returns(address[])
```

**Returns**

list of smart tokens associated with the given convertible token

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 

### getConvertibleTokenSmartToken

⤾ overrides [IConverterRegistryData.getConvertibleTokenSmartToken](IConverterRegistryData.md#getconvertibletokensmarttoken)

returns the smart token associated with a given convertible token at a given index
	 *

```js
function getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index) external view
returns(address)
```

**Returns**

smart token associated with the given convertible token at the given index

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _index | uint256 | index | 

### isConvertibleTokenSmartToken

⤾ overrides [IConverterRegistryData.isConvertibleTokenSmartToken](IConverterRegistryData.md#isconvertibletokensmarttoken)

checks whether or not a given value is a smart token of a given convertible token
	 *

```js
function isConvertibleTokenSmartToken(address _convertibleToken, address _value) external view
returns(bool)
```

**Returns**

true if the given value is a smart token of the given convertible token, false it not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _value | address | value | 

### addItem

adds an item to a list of items
	 *

```js
function addItem(struct ConverterRegistryData.Items _items, address _value) internal nonpayable validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _items | struct ConverterRegistryData.Items | list of items | 
| _value | address | item's value | 

### removeItem

removes an item from a list of items
	 *

```js
function removeItem(struct ConverterRegistryData.Items _items, address _value) internal nonpayable validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _items | struct ConverterRegistryData.Items | list of items | 
| _value | address | item's value | 

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
