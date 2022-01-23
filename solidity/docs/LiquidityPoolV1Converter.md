# LiquidityPoolV1Converter.sol

View Source: [contracts/converter/types/liquidity-pool-v1/LiquidityPoolV1Converter.sol](../contracts/converter/types/liquidity-pool-v1/LiquidityPoolV1Converter.sol)

**↗ Extends: [LiquidityPoolConverter](LiquidityPoolConverter.md)**
**↘ Derived Contracts: [TestLiquidityPoolConverter](TestLiquidityPoolConverter.md)**

**LiquidityPoolV1Converter**

Liquidity Pool v1 Converter

  * The liquidity pool v1 converter is a specialized version of a converter that manages

a classic SovrynSwap liquidity pool.

  * Even though classic pools can have many reserves, the most common configuration of

the pool has 2 reserves with 50%/50% weights.

## Constructor

initializes a new LiquidityPoolV1Converter instance

      *

```js
constructor(ISmartToken _token, IContractRegistry _registry, uint32 _maxConversionFee) public
```

**Arguments**

## Contract Members
**Constants & Variables**

```js
//internal members
contract IEtherToken internal etherToken;

//private members
uint256 private constant CONVERTER_TYPE;

//public members
uint256 public constant DENOMINATOR;
contract IOracle public oracle;
uint256 public token0Decimal;
uint256 public token1Decimal;

```

**Events**

```js
event PriceDataUpdate(address indexed _connectorToken, uint256  _tokenSupply, uint256  _connectorBalance, uint32  _connectorWeight);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | ISmartToken |  | 
| _registry | IContractRegistry |  | 
| _maxConversionFee | uint32 |  | 

## Functions

- [converterType()](#convertertype)
- [setOracle(address _oracle)](#setoracle)
- [acceptAnchorOwnership()](#acceptanchorownership)
- [addReserve(IERC20Token _token, uint32 _weight)](#addreserve)
- [targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)](#targetamountandfee)
- [doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary)](#doconvert)
- [_write()](#_write)
- [addLiquidity(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _minReturn)](#addliquidity)
- [removeLiquidity(uint256 _amount, IERC20Token[] _reserveTokens, uint256[] _reserveMinReturnAmounts)](#removeliquidity)
- [fund(uint256 _amount)](#fund)
- [liquidate(uint256 _amount)](#liquidate)
- [verifyLiquidityInput(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _amount)](#verifyliquidityinput)
- [addLiquidityToPool(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _totalSupply)](#addliquiditytopool)
- [addLiquidityToEmptyPool(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts)](#addliquiditytoemptypool)
- [addLiquidityToNonEmptyPool(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _totalSupply)](#addliquiditytononemptypool)
- [removeLiquidityFromPool(IERC20Token[] _reserveTokens, uint256[] _reserveMinReturnAmounts, uint256 _totalSupply, uint256 _amount)](#removeliquidityfrompool)
- [getMinShare(ISovrynSwapFormula formula, uint256 _totalSupply, IERC20Token[] _reserveTokens, uint256[] _reserveAmounts)](#getminshare)
- [getExpectedOutAmount(uint256 lpTokens)](#getexpectedoutamount)
- [decimalLength(uint256 _x)](#decimallength)
- [roundDiv(uint256 _n, uint256 _d)](#rounddiv)
- [geometricMean(uint256[] _values)](#geometricmean)
- [dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken)](#dispatchrateevents)
- [dispatchPoolTokenRateEvent(uint256 _poolTokenSupply, IERC20Token _reserveToken, uint256 _reserveBalance, uint32 _reserveWeight)](#dispatchpooltokenrateevent)

### converterType

undefined

returns the converter type

      *

```js
function converterType() public pure
returns(uint16)
```

**Returns**

see the converter types in the the main contract doc

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### setOracle

set oracle contract address

can be called by owner of the contract only

```js
function setOracle(address _oracle) external nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oracle | address |  | 

### acceptAnchorOwnership

⤾ overrides [LiquidityPoolConverter.acceptAnchorOwnership](LiquidityPoolConverter.md#acceptanchorownership)

accepts ownership of the anchor after an ownership transfer

also activates the converter

can only be called by the contract owner

note that prior to version 28, you should use 'acceptTokenOwnership' instead

```js
function acceptAnchorOwnership() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### addReserve

⤾ overrides [ConverterBase.addReserve](ConverterBase.md#addreserve)

defines a new reserve token for the converter

can only be called by the owner while the converter is inactive and

2 reserves aren't defined yet

      *

```js
function addReserve(IERC20Token _token, uint32 _weight) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | address of the reserve token | 
| _weight | uint32 |  | 

### targetAmountAndFee

undefined

returns the expected target amount of converting one reserve to another along with the fee

      *

```js
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) public view active validReserve validReserve 
returns(uint256, uint256)
```

**Returns**

expected target amount

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | contract address of the source reserve token | 
| _targetToken | IERC20Token | contract address of the target reserve token | 
| _amount | uint256 | amount of tokens received from the user

      * | 

### doConvert

⤾ overrides [ConverterBase.doConvert](ConverterBase.md#doconvert)

converts a specific amount of source tokens to target tokens

can only be called by the SovrynSwap network contract

      *

```js
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary) internal nonpayable
returns(uint256)
```

**Returns**

amount of tokens received (in units of the target token)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source ERC20 token | 
| _targetToken | IERC20Token | target ERC20 token | 
| _amount | uint256 | amount of tokens to convert (in units of the source token) | 
| _trader | address | address of the caller who executed the conversion | 
| _beneficiary | address | wallet to receive the conversion result

      * | 

### _write

```js
function _write() internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### addLiquidity

increases the pool's liquidity and mints new shares in the pool to the caller

note that prior to version 28, you should use 'fund' instead

      *

```js
function addLiquidity(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _minReturn) public payable protected active 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveAmounts | uint256[] | amount of each reserve token | 
| _minReturn | uint256 | token minimum return-amount | 

### removeLiquidity

decreases the pool's liquidity and burns the caller's shares in the pool

note that prior to version 28, you should use 'liquidate' instead

      *

```js
function removeLiquidity(uint256 _amount, IERC20Token[] _reserveTokens, uint256[] _reserveMinReturnAmounts) public nonpayable protected active 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | token amount | 
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveMinReturnAmounts | uint256[] | minimum return-amount of each reserve token | 

### fund

increases the pool's liquidity and mints new shares in the pool to the caller

for example, if the caller increases the supply by 10%,

then it will cost an amount equal to 10% of each reserve token balance

note that starting from version 28, you should use 'addLiquidity' instead

      *

```js
function fund(uint256 _amount) external payable protected 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount to increase the supply by (in the pool token) | 

### liquidate

decreases the pool's liquidity and burns the caller's shares in the pool

for example, if the holder sells 10% of the supply,

then they will receive 10% of each reserve token balance in return

note that starting from version 28, you should use 'removeLiquidity' instead

      *

```js
function liquidate(uint256 _amount) external nonpayable protected 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount to liquidate (in the pool token) | 

### verifyLiquidityInput

verifies that a given array of tokens is identical to the converter's array of reserve tokens

we take this input in order to allow specifying the corresponding reserve amounts in any order

      *

```js
function verifyLiquidityInput(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _amount) private view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | array of reserve tokens | 
| _reserveAmounts | uint256[] | array of reserve amounts | 
| _amount | uint256 | token amount | 

### addLiquidityToPool

adds liquidity (reserve) to the pool

      *

```js
function addLiquidityToPool(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _totalSupply) private nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveAmounts | uint256[] | amount of each reserve token | 
| _totalSupply | uint256 | token total supply | 

### addLiquidityToEmptyPool

adds liquidity (reserve) to the pool when it's empty

      *

```js
function addLiquidityToEmptyPool(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts) private nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveAmounts | uint256[] | amount of each reserve token | 

### addLiquidityToNonEmptyPool

adds liquidity (reserve) to the pool when it's not empty

      *

```js
function addLiquidityToNonEmptyPool(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _totalSupply) private nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveAmounts | uint256[] | amount of each reserve token | 
| _totalSupply | uint256 | token total supply | 

### removeLiquidityFromPool

removes liquidity (reserve) from the pool

      *

```js
function removeLiquidityFromPool(IERC20Token[] _reserveTokens, uint256[] _reserveMinReturnAmounts, uint256 _totalSupply, uint256 _amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveMinReturnAmounts | uint256[] | minimum return-amount of each reserve token | 
| _totalSupply | uint256 | token total supply | 
| _amount | uint256 | token amount | 

### getMinShare

```js
function getMinShare(ISovrynSwapFormula formula, uint256 _totalSupply, IERC20Token[] _reserveTokens, uint256[] _reserveAmounts) private view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| formula | ISovrynSwapFormula |  | 
| _totalSupply | uint256 |  | 
| _reserveTokens | IERC20Token[] |  | 
| _reserveAmounts | uint256[] |  | 

### getExpectedOutAmount

```js
function getExpectedOutAmount(uint256 lpTokens) external view
returns(amountOut uint256[2])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| lpTokens | uint256 |  | 

### decimalLength

calculates the number of decimal digits in a given value

      *

```js
function decimalLength(uint256 _x) public pure
returns(uint256)
```

**Returns**

the number of decimal digits in the given value

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 | value (assumed positive) | 

### roundDiv

calculates the nearest integer to a given quotient

      *

```js
function roundDiv(uint256 _n, uint256 _d) public pure
returns(uint256)
```

**Returns**

the nearest integer to the given quotient

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _n | uint256 | quotient numerator | 
| _d | uint256 | quotient denominator | 

### geometricMean

calculates the average number of decimal digits in a given list of values

      *

```js
function geometricMean(uint256[] _values) public pure
returns(uint256)
```

**Returns**

the average number of decimal digits in the given list of values

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _values | uint256[] | list of values (each of which assumed positive) | 

### dispatchRateEvents

dispatches rate events for both reserves / pool tokens

only used to circumvent the `stack too deep` compiler error

      *

```js
function dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | address of the source reserve token | 
| _targetToken | IERC20Token | address of the target reserve token | 

### dispatchPoolTokenRateEvent

dispatches the `TokenRateUpdate` for the pool token

only used to circumvent the `stack too deep` compiler error

      *

```js
function dispatchPoolTokenRateEvent(uint256 _poolTokenSupply, IERC20Token _reserveToken, uint256 _reserveBalance, uint32 _reserveWeight) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolTokenSupply | uint256 | total pool token supply | 
| _reserveToken | IERC20Token | address of the reserve token | 
| _reserveBalance | uint256 | reserve balance | 
| _reserveWeight | uint32 | reserve weight | 

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
