# SovrynSwapFormula.sol

View Source: [contracts/converter/SovrynSwapFormula.sol](../contracts/converter/SovrynSwapFormula.sol)

**↗ Extends: [ISovrynSwapFormula](ISovrynSwapFormula.md)**
**↘ Derived Contracts: [TestSovrynSwapFormula](TestSovrynSwapFormula.md)**

**SovrynSwapFormula**

## Contract Members
**Constants & Variables**

```js
//public members
uint16 public constant version;

//private members
uint256 private constant ONE;
uint32 private constant MAX_WEIGHT;
uint8 private constant MIN_PRECISION;
uint8 private constant MAX_PRECISION;
uint256 private constant FIXED_1;
uint256 private constant FIXED_2;
uint256 private constant MAX_NUM;
uint256 private constant LN2_NUMERATOR;
uint256 private constant LN2_DENOMINATOR;
uint256 private constant OPT_LOG_MAX_VAL;
uint256 private constant OPT_EXP_MAX_VAL;
uint256 private constant LAMBERT_CONV_RADIUS;
uint256 private constant LAMBERT_POS2_SAMPLE;
uint256 private constant LAMBERT_POS2_MAXVAL;
uint256 private constant LAMBERT_POS3_MAXVAL;
uint256 private constant MAX_UNF_WEIGHT;
uint256[128] private maxExpArray;
uint256[128] private lambertArray;

```

## Functions

- [initMaxExpArray()](#initmaxexparray)
- [initLambertArray()](#initlambertarray)
- [init()](#init)
- [purchaseTargetAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount)](#purchasetargetamount)
- [saleTargetAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount)](#saletargetamount)
- [crossReserveTargetAmount(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount)](#crossreservetargetamount)
- [fundCost(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount)](#fundcost)
- [fundSupplyAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount)](#fundsupplyamount)
- [liquidateReserveAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount)](#liquidatereserveamount)
- [balancedWeights(uint256 _primaryReserveStakedBalance, uint256 _primaryReserveBalance, uint256 _secondaryReserveBalance, uint256 _reserveRateNumerator, uint256 _reserveRateDenominator)](#balancedweights)
- [power(uint256 _baseN, uint256 _baseD, uint32 _expN, uint32 _expD)](#power)
- [generalLog(uint256 x)](#generallog)
- [floorLog2(uint256 _n)](#floorlog2)
- [findPositionInMaxExpArray(uint256 _x)](#findpositioninmaxexparray)
- [generalExp(uint256 _x, uint8 _precision)](#generalexp)
- [optimalLog(uint256 x)](#optimallog)
- [optimalExp(uint256 x)](#optimalexp)
- [lowerStake(uint256 _x)](#lowerstake)
- [higherStake(uint256 _x)](#higherstake)
- [lambertPos1(uint256 _x)](#lambertpos1)
- [lambertPos2(uint256 _x)](#lambertpos2)
- [lambertPos3(uint256 _x)](#lambertpos3)
- [lambertNeg1(uint256 _x)](#lambertneg1)
- [balancedWeightsByStake(uint256 _hi, uint256 _lo, uint256 _tq, uint256 _rp, bool _lowerStake)](#balancedweightsbystake)
- [safeFactors(uint256 _a, uint256 _b)](#safefactors)
- [normalizedWeights(uint256 _a, uint256 _b)](#normalizedweights)
- [accurateWeights(uint256 _a, uint256 _b)](#accurateweights)
- [roundDiv(uint256 _n, uint256 _d)](#rounddiv)
- [calculatePurchaseReturn(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount)](#calculatepurchasereturn)
- [calculateSaleReturn(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount)](#calculatesalereturn)
- [calculateCrossReserveReturn(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount)](#calculatecrossreservereturn)
- [calculateCrossConnectorReturn(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount)](#calculatecrossconnectorreturn)
- [calculateFundCost(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount)](#calculatefundcost)
- [calculateLiquidateReturn(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount)](#calculateliquidatereturn)
- [purchaseRate(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount)](#purchaserate)
- [saleRate(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount)](#salerate)
- [crossReserveRate(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount)](#crossreserverate)
- [liquidateRate(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount)](#liquidaterate)

### initMaxExpArray

```js
function initMaxExpArray() private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### initLambertArray

```js
function initLambertArray() private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### init

should be executed after construction (too large for the constructor)

```js
function init() public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### purchaseTargetAmount

⤾ overrides [ISovrynSwapFormula.purchaseTargetAmount](ISovrynSwapFormula.md#purchasetargetamount)

given a token supply, reserve balance, weight and a deposit amount (in the reserve token),
calculates the target amount for a given conversion (in the main token)
	 * Formula:
return = _supply * ((1 + _amount / _reserveBalance) ^ (_reserveWeight / 1000000) - 1)
	 *

```js
function purchaseTargetAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount) public view
returns(uint256)
```

**Returns**

smart token amount

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 | smart token supply | 
| _reserveBalance | uint256 | reserve balance | 
| _reserveWeight | uint32 | reserve weight, represented in ppm (1-1000000) | 
| _amount | uint256 | amount of reserve tokens to get the target amount for
	 * | 

### saleTargetAmount

⤾ overrides [ISovrynSwapFormula.saleTargetAmount](ISovrynSwapFormula.md#saletargetamount)

given a token supply, reserve balance, weight and a sell amount (in the main token),
calculates the target amount for a given conversion (in the reserve token)
	 * Formula:
return = _reserveBalance * (1 - (1 - _amount / _supply) ^ (1000000 / _reserveWeight))
	 *

```js
function saleTargetAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount) public view
returns(uint256)
```

**Returns**

reserve token amount

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 | smart token supply | 
| _reserveBalance | uint256 | reserve balance | 
| _reserveWeight | uint32 | reserve weight, represented in ppm (1-1000000) | 
| _amount | uint256 | amount of smart tokens to get the target amount for
	 * | 

### crossReserveTargetAmount

⤾ overrides [ISovrynSwapFormula.crossReserveTargetAmount](ISovrynSwapFormula.md#crossreservetargetamount)

given two reserve balances/weights and a sell amount (in the first reserve token),
calculates the target amount for a conversion from the source reserve token to the target reserve token
	 * Formula:
return = _targetReserveBalance * (1 - (_sourceReserveBalance / (_sourceReserveBalance + _amount)) ^ (_sourceReserveWeight / _targetReserveWeight))
	 *

```js
function crossReserveTargetAmount(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount) public view
returns(uint256)
```

**Returns**

target reserve amount

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceReserveBalance | uint256 | source reserve balance | 
| _sourceReserveWeight | uint32 | source reserve weight, represented in ppm (1-1000000) | 
| _targetReserveBalance | uint256 | target reserve balance | 
| _targetReserveWeight | uint32 | target reserve weight, represented in ppm (1-1000000) | 
| _amount | uint256 | source reserve amount
	 * | 

### fundCost

⤾ overrides [ISovrynSwapFormula.fundCost](ISovrynSwapFormula.md#fundcost)

given a smart token supply, reserve balance, reserve ratio and an amount of requested smart tokens,
calculates the amount of reserve tokens required for purchasing the given amount of smart tokens
	 * Formula:
return = _reserveBalance * (((_supply + _amount) / _supply) ^ (MAX_WEIGHT / _reserveRatio) - 1)
	 *

```js
function fundCost(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view
returns(uint256)
```

**Returns**

reserve token amount

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 | smart token supply | 
| _reserveBalance | uint256 | reserve balance | 
| _reserveRatio | uint32 | reserve ratio, represented in ppm (2-2000000) | 
| _amount | uint256 | requested amount of smart tokens
	 * | 

### fundSupplyAmount

⤾ overrides [ISovrynSwapFormula.fundSupplyAmount](ISovrynSwapFormula.md#fundsupplyamount)

given a smart token supply, reserve balance, reserve ratio and an amount of reserve tokens to fund with,
calculates the amount of smart tokens received for purchasing with the given amount of reserve tokens
	 * Formula:
return = _supply * ((_amount / _reserveBalance + 1) ^ (_reserveRatio / MAX_WEIGHT) - 1)
	 *

```js
function fundSupplyAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view
returns(uint256)
```

**Returns**

smart token amount

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 | smart token supply | 
| _reserveBalance | uint256 | reserve balance | 
| _reserveRatio | uint32 | reserve ratio, represented in ppm (2-2000000) | 
| _amount | uint256 | amount of reserve tokens to fund with
	 * | 

### liquidateReserveAmount

⤾ overrides [ISovrynSwapFormula.liquidateReserveAmount](ISovrynSwapFormula.md#liquidatereserveamount)

given a smart token supply, reserve balance, reserve ratio and an amount of smart tokens to liquidate,
calculates the amount of reserve tokens received for selling the given amount of smart tokens
	 * Formula:
return = _reserveBalance * (1 - ((_supply - _amount) / _supply) ^ (MAX_WEIGHT / _reserveRatio))
	 *

```js
function liquidateReserveAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view
returns(uint256)
```

**Returns**

reserve token amount

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 | smart token supply | 
| _reserveBalance | uint256 | reserve balance | 
| _reserveRatio | uint32 | reserve ratio, represented in ppm (2-2000000) | 
| _amount | uint256 | amount of smart tokens to liquidate
	 * | 

### balancedWeights

⤾ overrides [ISovrynSwapFormula.balancedWeights](ISovrynSwapFormula.md#balancedweights)

The arbitrage incentive is to convert to the point where the on-chain price is equal to the off-chain price.
We want this operation to also impact the primary reserve balance becoming equal to the primary reserve staked balance.
In other words, we want the arbitrager to convert the difference between the reserve balance and the reserve staked balance.
	 * Formula input:
- let t denote the primary reserve token staked balance
- let s denote the primary reserve token balance
- let r denote the secondary reserve token balance
- let q denote the numerator of the rate between the tokens
- let p denote the denominator of the rate between the tokens
Where p primary tokens are equal to q secondary tokens
	 * Formula output:
- compute x = W(t / r * q / p * log(s / t)) / log(s / t)
- return x / (1 + x) as the weight of the primary reserve token
- return 1 / (1 + x) as the weight of the secondary reserve token
Where W is the Lambert W Function
	 * If the rate-provider provides the rates for a common unit, for example:
- P = 2 ==> 2 primary reserve tokens = 1 ether
- Q = 3 ==> 3 secondary reserve tokens = 1 ether
Then you can simply use p = P and q = Q
	 * If the rate-provider provides the rates for a single unit, for example:
- P = 2 ==> 1 primary reserve token = 2 ethers
- Q = 3 ==> 1 secondary reserve token = 3 ethers
Then you can simply use p = Q and q = P
	 *

```js
function balancedWeights(uint256 _primaryReserveStakedBalance, uint256 _primaryReserveBalance, uint256 _secondaryReserveBalance, uint256 _reserveRateNumerator, uint256 _reserveRateDenominator) public view
returns(uint32, uint32)
```

**Returns**

the weight of the primary reserve token and the weight of the secondary reserve token, both in ppm (0-1000000)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _primaryReserveStakedBalance | uint256 | the primary reserve token staked balance | 
| _primaryReserveBalance | uint256 | the primary reserve token balance | 
| _secondaryReserveBalance | uint256 | the secondary reserve token balance | 
| _reserveRateNumerator | uint256 | the numerator of the rate between the tokens | 
| _reserveRateDenominator | uint256 | the denominator of the rate between the tokens
	 * Note that `numerator / denominator` should represent the amount of secondary tokens equal to one primary token
	 * | 

### power

General Description:
    Determine a value of precision.
    Calculate an integer approximation of (_baseN / _baseD) ^ (_expN / _expD) * 2 ^ precision.
    Return the result along with the precision used.
	 * Detailed Description:
    Instead of calculating "base ^ exp", we calculate "e ^ (log(base) * exp)".
    The value of "log(base)" is represented with an integer slightly smaller than "log(base) * 2 ^ precision".
    The larger "precision" is, the more accurately this value represents the real value.
    However, the larger "precision" is, the more bits are required in order to store this value.
    And the exponentiation function, which takes "x" and calculates "e ^ x", is limited to a maximum exponent (maximum value of "x").
    This maximum exponent depends on the "precision" used, and it is given by "maxExpArray[precision] >> (MAX_PRECISION - precision)".
    Hence we need to determine the highest precision which can be used for the given input, before calling the exponentiation function.
    This allows us to compute "base ^ exp" with maximum accuracy and without exceeding 256 bits in any of the intermediate computations.
    This functions assumes that "_expN < 2 ^ 256 / log(MAX_NUM - 1)", otherwise the multiplication should be replaced with a "safeMul".
    Since we rely on unsigned-integer arithmetic and "base < 1" ==> "log(base) < 0", this function does not support "_baseN < _baseD".

```js
function power(uint256 _baseN, uint256 _baseD, uint32 _expN, uint32 _expD) internal view
returns(uint256, uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _baseN | uint256 |  | 
| _baseD | uint256 |  | 
| _expN | uint32 |  | 
| _expD | uint32 |  | 

### generalLog

computes log(x / FIXED_1) * FIXED_1.
This functions assumes that "x >= FIXED_1", because the output would be negative otherwise.

```js
function generalLog(uint256 x) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| x | uint256 |  | 

### floorLog2

computes the largest integer smaller than or equal to the binary logarithm of the input.

```js
function floorLog2(uint256 _n) internal pure
returns(uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _n | uint256 |  | 

### findPositionInMaxExpArray

the global "maxExpArray" is sorted in descending order, and therefore the following statements are equivalent:
- This function finds the position of [the smallest value in "maxExpArray" larger than or equal to "x"]
- This function finds the highest position of [a value in "maxExpArray" larger than or equal to "x"]

```js
function findPositionInMaxExpArray(uint256 _x) internal view
returns(uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 

### generalExp

this function can be auto-generated by the script 'PrintFunctionGeneralExp.py'.
it approximates "e ^ x" via maclaurin summation: "(x^0)/0! + (x^1)/1! + ... + (x^n)/n!".
it returns "e ^ (x / 2 ^ precision) * 2 ^ precision", that is, the result is upshifted for accuracy.
the global "maxExpArray" maps each "precision" to "((maximumExponent + 1) << (MAX_PRECISION - precision)) - 1".
the maximum permitted value for "x" is therefore given by "maxExpArray[precision] >> (MAX_PRECISION - precision)".

```js
function generalExp(uint256 _x, uint8 _precision) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 
| _precision | uint8 |  | 

### optimalLog

computes log(x / FIXED_1) * FIXED_1
Input range: FIXED_1 <= x <= OPT_LOG_MAX_VAL - 1
Auto-generated via 'PrintFunctionOptimalLog.py'
Detailed description:
- Rewrite the input as a product of natural exponents and a single residual r, such that 1 < r < 2
- The natural logarithm of each (pre-calculated) exponent is the degree of the exponent
- The natural logarithm of r is calculated via Taylor series for log(1 + x), where x = r - 1
- The natural logarithm of the input is calculated by summing up the intermediate results above
- For example: log(250) = log(e^4 * e^1 * e^0.5 * 1.021692859) = 4 + 1 + 0.5 + log(1 + 0.021692859)

```js
function optimalLog(uint256 x) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| x | uint256 |  | 

### optimalExp

computes e ^ (x / FIXED_1) * FIXED_1
input range: 0 <= x <= OPT_EXP_MAX_VAL - 1
auto-generated via 'PrintFunctionOptimalExp.py'
Detailed description:
- Rewrite the input as a sum of binary exponents and a single residual r, as small as possible
- The exponentiation of each binary exponent is given (pre-calculated)
- The exponentiation of r is calculated via Taylor series for e^x, where x = r
- The exponentiation of the input is calculated by multiplying the intermediate results above
- For example: e^5.521692859 = e^(4 + 1 + 0.5 + 0.021692859) = e^4 * e^1 * e^0.5 * e^0.021692859

```js
function optimalExp(uint256 x) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| x | uint256 |  | 

### lowerStake

computes W(x / FIXED_1) / (x / FIXED_1) * FIXED_1

```js
function lowerStake(uint256 _x) internal view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 

### higherStake

computes W(-x / FIXED_1) / (-x / FIXED_1) * FIXED_1

```js
function higherStake(uint256 _x) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 

### lambertPos1

computes W(x / FIXED_1) / (x / FIXED_1) * FIXED_1
input range: 1 <= x <= 1 / e * FIXED_1
auto-generated via 'PrintFunctionLambertPos1.py'

```js
function lambertPos1(uint256 _x) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 

### lambertPos2

computes W(x / FIXED_1) / (x / FIXED_1) * FIXED_1
input range: LAMBERT_CONV_RADIUS + 1 <= x <= LAMBERT_POS2_MAXVAL

```js
function lambertPos2(uint256 _x) internal view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 

### lambertPos3

computes W(x / FIXED_1) / (x / FIXED_1) * FIXED_1
input range: LAMBERT_POS2_MAXVAL + 1 <= x <= LAMBERT_POS3_MAXVAL

```js
function lambertPos3(uint256 _x) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 

### lambertNeg1

computes W(-x / FIXED_1) / (-x / FIXED_1) * FIXED_1
input range: 1 <= x <= 1 / e * FIXED_1
auto-generated via 'PrintFunctionLambertNeg1.py'

```js
function lambertNeg1(uint256 _x) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _x | uint256 |  | 

### balancedWeightsByStake

computes the weights based on "W(log(hi / lo) * tq / rp) * tq / rp", where "W" is a variation of the Lambert W function.

```js
function balancedWeightsByStake(uint256 _hi, uint256 _lo, uint256 _tq, uint256 _rp, bool _lowerStake) internal view
returns(uint32, uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _hi | uint256 |  | 
| _lo | uint256 |  | 
| _tq | uint256 |  | 
| _rp | uint256 |  | 
| _lowerStake | bool |  | 

### safeFactors

reduces "a" and "b" while maintaining their ratio.

```js
function safeFactors(uint256 _a, uint256 _b) internal pure
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _a | uint256 |  | 
| _b | uint256 |  | 

### normalizedWeights

computes "MAX_WEIGHT * a / (a + b)" and "MAX_WEIGHT * b / (a + b)".

```js
function normalizedWeights(uint256 _a, uint256 _b) internal pure
returns(uint32, uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _a | uint256 |  | 
| _b | uint256 |  | 

### accurateWeights

computes "MAX_WEIGHT * a / (a + b)" and "MAX_WEIGHT * b / (a + b)", assuming that "a <= b".

```js
function accurateWeights(uint256 _a, uint256 _b) internal pure
returns(uint32, uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _a | uint256 |  | 
| _b | uint256 |  | 

### roundDiv

computes the nearest integer to a given quotient without overflowing or underflowing.

```js
function roundDiv(uint256 _n, uint256 _d) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _n | uint256 |  | 
| _d | uint256 |  | 

### calculatePurchaseReturn

deprecated, backward compatibility

```js
function calculatePurchaseReturn(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveWeight | uint32 |  | 
| _amount | uint256 |  | 

### calculateSaleReturn

deprecated, backward compatibility

```js
function calculateSaleReturn(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveWeight | uint32 |  | 
| _amount | uint256 |  | 

### calculateCrossReserveReturn

deprecated, backward compatibility

```js
function calculateCrossReserveReturn(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceReserveBalance | uint256 |  | 
| _sourceReserveWeight | uint32 |  | 
| _targetReserveBalance | uint256 |  | 
| _targetReserveWeight | uint32 |  | 
| _amount | uint256 |  | 

### calculateCrossConnectorReturn

deprecated, backward compatibility

```js
function calculateCrossConnectorReturn(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceReserveBalance | uint256 |  | 
| _sourceReserveWeight | uint32 |  | 
| _targetReserveBalance | uint256 |  | 
| _targetReserveWeight | uint32 |  | 
| _amount | uint256 |  | 

### calculateFundCost

deprecated, backward compatibility

```js
function calculateFundCost(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveRatio | uint32 |  | 
| _amount | uint256 |  | 

### calculateLiquidateReturn

deprecated, backward compatibility

```js
function calculateLiquidateReturn(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveRatio | uint32 |  | 
| _amount | uint256 |  | 

### purchaseRate

deprecated, backward compatibility

```js
function purchaseRate(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveWeight | uint32 |  | 
| _amount | uint256 |  | 

### saleRate

deprecated, backward compatibility

```js
function saleRate(uint256 _supply, uint256 _reserveBalance, uint32 _reserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveWeight | uint32 |  | 
| _amount | uint256 |  | 

### crossReserveRate

deprecated, backward compatibility

```js
function crossReserveRate(uint256 _sourceReserveBalance, uint32 _sourceReserveWeight, uint256 _targetReserveBalance, uint32 _targetReserveWeight, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceReserveBalance | uint256 |  | 
| _sourceReserveWeight | uint32 |  | 
| _targetReserveBalance | uint256 |  | 
| _targetReserveWeight | uint32 |  | 
| _amount | uint256 |  | 

### liquidateRate

deprecated, backward compatibility

```js
function liquidateRate(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _supply | uint256 |  | 
| _reserveBalance | uint256 |  | 
| _reserveRatio | uint32 |  | 
| _amount | uint256 |  | 

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
