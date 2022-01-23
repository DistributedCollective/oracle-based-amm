# LiquidityPoolV1ConverterMultiAsset.sol

View Source: [contracts/converter/types/liquidity-pool-v1/LiquidityPoolV1ConverterMultiAsset.sol](../solidity/contracts/converter/types/liquidity-pool-v1/LiquidityPoolV1ConverterMultiAsset.sol)

**↗ Extends: [LiquidityPoolConverter](LiquidityPoolConverter.md)**

**LiquidityPoolV1ConverterMultiAsset**

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
- [acceptAnchorOwnership()](#acceptanchorownership)
- [targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)](#targetamountandfee)
- [doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary)](#doconvert)
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
- [decimalLength(uint256 _x)](#decimallength)
- [roundDiv(uint256 _n, uint256 _d)](#rounddiv)
- [geometricMean(uint256[] _values)](#geometricmean)
- [dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken)](#dispatchrateevents)
- [dispatchPoolTokenRateEvent(uint256 _poolTokenSupply, IERC20Token _reserveToken, uint256 _reserveBalance, uint32 _reserveWeight)](#dispatchpooltokenrateevent)

> ### converterType

⤾ overrides [IConverter.converterType](IConverter.md#.convertertype)

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

        return uint16(CONVERTER_TYPE);

    }
```
</details>

> ### acceptAnchorOwnership

⤾ overrides [LiquidityPoolConverter.acceptAnchorOwnership](LiquidityPoolConverter.md#.acceptanchorownership)

accepts ownership of the anchor after an ownership transfer

also activates the converter

can only be called by the contract owner

note that prior to version 28, you should use 'acceptTokenOwnership' instead

```solidity
function acceptAnchorOwnership() public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function acceptAnchorOwnership() public ownerOnly {

        super.acceptAnchorOwnership();

        emit Activation(converterType(), anchor, true);

    }
```
</details>

> ### targetAmountAndFee

⤾ overrides [IConverter.targetAmountAndFee](IConverter.md#.targetamountandfee)

returns the expected target amount of converting one reserve to another along with the fee

      *

```solidity
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) public view active validReserve validReserve 
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

        validReserve(_sourceToken)

        validReserve(_targetToken)

        returns (uint256, uint256)

    {

        // validate input

        require(_sourceToken != _targetToken, "ERR_SAME_SOURCE_TARGET");

        uint256 amount = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA)).crossReserveTargetAmount(

            reserveBalance(_sourceToken),

            reserves[_sourceToken].weight,

            reserveBalance(_targetToken),

            reserves[_targetToken].weight,

            _amount

        );

        // return the amount minus the conversion fee and the conversion fee

        uint256 fee = calculateFee(amount);

        return (amount - fee, fee);

    }
```
</details>

> ### doConvert

⤾ overrides [ConverterBase.doConvert](ConverterBase.md#.doconvert)

converts a specific amount of source tokens to target tokens

can only be called by the SovrynSwap network contract

      *

```solidity
function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary) internal nonpayable
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

        returns (uint256)

    {

        // get expected target amount and fee

        (uint256 amount, uint256 fee) = targetAmountAndFee(_sourceToken, _targetToken, _amount);

        // ensure that the trade gives something in return

        require(amount != 0, "ERR_ZERO_TARGET_AMOUNT");

        // ensure that the trade won't deplete the reserve balance

        uint256 targetReserveBalance = reserveBalance(_targetToken);

        assert(amount < targetReserveBalance);

        // ensure that the input amount was already deposited

        if (_sourceToken == ETH_RESERVE_ADDRESS)

            require(msg.value == _amount, "ERR_ETH_AMOUNT_MISMATCH");

        else

            require(msg.value == 0 && _sourceToken.balanceOf(this).sub(reserveBalance(_sourceToken)) >= _amount, "ERR_INVALID_AMOUNT");

        // sync the reserve balances

        syncReserveBalance(_sourceToken);

        reserves[_targetToken].balance = reserves[_targetToken].balance.sub(amount);

        // transfer funds to the beneficiary in the to reserve token

        if (_targetToken == ETH_RESERVE_ADDRESS)

            _beneficiary.transfer(amount);

        else

            safeTransfer(_targetToken, _beneficiary, amount);

        // dispatch the conversion event

        dispatchConversionEvent(_sourceToken, _targetToken, _trader, _amount, amount, fee, 0);

        // dispatch rate updates

        dispatchRateEvents(_sourceToken, _targetToken);

        return amount;

    }
```
</details>

> ### addLiquidity

increases the pool's liquidity and mints new shares in the pool to the caller

note that prior to version 28, you should use 'fund' instead

      *

```solidity
function addLiquidity(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _minReturn) public payable protected active 
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
function addLiquidity(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts, uint256 _minReturn)

        public

        payable

        protected

        active

    {

        // verify the user input

        verifyLiquidityInput(_reserveTokens, _reserveAmounts, _minReturn);

        // if one of the reserves is ETH, then verify that the input amount of ETH is equal to the input value of ETH

        for (uint256 i = 0; i < _reserveTokens.length; i++)

            if (_reserveTokens[i] == ETH_RESERVE_ADDRESS)

                require(_reserveAmounts[i] == msg.value, "ERR_ETH_AMOUNT_MISMATCH");

        // if the input value of ETH is larger than zero, then verify that one of the reserves is ETH

        if (msg.value > 0)

            require(reserves[ETH_RESERVE_ADDRESS].isSet, "ERR_NO_ETH_RESERVE");

        // get the total supply

        uint256 totalSupply = ISmartToken(anchor).totalSupply();

        // transfer from the user an equally-worth amount of each one of the reserve tokens

        uint256 amount = addLiquidityToPool(_reserveTokens, _reserveAmounts, totalSupply);

        // verify that the equivalent amount of tokens is equal to or larger than the user's expectation

        require(amount >= _minReturn, "ERR_RETURN_TOO_LOW");

        // issue the tokens to the user

        ISmartToken(anchor).issue(msg.sender, amount);

    }
```
</details>

> ### removeLiquidity

decreases the pool's liquidity and burns the caller's shares in the pool

note that prior to version 28, you should use 'liquidate' instead

      *

```solidity
function removeLiquidity(uint256 _amount, IERC20Token[] _reserveTokens, uint256[] _reserveMinReturnAmounts) public nonpayable protected active 
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
function removeLiquidity(uint256 _amount, IERC20Token[] memory _reserveTokens, uint256[] memory _reserveMinReturnAmounts)

        public

        protected

        active

    {

        // verify the user input

        verifyLiquidityInput(_reserveTokens, _reserveMinReturnAmounts, _amount);

        // get the total supply BEFORE destroying the user tokens

        uint256 totalSupply = ISmartToken(anchor).totalSupply();

        // destroy the user tokens

        ISmartToken(anchor).destroy(msg.sender, _amount);

        // transfer to the user an equivalent amount of each one of the reserve tokens

        removeLiquidityFromPool(_reserveTokens, _reserveMinReturnAmounts, totalSupply, _amount);

    }
```
</details>

> ### fund

increases the pool's liquidity and mints new shares in the pool to the caller

for example, if the caller increases the supply by 10%,

then it will cost an amount equal to 10% of each reserve token balance

note that starting from version 28, you should use 'addLiquidity' instead

      *

```solidity
function fund(uint256 _amount) external payable protected 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount to increase the supply by (in the pool token) | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function fund(uint256 _amount) external payable protected {

        syncReserveBalances();

        reserves[ETH_RESERVE_ADDRESS].balance = reserves[ETH_RESERVE_ADDRESS].balance.sub(msg.value);

        uint256 supply = ISmartToken(anchor).totalSupply();

        ISovrynSwapFormula formula = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA));

        // iterate through the reserve tokens and transfer a percentage equal to the weight between

        // _amount and the total supply in each reserve from the caller to the converter

        uint256 reserveCount = reserveTokens.length;

        for (uint256 i = 0; i < reserveCount; i++) {

            IERC20Token reserveToken = reserveTokens[i];

            uint256 rsvBalance = reserves[reserveToken].balance;

            uint256 reserveAmount = formula.fundCost(supply, rsvBalance, reserveRatio, _amount);

            // transfer funds from the caller in the reserve token

            if (reserveToken == ETH_RESERVE_ADDRESS) {

                if (msg.value > reserveAmount) {

                    msg.sender.transfer(msg.value - reserveAmount);

                }

                else if (msg.value < reserveAmount) {

                    require(msg.value == 0, "ERR_INVALID_ETH_VALUE");

                    safeTransferFrom(etherToken, msg.sender, this, reserveAmount);

                    etherToken.withdraw(reserveAmount);

                }

            }

            else {

                safeTransferFrom(reserveToken, msg.sender, this, reserveAmount);

            }

            // sync the reserve balance

            uint256 newReserveBalance = rsvBalance.add(reserveAmount);

            reserves[reserveToken].balance = newReserveBalance;

            uint256 newPoolTokenSupply = supply.add(_amount);

            // dispatch liquidity update for the pool token/reserve

            emit LiquidityAdded(msg.sender, reserveToken, reserveAmount, newReserveBalance, newPoolTokenSupply);

            // dispatch the `TokenRateUpdate` event for the pool token

            uint32 reserveWeight = reserves[reserveToken].weight;

            dispatchPoolTokenRateEvent(newPoolTokenSupply, reserveToken, newReserveBalance, reserveWeight);

        }

        // issue new funds to the caller in the pool token

        ISmartToken(anchor).issue(msg.sender, _amount);

    }
```
</details>

> ### liquidate

decreases the pool's liquidity and burns the caller's shares in the pool

for example, if the holder sells 10% of the supply,

then they will receive 10% of each reserve token balance in return

note that starting from version 28, you should use 'removeLiquidity' instead

      *

```solidity
function liquidate(uint256 _amount) external nonpayable protected 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount to liquidate (in the pool token) | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function liquidate(uint256 _amount) external protected {

        require(_amount > 0, "ERR_ZERO_AMOUNT");

        uint256 totalSupply = ISmartToken(anchor).totalSupply();

        ISmartToken(anchor).destroy(msg.sender, _amount);

        uint256[] memory reserveMinReturnAmounts = new uint256[](reserveTokens.length);

        for (uint256 i = 0; i < reserveMinReturnAmounts.length; i++)

            reserveMinReturnAmounts[i] = 1;

        removeLiquidityFromPool(reserveTokens, reserveMinReturnAmounts, totalSupply, _amount);

    }
```
</details>

> ### verifyLiquidityInput

verifies that a given array of tokens is identical to the converter's array of reserve tokens

we take this input in order to allow specifying the corresponding reserve amounts in any order

      *

```solidity
function verifyLiquidityInput(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _amount) private view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | array of reserve tokens | 
| _reserveAmounts | uint256[] | array of reserve amounts | 
| _amount | uint256 | token amount | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function verifyLiquidityInput(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts, uint256 _amount) private view {

        uint256 i;

        uint256 j;

        uint256 length = reserveTokens.length;

        require(length == _reserveTokens.length, "ERR_INVALID_RESERVE");

        require(length == _reserveAmounts.length, "ERR_INVALID_AMOUNT");

        for (i = 0; i < length; i++) {

            // verify that every input reserve token is included in the reserve tokens

            require(reserves[_reserveTokens[i]].isSet, "ERR_INVALID_RESERVE");

            for (j = 0; j < length; j++) {

                if (reserveTokens[i] == _reserveTokens[j])

                    break;

            }

            // verify that every reserve token is included in the input reserve tokens

            require(j < length, "ERR_INVALID_RESERVE");

            // verify that every input reserve token amount is larger than zero

            require(_reserveAmounts[i] > 0, "ERR_INVALID_AMOUNT");

        }

        // verify that the input token amount is larger than zero

        require(_amount > 0, "ERR_ZERO_AMOUNT");

    }
```
</details>

> ### addLiquidityToPool

adds liquidity (reserve) to the pool

      *

```solidity
function addLiquidityToPool(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _totalSupply) private nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveAmounts | uint256[] | amount of each reserve token | 
| _totalSupply | uint256 | token total supply | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityToPool(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts, uint256 _totalSupply)

        private

        returns (uint256)

    {

        if (_totalSupply == 0)

            return addLiquidityToEmptyPool(_reserveTokens, _reserveAmounts);

        return addLiquidityToNonEmptyPool(_reserveTokens, _reserveAmounts, _totalSupply);

    }
```
</details>

> ### addLiquidityToEmptyPool

adds liquidity (reserve) to the pool when it's empty

      *

```solidity
function addLiquidityToEmptyPool(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts) private nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveAmounts | uint256[] | amount of each reserve token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityToEmptyPool(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts)

        private

        returns (uint256)

    {

        // calculate the geometric-mean of the reserve amounts approved by the user

        uint256 amount = geometricMean(_reserveAmounts);

        // transfer each one of the reserve amounts from the user to the pool

        for (uint256 i = 0; i < _reserveTokens.length; i++) {

            if (_reserveTokens[i] != ETH_RESERVE_ADDRESS) // ETH has already been transferred as part of the transaction

                safeTransferFrom(_reserveTokens[i], msg.sender, this, _reserveAmounts[i]);

            reserves[_reserveTokens[i]].balance = _reserveAmounts[i];

            emit LiquidityAdded(msg.sender, _reserveTokens[i], _reserveAmounts[i], _reserveAmounts[i], amount);

            // dispatch the `TokenRateUpdate` event for the pool token

            uint32 reserveWeight = reserves[_reserveTokens[i]].weight;

            dispatchPoolTokenRateEvent(amount, _reserveTokens[i], _reserveAmounts[i], reserveWeight);

        }

        return amount;

    }
```
</details>

> ### addLiquidityToNonEmptyPool

adds liquidity (reserve) to the pool when it's not empty

      *

```solidity
function addLiquidityToNonEmptyPool(IERC20Token[] _reserveTokens, uint256[] _reserveAmounts, uint256 _totalSupply) private nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveAmounts | uint256[] | amount of each reserve token | 
| _totalSupply | uint256 | token total supply | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityToNonEmptyPool(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts, uint256 _totalSupply)

        private

        returns (uint256)

    {

        syncReserveBalances();

        reserves[ETH_RESERVE_ADDRESS].balance = reserves[ETH_RESERVE_ADDRESS].balance.sub(msg.value);

        ISovrynSwapFormula formula = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA));

        uint256 amount = getMinShare(formula, _totalSupply, _reserveTokens, _reserveAmounts);

        uint256 newPoolTokenSupply = _totalSupply.add(amount);

        for (uint256 i = 0; i < _reserveTokens.length; i++) {

            IERC20Token reserveToken = _reserveTokens[i];

            uint256 rsvBalance = reserves[reserveToken].balance;

            uint256 reserveAmount = formula.fundCost(_totalSupply, rsvBalance, reserveRatio, amount);

            require(reserveAmount > 0, "ERR_ZERO_TARGET_AMOUNT");

            assert(reserveAmount <= _reserveAmounts[i]);

            // transfer each one of the reserve amounts from the user to the pool

            if (reserveToken != ETH_RESERVE_ADDRESS) // ETH has already been transferred as part of the transaction

                safeTransferFrom(reserveToken, msg.sender, this, reserveAmount);

            else if (_reserveAmounts[i] > reserveAmount) // transfer the extra amount of ETH back to the user

                msg.sender.transfer(_reserveAmounts[i] - reserveAmount);

            uint256 newReserveBalance = rsvBalance.add(reserveAmount);

            reserves[reserveToken].balance = newReserveBalance;

            emit LiquidityAdded(msg.sender, reserveToken, reserveAmount, newReserveBalance, newPoolTokenSupply);

            // dispatch the `TokenRateUpdate` event for the pool token

            uint32 reserveWeight = reserves[_reserveTokens[i]].weight;

            dispatchPoolTokenRateEvent(newPoolTokenSupply, _reserveTokens[i], newReserveBalance, reserveWeight);

        }

        return amount;

    }
```
</details>

> ### removeLiquidityFromPool

removes liquidity (reserve) from the pool

      *

```solidity
function removeLiquidityFromPool(IERC20Token[] _reserveTokens, uint256[] _reserveMinReturnAmounts, uint256 _totalSupply, uint256 _amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] | address of each reserve token | 
| _reserveMinReturnAmounts | uint256[] | minimum return-amount of each reserve token | 
| _totalSupply | uint256 | token total supply | 
| _amount | uint256 | token amount | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidityFromPool(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveMinReturnAmounts, uint256 _totalSupply, uint256 _amount)

        private

    {

        syncReserveBalances();

        ISovrynSwapFormula formula = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA));

        uint256 newPoolTokenSupply = _totalSupply.sub(_amount);

        for (uint256 i = 0; i < _reserveTokens.length; i++) {

            IERC20Token reserveToken = _reserveTokens[i];

            uint256 rsvBalance = reserves[reserveToken].balance;

            uint256 reserveAmount = formula.liquidateReserveAmount(_totalSupply, rsvBalance, reserveRatio, _amount);

            require(reserveAmount >= _reserveMinReturnAmounts[i], "ERR_ZERO_TARGET_AMOUNT");

            uint256 newReserveBalance = rsvBalance.sub(reserveAmount);

            reserves[reserveToken].balance = newReserveBalance;

            // transfer each one of the reserve amounts from the pool to the user

            if (reserveToken == ETH_RESERVE_ADDRESS)

                msg.sender.transfer(reserveAmount);

            else

                safeTransfer(reserveToken, msg.sender, reserveAmount);

            emit LiquidityRemoved(msg.sender, reserveToken, reserveAmount, newReserveBalance, newPoolTokenSupply);

            // dispatch the `TokenRateUpdate` event for the pool token

            uint32 reserveWeight = reserves[reserveToken].weight;

            dispatchPoolTokenRateEvent(newPoolTokenSupply, reserveToken, newReserveBalance, reserveWeight);

        }

    }
```
</details>

> ### getMinShare

```solidity
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

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getMinShare(ISovrynSwapFormula formula, uint256 _totalSupply, IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts) private view returns (uint256) {

        uint256 minIndex = 0;

        for (uint256 i = 1; i < _reserveTokens.length; i++) {

            if (_reserveAmounts[i].mul(reserves[_reserveTokens[minIndex]].balance) < _reserveAmounts[minIndex].mul(reserves[_reserveTokens[i]].balance))

                minIndex = i;

        }

        return formula.fundSupplyAmount(_totalSupply, reserves[_reserveTokens[minIndex]].balance, reserveRatio, _reserveAmounts[minIndex]);

    }
```
</details>

> ### decimalLength

calculates the number of decimal digits in a given value

      *

```solidity
function decimalLength(uint256 _x) public pure
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
function decimalLength(uint256 _x) public pure returns (uint256) {

        uint256 y = 0;

        for (uint256 x = _x; x > 0; x /= 10)

            y++;

        return y;

    }
```
</details>

> ### roundDiv

calculates the nearest integer to a given quotient

      *

```solidity
function roundDiv(uint256 _n, uint256 _d) public pure
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
function roundDiv(uint256 _n, uint256 _d) public pure returns (uint256) {

        return (_n + _d / 2) / _d;

    }
```
</details>

> ### geometricMean

calculates the average number of decimal digits in a given list of values

      *

```solidity
function geometricMean(uint256[] _values) public pure
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
function geometricMean(uint256[] memory _values) public pure returns (uint256) {

        uint256 numOfDigits = 0;

        uint256 length = _values.length;

        for (uint256 i = 0; i < length; i++)

            numOfDigits += decimalLength(_values[i]);

        return uint256(10) ** (roundDiv(numOfDigits, length) - 1);

    }
```
</details>

> ### dispatchRateEvents

dispatches rate events for both reserves / pool tokens

only used to circumvent the `stack too deep` compiler error

      *

```solidity
function dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | address of the source reserve token | 
| _targetToken | IERC20Token | address of the target reserve token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken) private {

        uint256 poolTokenSupply = ISmartToken(anchor).totalSupply();

        uint256 sourceReserveBalance = reserveBalance(_sourceToken);

        uint256 targetReserveBalance = reserveBalance(_targetToken);

        uint32 sourceReserveWeight = reserves[_sourceToken].weight;

        uint32 targetReserveWeight = reserves[_targetToken].weight;

        // dispatch token rate update event

        uint256 rateN = targetReserveBalance.mul(sourceReserveWeight);

        uint256 rateD = sourceReserveBalance.mul(targetReserveWeight);

        emit TokenRateUpdate(_sourceToken, _targetToken, rateN, rateD);

        // dispatch the `TokenRateUpdate` event for the pool token

        dispatchPoolTokenRateEvent(poolTokenSupply, _sourceToken, sourceReserveBalance, sourceReserveWeight);

        dispatchPoolTokenRateEvent(poolTokenSupply, _targetToken, targetReserveBalance, targetReserveWeight);

        // dispatch price data update events (deprecated events)

        emit PriceDataUpdate(_sourceToken, poolTokenSupply, sourceReserveBalance, sourceReserveWeight);

        emit PriceDataUpdate(_targetToken, poolTokenSupply, targetReserveBalance, targetReserveWeight);

    }
```
</details>

> ### dispatchPoolTokenRateEvent

dispatches the `TokenRateUpdate` for the pool token

only used to circumvent the `stack too deep` compiler error

      *

```solidity
function dispatchPoolTokenRateEvent(uint256 _poolTokenSupply, IERC20Token _reserveToken, uint256 _reserveBalance, uint32 _reserveWeight) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _poolTokenSupply | uint256 | total pool token supply | 
| _reserveToken | IERC20Token | address of the reserve token | 
| _reserveBalance | uint256 | reserve balance | 
| _reserveWeight | uint32 | reserve weight | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function dispatchPoolTokenRateEvent(uint256 _poolTokenSupply, IERC20Token _reserveToken, uint256 _reserveBalance, uint32 _reserveWeight) private {

        emit TokenRateUpdate(anchor, _reserveToken, _reserveBalance.mul(WEIGHT_RESOLUTION), _poolTokenSupply.mul(_reserveWeight));

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
