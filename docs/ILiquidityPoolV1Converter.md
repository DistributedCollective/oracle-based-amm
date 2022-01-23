# ILiquidityPoolV1Converter.sol

View Source: [contracts/converter/interfaces/ILiquidityPoolV1Converter.sol](../solidity/contracts/converter/interfaces/ILiquidityPoolV1Converter.sol)

**ILiquidityPoolV1Converter**

Liquidity Pool v1 Converter

  * The liquidity pool v1 converter is a specialized version of a converter that manages

a classic SovrynSwap liquidity pool.

  * Even though classic pools can have many reserves, the most common configuration of

the pool has 2 reserves with 50%/50% weights.

**Events**

```js
event PriceDataUpdate(address indexed _connectorToken, uint256  _tokenSupply, uint256  _connectorBalance, uint32  _connectorWeight);
```

## Functions

- [converterType()](#convertertype)
- [acceptAnchorOwnership()](#acceptanchorownership)
- [targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)](#targetamountandfee)
- [addLiquidity(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _minReturn)](#addliquidity)
- [removeLiquidity(uint256 _amount, IERC20Token[] _reserveTokens, uint256[] _reserveMinReturnAmounts)](#removeliquidity)
- [fund(uint256 _amount)](#fund)
- [liquidate(uint256 _amount)](#liquidate)
- [decimalLength(uint256 _x)](#decimallength)
- [roundDiv(uint256 _n, uint256 _d)](#rounddiv)
- [geometricMean(uint256[] _values)](#geometricmean)
- [token()](#token)
- [reserveRatio()](#reserveratio)
- [reserves(address )](#reserves)
- [reserveTokens(uint256 index)](#reservetokens)

---    

> ### converterType

returns the converter type

      *

```solidity
function converterType() external pure
returns(uint16)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function converterType() external pure returns (uint16);
```
</details>

---    

> ### acceptAnchorOwnership

accepts ownership of the anchor after an ownership transfer

also activates the converter

can only be called by the contract owner

note that prior to version 28, you should use 'acceptTokenOwnership' instead

```solidity
function acceptAnchorOwnership() external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function acceptAnchorOwnership() external;
```
</details>

---    

> ### targetAmountAndFee

returns the expected target amount of converting one reserve to another along with the fee

      *

```solidity
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) external view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | contract address of the source reserve token | 
| _targetToken | IERC20Token | contract address of the target reserve token | 
| _amount | uint256 | amount of tokens received from the user        * | 

**Returns**

expected target amount

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) external view returns (uint256, uint256);
```
</details>

---    

> ### addLiquidity

increases the pool's liquidity and mints new shares in the pool to the caller

note that prior to version 28, you should use 'fund' instead

      *

```solidity
function addLiquidity(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _minReturn) external payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveAmounts | uint256[] | amount of each reserve token | 
| _minReturn | uint256 | token minimum return-amount | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidity(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _minReturn) external payable;
```
</details>

---    

> ### removeLiquidity

decreases the pool's liquidity and burns the caller's shares in the pool

note that prior to version 28, you should use 'liquidate' instead

      *

```solidity
function removeLiquidity(uint256 _amount, IERC20Token[] _reserveTokens, uint256[] _reserveMinReturnAmounts) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | token amount | 
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveMinReturnAmounts | uint256[] | minimum return-amount of each reserve token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidity(uint256 _amount, IERC20Token[] _reserveTokens, uint256[] _reserveMinReturnAmounts) external;
```
</details>

---    

> ### fund

increases the pool's liquidity and mints new shares in the pool to the caller

for example, if the caller increases the supply by 10%,

then it will cost an amount equal to 10% of each reserve token balance

note that starting from version 28, you should use 'addLiquidity' instead

      *

```solidity
function fund(uint256 _amount) external payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount to increase the supply by (in the pool token) | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function fund(uint256 _amount) external payable;
```
</details>

---    

> ### liquidate

decreases the pool's liquidity and burns the caller's shares in the pool

for example, if the holder sells 10% of the supply,

then they will receive 10% of each reserve token balance in return

note that starting from version 28, you should use 'removeLiquidity' instead

      *

```solidity
function liquidate(uint256 _amount) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount to liquidate (in the pool token) | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function liquidate(uint256 _amount) external;
```
</details>

---    

> ### decimalLength

calculates the number of decimal digits in a given value

      *

```solidity
function decimalLength(uint256 _x) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 | value (assumed positive) | 

**Returns**

the number of decimal digits in the given value

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function decimalLength(uint256 _x) external pure returns (uint256);
```
</details>

---    

> ### roundDiv

calculates the nearest integer to a given quotient

      *

```solidity
function roundDiv(uint256 _n, uint256 _d) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _n | uint256 | quotient numerator | 
| _d | uint256 | quotient denominator | 

**Returns**

the nearest integer to the given quotient

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function roundDiv(uint256 _n, uint256 _d) external pure returns (uint256);
```
</details>

---    

> ### geometricMean

calculates the average number of decimal digits in a given list of values

      *

```solidity
function geometricMean(uint256[] _values) external pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _values | uint256[] | list of values (each of which assumed positive) | 

**Returns**

the average number of decimal digits in the given list of values

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function geometricMean(uint256[] _values) external pure returns (uint256);
```
</details>

---    

> ### token

deprecated since version 28, backward compatibility - use only for earlier versions

```solidity
function token() external view
returns(contract IConverterAnchor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function token() external view returns (IConverterAnchor);
```
</details>

---    

> ### reserveRatio

```solidity
function reserveRatio() external view
returns(uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reserveRatio() external view returns (uint32);
```
</details>

---    

> ### reserves

```solidity
function reserves(address ) external view
returns(uint256, uint32, bool, bool, bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
|  | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reserves(address) external view returns (uint256, uint32, bool, bool, bool);
```
</details>

---    

> ### reserveTokens

```solidity
function reserveTokens(uint256 index) external view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reserveTokens(uint256 index) external view returns (address);
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
