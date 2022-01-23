# PriceOracle.sol

View Source: [contracts/utility/PriceOracle.sol](../solidity/contracts/utility/PriceOracle.sol)

**↗ Extends: [IPriceOracle](IPriceOracle.md), [Utils](Utils.md)**

**PriceOracle**

Provides the off-chain rate between two tokens
 * The price oracle uses chainlink oracles internally to get the rates of the two tokens
with respect to a common denominator, and then returns the rate between them, which
is equivalent to the rate of TokenA / TokenB

## Constructor

initializes a new PriceOracle instance
note that the oracles must have the same common denominator (USD, ETH etc.)
	 *

```js
constructor(IERC20Token _tokenA, IERC20Token _tokenB) public
```

**Arguments**

## Contract Members
**Constants & Variables**

```js
//private members
address private constant ETH_ADDRESS;
uint8 private constant ETH_DECIMALS;

//public members
contract IERC20Token public tokenA;
contract IERC20Token public tokenB;
mapping(address => uint8) public tokenDecimals;
contract IConsumerPriceOracle public tokenAOracle;
contract IConsumerPriceOracle public tokenBOracle;
mapping(address => contract IConsumerPriceOracle) public tokensToOracles;

```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _tokenA | IERC20Token |  | 
| _tokenB | IERC20Token |  | 

## Modifiers

- [validUniqueAddresses](#validuniqueaddresses)
- [supportedTokens](#supportedtokens)

### validUniqueAddresses

```js
modifier validUniqueAddresses(address _address1, address _address2) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address1 | address |  | 
| _address2 | address |  | 

### supportedTokens

```js
modifier supportedTokens(IERC20Token _tokenA, IERC20Token _tokenB) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _tokenA | IERC20Token |  | 
| _tokenB | IERC20Token |  | 

## Functions

- [_validUniqueAddresses(address _address1, address _address2)](#_validuniqueaddresses)
- [_supportedTokens(IERC20Token _tokenA, IERC20Token _tokenB)](#_supportedtokens)
- [latestRate(IERC20Token _tokenA, IERC20Token _tokenB)](#latestrate)
- [lastUpdateTime()](#lastupdatetime)
- [latestRateAndUpdateTime(IERC20Token _tokenA, IERC20Token _tokenB)](#latestrateandupdatetime)
- [decimals(IERC20Token _token)](#decimals)

> ### function _validUniqueAddresses

```solidity
function _validUniqueAddresses(address _address1, address _address2) internal pure
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address1 | address |  | 
| _address2 | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _validUniqueAddresses(address _address1, address _address2) internal pure {
		_validAddress(_address1);
		_validAddress(_address2);
		require(_address1 != _address2, "ERR_SAME_ADDRESS");
	}
```
</details>

> ### function _supportedTokens

```solidity
function _supportedTokens(IERC20Token _tokenA, IERC20Token _tokenB) internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _tokenA | IERC20Token |  | 
| _tokenB | IERC20Token |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _supportedTokens(IERC20Token _tokenA, IERC20Token _tokenB) internal view {
		_validUniqueAddresses(_tokenA, _tokenB);
		require(tokensToOracles[_tokenA] != address(0) && tokensToOracles[_tokenB] != address(0), "ERR_UNSUPPORTED_TOKEN");
	}
```
</details>

> ### function latestRate

⤾ overrides [IPriceOracle.latestRate](IPriceOracle.md#latestrate)

returns the latest known rate between the two given tokens
for a given pair of tokens A and B, returns the rate of A / B
(the number of B units equivalent to a single A unit)
the rate is returned as a fraction (numerator / denominator) for accuracy
	 *

```solidity
function latestRate(IERC20Token _tokenA, IERC20Token _tokenB) public view supportedTokens 
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _tokenA | IERC20Token |  | 
| _tokenB | IERC20Token |  | 

**Returns**

numerator

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function latestRate(IERC20Token _tokenA, IERC20Token _tokenB) public view supportedTokens(_tokenA, _tokenB) returns (uint256, uint256) {
		uint256 rateTokenA = uint256(tokensToOracles[_tokenA].latestAnswer());
		uint256 rateTokenB = uint256(tokensToOracles[_tokenB].latestAnswer());
		uint8 decimalsTokenA = tokenDecimals[_tokenA];
		uint8 decimalsTokenB = tokenDecimals[_tokenB];

		// the normalization works as follows:
		//   - token A with decimals of dA and price of rateA per one token (e.g., for 10^dA weiA)
		//   - token B with decimals of dB < dA and price of rateB per one token (e.g., for 10^dB weiB)
		// then the normalized rate, representing the rate between 1 weiA and 1 weiB is rateA / (rateB * 10^(dA - dB)).
		//
		// for example:
		//   - token A with decimals of 5 and price of $10 per one token (e.g., for 100,000 weiA)
		//   - token B with decimals of 2 and price of $2 per one token (e.g., for 100 weiB)
		// then the normalized rate would be: 5 / (2 * 10^3) = 0.0025, which is the correct rate since
		// 1 weiA costs $0.00005, 1 weiB costs $0.02, and weiA / weiB is 0.0025.

		if (decimalsTokenA > decimalsTokenB) {
			rateTokenB = rateTokenB.mul(uint256(10)**(decimalsTokenA - decimalsTokenB));
		} else if (decimalsTokenA < decimalsTokenB) {
			rateTokenA = rateTokenA.mul(uint256(10)**(decimalsTokenB - decimalsTokenA));
		}

		return (rateTokenA, rateTokenB);
	}
```
</details>

> ### function lastUpdateTime

⤾ overrides [IPriceOracle.lastUpdateTime](IPriceOracle.md#lastupdatetime)

returns the timestamp of the last price update
	 *

```solidity
function lastUpdateTime() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function lastUpdateTime() public view returns (uint256) {
		// returns the oldest timestamp between the two
		uint256 timestampA = tokenAOracle.latestTimestamp();
		uint256 timestampB = tokenBOracle.latestTimestamp();

		return timestampA > timestampB ? timestampA : timestampB;
	}
```
</details>

> ### function latestRateAndUpdateTime

⤾ overrides [IPriceOracle.latestRateAndUpdateTime](IPriceOracle.md#latestrateandupdatetime)

returns both the rate and the timestamp of the last update in a single call (gas optimization)
	 *

```solidity
function latestRateAndUpdateTime(IERC20Token _tokenA, IERC20Token _tokenB) public view
returns(uint256, uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _tokenA | IERC20Token |  | 
| _tokenB | IERC20Token |  | 

**Returns**

numerator

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function latestRateAndUpdateTime(IERC20Token _tokenA, IERC20Token _tokenB)
		public
		view
		returns (
			uint256,
			uint256,
			uint256
		)
	{
		(uint256 numerator, uint256 denominator) = latestRate(_tokenA, _tokenB);

		return (numerator, denominator, lastUpdateTime());
	}
```
</details>

> ### function decimals

returns the decimals of a given token

```solidity
function decimals(IERC20Token _token) private view
returns(uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function decimals(IERC20Token _token) private view returns (uint8) {
		if (_token == ETH_ADDRESS) {
			return ETH_DECIMALS;
		}

		return _token.decimals();
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
