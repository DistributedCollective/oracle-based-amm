# LiquidityPoolV2Converter.sol

View Source: [contracts/converter/types/liquidity-pool-v2/LiquidityPoolV2Converter.sol](../contracts/converter/types/liquidity-pool-v2/LiquidityPoolV2Converter.sol)

**↗ Extends: [LiquidityPoolConverter](LiquidityPoolConverter.md)**
**↘ Derived Contracts: [TestLiquidityPoolV2Converter](TestLiquidityPoolV2Converter.md)**

**LiquidityPoolV2Converter**

Liquidity Pool v2 Converter

  * The liquidity pool v2 converter is a specialized version of a converter that uses

price oracles to rebalance the reserve weights in such a way that the primary token

balance always strives to match the staked balance.

  * This type of liquidity pool always has 2 reserves and the reserve weights are dynamic.

## Constructor

initializes a new LiquidityPoolV2Converter instance

      *

```js
constructor(IPoolTokensContainer _poolTokensContainer, IContractRegistry _registry, uint32 _maxConversionFee) public
```

**Arguments**

## Structs
### Fraction

```js
struct Fraction {
 uint256 n,
 uint256 d
}
```

## Contract Members
**Constants & Variables**

```js
//internal members
uint8 internal constant AMPLIFICATION_FACTOR;
uint32 internal constant MAX_DYNAMIC_FEE_FACTOR;

//public members
contract IPriceOracle public priceOracle;
contract IERC20Token public primaryReserveToken;
contract IERC20Token public secondaryReserveToken;
struct LiquidityPoolV2Converter.Fraction public referenceRate;
uint256 public referenceRateUpdateTime;
struct LiquidityPoolV2Converter.Fraction public lastConversionRate;
mapping(address => uint256) public maxStakedBalances;
bool public maxStakedBalanceEnabled;
uint256 public dynamicFeeFactor;

//private members
mapping(address => uint256) private stakedBalances;
mapping(address => contract ISmartToken) private reservesToPoolTokens;
mapping(address => contract IERC20Token) private poolTokensToReserves;
uint256 private constant RATE_PROPAGATION_PERIOD;
uint256 private constant MAX_RATE_FACTOR_LOWER_BOUND;
uint256 private constant MAX_RATE_FACTOR_UPPER_BOUND;

```

**Events**

```js
event DynamicFeeFactorUpdate(uint256  _prevFactor, uint256  _newFactor);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolTokensContainer | IPoolTokensContainer |  | 
| _registry | IContractRegistry |  | 
| _maxConversionFee | uint32 |  | 

## Modifiers

- [validPoolToken](#validpooltoken)

### validPoolToken

```js
modifier validPoolToken(ISmartToken _address) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | ISmartToken |  | 

## Functions

- [_validPoolToken(ISmartToken _address)](#_validpooltoken)
- [converterType()](#convertertype)
- [isActive()](#isactive)
- [amplificationFactor()](#amplificationfactor)
- [activate(IERC20Token _primaryReserveToken, IConsumerPriceOracle _primaryReserveOracle, IConsumerPriceOracle _secondaryReserveOracle)](#activate)
- [setDynamicFeeFactor(uint256 _dynamicFeeFactor)](#setdynamicfeefactor)
- [reserveStakedBalance(IERC20Token _reserveToken)](#reservestakedbalance)
- [reserveAmplifiedBalance(IERC20Token _reserveToken)](#reserveamplifiedbalance)
- [setReserveStakedBalance(IERC20Token _reserveToken, uint256 _balance)](#setreservestakedbalance)
- [setMaxStakedBalances(uint256 _reserve1MaxStakedBalance, uint256 _reserve2MaxStakedBalance)](#setmaxstakedbalances)
- [disableMaxStakedBalances()](#disablemaxstakedbalances)
- [poolToken(IERC20Token _reserveToken)](#pooltoken)
- [liquidationLimit(ISmartToken _poolToken)](#liquidationlimit)
- [addReserve(IERC20Token _token, uint32 _weight)](#addreserve)
- [effectiveTokensRate()](#effectivetokensrate)
- [effectiveReserveWeights()](#effectivereserveweights)
- [targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)](#targetamountandfee)
- [doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary)](#doconvert)
- [doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)](#doconvert)
- [addLiquidity(IERC20Token _reserveToken, uint256 _amount, uint256 _minReturn)](#addliquidity)
- [removeLiquidity(ISmartToken _poolToken, uint256 _amount, uint256 _minReturn)](#removeliquidity)
- [removeLiquidityReturnAndFee(ISmartToken _poolToken, uint256 _amount)](#removeliquidityreturnandfee)
- [targetAmountAndFees(IERC20Token _sourceToken, IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight, struct LiquidityPoolV2Converter.Fraction _rate, uint256 _amount)](#targetamountandfees)
- [calculateDynamicFee(IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight, struct LiquidityPoolV2Converter.Fraction _rate, uint256 _targetAmount)](#calculatedynamicfee)
- [calculateFeeToEquilibrium(uint256 _primaryReserveStaked, uint256 _secondaryReserveStaked, uint256 _primaryReserveWeight, uint256 _secondaryReserveWeight, uint256 _primaryReserveRate, uint256 _secondaryReserveRate, uint256 _dynamicFeeFactor)](#calculatefeetoequilibrium)
- [createPoolTokens()](#createpooltokens)
- [_effectiveTokensRate()](#_effectivetokensrate)
- [handleRateChange()](#handleratechange)
- [rebalance()](#rebalance)
- [effectiveReserveWeights(struct LiquidityPoolV2Converter.Fraction _rate)](#effectivereserveweights)
- [tokensRate(IERC20Token _token1, IERC20Token _token2, uint32 _token1Weight, uint32 _token2Weight)](#tokensrate)
- [dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight)](#dispatchrateevents)
- [dispatchTokenRateUpdateEvent(IERC20Token _token1, IERC20Token _token2, uint32 _token1Weight, uint32 _token2Weight)](#dispatchtokenrateupdateevent)
- [dispatchPoolTokenRateUpdateEvent(ISmartToken _poolToken, uint256 _poolTokenSupply, IERC20Token _reserveToken)](#dispatchpooltokenrateupdateevent)
- [time()](#time)
- [reduceRate(uint256 _n, uint256 _d)](#reducerate)
- [reduceFactors(uint256 _max, uint256 _min)](#reducefactors)

### _validPoolToken

```js
function _validPoolToken(ISmartToken _address) internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | ISmartToken |  | 

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

### isActive

⤾ overrides [ConverterBase.isActive](ConverterBase.md#isactive)

returns true if the converter is active, false otherwise

      *

```js
function isActive() public view
returns(bool)
```

**Returns**

true if the converter is active, false otherwise

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### amplificationFactor

returns the liquidity amplification factor in the pool

      *

```js
function amplificationFactor() public pure
returns(uint8)
```

**Returns**

liquidity amplification factor

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### activate

sets the pool's primary reserve token / price oracles and activates the pool

each oracle must be able to provide the rate for each reserve token

note that the oracle must be whitelisted prior to the call

can only be called by the owner while the pool is inactive

      *

```js
function activate(IERC20Token _primaryReserveToken, IConsumerPriceOracle _primaryReserveOracle, IConsumerPriceOracle _secondaryReserveOracle) public nonpayable inactive ownerOnly validReserve notThis notThis validAddress validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _primaryReserveToken | IERC20Token | address of the pool's primary reserve token | 
| _primaryReserveOracle | IConsumerPriceOracle | address of a chainlink price oracle for the primary reserve token | 
| _secondaryReserveOracle | IConsumerPriceOracle | address of a chainlink price oracle for the secondary reserve token | 

### setDynamicFeeFactor

updates the current dynamic fee factor

can only be called by the contract owner

      *

```js
function setDynamicFeeFactor(uint256 _dynamicFeeFactor) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _dynamicFeeFactor | uint256 | new dynamic fee factor, represented in ppm | 

### reserveStakedBalance

returns the staked balance of a given reserve token

      *

```js
function reserveStakedBalance(IERC20Token _reserveToken) public view validReserve 
returns(uint256)
```

**Returns**

staked balance

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token address

      * | 

### reserveAmplifiedBalance

returns the amplified balance of a given reserve token

      *

```js
function reserveAmplifiedBalance(IERC20Token _reserveToken) public view validReserve 
returns(uint256)
```

**Returns**

amplified balance

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token address

      * | 

### setReserveStakedBalance

sets the reserve's staked balance

can only be called by the upgrader contract while the upgrader is the owner

      *

```js
function setReserveStakedBalance(IERC20Token _reserveToken, uint256 _balance) public nonpayable ownerOnly only validReserve 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token address | 
| _balance | uint256 | new reserve staked balance | 

### setMaxStakedBalances

sets the max staked balance for both reserves

available as a temporary mechanism during the pilot

can only be called by the owner

      *

```js
function setMaxStakedBalances(uint256 _reserve1MaxStakedBalance, uint256 _reserve2MaxStakedBalance) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserve1MaxStakedBalance | uint256 | max staked balance for reserve 1 | 
| _reserve2MaxStakedBalance | uint256 | max staked balance for reserve 2 | 

### disableMaxStakedBalances

disables the max staked balance mechanism

available as a temporary mechanism during the pilot

once disabled, it cannot be re-enabled

can only be called by the owner

```js
function disableMaxStakedBalances() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### poolToken

returns the pool token address by the reserve token address

      *

```js
function poolToken(IERC20Token _reserveToken) public view
returns(contract ISmartToken)
```

**Returns**

pool token address

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token address

      * | 

### liquidationLimit

returns the maximum number of pool tokens that can currently be liquidated

      *

```js
function liquidationLimit(ISmartToken _poolToken) public view
returns(uint256)
```

**Returns**

liquidation limit

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolToken | ISmartToken | address of the pool token

      * | 

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
| _weight | uint32 | reserve weight, represented in ppm, 1-1000000 | 

### effectiveTokensRate

returns the effective rate of 1 primary token in secondary tokens

      *

```js
function effectiveTokensRate() public view
returns(uint256, uint256)
```

**Returns**

rate of 1 primary token in secondary tokens (numerator)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### effectiveReserveWeights

returns the effective reserve tokens weights

      *

```js
function effectiveReserveWeights() public view
returns(uint256, uint256)
```

**Returns**

reserve1 weight

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### targetAmountAndFee

undefined

returns the expected target amount of converting one reserve to another along with the fee

      *

```js
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) public view active 
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
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary) internal nonpayable active validReserve validReserve 
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

### doConvert

converts a specific amount of source tokens to target tokens

can only be called by the SovrynSwap network contract

      *

```js
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) private nonpayable
returns(uint256, uint256)
```

**Returns**

amount of tokens received (in units of the target token)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source ERC20 token | 
| _targetToken | IERC20Token | target ERC20 token | 
| _amount | uint256 | amount of tokens to convert (in units of the source token)

      * | 

### addLiquidity

increases the pool's liquidity and mints new shares in the pool to the caller

      *

```js
function addLiquidity(IERC20Token _reserveToken, uint256 _amount, uint256 _minReturn) public payable protected active validReserve greaterThanZero greaterThanZero 
returns(uint256)
```

**Returns**

amount of pool tokens minted

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | address of the reserve token to add liquidity to | 
| _amount | uint256 | amount of liquidity to add | 
| _minReturn | uint256 | minimum return-amount of pool tokens

      * | 

### removeLiquidity

decreases the pool's liquidity and burns the caller's shares in the pool

      *

```js
function removeLiquidity(ISmartToken _poolToken, uint256 _amount, uint256 _minReturn) public nonpayable protected active validPoolToken greaterThanZero greaterThanZero 
returns(uint256)
```

**Returns**

amount of liquidity removed

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolToken | ISmartToken | address of the pool token | 
| _amount | uint256 | amount of pool tokens to burn | 
| _minReturn | uint256 | minimum return-amount of reserve tokens

      * | 

### removeLiquidityReturnAndFee

calculates the amount of reserve tokens entitled for a given amount of pool tokens

note that a fee is applied according to the equilibrium level of the primary reserve token

      *

```js
function removeLiquidityReturnAndFee(ISmartToken _poolToken, uint256 _amount) public view
returns(uint256, uint256)
```

**Returns**

amount after fee and fee, in reserve token units

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolToken | ISmartToken | address of the pool token | 
| _amount | uint256 | amount of pool tokens

      * | 

### targetAmountAndFees

returns the expected target amount of converting one reserve to another along with the fees

this version of the function expects the reserve weights as an input (gas optimization)

      *

```js
function targetAmountAndFees(IERC20Token _sourceToken, IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight, struct LiquidityPoolV2Converter.Fraction _rate, uint256 _amount) private view
returns(targetAmount uint256, standardFee uint256, dynamicFee uint256)
```

**Returns**

expected target amount

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | contract address of the source reserve token | 
| _targetToken | IERC20Token | contract address of the target reserve token | 
| _sourceWeight | uint32 | source reserve token weight or 0 to read it from storage | 
| _targetWeight | uint32 | target reserve token weight or 0 to read it from storage | 
| _rate | struct LiquidityPoolV2Converter.Fraction | rate between the reserve tokens | 
| _amount | uint256 | amount of tokens received from the user

      * | 

### calculateDynamicFee

returns the dynamic fee for a given target amount

      *

```js
function calculateDynamicFee(IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight, struct LiquidityPoolV2Converter.Fraction _rate, uint256 _targetAmount) internal view
returns(uint256)
```

**Returns**

dynamic fee

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _targetToken | IERC20Token | contract address of the target reserve token | 
| _sourceWeight | uint32 | source reserve token weight | 
| _targetWeight | uint32 | target reserve token weight | 
| _rate | struct LiquidityPoolV2Converter.Fraction | rate of 1 primary token in secondary tokens | 
| _targetAmount | uint256 | target amount

      * | 

### calculateFeeToEquilibrium

returns the relative fee required for mitigating the secondary reserve distance from equilibrium

      *

```js
function calculateFeeToEquilibrium(uint256 _primaryReserveStaked, uint256 _secondaryReserveStaked, uint256 _primaryReserveWeight, uint256 _secondaryReserveWeight, uint256 _primaryReserveRate, uint256 _secondaryReserveRate, uint256 _dynamicFeeFactor) internal pure
returns(uint256)
```

**Returns**

relative fee, represented in ppm

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _primaryReserveStaked | uint256 | primary reserve staked balance | 
| _secondaryReserveStaked | uint256 | secondary reserve staked balance | 
| _primaryReserveWeight | uint256 | primary reserve weight | 
| _secondaryReserveWeight | uint256 | secondary reserve weight | 
| _primaryReserveRate | uint256 | primary reserve rate | 
| _secondaryReserveRate | uint256 | secondary reserve rate | 
| _dynamicFeeFactor | uint256 | dynamic fee factor

      * | 

### createPoolTokens

creates the converter's pool tokens

note that technically pool tokens can be created on deployment but gas limit

might get too high for a block, so creating them on first activation

```js
function createPoolTokens() internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _effectiveTokensRate

returns the effective rate between the two reserve tokens

      *

```js
function _effectiveTokensRate() private view
returns(struct LiquidityPoolV2Converter.Fraction)
```

**Returns**

rate

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### handleRateChange

checks if the rate has changed and if so, rebalances the weights

note that rebalancing based on rate change only happens once per block

      *

```js
function handleRateChange() private nonpayable
returns(bool, struct LiquidityPoolV2Converter.Fraction)
```

**Returns**

whether the rate was updated

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### rebalance

updates the pool's reserve weights with new values in order to push the current primary

reserve token balance to its staked balance

```js
function rebalance() private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### effectiveReserveWeights

returns the effective reserve weights based on the staked balance, current balance and oracle price

      *

```js
function effectiveReserveWeights(struct LiquidityPoolV2Converter.Fraction _rate) private view
returns(uint32, uint32)
```

**Returns**

new primary reserve weight

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _rate | struct LiquidityPoolV2Converter.Fraction | rate between the reserve tokens

      * | 

### tokensRate

calculates and returns the rate between two reserve tokens

      *

```js
function tokensRate(IERC20Token _token1, IERC20Token _token2, uint32 _token1Weight, uint32 _token2Weight) private view
returns(struct LiquidityPoolV2Converter.Fraction)
```

**Returns**

rate

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token1 | IERC20Token | contract address of the token to calculate the rate of one unit of | 
| _token2 | IERC20Token | contract address of the token to calculate the rate of one `_token1` unit in | 
| _token1Weight | uint32 | reserve weight of token1 | 
| _token2Weight | uint32 | reserve weight of token2

      * | 

### dispatchRateEvents

dispatches rate events for both reserve tokens and for the target pool token

only used to circumvent the `stack too deep` compiler error

      *

```js
function dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | contract address of the source reserve token | 
| _targetToken | IERC20Token | contract address of the target reserve token | 
| _sourceWeight | uint32 | source reserve token weight | 
| _targetWeight | uint32 | target reserve token weight | 

### dispatchTokenRateUpdateEvent

dispatches token rate update event

only used to circumvent the `stack too deep` compiler error

      *

```js
function dispatchTokenRateUpdateEvent(IERC20Token _token1, IERC20Token _token2, uint32 _token1Weight, uint32 _token2Weight) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token1 | IERC20Token | contract address of the token to calculate the rate of one unit of | 
| _token2 | IERC20Token | contract address of the token to calculate the rate of one `_token1` unit in | 
| _token1Weight | uint32 | reserve weight of token1 | 
| _token2Weight | uint32 | reserve weight of token2 | 

### dispatchPoolTokenRateUpdateEvent

dispatches the `TokenRateUpdate` for the pool token

only used to circumvent the `stack too deep` compiler error

      *

```js
function dispatchPoolTokenRateUpdateEvent(ISmartToken _poolToken, uint256 _poolTokenSupply, IERC20Token _reserveToken) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolToken | ISmartToken | address of the pool token | 
| _poolTokenSupply | uint256 | total pool token supply | 
| _reserveToken | IERC20Token | address of the reserve token | 

### time

⤿ Overridden Implementation(s): [TestLiquidityPoolV2Converter.time](TestLiquidityPoolV2Converter.md#time)

returns the current time

```js
function time() internal view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### reduceRate

reduces the numerator and denominator while maintaining the ratio between them as accurately as possible

```js
function reduceRate(uint256 _n, uint256 _d) internal pure
returns(struct LiquidityPoolV2Converter.Fraction)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _n | uint256 |  | 
| _d | uint256 |  | 

### reduceFactors

reduces the factors while maintaining the ratio between them as accurately as possible

```js
function reduceFactors(uint256 _max, uint256 _min) internal pure
returns(struct LiquidityPoolV2Converter.Fraction)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _max | uint256 |  | 
| _min | uint256 |  | 

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
