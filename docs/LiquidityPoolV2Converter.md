# LiquidityPoolV2Converter.sol

View Source: [contracts/converter/types/liquidity-pool-v2/LiquidityPoolV2Converter.sol](../solidity/contracts/converter/types/liquidity-pool-v2/LiquidityPoolV2Converter.sol)

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

---    

> ### _validPoolToken

```solidity
function _validPoolToken(ISmartToken _address) internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | ISmartToken |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _validPoolToken(ISmartToken _address) internal view {

        require(poolTokensToReserves[_address] != address(0), "ERR_INVALID_POOL_TOKEN");

    }
```
</details>

---    

> ### converterType

⤾ overrides [IConverter.converterType](IConverter.md#convertertype)

returns the converter type

      *

```solidity
function converterType() public pure
returns(uint16)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function converterType() public pure returns (uint16) {

        return 2;

    }
```
</details>

---    

> ### isActive

⤾ overrides [ConverterBase.isActive](ConverterBase.md#isactive)

returns true if the converter is active, false otherwise

      *

```solidity
function isActive() public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isActive() public view returns (bool) {

        return super.isActive() && priceOracle != address(0);

    }
```
</details>

---    

> ### amplificationFactor

returns the liquidity amplification factor in the pool

      *

```solidity
function amplificationFactor() public pure
returns(uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function amplificationFactor() public pure returns (uint8) {

        return AMPLIFICATION_FACTOR;

    }
```
</details>

---    

> ### activate

sets the pool's primary reserve token / price oracles and activates the pool

each oracle must be able to provide the rate for each reserve token

note that the oracle must be whitelisted prior to the call

can only be called by the owner while the pool is inactive

      *

```solidity
function activate(IERC20Token _primaryReserveToken, IConsumerPriceOracle _primaryReserveOracle, IConsumerPriceOracle _secondaryReserveOracle) public nonpayable inactive ownerOnly validReserve notThis notThis validAddress validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _primaryReserveToken | IERC20Token | address of the pool's primary reserve token | 
| _primaryReserveOracle | IConsumerPriceOracle | address of a chainlink price oracle for the primary reserve token | 
| _secondaryReserveOracle | IConsumerPriceOracle | address of a chainlink price oracle for the secondary reserve token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function activate(IERC20Token _primaryReserveToken, IConsumerPriceOracle _primaryReserveOracle, IConsumerPriceOracle _secondaryReserveOracle)

        public

        inactive

        ownerOnly

        validReserve(_primaryReserveToken)

        notThis(_primaryReserveOracle)

        notThis(_secondaryReserveOracle)

        validAddress(_primaryReserveOracle)

        validAddress(_secondaryReserveOracle)

    {

        // validate anchor ownership

        require(anchor.owner() == address(this), "ERR_ANCHOR_NOT_OWNED");

        // validate oracles

        IWhitelist oracleWhitelist = IWhitelist(addressOf(CHAINLINK_ORACLE_WHITELIST));

        require(oracleWhitelist.isWhitelisted(_primaryReserveOracle), "ERR_INVALID_ORACLE");

        require(oracleWhitelist.isWhitelisted(_secondaryReserveOracle), "ERR_INVALID_ORACLE");

        // create the converter's pool tokens if they don't already exist

        createPoolTokens();

        // sets the primary & secondary reserve tokens

        primaryReserveToken = _primaryReserveToken;

        if (_primaryReserveToken == reserveTokens[0])

            secondaryReserveToken = reserveTokens[1];

        else

            secondaryReserveToken = reserveTokens[0];

        // creates and initalizes the price oracle and sets initial rates

        LiquidityPoolV2ConverterCustomFactory customFactory =

            LiquidityPoolV2ConverterCustomFactory(IConverterFactory(addressOf(CONVERTER_FACTORY)).customFactories(converterType()));

        priceOracle = customFactory.createPriceOracle(_primaryReserveToken, secondaryReserveToken, _primaryReserveOracle, _secondaryReserveOracle);

        (referenceRate.n, referenceRate.d) = priceOracle.latestRate(primaryReserveToken, secondaryReserveToken);

        lastConversionRate = referenceRate;

        referenceRateUpdateTime = time();

        // if we are upgrading from an older converter, make sure that reserve balances are in-sync and rebalance

        uint256 primaryReserveStakedBalance = reserveStakedBalance(primaryReserveToken);

        uint256 primaryReserveBalance = reserveBalance(primaryReserveToken);

        uint256 secondaryReserveBalance = reserveBalance(secondaryReserveToken);

        if (primaryReserveStakedBalance == primaryReserveBalance) {

            if (primaryReserveStakedBalance > 0 || secondaryReserveBalance > 0) {

                rebalance();

            }

        }

        else if (primaryReserveStakedBalance > 0 && primaryReserveBalance > 0 && secondaryReserveBalance > 0) {

            rebalance();

        }

        emit Activation(converterType(), anchor, true);

    }
```
</details>

---    

> ### setDynamicFeeFactor

updates the current dynamic fee factor

can only be called by the contract owner

      *

```solidity
function setDynamicFeeFactor(uint256 _dynamicFeeFactor) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _dynamicFeeFactor | uint256 | new dynamic fee factor, represented in ppm | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setDynamicFeeFactor(uint256 _dynamicFeeFactor) public ownerOnly {

        require(_dynamicFeeFactor <= MAX_DYNAMIC_FEE_FACTOR, "ERR_INVALID_DYNAMIC_FEE_FACTOR");

        emit DynamicFeeFactorUpdate(dynamicFeeFactor, _dynamicFeeFactor);

        dynamicFeeFactor = _dynamicFeeFactor;

    }
```
</details>

---    

> ### reserveStakedBalance

returns the staked balance of a given reserve token

      *

```solidity
function reserveStakedBalance(IERC20Token _reserveToken) public view validReserve 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token address        * | 

**Returns**

staked balance

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reserveStakedBalance(IERC20Token _reserveToken)

        public

        view

        validReserve(_reserveToken)

        returns (uint256)

    {

        return stakedBalances[_reserveToken];

    }
```
</details>

---    

> ### reserveAmplifiedBalance

returns the amplified balance of a given reserve token

      *

```solidity
function reserveAmplifiedBalance(IERC20Token _reserveToken) public view validReserve 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token address        * | 

**Returns**

amplified balance

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reserveAmplifiedBalance(IERC20Token _reserveToken)

        public

        view

        validReserve(_reserveToken)

        returns (uint256)

    {

        return stakedBalances[_reserveToken].mul(AMPLIFICATION_FACTOR - 1).add(reserveBalance(_reserveToken));

    }
```
</details>

---    

> ### setReserveStakedBalance

sets the reserve's staked balance

can only be called by the upgrader contract while the upgrader is the owner

      *

```solidity
function setReserveStakedBalance(IERC20Token _reserveToken, uint256 _balance) public nonpayable ownerOnly only validReserve 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token address | 
| _balance | uint256 | new reserve staked balance | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReserveStakedBalance(IERC20Token _reserveToken, uint256 _balance)

        public

        ownerOnly

        only(CONVERTER_UPGRADER)

        validReserve(_reserveToken)

    {

        stakedBalances[_reserveToken] = _balance;

    }
```
</details>

---    

> ### setMaxStakedBalances

sets the max staked balance for both reserves

available as a temporary mechanism during the pilot

can only be called by the owner

      *

```solidity
function setMaxStakedBalances(uint256 _reserve1MaxStakedBalance, uint256 _reserve2MaxStakedBalance) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserve1MaxStakedBalance | uint256 | max staked balance for reserve 1 | 
| _reserve2MaxStakedBalance | uint256 | max staked balance for reserve 2 | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMaxStakedBalances(uint256 _reserve1MaxStakedBalance, uint256 _reserve2MaxStakedBalance) public ownerOnly {

        maxStakedBalances[reserveTokens[0]] = _reserve1MaxStakedBalance;

        maxStakedBalances[reserveTokens[1]] = _reserve2MaxStakedBalance;

    }
```
</details>

---    

> ### disableMaxStakedBalances

disables the max staked balance mechanism

available as a temporary mechanism during the pilot

once disabled, it cannot be re-enabled

can only be called by the owner

```solidity
function disableMaxStakedBalances() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disableMaxStakedBalances() public ownerOnly {

        maxStakedBalanceEnabled = false;

    }
```
</details>

---    

> ### poolToken

returns the pool token address by the reserve token address

      *

```solidity
function poolToken(IERC20Token _reserveToken) public view
returns(contract ISmartToken)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | reserve token address        * | 

**Returns**

pool token address

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function poolToken(IERC20Token _reserveToken) public view returns (ISmartToken) {

        return reservesToPoolTokens[_reserveToken];

    }
```
</details>

---    

> ### liquidationLimit

returns the maximum number of pool tokens that can currently be liquidated

      *

```solidity
function liquidationLimit(ISmartToken _poolToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolToken | ISmartToken | address of the pool token        * | 

**Returns**

liquidation limit

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function liquidationLimit(ISmartToken _poolToken) public view returns (uint256) {

        // get the pool token supply

        uint256 poolTokenSupply = _poolToken.totalSupply();

        // get the reserve token associated with the pool token and its balance / staked balance

        IERC20Token reserveToken = poolTokensToReserves[_poolToken];

        uint256 balance = reserveBalance(reserveToken);

        uint256 stakedBalance = stakedBalances[reserveToken];

        // calculate the amount that's available for liquidation

        return balance.mul(poolTokenSupply).div(stakedBalance);

    }
```
</details>

---    

> ### addReserve

⤾ overrides [ConverterBase.addReserve](ConverterBase.md#addreserve)

defines a new reserve token for the converter

can only be called by the owner while the converter is inactive and

2 reserves aren't defined yet

      *

```solidity
function addReserve(IERC20Token _token, uint32 _weight) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | address of the reserve token | 
| _weight | uint32 | reserve weight, represented in ppm, 1-1000000 | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addReserve(IERC20Token _token, uint32 _weight) public {

        // verify that the converter doesn't have 2 reserves yet

        require(reserveTokenCount() < 2, "ERR_INVALID_RESERVE_COUNT");

        super.addReserve(_token, _weight);

    }
```
</details>

---    

> ### effectiveTokensRate

returns the effective rate of 1 primary token in secondary tokens

      *

```solidity
function effectiveTokensRate() public view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function effectiveTokensRate() public view returns (uint256, uint256) {

        Fraction memory rate = _effectiveTokensRate();

        return (rate.n, rate.d);

    }
```
</details>

---    

> ### effectiveReserveWeights

returns the effective reserve tokens weights

      *

```solidity
function effectiveReserveWeights() public view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function effectiveReserveWeights() public view returns (uint256, uint256) {

        Fraction memory rate = _effectiveTokensRate();

        (uint32 primaryReserveWeight, uint32 secondaryReserveWeight) = effectiveReserveWeights(rate);

        if (primaryReserveToken == reserveTokens[0]) {

            return (primaryReserveWeight, secondaryReserveWeight);

        }

        return (secondaryReserveWeight, primaryReserveWeight);

    }
```
</details>

---    

> ### targetAmountAndFee

⤾ overrides [IConverter.targetAmountAndFee](IConverter.md#targetamountandfee)

returns the expected target amount of converting one reserve to another along with the fee

      *

```solidity
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) public view active 
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
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)

        public

        view

        active

        returns (uint256, uint256)

    {

        // validate input

        // not using the `validReserve` modifier to circumvent `stack too deep` compiler error

        _validReserve(_sourceToken);

        _validReserve(_targetToken);

        require(_sourceToken != _targetToken, "ERR_SAME_SOURCE_TARGET");

        // check if rebalance is required (some of this code is duplicated for gas optimization)

        uint32 sourceTokenWeight;

        uint32 targetTokenWeight;

        // if the rate was already checked in this block, use the current weights.

        // otherwise, get the new weights

        Fraction memory rate;

        if (referenceRateUpdateTime == time()) {

            rate = referenceRate;

            sourceTokenWeight = reserves[_sourceToken].weight;

            targetTokenWeight = reserves[_targetToken].weight;

        }

        else {

            // get the new rate / reserve weights

            rate = _effectiveTokensRate();

            (uint32 primaryReserveWeight, uint32 secondaryReserveWeight) = effectiveReserveWeights(rate);

            if (_sourceToken == primaryReserveToken) {

                sourceTokenWeight = primaryReserveWeight;

                targetTokenWeight = secondaryReserveWeight;

            }

            else {

                sourceTokenWeight = secondaryReserveWeight;

                targetTokenWeight = primaryReserveWeight;

            }

        }

        // return the target amount and the conversion fee using the updated reserve weights

        (uint256 targetAmount, , uint256 fee) = targetAmountAndFees(_sourceToken, _targetToken, sourceTokenWeight, targetTokenWeight, rate, _amount);

        return (targetAmount, fee);

    }
```
</details>

---    

> ### doConvert

⤾ overrides [ConverterBase.doConvert](ConverterBase.md#doconvert)

converts a specific amount of source tokens to target tokens

can only be called by the SovrynSwap network contract

      *

```solidity
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary) internal nonpayable active validReserve validReserve 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source ERC20 token | 
| _targetToken | IERC20Token | target ERC20 token | 
| _amount | uint256 | amount of tokens to convert (in units of the source token) | 
| _trader | address | address of the caller who executed the conversion | 
| _beneficiary | address | wallet to receive the conversion result        * | 

**Returns**

amount of tokens received (in units of the target token)

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary)

        internal

        active

        validReserve(_sourceToken)

        validReserve(_targetToken)

        returns (uint256)

    {

        // convert the amount and return the resulted amount and fee

        (uint256 amount, uint256 fee) = doConvert(_sourceToken, _targetToken, _amount);

        // transfer funds to the beneficiary in the to reserve token

        if (_targetToken == ETH_RESERVE_ADDRESS) {

            _beneficiary.transfer(amount);

        }

        else {

            safeTransfer(_targetToken, _beneficiary, amount);

        }

        // dispatch the conversion event

        dispatchConversionEvent(_sourceToken, _targetToken, _trader, _amount, amount, fee, 0);

        // dispatch rate updates for the pool / reserve tokens

        dispatchRateEvents(_sourceToken, _targetToken, reserves[_sourceToken].weight, reserves[_targetToken].weight);

        // return the conversion result amount

        return amount;

    }
```
</details>

---    

> ### doConvert

converts a specific amount of source tokens to target tokens

can only be called by the SovrynSwap network contract

      *

```solidity
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) private nonpayable
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source ERC20 token | 
| _targetToken | IERC20Token | target ERC20 token | 
| _amount | uint256 | amount of tokens to convert (in units of the source token)        * | 

**Returns**

amount of tokens received (in units of the target token)

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) private returns (uint256, uint256) {

        // check if the rate has changed and rebalance the pool if needed (once in a block)

        (bool rateUpdated, Fraction memory rate) = handleRateChange();

        // get expected target amount and fees

        (uint256 amount, uint256 standardFee, uint256 dynamicFee) = targetAmountAndFees(_sourceToken, _targetToken, 0, 0, rate, _amount);

        // ensure that the trade gives something in return

        require(amount != 0, "ERR_ZERO_TARGET_AMOUNT");

        // ensure that the trade won't deplete the reserve balance

        uint256 targetReserveBalance = reserveBalance(_targetToken);

        require(amount < targetReserveBalance, "ERR_TARGET_AMOUNT_TOO_HIGH");

        // ensure that the input amount was already deposited

        if (_sourceToken == ETH_RESERVE_ADDRESS)

            require(msg.value == _amount, "ERR_ETH_AMOUNT_MISMATCH");

        else

            require(msg.value == 0 && _sourceToken.balanceOf(this).sub(reserveBalance(_sourceToken)) >= _amount, "ERR_INVALID_AMOUNT");

        // sync the reserve balances

        syncReserveBalance(_sourceToken);

        reserves[_targetToken].balance = targetReserveBalance.sub(amount);

        // update the target staked balance with the fee

        stakedBalances[_targetToken] = stakedBalances[_targetToken].add(standardFee);

        // update the last conversion rate

        if (rateUpdated) {

            lastConversionRate = tokensRate(primaryReserveToken, secondaryReserveToken, 0, 0);

        }

        return (amount, dynamicFee);

    }
```
</details>

---    

> ### addLiquidity

increases the pool's liquidity and mints new shares in the pool to the caller

      *

```solidity
function addLiquidity(IERC20Token _reserveToken, uint256 _amount, uint256 _minReturn) public payable protected active validReserve greaterThanZero greaterThanZero 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token | address of the reserve token to add liquidity to | 
| _amount | uint256 | amount of liquidity to add | 
| _minReturn | uint256 | minimum return-amount of pool tokens        * | 

**Returns**

amount of pool tokens minted

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidity(IERC20Token _reserveToken, uint256 _amount, uint256 _minReturn)

        public

        payable

        protected

        active

        validReserve(_reserveToken)

        greaterThanZero(_amount)

        greaterThanZero(_minReturn)

        returns (uint256)

    {

        // verify that msg.value is identical to the provided amount for ETH reserve, or 0 otherwise

        require(_reserveToken == ETH_RESERVE_ADDRESS ? msg.value == _amount : msg.value == 0, "ERR_ETH_AMOUNT_MISMATCH");

        // sync the reserve balances just in case

        syncReserveBalances();

        // for ETH reserve, deduct the amount that was just synced (since it's already in the converter)

        if (_reserveToken == ETH_RESERVE_ADDRESS)

            reserves[ETH_RESERVE_ADDRESS].balance = reserves[ETH_RESERVE_ADDRESS].balance.sub(msg.value);

        // get the reserve staked balance before adding the liquidity to it

        uint256 initialStakedBalance = stakedBalances[_reserveToken];

        // during the pilot, ensure that the new staked balance isn't greater than the max limit

        if (maxStakedBalanceEnabled) {

            require(maxStakedBalances[_reserveToken] == 0 || initialStakedBalance.add(_amount) <= maxStakedBalances[_reserveToken], "ERR_MAX_STAKED_BALANCE_REACHED");

        }

        // get the pool token associated with the reserve and its supply

        ISmartToken reservePoolToken = reservesToPoolTokens[_reserveToken];

        uint256 poolTokenSupply = reservePoolToken.totalSupply();

        // for non ETH reserve, transfer the funds from the user to the pool

        if (_reserveToken != ETH_RESERVE_ADDRESS)

            safeTransferFrom(_reserveToken, msg.sender, this, _amount);

        // sync the reserve balance / staked balance

        reserves[_reserveToken].balance = reserves[_reserveToken].balance.add(_amount);

        stakedBalances[_reserveToken] = initialStakedBalance.add(_amount);

        // calculate how many pool tokens to mint

        // for an empty pool, the price is 1:1, otherwise the price is based on the ratio

        // between the pool token supply and the staked balance

        uint256 poolTokenAmount = 0;

        if (initialStakedBalance == 0 || poolTokenSupply == 0)

            poolTokenAmount = _amount;

        else

            poolTokenAmount = _amount.mul(poolTokenSupply).div(initialStakedBalance);

        require(poolTokenAmount >= _minReturn, "ERR_RETURN_TOO_LOW");

        // mint new pool tokens to the caller

        IPoolTokensContainer(anchor).mint(reservePoolToken, msg.sender, poolTokenAmount);

        // rebalance the pool's reserve weights

        rebalance();

        // dispatch the LiquidityAdded event

        emit LiquidityAdded(msg.sender, _reserveToken, _amount, initialStakedBalance.add(_amount), poolTokenSupply.add(poolTokenAmount));

        // dispatch the `TokenRateUpdate` event for the pool token

        dispatchPoolTokenRateUpdateEvent(reservePoolToken, poolTokenSupply.add(poolTokenAmount), _reserveToken);

        // dispatch the `TokenRateUpdate` event for the reserve tokens

        dispatchTokenRateUpdateEvent(reserveTokens[0], reserveTokens[1], 0, 0);

        // return the amount of pool tokens minted

        return poolTokenAmount;

    }
```
</details>

---    

> ### removeLiquidity

decreases the pool's liquidity and burns the caller's shares in the pool

      *

```solidity
function removeLiquidity(ISmartToken _poolToken, uint256 _amount, uint256 _minReturn) public nonpayable protected active validPoolToken greaterThanZero greaterThanZero 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolToken | ISmartToken | address of the pool token | 
| _amount | uint256 | amount of pool tokens to burn | 
| _minReturn | uint256 | minimum return-amount of reserve tokens        * | 

**Returns**

amount of liquidity removed

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidity(ISmartToken _poolToken, uint256 _amount, uint256 _minReturn)

        public

        protected

        active

        validPoolToken(_poolToken)

        greaterThanZero(_amount)

        greaterThanZero(_minReturn)

        returns (uint256)

    {

        // sync the reserve balances just in case

        syncReserveBalances();

        // get the pool token supply before burning the caller's shares

        uint256 initialPoolSupply = _poolToken.totalSupply();

        // get the reserve token return before burning the caller's shares

        (uint256 reserveAmount, ) = removeLiquidityReturnAndFee(_poolToken, _amount);

        require(reserveAmount >= _minReturn, "ERR_RETURN_TOO_LOW");

        // get the reserve token associated with the pool token

        IERC20Token reserveToken = poolTokensToReserves[_poolToken];

        // burn the caller's pool tokens

        IPoolTokensContainer(anchor).burn(_poolToken, msg.sender, _amount);

        // sync the reserve balance / staked balance

        reserves[reserveToken].balance = reserves[reserveToken].balance.sub(reserveAmount);

        uint256 newStakedBalance = stakedBalances[reserveToken].sub(reserveAmount);

        stakedBalances[reserveToken] = newStakedBalance;

        // transfer the reserve amount to the caller

        if (reserveToken == ETH_RESERVE_ADDRESS)

            msg.sender.transfer(reserveAmount);

        else

            safeTransfer(reserveToken, msg.sender, reserveAmount);

        // rebalance the pool's reserve weights

        rebalance();

        uint256 newPoolTokenSupply = initialPoolSupply.sub(_amount);

        // dispatch the LiquidityRemoved event

        emit LiquidityRemoved(msg.sender, reserveToken, reserveAmount, newStakedBalance, newPoolTokenSupply);

        // dispatch the `TokenRateUpdate` event for the pool token

        dispatchPoolTokenRateUpdateEvent(_poolToken, newPoolTokenSupply, reserveToken);

        // dispatch the `TokenRateUpdate` event for the reserve tokens

        dispatchTokenRateUpdateEvent(reserveTokens[0], reserveTokens[1], 0, 0);

        // return the amount of liquidity removed

        return reserveAmount;

    }
```
</details>

---    

> ### removeLiquidityReturnAndFee

calculates the amount of reserve tokens entitled for a given amount of pool tokens

note that a fee is applied according to the equilibrium level of the primary reserve token

      *

```solidity
function removeLiquidityReturnAndFee(ISmartToken _poolToken, uint256 _amount) public view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolToken | ISmartToken | address of the pool token | 
| _amount | uint256 | amount of pool tokens        * | 

**Returns**

amount after fee and fee, in reserve token units

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidityReturnAndFee(ISmartToken _poolToken, uint256 _amount)

        public

        view

        returns (uint256, uint256)

    {

        uint256 totalSupply = _poolToken.totalSupply();

        uint256 stakedBalance = stakedBalances[poolTokensToReserves[_poolToken]];

        if (_amount < totalSupply) {

            uint256 x = stakedBalances[primaryReserveToken].mul(AMPLIFICATION_FACTOR);

            uint256 y = reserveAmplifiedBalance(primaryReserveToken);

            (uint256 min, uint256 max) = x < y ? (x, y) : (y, x);

            uint256 amountBeforeFee = _amount.mul(stakedBalance).div(totalSupply);

            uint256 amountAfterFee = amountBeforeFee.mul(min).div(max);

            return (amountAfterFee, amountBeforeFee - amountAfterFee);

        }

        return (stakedBalance, 0);

    }
```
</details>

---    

> ### targetAmountAndFees

returns the expected target amount of converting one reserve to another along with the fees

this version of the function expects the reserve weights as an input (gas optimization)

      *

```solidity
function targetAmountAndFees(IERC20Token _sourceToken, IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight, struct LiquidityPoolV2Converter.Fraction _rate, uint256 _amount) private view
returns(targetAmount uint256, standardFee uint256, dynamicFee uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | contract address of the source reserve token | 
| _targetToken | IERC20Token | contract address of the target reserve token | 
| _sourceWeight | uint32 | source reserve token weight or 0 to read it from storage | 
| _targetWeight | uint32 | target reserve token weight or 0 to read it from storage | 
| _rate | struct LiquidityPoolV2Converter.Fraction | rate between the reserve tokens | 
| _amount | uint256 | amount of tokens received from the user        * | 

**Returns**

expected target amount

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function targetAmountAndFees(

        IERC20Token _sourceToken,

        IERC20Token _targetToken,

        uint32 _sourceWeight,

        uint32 _targetWeight,

        Fraction memory _rate,

        uint256 _amount)

        private

        view

        returns (uint256 targetAmount, uint256 standardFee, uint256 dynamicFee)

    {

        if (_sourceWeight == 0)

            _sourceWeight = reserves[_sourceToken].weight;

        if (_targetWeight == 0)

            _targetWeight = reserves[_targetToken].weight;

        // get the tokens amplified balances

        uint256 sourceBalance = reserveAmplifiedBalance(_sourceToken);

        uint256 targetBalance = reserveAmplifiedBalance(_targetToken);

        // get the target amount

        targetAmount = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA)).crossReserveTargetAmount(

            sourceBalance,

            _sourceWeight,

            targetBalance,

            _targetWeight,

            _amount

        );

        // return a tuple of [target amount minus dynamic conversion fee, standard conversion fee, dynamic conversion fee]

        standardFee = calculateFee(targetAmount);

        dynamicFee = calculateDynamicFee(_targetToken, _sourceWeight, _targetWeight, _rate, targetAmount).add(standardFee);

        targetAmount = targetAmount.sub(dynamicFee);

    }
```
</details>

---    

> ### calculateDynamicFee

returns the dynamic fee for a given target amount

      *

```solidity
function calculateDynamicFee(IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight, struct LiquidityPoolV2Converter.Fraction _rate, uint256 _targetAmount) internal view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _targetToken | IERC20Token | contract address of the target reserve token | 
| _sourceWeight | uint32 | source reserve token weight | 
| _targetWeight | uint32 | target reserve token weight | 
| _rate | struct LiquidityPoolV2Converter.Fraction | rate of 1 primary token in secondary tokens | 
| _targetAmount | uint256 | target amount        * | 

**Returns**

dynamic fee

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateDynamicFee(

        IERC20Token _targetToken,

        uint32 _sourceWeight,

        uint32 _targetWeight,

        Fraction memory _rate,

        uint256 _targetAmount)

        internal view returns (uint256)

    {

        uint256 fee;

        if (_targetToken == secondaryReserveToken) {

            fee = calculateFeeToEquilibrium(

                stakedBalances[primaryReserveToken],

                stakedBalances[secondaryReserveToken],

                _sourceWeight,

                _targetWeight,

                _rate.n,

                _rate.d,

                dynamicFeeFactor);

        }

        else {

            fee = calculateFeeToEquilibrium(

                stakedBalances[primaryReserveToken],

                stakedBalances[secondaryReserveToken],

                _targetWeight,

                _sourceWeight,

                _rate.n,

                _rate.d,

                dynamicFeeFactor);

        }

        return _targetAmount.mul(fee).div(CONVERSION_FEE_RESOLUTION);

    }
```
</details>

---    

> ### calculateFeeToEquilibrium

returns the relative fee required for mitigating the secondary reserve distance from equilibrium

      *

```solidity
function calculateFeeToEquilibrium(uint256 _primaryReserveStaked, uint256 _secondaryReserveStaked, uint256 _primaryReserveWeight, uint256 _secondaryReserveWeight, uint256 _primaryReserveRate, uint256 _secondaryReserveRate, uint256 _dynamicFeeFactor) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _primaryReserveStaked | uint256 | primary reserve staked balance | 
| _secondaryReserveStaked | uint256 | secondary reserve staked balance | 
| _primaryReserveWeight | uint256 | primary reserve weight | 
| _secondaryReserveWeight | uint256 | secondary reserve weight | 
| _primaryReserveRate | uint256 | primary reserve rate | 
| _secondaryReserveRate | uint256 | secondary reserve rate | 
| _dynamicFeeFactor | uint256 | dynamic fee factor        * | 

**Returns**

relative fee, represented in ppm

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function calculateFeeToEquilibrium(

        uint256 _primaryReserveStaked,

        uint256 _secondaryReserveStaked,

        uint256 _primaryReserveWeight,

        uint256 _secondaryReserveWeight,

        uint256 _primaryReserveRate,

        uint256 _secondaryReserveRate,

        uint256 _dynamicFeeFactor)

        internal

        pure

        returns (uint256)

    {

        uint256 x = _primaryReserveStaked.mul(_primaryReserveRate).mul(_secondaryReserveWeight);

        uint256 y = _secondaryReserveStaked.mul(_secondaryReserveRate).mul(_primaryReserveWeight);

        if (y > x)

            return (y - x).mul(_dynamicFeeFactor).mul(AMPLIFICATION_FACTOR).div(y);

        return 0;

    }
```
</details>

---    

> ### createPoolTokens

creates the converter's pool tokens

note that technically pool tokens can be created on deployment but gas limit

might get too high for a block, so creating them on first activation

```solidity
function createPoolTokens() internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function createPoolTokens() internal {

        IPoolTokensContainer container = IPoolTokensContainer(anchor);

        ISmartToken[] memory poolTokens = container.poolTokens();

        bool initialSetup = poolTokens.length == 0;

        uint256 reserveCount = reserveTokens.length;

        for (uint256 i = 0; i < reserveCount; i++) {

            ISmartToken reservePoolToken;

            if (initialSetup) {

                reservePoolToken = container.createToken();

            }

            else {

                reservePoolToken = poolTokens[i];

            }

            // cache the pool token address (gas optimization)

            reservesToPoolTokens[reserveTokens[i]] = reservePoolToken;

            poolTokensToReserves[reservePoolToken] = reserveTokens[i];

        }

    }
```
</details>

---    

> ### _effectiveTokensRate

returns the effective rate between the two reserve tokens

      *

```solidity
function _effectiveTokensRate() private view
returns(struct LiquidityPoolV2Converter.Fraction)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _effectiveTokensRate() private view returns (Fraction memory) {

        // get the external rate between the reserves

        (uint256 externalRateN, uint256 externalRateD, uint256 updateTime) = priceOracle.latestRateAndUpdateTime(primaryReserveToken, secondaryReserveToken);

        // if the external rate was recently updated - prefer it over the internal rate

        if (updateTime > referenceRateUpdateTime) {

            return Fraction({ n: externalRateN, d: externalRateD });

        }

        // get the elapsed time between the current and the last conversion

        uint256 timeElapsed = time() - referenceRateUpdateTime;

        // if both of the conversions are in the same block - use the reference rate

        if (timeElapsed == 0) {

            return referenceRate;

        }

        // given N as the sampling window, the new internal rate is calculated according to the following formula:

        //   newRate = referenceRate + timeElapsed * [lastConversionRate - referenceRate] / N

        // if a long period of time, since the last update, has passed - the last rate should fully take effect

        if (timeElapsed >= RATE_PROPAGATION_PERIOD) {

            return lastConversionRate;

        }

        // calculate the numerator and the denumerator of the new rate

        Fraction memory ref = referenceRate;

        Fraction memory last = lastConversionRate;

        uint256 x = ref.d.mul(last.n);

        uint256 y = ref.n.mul(last.d);

        // since we know that timeElapsed < RATE_PROPAGATION_PERIOD, we can avoid using SafeMath:

        uint256 newRateN = y.mul(RATE_PROPAGATION_PERIOD - timeElapsed).add(x.mul(timeElapsed));

        uint256 newRateD = ref.d.mul(last.d).mul(RATE_PROPAGATION_PERIOD);

        return reduceRate(newRateN, newRateD);

    }
```
</details>

---    

> ### handleRateChange

checks if the rate has changed and if so, rebalances the weights

note that rebalancing based on rate change only happens once per block

      *

```solidity
function handleRateChange() private nonpayable
returns(bool, struct LiquidityPoolV2Converter.Fraction)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function handleRateChange() private returns (bool, Fraction memory) {

        uint256 currentTime = time();

        // avoid updating the rate more than once per block

        if (referenceRateUpdateTime == currentTime) {

            return (false, referenceRate);

        }

        // get and store the effective rate between the reserves

        Fraction memory newRate = _effectiveTokensRate();

        // if the rate has changed, update it and rebalance the pool

        Fraction memory ref = referenceRate;

        if (newRate.n == ref.n && newRate.d == ref.d) {

            return (false, newRate);

        }

        referenceRate = newRate;

        referenceRateUpdateTime = currentTime;

        rebalance();

        return (true, newRate);

    }
```
</details>

---    

> ### rebalance

updates the pool's reserve weights with new values in order to push the current primary

reserve token balance to its staked balance

```solidity
function rebalance() private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function rebalance() private {

        // get the new reserve weights

        (uint32 primaryReserveWeight, uint32 secondaryReserveWeight) = effectiveReserveWeights(referenceRate);

        // update the reserve weights with the new values

        reserves[primaryReserveToken].weight = primaryReserveWeight;

        reserves[secondaryReserveToken].weight = secondaryReserveWeight;

    }
```
</details>

---    

> ### effectiveReserveWeights

returns the effective reserve weights based on the staked balance, current balance and oracle price

      *

```solidity
function effectiveReserveWeights(struct LiquidityPoolV2Converter.Fraction _rate) private view
returns(uint32, uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _rate | struct LiquidityPoolV2Converter.Fraction | rate between the reserve tokens        * | 

**Returns**

new primary reserve weight

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function effectiveReserveWeights(Fraction memory _rate) private view returns (uint32, uint32) {

        // get the primary reserve staked balance

        uint256 primaryStakedBalance = stakedBalances[primaryReserveToken];

        // get the tokens amplified balances

        uint256 primaryBalance = reserveAmplifiedBalance(primaryReserveToken);

        uint256 secondaryBalance = reserveAmplifiedBalance(secondaryReserveToken);

        // get the new weights

        return ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA)).balancedWeights(

            primaryStakedBalance.mul(AMPLIFICATION_FACTOR),

            primaryBalance,

            secondaryBalance,

            _rate.n,

            _rate.d);

    }
```
</details>

---    

> ### tokensRate

calculates and returns the rate between two reserve tokens

      *

```solidity
function tokensRate(IERC20Token _token1, IERC20Token _token2, uint32 _token1Weight, uint32 _token2Weight) private view
returns(struct LiquidityPoolV2Converter.Fraction)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token1 | IERC20Token | contract address of the token to calculate the rate of one unit of | 
| _token2 | IERC20Token | contract address of the token to calculate the rate of one `_token1` unit in | 
| _token1Weight | uint32 | reserve weight of token1 | 
| _token2Weight | uint32 | reserve weight of token2        * | 

**Returns**

rate

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function tokensRate(IERC20Token _token1, IERC20Token _token2, uint32 _token1Weight, uint32 _token2Weight) private view returns (Fraction memory) {

        // apply the amplification factor

        uint256 token1Balance = reserveAmplifiedBalance(_token1);

        uint256 token2Balance = reserveAmplifiedBalance(_token2);

        // get reserve weights

        if (_token1Weight == 0) {

            _token1Weight = reserves[_token1].weight;

        }

        if (_token2Weight == 0) {

            _token2Weight = reserves[_token2].weight;

        }

        return Fraction({ n: token2Balance.mul(_token1Weight), d: token1Balance.mul(_token2Weight) });

    }
```
</details>

---    

> ### dispatchRateEvents

dispatches rate events for both reserve tokens and for the target pool token

only used to circumvent the `stack too deep` compiler error

      *

```solidity
function dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | contract address of the source reserve token | 
| _targetToken | IERC20Token | contract address of the target reserve token | 
| _sourceWeight | uint32 | source reserve token weight | 
| _targetWeight | uint32 | target reserve token weight | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken, uint32 _sourceWeight, uint32 _targetWeight) private {

        dispatchTokenRateUpdateEvent(_sourceToken, _targetToken, _sourceWeight, _targetWeight);

        // dispatch the `TokenRateUpdate` event for the pool token

        // the target reserve pool token rate is the only one that's affected

        // by conversions since conversion fees are applied to the target reserve

        ISmartToken targetPoolToken = poolToken(_targetToken);

        uint256 targetPoolTokenSupply = targetPoolToken.totalSupply();

        dispatchPoolTokenRateUpdateEvent(targetPoolToken, targetPoolTokenSupply, _targetToken);

    }
```
</details>

---    

> ### dispatchTokenRateUpdateEvent

dispatches token rate update event

only used to circumvent the `stack too deep` compiler error

      *

```solidity
function dispatchTokenRateUpdateEvent(IERC20Token _token1, IERC20Token _token2, uint32 _token1Weight, uint32 _token2Weight) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token1 | IERC20Token | contract address of the token to calculate the rate of one unit of | 
| _token2 | IERC20Token | contract address of the token to calculate the rate of one `_token1` unit in | 
| _token1Weight | uint32 | reserve weight of token1 | 
| _token2Weight | uint32 | reserve weight of token2 | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function dispatchTokenRateUpdateEvent(IERC20Token _token1, IERC20Token _token2, uint32 _token1Weight, uint32 _token2Weight) private {

        // dispatch token rate update event

        Fraction memory rate = tokensRate(_token1, _token2, _token1Weight, _token2Weight);

        emit TokenRateUpdate(_token1, _token2, rate.n, rate.d);

    }
```
</details>

---    

> ### dispatchPoolTokenRateUpdateEvent

dispatches the `TokenRateUpdate` for the pool token

only used to circumvent the `stack too deep` compiler error

      *

```solidity
function dispatchPoolTokenRateUpdateEvent(ISmartToken _poolToken, uint256 _poolTokenSupply, IERC20Token _reserveToken) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolToken | ISmartToken | address of the pool token | 
| _poolTokenSupply | uint256 | total pool token supply | 
| _reserveToken | IERC20Token | address of the reserve token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function dispatchPoolTokenRateUpdateEvent(ISmartToken _poolToken, uint256 _poolTokenSupply, IERC20Token _reserveToken) private {

        emit TokenRateUpdate(_poolToken, _reserveToken, stakedBalances[_reserveToken], _poolTokenSupply);

    }
```
</details>

---    

> ### time

⤿ Overridden Implementation(s): [TestLiquidityPoolV2Converter.time](TestLiquidityPoolV2Converter.md#time)

returns the current time

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

        return now;

    }
```
</details>

---    

> ### reduceRate

reduces the numerator and denominator while maintaining the ratio between them as accurately as possible

```solidity
function reduceRate(uint256 _n, uint256 _d) internal pure
returns(struct LiquidityPoolV2Converter.Fraction)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _n | uint256 |  | 
| _d | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reduceRate(uint256 _n, uint256 _d) internal pure returns (Fraction memory) {

        if (_n >= _d) {

            return reduceFactors(_n, _d);

        }

        Fraction memory rate = reduceFactors(_d, _n);

        return Fraction({ n: rate.d, d: rate.n });

    }
```
</details>

---    

> ### reduceFactors

reduces the factors while maintaining the ratio between them as accurately as possible

```solidity
function reduceFactors(uint256 _max, uint256 _min) internal pure
returns(struct LiquidityPoolV2Converter.Fraction)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _max | uint256 |  | 
| _min | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reduceFactors(uint256 _max, uint256 _min) internal pure returns (Fraction memory) {

        if (_min > MAX_RATE_FACTOR_UPPER_BOUND) {

            return Fraction({

                n: MAX_RATE_FACTOR_LOWER_BOUND,

                d: _min / (_max / MAX_RATE_FACTOR_LOWER_BOUND)

            });

        }

        if (_max > MAX_RATE_FACTOR_LOWER_BOUND) {

            return Fraction({

                n: MAX_RATE_FACTOR_LOWER_BOUND,

                d: _min * MAX_RATE_FACTOR_LOWER_BOUND / _max

            });

        }

        return Fraction({ n: _max, d: _min });

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
