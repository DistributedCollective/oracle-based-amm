# ConverterRegistryData.sol

View Source: [contracts/converter/ConverterRegistryData.sol](../solidity/contracts/converter/ConverterRegistryData.sol)

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

> ### addSmartToken

⤾ overrides [IConverterRegistryData.addSmartToken](IConverterRegistryData.md#.addsmarttoken)

adds a smart token
	 *

```solidity
function addSmartToken(address _smartToken) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartToken | address | smart token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addSmartToken(address _smartToken) external only(CONVERTER_REGISTRY) {
		addItem(smartTokens, _smartToken);
	}
```
</details>

> ### removeSmartToken

⤾ overrides [IConverterRegistryData.removeSmartToken](IConverterRegistryData.md#.removesmarttoken)

removes a smart token
	 *

```solidity
function removeSmartToken(address _smartToken) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartToken | address | smart token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeSmartToken(address _smartToken) external only(CONVERTER_REGISTRY) {
		removeItem(smartTokens, _smartToken);
	}
```
</details>

> ### addLiquidityPool

⤾ overrides [IConverterRegistryData.addLiquidityPool](IConverterRegistryData.md#.addliquiditypool)

adds a liquidity pool
	 *

```solidity
function addLiquidityPool(address _liquidityPool) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _liquidityPool | address | liquidity pool | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityPool(address _liquidityPool) external only(CONVERTER_REGISTRY) {
		addItem(liquidityPools, _liquidityPool);
	}
```
</details>

> ### removeLiquidityPool

⤾ overrides [IConverterRegistryData.removeLiquidityPool](IConverterRegistryData.md#.removeliquiditypool)

removes a liquidity pool
	 *

```solidity
function removeLiquidityPool(address _liquidityPool) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _liquidityPool | address | liquidity pool | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidityPool(address _liquidityPool) external only(CONVERTER_REGISTRY) {
		removeItem(liquidityPools, _liquidityPool);
	}
```
</details>

> ### addConvertibleToken

⤾ overrides [IConverterRegistryData.addConvertibleToken](IConverterRegistryData.md#.addconvertibletoken)

adds a convertible token
	 *

```solidity
function addConvertibleToken(address _convertibleToken, address _smartToken) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _smartToken | address | associated smart token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addConvertibleToken(address _convertibleToken, address _smartToken) external only(CONVERTER_REGISTRY) {
		List storage list = convertibleTokens.table[_convertibleToken];
		if (list.items.array.length == 0) {
			list.index = convertibleTokens.array.push(_convertibleToken) - 1;
		}
		addItem(list.items, _smartToken);
	}
```
</details>

> ### removeConvertibleToken

⤾ overrides [IConverterRegistryData.removeConvertibleToken](IConverterRegistryData.md#.removeconvertibletoken)

removes a convertible token
	 *

```solidity
function removeConvertibleToken(address _convertibleToken, address _smartToken) external nonpayable only 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _smartToken | address | associated smart token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeConvertibleToken(address _convertibleToken, address _smartToken) external only(CONVERTER_REGISTRY) {
		List storage list = convertibleTokens.table[_convertibleToken];
		removeItem(list.items, _smartToken);
		if (list.items.array.length == 0) {
			address lastConvertibleToken = convertibleTokens.array[convertibleTokens.array.length - 1];
			convertibleTokens.table[lastConvertibleToken].index = list.index;
			convertibleTokens.array[list.index] = lastConvertibleToken;
			convertibleTokens.array.length--;
			delete convertibleTokens.table[_convertibleToken];
		}
	}
```
</details>

> ### getSmartTokenCount

⤾ overrides [IConverterRegistryData.getSmartTokenCount](IConverterRegistryData.md#.getsmarttokencount)

returns the number of smart tokens
	 *

```solidity
function getSmartTokenCount() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSmartTokenCount() external view returns (uint256) {
		return smartTokens.array.length;
	}
```
</details>

> ### getSmartTokens

⤾ overrides [IConverterRegistryData.getSmartTokens](IConverterRegistryData.md#.getsmarttokens)

returns the list of smart tokens
	 *

```solidity
function getSmartTokens() external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSmartTokens() external view returns (address[]) {
		return smartTokens.array;
	}
```
</details>

> ### getSmartToken

⤾ overrides [IConverterRegistryData.getSmartToken](IConverterRegistryData.md#.getsmarttoken)

returns the smart token at a given index
	 *

```solidity
function getSmartToken(uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

**Returns**

smart token at the given index

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSmartToken(uint256 _index) external view returns (address) {
		return smartTokens.array[_index];
	}
```
</details>

> ### isSmartToken

⤾ overrides [IConverterRegistryData.isSmartToken](IConverterRegistryData.md#.issmarttoken)

checks whether or not a given value is a smart token
	 *

```solidity
function isSmartToken(address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

**Returns**

true if the given value is a smart token, false if not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isSmartToken(address _value) external view returns (bool) {
		return smartTokens.table[_value].valid;
	}
```
</details>

> ### getLiquidityPoolCount

⤾ overrides [IConverterRegistryData.getLiquidityPoolCount](IConverterRegistryData.md#.getliquiditypoolcount)

returns the number of liquidity pools
	 *

```solidity
function getLiquidityPoolCount() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPoolCount() external view returns (uint256) {
		return liquidityPools.array.length;
	}
```
</details>

> ### getLiquidityPools

⤾ overrides [IConverterRegistryData.getLiquidityPools](IConverterRegistryData.md#.getliquiditypools)

returns the list of liquidity pools
	 *

```solidity
function getLiquidityPools() external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPools() external view returns (address[]) {
		return liquidityPools.array;
	}
```
</details>

> ### getLiquidityPool

⤾ overrides [IConverterRegistryData.getLiquidityPool](IConverterRegistryData.md#.getliquiditypool)

returns the liquidity pool at a given index
	 *

```solidity
function getLiquidityPool(uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

**Returns**

liquidity pool at the given index

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPool(uint256 _index) external view returns (address) {
		return liquidityPools.array[_index];
	}
```
</details>

> ### isLiquidityPool

⤾ overrides [IConverterRegistryData.isLiquidityPool](IConverterRegistryData.md#.isliquiditypool)

checks whether or not a given value is a liquidity pool
	 *

```solidity
function isLiquidityPool(address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

**Returns**

true if the given value is a liquidity pool, false if not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isLiquidityPool(address _value) external view returns (bool) {
		return liquidityPools.table[_value].valid;
	}
```
</details>

> ### getConvertibleTokenCount

⤾ overrides [IConverterRegistryData.getConvertibleTokenCount](IConverterRegistryData.md#.getconvertibletokencount)

returns the number of convertible tokens
	 *

```solidity
function getConvertibleTokenCount() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenCount() external view returns (uint256) {
		return convertibleTokens.array.length;
	}
```
</details>

> ### getConvertibleTokens

⤾ overrides [IConverterRegistryData.getConvertibleTokens](IConverterRegistryData.md#.getconvertibletokens)

returns the list of convertible tokens
	 *

```solidity
function getConvertibleTokens() external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokens() external view returns (address[]) {
		return convertibleTokens.array;
	}
```
</details>

> ### getConvertibleToken

⤾ overrides [IConverterRegistryData.getConvertibleToken](IConverterRegistryData.md#.getconvertibletoken)

returns the convertible token at a given index
	 *

```solidity
function getConvertibleToken(uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

**Returns**

convertible token at the given index

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleToken(uint256 _index) external view returns (address) {
		return convertibleTokens.array[_index];
	}
```
</details>

> ### isConvertibleToken

⤾ overrides [IConverterRegistryData.isConvertibleToken](IConverterRegistryData.md#.isconvertibletoken)

checks whether or not a given value is a convertible token
	 *

```solidity
function isConvertibleToken(address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

**Returns**

true if the given value is a convertible token, false if not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConvertibleToken(address _value) external view returns (bool) {
		return convertibleTokens.table[_value].items.array.length > 0;
	}
```
</details>

> ### getConvertibleTokenSmartTokenCount

⤾ overrides [IConverterRegistryData.getConvertibleTokenSmartTokenCount](IConverterRegistryData.md#.getconvertibletokensmarttokencount)

returns the number of smart tokens associated with a given convertible token
	 *

```solidity
function getConvertibleTokenSmartTokenCount(address _convertibleToken) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 

**Returns**

number of smart tokens associated with the given convertible token

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenSmartTokenCount(address _convertibleToken) external view returns (uint256) {
		return convertibleTokens.table[_convertibleToken].items.array.length;
	}
```
</details>

> ### getConvertibleTokenSmartTokens

⤾ overrides [IConverterRegistryData.getConvertibleTokenSmartTokens](IConverterRegistryData.md#.getconvertibletokensmarttokens)

returns the list of smart tokens associated with a given convertible token
	 *

```solidity
function getConvertibleTokenSmartTokens(address _convertibleToken) external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 

**Returns**

list of smart tokens associated with the given convertible token

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenSmartTokens(address _convertibleToken) external view returns (address[]) {
		return convertibleTokens.table[_convertibleToken].items.array;
	}
```
</details>

> ### getConvertibleTokenSmartToken

⤾ overrides [IConverterRegistryData.getConvertibleTokenSmartToken](IConverterRegistryData.md#.getconvertibletokensmarttoken)

returns the smart token associated with a given convertible token at a given index
	 *

```solidity
function getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _index | uint256 | index | 

**Returns**

smart token associated with the given convertible token at the given index

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index) external view returns (address) {
		return convertibleTokens.table[_convertibleToken].items.array[_index];
	}
```
</details>

> ### isConvertibleTokenSmartToken

⤾ overrides [IConverterRegistryData.isConvertibleTokenSmartToken](IConverterRegistryData.md#.isconvertibletokensmarttoken)

checks whether or not a given value is a smart token of a given convertible token
	 *

```solidity
function isConvertibleTokenSmartToken(address _convertibleToken, address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _value | address | value | 

**Returns**

true if the given value is a smart token of the given convertible token, false it not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConvertibleTokenSmartToken(address _convertibleToken, address _value) external view returns (bool) {
		return convertibleTokens.table[_convertibleToken].items.table[_value].valid;
	}
```
</details>

> ### addItem

adds an item to a list of items
	 *

```solidity
function addItem(struct ConverterRegistryData.Items _items, address _value) internal nonpayable validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _items | struct ConverterRegistryData.Items | list of items | 
| _value | address | item's value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addItem(Items storage _items, address _value) internal validAddress(_value) {
		Item storage item = _items.table[_value];
		require(!item.valid, "ERR_INVALID_ITEM");

		item.index = _items.array.push(_value) - 1;
		item.valid = true;
	}
```
</details>

> ### removeItem

removes an item from a list of items
	 *

```solidity
function removeItem(struct ConverterRegistryData.Items _items, address _value) internal nonpayable validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _items | struct ConverterRegistryData.Items | list of items | 
| _value | address | item's value | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeItem(Items storage _items, address _value) internal validAddress(_value) {
		Item storage item = _items.table[_value];
		require(item.valid, "ERR_INVALID_ITEM");

		address lastValue = _items.array[_items.array.length - 1];
		_items.table[lastValue].index = item.index;
		_items.array[item.index] = lastValue;
		_items.array.length--;
		delete _items.table[_value];
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
