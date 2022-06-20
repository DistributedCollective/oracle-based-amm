# SafeMath.sol

View Source: [contracts/utility/SafeMath.sol](../solidity/contracts/utility/SafeMath.sol)

**SafeMath**

Library for basic math operations with overflow/underflow protection

## Functions

- [add(uint256 _x, uint256 _y)](#add)
- [sub(uint256 _x, uint256 _y)](#sub)
- [mul(uint256 _x, uint256 _y)](#mul)
- [div(uint256 _x, uint256 _y)](#div)

---    

> ### add

returns the sum of _x and _y, reverts if the calculation overflows
	 *

```solidity
function add(uint256 _x, uint256 _y) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 | value 1 | 
| _y | uint256 | value 2 	 * | 

**Returns**

sum

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function add(uint256 _x, uint256 _y) internal pure returns (uint256) {
		uint256 z = _x + _y;
		require(z >= _x, "ERR_OVERFLOW");
		return z;
	}
```
</details>

---    

> ### sub

returns the difference of _x minus _y, reverts if the calculation underflows
	 *

```solidity
function sub(uint256 _x, uint256 _y) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 | minuend | 
| _y | uint256 | subtrahend 	 * | 

**Returns**

difference

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function sub(uint256 _x, uint256 _y) internal pure returns (uint256) {
		require(_x >= _y, "ERR_UNDERFLOW");
		return _x - _y;
	}
```
</details>

---    

> ### mul

returns the product of multiplying _x by _y, reverts if the calculation overflows
	 *

```solidity
function mul(uint256 _x, uint256 _y) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 | factor 1 | 
| _y | uint256 | factor 2 	 * | 

**Returns**

product

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mul(uint256 _x, uint256 _y) internal pure returns (uint256) {
		// gas optimization
		if (_x == 0) return 0;

		uint256 z = _x * _y;
		require(z / _x == _y, "ERR_OVERFLOW");
		return z;
	}
```
</details>

---    

> ### div

Integer division of two numbers truncating the quotient, reverts on division by zero.
	 *

```solidity
function div(uint256 _x, uint256 _y) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 | dividend | 
| _y | uint256 | divisor 	 * | 

**Returns**

quotient

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function div(uint256 _x, uint256 _y) internal pure returns (uint256) {
		require(_y > 0, "ERR_DIVIDE_BY_ZERO");
		uint256 c = _x / _y;
		return c;
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
* [IConsumerPriceOracle](IConsumerPriceOracle.md)
* [IContractRegistry](IContractRegistry.md)
* [IConversionPathFinder](IConversionPathFinder.md)
* [IConverter](IConverter.md)
* [IConverterAnchor](IConverterAnchor.md)
* [IConverterFactory](IConverterFactory.md)
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
* [SovrynSwapX](SovrynSwapX.md)
* [SwapSettings](SwapSettings.md)
* [TokenHandler](TokenHandler.md)
* [TokenHolder](TokenHolder.md)
* [Utils](Utils.md)
* [Whitelist](Whitelist.md)
* [XTransferRerouter](XTransferRerouter.md)
