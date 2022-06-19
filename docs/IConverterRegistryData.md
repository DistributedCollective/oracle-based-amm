# IConverterRegistryData.sol

View Source: [contracts/converter/interfaces/IConverterRegistryData.sol](../solidity/contracts/converter/interfaces/IConverterRegistryData.sol)

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

---    

> ### addSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.addSmartToken](ConverterRegistryData.md#addsmarttoken)

```solidity
function addSmartToken(address _smartToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addSmartToken(address _smartToken) external;
```
</details>

---    

> ### removeSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.removeSmartToken](ConverterRegistryData.md#removesmarttoken)

```solidity
function removeSmartToken(address _smartToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeSmartToken(address _smartToken) external;
```
</details>

---    

> ### addLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistryData.addLiquidityPool](ConverterRegistryData.md#addliquiditypool)

```solidity
function addLiquidityPool(address _liquidityPool) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _liquidityPool | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityPool(address _liquidityPool) external;
```
</details>

---    

> ### removeLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistryData.removeLiquidityPool](ConverterRegistryData.md#removeliquiditypool)

```solidity
function removeLiquidityPool(address _liquidityPool) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _liquidityPool | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidityPool(address _liquidityPool) external;
```
</details>

---    

> ### addConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistryData.addConvertibleToken](ConverterRegistryData.md#addconvertibletoken)

```solidity
function addConvertibleToken(address _convertibleToken, address _smartToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _smartToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addConvertibleToken(address _convertibleToken, address _smartToken) external;
```
</details>

---    

> ### removeConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistryData.removeConvertibleToken](ConverterRegistryData.md#removeconvertibletoken)

```solidity
function removeConvertibleToken(address _convertibleToken, address _smartToken) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _smartToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeConvertibleToken(address _convertibleToken, address _smartToken) external;
```
</details>

---    

> ### getSmartTokenCount

⤿ Overridden Implementation(s): [ConverterRegistryData.getSmartTokenCount](ConverterRegistryData.md#getsmarttokencount)

```solidity
function getSmartTokenCount() external view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSmartTokenCount() external view returns (uint256);
```
</details>

---    

> ### getSmartTokens

⤿ Overridden Implementation(s): [ConverterRegistryData.getSmartTokens](ConverterRegistryData.md#getsmarttokens)

```solidity
function getSmartTokens() external view
returns(address[])
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSmartTokens() external view returns (address[]);
```
</details>

---    

> ### getSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.getSmartToken](ConverterRegistryData.md#getsmarttoken)

```solidity
function getSmartToken(uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSmartToken(uint256 _index) external view returns (address);
```
</details>

---    

> ### isSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.isSmartToken](ConverterRegistryData.md#issmarttoken)

```solidity
function isSmartToken(address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isSmartToken(address _value) external view returns (bool);
```
</details>

---    

> ### getLiquidityPoolCount

⤿ Overridden Implementation(s): [ConverterRegistryData.getLiquidityPoolCount](ConverterRegistryData.md#getliquiditypoolcount)

```solidity
function getLiquidityPoolCount() external view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPoolCount() external view returns (uint256);
```
</details>

---    

> ### getLiquidityPools

⤿ Overridden Implementation(s): [ConverterRegistryData.getLiquidityPools](ConverterRegistryData.md#getliquiditypools)

```solidity
function getLiquidityPools() external view
returns(address[])
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPools() external view returns (address[]);
```
</details>

---    

> ### getLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistryData.getLiquidityPool](ConverterRegistryData.md#getliquiditypool)

```solidity
function getLiquidityPool(uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPool(uint256 _index) external view returns (address);
```
</details>

---    

> ### isLiquidityPool

⤿ Overridden Implementation(s): [ConverterRegistryData.isLiquidityPool](ConverterRegistryData.md#isliquiditypool)

```solidity
function isLiquidityPool(address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isLiquidityPool(address _value) external view returns (bool);
```
</details>

---    

> ### getConvertibleTokenCount

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokenCount](ConverterRegistryData.md#getconvertibletokencount)

```solidity
function getConvertibleTokenCount() external view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenCount() external view returns (uint256);
```
</details>

---    

> ### getConvertibleTokens

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokens](ConverterRegistryData.md#getconvertibletokens)

```solidity
function getConvertibleTokens() external view
returns(address[])
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokens() external view returns (address[]);
```
</details>

---    

> ### getConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleToken](ConverterRegistryData.md#getconvertibletoken)

```solidity
function getConvertibleToken(uint256 _index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleToken(uint256 _index) external view returns (address);
```
</details>

---    

> ### isConvertibleToken

⤿ Overridden Implementation(s): [ConverterRegistryData.isConvertibleToken](ConverterRegistryData.md#isconvertibletoken)

```solidity
function isConvertibleToken(address _value) external view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConvertibleToken(address _value) external view returns (bool);
```
</details>

---    

> ### getConvertibleTokenSmartTokenCount

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokenSmartTokenCount](ConverterRegistryData.md#getconvertibletokensmarttokencount)

```solidity
function getConvertibleTokenSmartTokenCount(address _convertibleToken) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenSmartTokenCount(address _convertibleToken) external view returns (uint256);
```
</details>

---    

> ### getConvertibleTokenSmartTokens

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokenSmartTokens](ConverterRegistryData.md#getconvertibletokensmarttokens)

```solidity
function getConvertibleTokenSmartTokens(address _convertibleToken) external view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenSmartTokens(address _convertibleToken) external view returns (address[]);
```
</details>

---    

> ### getConvertibleTokenSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.getConvertibleTokenSmartToken](ConverterRegistryData.md#getconvertibletokensmarttoken)

```solidity
function getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index) external view
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
function getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index) external view returns (address);
```
</details>

---    

> ### isConvertibleTokenSmartToken

⤿ Overridden Implementation(s): [ConverterRegistryData.isConvertibleTokenSmartToken](ConverterRegistryData.md#isconvertibletokensmarttoken)

```solidity
function isConvertibleTokenSmartToken(address _convertibleToken, address _value) external view
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
function isConvertibleTokenSmartToken(address _convertibleToken, address _value) external view returns (bool);
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
