# TestLiquidityPoolV2Converter.sol

View Source: [contracts/helpers/TestLiquidityPoolV2Converter.sol](../solidity/contracts/helpers/TestLiquidityPoolV2Converter.sol)

**↗ Extends: [LiquidityPoolV2Converter](LiquidityPoolV2Converter.md)**

**TestLiquidityPoolV2Converter**

## Constructor

```js
constructor(IPoolTokensContainer _token, IContractRegistry _registry, uint32 _maxConversionFee) public
```

**Arguments**

## Contract Members
**Constants & Variables**

```js
uint256 public currentTime;

```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IPoolTokensContainer |  | 
| _registry | IContractRegistry |  | 
| _maxConversionFee | uint32 |  | 

## Functions

- [setReferenceRateUpdateTime(uint256 _referenceRateUpdateTime)](#setreferencerateupdatetime)
- [time()](#time)
- [setTime(uint256 _currentTime)](#settime)
- [calculateFeeToEquilibriumTest(uint256 _primaryReserveStaked, uint256 _secondaryReserveStaked, uint256 _primaryReserveWeight, uint256 _secondaryReserveWeight, uint256 _primaryReserveRate, uint256 _secondaryReserveRate, uint256 _dynamicFeeFactor)](#calculatefeetoequilibriumtest)
- [setReserveWeight(IERC20Token _reserveToken, uint32 _weight)](#setreserveweight)

> ### function setReferenceRateUpdateTime

```solidity
function setReferenceRateUpdateTime(uint256 _referenceRateUpdateTime) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _referenceRateUpdateTime | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReferenceRateUpdateTime(uint256 _referenceRateUpdateTime) public {
		referenceRateUpdateTime = _referenceRateUpdateTime;
	}
```
</details>

> ### function time

⤾ overrides [LiquidityPoolV2Converter.time](LiquidityPoolV2Converter.md#time)

```solidity
function time() internal view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function time() internal view returns (uint256) {
		return currentTime != 0 ? currentTime : now;
	}
```
</details>

> ### function setTime

```solidity
function setTime(uint256 _currentTime) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _currentTime | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setTime(uint256 _currentTime) public {
		currentTime = _currentTime;
	}
```
</details>

> ### function calculateFeeToEquilibriumTest

```solidity
function calculateFeeToEquilibriumTest(uint256 _primaryReserveStaked, uint256 _secondaryReserveStaked, uint256 _primaryReserveWeight, uint256 _secondaryReserveWeight, uint256 _primaryReserveRate, uint256 _secondaryReserveRate, uint256 _dynamicFeeFactor) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _primaryReserveStaked | uint256 |  | 
| _secondaryReserveStaked | uint256 |  | 
| _primaryReserveWeight | uint256 |  | 
| _secondaryReserveWeight | uint256 |  | 
| _primaryReserveRate | uint256 |  | 
| _secondaryReserveRate | uint256 |  | 
| _dynamicFeeFactor | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateFeeToEquilibriumTest(
		uint256 _primaryReserveStaked,
		uint256 _secondaryReserveStaked,
		uint256 _primaryReserveWeight,
		uint256 _secondaryReserveWeight,
		uint256 _primaryReserveRate,
		uint256 _secondaryReserveRate,
		uint256 _dynamicFeeFactor
	) external pure returns (uint256) {
		return
			calculateFeeToEquilibrium(
				_primaryReserveStaked,
				_secondaryReserveStaked,
				_primaryReserveWeight,
				_secondaryReserveWeight,
				_primaryReserveRate,
				_secondaryReserveRate,
				_dynamicFeeFactor
			);
	}
```
</details>

> ### function setReserveWeight

```solidity
function setReserveWeight(IERC20Token _reserveToken, uint32 _weight) public nonpayable validReserve 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token |  | 
| _weight | uint32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReserveWeight(IERC20Token _reserveToken, uint32 _weight) public validReserve(_reserveToken) {
		reserves[_reserveToken].weight = _weight;
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
