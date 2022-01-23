# ConversionPathFinder.sol

View Source: [contracts/ConversionPathFinder.sol](../solidity/contracts/ConversionPathFinder.sol)

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

> ### setAnchorToken

updates the anchor token
	 *

```solidity
function setAnchorToken(address _anchorToken) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _anchorToken | address | address of the anchor token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setAnchorToken(address _anchorToken) public ownerOnly {
		anchorToken = _anchorToken;
	}
```
</details>

> ### findPath

⤾ overrides [IConversionPathFinder.findPath](IConversionPathFinder.md#.findpath)

generates a conversion path between a given pair of tokens in the SovrynSwap Network
	 *

```solidity
function findPath(address _sourceToken, address _targetToken) public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | address | address of the source token | 
| _targetToken | address | address of the target token 	 * | 

**Returns**

a path from the source token to the target token

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function findPath(address _sourceToken, address _targetToken) public view returns (address[] memory) {
		IConverterRegistry converterRegistry = IConverterRegistry(addressOf(CONVERTER_REGISTRY));
		address[] memory sourcePath = getPath(_sourceToken, converterRegistry);
		address[] memory targetPath = getPath(_targetToken, converterRegistry);
		return getShortestPath(sourcePath, targetPath);
	}
```
</details>

> ### getPath

generates a conversion path between a given token and the anchor token
	 *

```solidity
function getPath(address _token, IConverterRegistry _converterRegistry) private view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | address | address of the token | 
| _converterRegistry | IConverterRegistry | address of the converter registry 	 * | 

**Returns**

a path from the input token to the anchor token

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPath(address _token, IConverterRegistry _converterRegistry) private view returns (address[] memory) {
		if (_token == anchorToken) return getInitialArray(_token);

		address[] memory anchors;
		if (_converterRegistry.isAnchor(_token)) anchors = getInitialArray(_token);
		else anchors = _converterRegistry.getConvertibleTokenAnchors(_token);

		for (uint256 n = 0; n < anchors.length; n++) {
			IConverter converter = IConverter(IConverterAnchor(anchors[n]).owner());
			uint256 connectorTokenCount = converter.connectorTokenCount();
			for (uint256 i = 0; i < connectorTokenCount; i++) {
				address connectorToken = converter.connectorTokens(i);
				if (connectorToken != _token) {
					address[] memory path = getPath(connectorToken, _converterRegistry);
					if (path.length > 0) return getExtendedArray(_token, anchors[n], path);
				}
			}
		}

		return new address[](0);
	}
```
</details>

> ### getShortestPath

merges two paths with a common suffix into one
	 *

```solidity
function getShortestPath(address[] _sourcePath, address[] _targetPath) private pure
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourcePath | address[] | address of the source path | 
| _targetPath | address[] | address of the target path 	 * | 

**Returns**

merged path

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getShortestPath(address[] memory _sourcePath, address[] memory _targetPath) private pure returns (address[] memory) {
		if (_sourcePath.length > 0 && _targetPath.length > 0) {
			uint256 i = _sourcePath.length;
			uint256 j = _targetPath.length;
			while (i > 0 && j > 0 && _sourcePath[i - 1] == _targetPath[j - 1]) {
				i--;
				j--;
			}

			address[] memory path = new address[](i + j + 1);
			for (uint256 m = 0; m <= i; m++) path[m] = _sourcePath[m];
			for (uint256 n = j; n > 0; n--) path[path.length - n] = _targetPath[n - 1];

			uint256 length = 0;
			for (uint256 p = 0; p < path.length; p += 1) {
				for (uint256 q = p + 2; q < path.length - (p % 2); q += 2) {
					if (path[p] == path[q]) p = q;
				}
				path[length++] = path[p];
			}

			return getPartialArray(path, length);
		}

		return new address[](0);
	}
```
</details>

> ### getInitialArray

creates a new array containing a single item
	 *

```solidity
function getInitialArray(address _item) private pure
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _item | address | item 	 * | 

**Returns**

initial array

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getInitialArray(address _item) private pure returns (address[] memory) {
		address[] memory array = new address[](1);
		array[0] = _item;
		return array;
	}
```
</details>

> ### getExtendedArray

prepends two items to the beginning of an array
	 *

```solidity
function getExtendedArray(address _item0, address _item1, address[] _array) private pure
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _item0 | address | first item | 
| _item1 | address | second item | 
| _array | address[] | initial array 	 * | 

**Returns**

extended array

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getExtendedArray(
		address _item0,
		address _item1,
		address[] memory _array
	) private pure returns (address[] memory) {
		address[] memory array = new address[](2 + _array.length);
		array[0] = _item0;
		array[1] = _item1;
		for (uint256 i = 0; i < _array.length; i++) array[2 + i] = _array[i];
		return array;
	}
```
</details>

> ### getPartialArray

extracts the prefix of a given array
	 *

```solidity
function getPartialArray(address[] _array, uint256 _length) private pure
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _array | address[] | given array | 
| _length | uint256 | prefix length 	 * | 

**Returns**

partial array

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getPartialArray(address[] memory _array, uint256 _length) private pure returns (address[] memory) {
		address[] memory array = new address[](_length);
		for (uint256 i = 0; i < _length; i++) array[i] = _array[i];
		return array;
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
