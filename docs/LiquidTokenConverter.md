# LiquidTokenConverter.sol

View Source: [contracts/converter/types/liquid-token/LiquidTokenConverter.sol](../solidity/contracts/converter/types/liquid-token/LiquidTokenConverter.sol)

**↗ Extends: [ConverterBase](ConverterBase.md)**

**LiquidTokenConverter**

Liquid Token Converter

  * The liquid token converter is a specialized version of a converter that manages a liquid token.

  * The converters govern a token with a single reserve and allow converting between the two.

Liquid tokens usually have fractional reserve (reserve ratio smaller than 100%).

## Constructor

initializes a new LiquidTokenConverter instance

      *

```js
constructor(ISmartToken _token, IContractRegistry _registry, uint32 _maxConversionFee) public
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | ISmartToken |  | 
| _registry | IContractRegistry |  | 
| _maxConversionFee | uint32 |  | 

## Functions

- [converterType()](#convertertype)
- [acceptAnchorOwnership()](#acceptanchorownership)
- [addReserve(IERC20Token _token, uint32 _weight)](#addreserve)
- [targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)](#targetamountandfee)
- [doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary)](#doconvert)
- [purchaseTargetAmount(uint256 _amount)](#purchasetargetamount)
- [saleTargetAmount(uint256 _amount)](#saletargetamount)
- [buy(uint256 _amount, address _trader, address _beneficiary)](#buy)
- [sell(uint256 _amount, address _trader, address _beneficiary)](#sell)

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

        return 0;

    }
```
</details>

---    

> ### acceptAnchorOwnership

⤾ overrides [ConverterBase.acceptAnchorOwnership](ConverterBase.md#acceptanchorownership)

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

---    

> ### addReserve

⤾ overrides [ConverterBase.addReserve](ConverterBase.md#addreserve)

defines the reserve token for the converter

can only be called by the owner while the converter is inactive and the

reserve wasn't defined yet

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

        // verify that the converter doesn't have a reserve yet

        require(reserveTokenCount() == 0, "ERR_INVALID_RESERVE_COUNT");

        super.addReserve(_token, _weight);

    }
```
</details>

---    

> ### targetAmountAndFee

⤾ overrides [IConverter.targetAmountAndFee](IConverter.md#targetamountandfee)

returns the expected target amount of converting the source token to the

target token along with the fee

      *

```solidity
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) public view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | contract address of the source token | 
| _targetToken | IERC20Token | contract address of the target token | 
| _amount | uint256 | amount of tokens received from the user        * | 

**Returns**

expected target amount

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) public view returns (uint256, uint256) {

        if (_targetToken == ISmartToken(anchor) && reserves[_sourceToken].isSet)

            return purchaseTargetAmount(_amount);

        if (_sourceToken == ISmartToken(anchor) && reserves[_targetToken].isSet)

            return saleTargetAmount(_amount);

        // invalid input

        revert("ERR_INVALID_TOKEN");

    }
```
</details>

---    

> ### doConvert

⤾ overrides [ConverterBase.doConvert](ConverterBase.md#doconvert)

converts between the liquid token and its reserve

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

        uint256 targetAmount;

        IERC20Token reserveToken;

        if (_targetToken == ISmartToken(anchor) && reserves[_sourceToken].isSet) {

            reserveToken = _sourceToken;

            targetAmount = buy(_amount, _trader, _beneficiary);

        }

        else if (_sourceToken == ISmartToken(anchor) && reserves[_targetToken].isSet) {

            reserveToken = _targetToken;

            targetAmount = sell(_amount, _trader, _beneficiary);

        }

        else {

            // invalid input

            revert("ERR_INVALID_TOKEN");

        }

        // dispatch rate update for the liquid token

        uint256 totalSupply = ISmartToken(anchor).totalSupply();

        uint32 reserveWeight = reserves[reserveToken].weight;

        emit TokenRateUpdate(anchor, reserveToken, reserveBalance(reserveToken).mul(WEIGHT_RESOLUTION), totalSupply.mul(reserveWeight));

        return targetAmount;

    }
```
</details>

---    

> ### purchaseTargetAmount

returns the expected target amount of buying with a given amount of tokens

      *

```solidity
function purchaseTargetAmount(uint256 _amount) internal view active 
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount of reserve tokens to get the target amount for        * | 

**Returns**

amount of liquid tokens that the user will receive

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function purchaseTargetAmount(uint256 _amount)

        internal

        view

        active

        returns (uint256, uint256)

    {

        uint256 totalSupply = ISmartToken(anchor).totalSupply();

        // if the current supply is zero, then return the input amount divided by the normalized reserve-weight

        if (totalSupply == 0)

            return (_amount.mul(WEIGHT_RESOLUTION).div(reserves[reserveToken].weight), 0);

        IERC20Token reserveToken = reserveTokens[0];

        uint256 amount = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA)).purchaseTargetAmount(

            totalSupply,

            reserveBalance(reserveToken),

            reserves[reserveToken].weight,

            _amount

        );

        // return the amount minus the conversion fee and the conversion fee

        uint256 fee = calculateFee(amount);

        return (amount - fee, fee);

    }
```
</details>

---    

> ### saleTargetAmount

returns the expected target amount of selling a given amount of tokens

      *

```solidity
function saleTargetAmount(uint256 _amount) internal view active 
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount of liquid tokens to get the target amount for        * | 

**Returns**

expected reserve tokens

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function saleTargetAmount(uint256 _amount)

        internal

        view

        active

        returns (uint256, uint256)

    {

        uint256 totalSupply = ISmartToken(anchor).totalSupply();

        IERC20Token reserveToken = reserveTokens[0];

        // special case for selling the entire supply - return the entire reserve

        if (totalSupply == _amount)

            return (reserveBalance(reserveToken), 0);

        uint256 amount = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA)).saleTargetAmount(

            totalSupply,

            reserveBalance(reserveToken),

            reserves[reserveToken].weight,

            _amount

        );

        // return the amount minus the conversion fee and the conversion fee

        uint256 fee = calculateFee(amount);

        return (amount - fee, fee);

    }
```
</details>

---    

> ### buy

buys the liquid token by depositing in its reserve

      *

```solidity
function buy(uint256 _amount, address _trader, address _beneficiary) internal nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount of reserve token to buy the token for | 
| _trader | address | address of the caller who executed the conversion | 
| _beneficiary | address | wallet to receive the conversion result        * | 

**Returns**

amount of liquid tokens received

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function buy(uint256 _amount, address _trader, address _beneficiary) internal returns (uint256) {

        // get expected target amount and fee

        (uint256 amount, uint256 fee) = purchaseTargetAmount(_amount);

        // ensure the trade gives something in return

        require(amount != 0, "ERR_ZERO_TARGET_AMOUNT");

        IERC20Token reserveToken = reserveTokens[0];

        // ensure that the input amount was already deposited

        if (reserveToken == ETH_RESERVE_ADDRESS)

            require(msg.value == _amount, "ERR_ETH_AMOUNT_MISMATCH");

        else

            require(msg.value == 0 && reserveToken.balanceOf(this).sub(reserveBalance(reserveToken)) >= _amount, "ERR_INVALID_AMOUNT");

        // sync the reserve balance

        syncReserveBalance(reserveToken);

        // issue new funds to the beneficiary in the liquid token

        ISmartToken(anchor).issue(_beneficiary, amount);

        // dispatch the conversion event

        dispatchConversionEvent(reserveToken, ISmartToken(anchor), _trader, _amount, amount, fee, 0);

        return amount;

    }
```
</details>

---    

> ### sell

sells the liquid token by withdrawing from its reserve

      *

```solidity
function sell(uint256 _amount, address _trader, address _beneficiary) internal nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount of liquid tokens to sell | 
| _trader | address | address of the caller who executed the conversion | 
| _beneficiary | address | wallet to receive the conversion result        * | 

**Returns**

amount of reserve tokens received

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function sell(uint256 _amount, address _trader, address _beneficiary) internal returns (uint256) {

        // ensure that the input amount was already deposited

        require(_amount <= ISmartToken(anchor).balanceOf(this), "ERR_INVALID_AMOUNT");

        // get expected target amount and fee

        (uint256 amount, uint256 fee) = saleTargetAmount(_amount);

        // ensure the trade gives something in return

        require(amount != 0, "ERR_ZERO_TARGET_AMOUNT");

        IERC20Token reserveToken = reserveTokens[0];

        // ensure that the trade will only deplete the reserve balance if the total supply is depleted as well

        uint256 tokenSupply = ISmartToken(anchor).totalSupply();

        uint256 rsvBalance = reserveBalance(reserveToken);

        assert(amount < rsvBalance || (amount == rsvBalance && _amount == tokenSupply));

        // destroy the tokens from the converter balance in the liquid token

        ISmartToken(anchor).destroy(this, _amount);

        // update the reserve balance

        reserves[reserveToken].balance = reserves[reserveToken].balance.sub(amount);

        // transfer funds to the beneficiary in the reserve token

        if (reserveToken == ETH_RESERVE_ADDRESS)

            _beneficiary.transfer(amount);

        else

            safeTransfer(reserveToken, _beneficiary, amount);

        // dispatch the conversion event

        dispatchConversionEvent(ISmartToken(anchor), reserveToken, _trader, _amount, amount, fee, 0);

        return amount;

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
