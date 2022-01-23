# IConverterRegistry.sol

View Source: [contracts/converter/interfaces/IConverterRegistry.sol](../solidity/contracts/converter/interfaces/IConverterRegistry.sol)

**↘ Derived Contracts: [ConverterRegistry](ConverterRegistry.md)**

**IConverterRegistry**

## Functions

- [getAnchorCount()](#getanchorcount)
- [getAnchors()](#getanchors)
- [getAnchor(uint256 _index)](#getanchor)
- [isAnchor(address _value)](#isanchor)
- [getLiquidityPoolCount()](#getliquiditypoolcount)
- [getLiquidityPools()](#getliquiditypools)
- [getLiquidityPool(uint256 _index)](#getliquiditypool)
- [isLiquidityPool(address _value)](#isliquiditypool)
- [getConvertibleTokenCount()](#getconvertibletokencount)
- [getConvertibleTokens()](#getconvertibletokens)
- [getConvertibleToken(uint256 _index)](#getconvertibletoken)
- [isConvertibleToken(address _value)](#isconvertibletoken)
- [getConvertibleTokenAnchorCount(address _convertibleToken)](#getconvertibletokenanchorcount)
- [getConvertibleTokenAnchors(address _convertibleToken)](#getconvertibletokenanchors)
- [getConvertibleTokenAnchor(address _convertibleToken, uint256 _index)](#getconvertibletokenanchor)
- [isConvertibleTokenAnchor(address _convertibleToken, address _value)](#isconvertibletokenanchor)

---    

> ### getAnchorCount

⤿ Overridden Implementation(s): [ConverterRegistry.getAnchorCount](ConverterRegistry.md#getanchorcount)

```solidity
function getAnchorCount() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAnchorCount() public view returns (uint256);
```
</details>

---    

> ### getAnchors

⤿ Overridden Implementation(s): [ConverterRegistry.getAnchors](ConverterRegistry.md#getanchors)

```solidity
function getAnchors() public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAnchors() public view returns (address[]);
```
</details>

---    

> ### getAnchor

⤿ Overridden Implementation(s): [ConverterRegistry.getAnchor](ConverterRegistry.md#getanchor)

```solidity
function getAnchor(uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAnchor(uint256 _index) public view returns (address);
```
</details>

---    

> ### isAnchor

⤿ Overridden Implementation(s): [ConverterRegistry.isAnchor](ConverterRegistry.md#isanchor)

```solidity
function isAnchor(address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isAnchor(address _value) public view returns (bool);
```
</details>

---    

> ### getLiquidityPoolCount

⤿ Overridden Implementation(s): [ConverterRegistry.getLiquidityPoolCount](ConverterRegistry.md#getliquiditypoolcount)

```solidity
function getLiquidityPoolCount() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPoolCount() public view returns (uint256);
```
</details>

---    

> ### getLiquidityPools

⤿ Overridden Implementation(s): [ConverterRegistry.getLiquidityPools](ConverterRegistry.md#getliquiditypools)

```solidity
function getLiquidityPools() public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPools() public view returns (address[]);
```
</details>

---    

> ### getLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistry.getLiquidityPool](ConverterRegistry.md#getliquiditypool)

```solidity
function getLiquidityPool(uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPool(uint256 _index) public view returns (address);
```
</details>

---    

> ### isLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistry.isLiquidityPool](ConverterRegistry.md#isliquiditypool)

```solidity
function isLiquidityPool(address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isLiquidityPool(address _value) public view returns (bool);
```
</details>

---    

> ### getConvertibleTokenCount

⤿ Overridden Implementation(s): [ConverterRegistry.getConvertibleTokenCount](ConverterRegistry.md#getconvertibletokencount)

```solidity
function getConvertibleTokenCount() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenCount() public view returns (uint256);
```
</details>

---    

> ### getConvertibleTokens

⤿ Overridden Implementation(s): [ConverterRegistry.getConvertibleTokens](ConverterRegistry.md#getconvertibletokens)

```solidity
function getConvertibleTokens() public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokens() public view returns (address[]);
```
</details>

---    

> ### getConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistry.getConvertibleToken](ConverterRegistry.md#getconvertibletoken)

```solidity
function getConvertibleToken(uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleToken(uint256 _index) public view returns (address);
```
</details>

---    

> ### isConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistry.isConvertibleToken](ConverterRegistry.md#isconvertibletoken)

```solidity
function isConvertibleToken(address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConvertibleToken(address _value) public view returns (bool);
```
</details>

---    

> ### getConvertibleTokenAnchorCount

⤿ Overridden Implementation(s): [ConverterRegistry.getConvertibleTokenAnchorCount](ConverterRegistry.md#getconvertibletokenanchorcount)

```solidity
function getConvertibleTokenAnchorCount(address _convertibleToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenAnchorCount(address _convertibleToken) public view returns (uint256);
```
</details>

---    

> ### getConvertibleTokenAnchors

⤿ Overridden Implementation(s): [ConverterRegistry.getConvertibleTokenAnchors](ConverterRegistry.md#getconvertibletokenanchors)

```solidity
function getConvertibleTokenAnchors(address _convertibleToken) public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenAnchors(address _convertibleToken) public view returns (address[]);
```
</details>

---    

> ### getConvertibleTokenAnchor

⤿ Overridden Implementation(s): [ConverterRegistry.getConvertibleTokenAnchor](ConverterRegistry.md#getconvertibletokenanchor)

```solidity
function getConvertibleTokenAnchor(address _convertibleToken, uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenAnchor(address _convertibleToken, uint256 _index) public view returns (address);
```
</details>

---    

> ### isConvertibleTokenAnchor

⤿ Overridden Implementation(s): [ConverterRegistry.isConvertibleTokenAnchor](ConverterRegistry.md#isconvertibletokenanchor)

```solidity
function isConvertibleTokenAnchor(address _convertibleToken, address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConvertibleTokenAnchor(address _convertibleToken, address _value) public view returns (bool);
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
