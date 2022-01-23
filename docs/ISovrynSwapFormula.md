# ISovrynSwapFormula.sol

View Source: [contracts/converter/interfaces/ISovrynSwapFormula.sol](../solidity/contracts/converter/interfaces/ISovrynSwapFormula.sol)

**↘ Derived Contracts: [SovrynSwapFormula](SovrynSwapFormula.md)**

**ISovrynSwapFormula**

## Functions

- [purchaseTargetAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount)](#purchasetargetamount)
- [saleTargetAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount)](#saletargetamount)
- [crossReserveTargetAmount(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount)](#crossreservetargetamount)
- [fundCost(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount)](#fundcost)
- [fundSupplyAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount)](#fundsupplyamount)
- [liquidateReserveAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount)](#liquidatereserveamount)
- [balancedWeights(uint256 _primaryReserveStakedBalance, uint256 _primaryReserveBalance, uint256 _secondaryReserveBalance, uint256 _reserveRateNumerator, uint256 _reserveRateDenominator)](#balancedweights)

> ### function purchaseTargetAmount

⤿ Overridden Implementation(s): [SovrynSwapFormula.purchaseTargetAmount](SovrynSwapFormula.md#purchasetargetamount)

```solidity
function purchaseTargetAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveWeight | uint32 |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function purchaseTargetAmount(
		uint256 _supply,
		uint256 _reserveBalance,
		uint32 _reserveWeight,
		uint256 _amount
	) public view returns (uint256);
```
</details>

> ### function saleTargetAmount

⤿ Overridden Implementation(s): [SovrynSwapFormula.saleTargetAmount](SovrynSwapFormula.md#saletargetamount)

```solidity
function saleTargetAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveWeight | uint32 |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function saleTargetAmount(
		uint256 _supply,
		uint256 _reserveBalance,
		uint32 _reserveWeight,
		uint256 _amount
	) public view returns (uint256);
```
</details>

> ### function crossReserveTargetAmount

⤿ Overridden Implementation(s): [SovrynSwapFormula.crossReserveTargetAmount](SovrynSwapFormula.md#crossreservetargetamount)

```solidity
function crossReserveTargetAmount(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceReserveBalance | uint256 |  | 
| _sourceReserveWeight | uint32 |  | 
| _targetReserveBalance | uint256 |  | 
| _targetReserveWeight | uint32 |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function crossReserveTargetAmount(
		uint256 _sourceReserveBalance,
		uint32 _sourceReserveWeight,
		uint256 _targetReserveBalance,
		uint32 _targetReserveWeight,
		uint256 _amount
	) public view returns (uint256);
```
</details>

> ### function fundCost

⤿ Overridden Implementation(s): [SovrynSwapFormula.fundCost](SovrynSwapFormula.md#fundcost)

```solidity
function fundCost(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveRatio | uint32 |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function fundCost(
		uint256 _supply,
		uint256 _reserveBalance,
		uint32 _reserveRatio,
		uint256 _amount
	) public view returns (uint256);
```
</details>

> ### function fundSupplyAmount

⤿ Overridden Implementation(s): [SovrynSwapFormula.fundSupplyAmount](SovrynSwapFormula.md#fundsupplyamount)

```solidity
function fundSupplyAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveRatio | uint32 |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function fundSupplyAmount(
		uint256 _supply,
		uint256 _reserveBalance,
		uint32 _reserveRatio,
		uint256 _amount
	) public view returns (uint256);
```
</details>

> ### function liquidateReserveAmount

⤿ Overridden Implementation(s): [SovrynSwapFormula.liquidateReserveAmount](SovrynSwapFormula.md#liquidatereserveamount)

```solidity
function liquidateReserveAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveRatio | uint32 |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function liquidateReserveAmount(
		uint256 _supply,
		uint256 _reserveBalance,
		uint32 _reserveRatio,
		uint256 _amount
	) public view returns (uint256);
```
</details>

> ### function balancedWeights

⤿ Overridden Implementation(s): [SovrynSwapFormula.balancedWeights](SovrynSwapFormula.md#balancedweights)

```solidity
function balancedWeights(uint256 _primaryReserveStakedBalance, uint256 _primaryReserveBalance, uint256 _secondaryReserveBalance, uint256 _reserveRateNumerator, uint256 _reserveRateDenominator) public view
returns(uint32, uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _primaryReserveStakedBalance | uint256 |  | 
| _primaryReserveBalance | uint256 |  | 
| _secondaryReserveBalance | uint256 |  | 
| _reserveRateNumerator | uint256 |  | 
| _reserveRateDenominator | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function balancedWeights(
		uint256 _primaryReserveStakedBalance,
		uint256 _primaryReserveBalance,
		uint256 _secondaryReserveBalance,
		uint256 _reserveRateNumerator,
		uint256 _reserveRateDenominator
	) public view returns (uint32, uint32);
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
