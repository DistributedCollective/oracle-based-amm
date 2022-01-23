# IConverterRegistryData.sol

View Source: [contracts/converter/interfaces/IConverterRegistryData.sol](../contracts/converter/interfaces/IConverterRegistryData.sol)

**↘ Derived Contracts: [ConverterRegistryData](ConverterRegistryData.md)**

**IConverterRegistryData**

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

### addSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.addSmartToken](ConverterRegistryData.md#addsmarttoken)

```js
function addSmartToken(address _smartToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartToken | address |  | 

### removeSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.removeSmartToken](ConverterRegistryData.md#removesmarttoken)

```js
function removeSmartToken(address _smartToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartToken | address |  | 

### addLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistryData.addLiquidityPool](ConverterRegistryData.md#addliquiditypool)

```js
function addLiquidityPool(address _liquidityPool) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _liquidityPool | address |  | 

### removeLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistryData.removeLiquidityPool](ConverterRegistryData.md#removeliquiditypool)

```js
function removeLiquidityPool(address _liquidityPool) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _liquidityPool | address |  | 

### addConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistryData.addConvertibleToken](ConverterRegistryData.md#addconvertibletoken)

```js
function addConvertibleToken(address _convertibleToken, address _smartToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _smartToken | address |  | 

### removeConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistryData.removeConvertibleToken](ConverterRegistryData.md#removeconvertibletoken)

```js
function removeConvertibleToken(address _convertibleToken, address _smartToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _smartToken | address |  | 

### getSmartTokenCount

⤿ Overridden Implementation(s): [ConverterRegistryData.getSmartTokenCount](ConverterRegistryData.md#getsmarttokencount)

```js
function getSmartTokenCount() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getSmartTokens

⤿ Overridden Implementation(s): [ConverterRegistryData.getSmartTokens](ConverterRegistryData.md#getsmarttokens)

```js
function getSmartTokens() external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.getSmartToken](ConverterRegistryData.md#getsmarttoken)

```js
function getSmartToken(uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

### isSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.isSmartToken](ConverterRegistryData.md#issmarttoken)

```js
function isSmartToken(address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

### getLiquidityPoolCount

⤿ Overridden Implementation(s): [ConverterRegistryData.getLiquidityPoolCount](ConverterRegistryData.md#getliquiditypoolcount)

```js
function getLiquidityPoolCount() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getLiquidityPools

⤿ Overridden Implementation(s): [ConverterRegistryData.getLiquidityPools](ConverterRegistryData.md#getliquiditypools)

```js
function getLiquidityPools() external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistryData.getLiquidityPool](ConverterRegistryData.md#getliquiditypool)

```js
function getLiquidityPool(uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

### isLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistryData.isLiquidityPool](ConverterRegistryData.md#isliquiditypool)

```js
function isLiquidityPool(address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

### getConvertibleTokenCount

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokenCount](ConverterRegistryData.md#getconvertibletokencount)

```js
function getConvertibleTokenCount() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getConvertibleTokens

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokens](ConverterRegistryData.md#getconvertibletokens)

```js
function getConvertibleTokens() external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleToken](ConverterRegistryData.md#getconvertibletoken)

```js
function getConvertibleToken(uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

### isConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistryData.isConvertibleToken](ConverterRegistryData.md#isconvertibletoken)

```js
function isConvertibleToken(address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

### getConvertibleTokenSmartTokenCount

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokenSmartTokenCount](ConverterRegistryData.md#getconvertibletokensmarttokencount)

```js
function getConvertibleTokenSmartTokenCount(address _convertibleToken) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

### getConvertibleTokenSmartTokens

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokenSmartTokens](ConverterRegistryData.md#getconvertibletokensmarttokens)

```js
function getConvertibleTokenSmartTokens(address _convertibleToken) external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

### getConvertibleTokenSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokenSmartToken](ConverterRegistryData.md#getconvertibletokensmarttoken)

```js
function getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _index | uint256 |  | 

### isConvertibleTokenSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.isConvertibleTokenSmartToken](ConverterRegistryData.md#isconvertibletokensmarttoken)

```js
function isConvertibleTokenSmartToken(address _convertibleToken, address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _value | address |  | 

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
