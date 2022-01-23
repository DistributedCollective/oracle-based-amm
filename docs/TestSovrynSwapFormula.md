# TestSovrynSwapFormula.sol

View Source: [contracts/helpers/TestSovrynSwapFormula.sol](../solidity/contracts/helpers/TestSovrynSwapFormula.sol)

**↗ Extends: [SovrynSwapFormula](SovrynSwapFormula.md)**

**TestSovrynSwapFormula**

## Functions

- [powerTest(uint256 _baseN, uint256 _baseD, uint32 _expN, uint32 _expD)](#powertest)
- [generalLogTest(uint256 x)](#generallogtest)
- [floorLog2Test(uint256 _n)](#floorlog2test)
- [findPositionInMaxExpArrayTest(uint256 _x)](#findpositioninmaxexparraytest)
- [generalExpTest(uint256 _x, uint8 _precision)](#generalexptest)
- [optimalLogTest(uint256 x)](#optimallogtest)
- [optimalExpTest(uint256 x)](#optimalexptest)
- [normalizedWeightsTest(uint256 _a, uint256 _b)](#normalizedweightstest)
- [accurateWeightsTest(uint256 _a, uint256 _b)](#accurateweightstest)
- [roundDivTest(uint256 _n, uint256 _d)](#rounddivtest)

---    

> ### powerTest

```solidity
function powerTest(uint256 _baseN, uint256 _baseD, uint32 _expN, uint32 _expD) external view
returns(uint256, uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _baseN | uint256 |  | 
| _baseD | uint256 |  | 
| _expN | uint32 |  | 
| _expD | uint32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function powerTest(
		uint256 _baseN,
		uint256 _baseD,
		uint32 _expN,
		uint32 _expD
	) external view returns (uint256, uint8) {
		return super.power(_baseN, _baseD, _expN, _expD);
	}
```
</details>

---    

> ### generalLogTest

```solidity
function generalLogTest(uint256 x) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| x | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function generalLogTest(uint256 x) external pure returns (uint256) {
		return super.generalLog(x);
	}
```
</details>

---    

> ### floorLog2Test

```solidity
function floorLog2Test(uint256 _n) external pure
returns(uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _n | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function floorLog2Test(uint256 _n) external pure returns (uint8) {
		return super.floorLog2(_n);
	}
```
</details>

---    

> ### findPositionInMaxExpArrayTest

```solidity
function findPositionInMaxExpArrayTest(uint256 _x) external view
returns(uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function findPositionInMaxExpArrayTest(uint256 _x) external view returns (uint8) {
		return super.findPositionInMaxExpArray(_x);
	}
```
</details>

---    

> ### generalExpTest

```solidity
function generalExpTest(uint256 _x, uint8 _precision) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 
| _precision | uint8 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function generalExpTest(uint256 _x, uint8 _precision) external pure returns (uint256) {
		return super.generalExp(_x, _precision);
	}
```
</details>

---    

> ### optimalLogTest

```solidity
function optimalLogTest(uint256 x) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| x | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function optimalLogTest(uint256 x) external pure returns (uint256) {
		return super.optimalLog(x);
	}
```
</details>

---    

> ### optimalExpTest

```solidity
function optimalExpTest(uint256 x) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| x | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function optimalExpTest(uint256 x) external pure returns (uint256) {
		return super.optimalExp(x);
	}
```
</details>

---    

> ### normalizedWeightsTest

```solidity
function normalizedWeightsTest(uint256 _a, uint256 _b) external pure
returns(uint32, uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _a | uint256 |  | 
| _b | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function normalizedWeightsTest(uint256 _a, uint256 _b) external pure returns (uint32, uint32) {
		return super.normalizedWeights(_a, _b);
	}
```
</details>

---    

> ### accurateWeightsTest

```solidity
function accurateWeightsTest(uint256 _a, uint256 _b) external pure
returns(uint32, uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _a | uint256 |  | 
| _b | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function accurateWeightsTest(uint256 _a, uint256 _b) external pure returns (uint32, uint32) {
		return super.accurateWeights(_a, _b);
	}
```
</details>

---    

> ### roundDivTest

```solidity
function roundDivTest(uint256 _n, uint256 _d) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _n | uint256 |  | 
| _d | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function roundDivTest(uint256 _n, uint256 _d) external pure returns (uint256) {
		return super.roundDiv(_n, _d);
	}
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
