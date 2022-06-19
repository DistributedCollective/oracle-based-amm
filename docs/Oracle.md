# Oracle.sol

View Source: [contracts/utility/Oracle.sol](../solidity/contracts/utility/Oracle.sol)

**↗ Extends: [Owned](Owned.md)**

**Oracle**

Provides the off-chain rate between two tokens
 * The oracle is used by liquidity v1 pool converter to update the Exponential Moving
Averages and other observations of pool tokens for each block having trades once. It is stored
at the beginning of each block.
EMA = k * currentPrice + (1 - k) * lastCumulativePrice
Were k is the weight given to more recent prices compared to the older ones.

## Contract Members
**Constants & Variables**

```js
//public members
uint256 public blockNumber;
uint256 public timestamp;
uint256 public ema0;
uint256 public ema1;
uint256 public lastCumulativePrice0;
uint256 public lastCumulativePrice1;
uint256 public k;
address public liquidityPool;
address public btcAddress;

//private members
uint256 private constant IS_EQUAL_TO_10000;

```

**Events**

```js
event ObservationsUpdated(uint256  ema0, uint256  ema1, uint256  blockNumber, uint256  timestamp, uint256  lastCumulativePrice0, uint256  lastCumulativePrice1);
event KValueUpdate(uint256  _k);
event LiquidityPoolUpdate(address indexed sender, address  oldLiquidityPool, address  newLiquidityPool);
```

## Modifiers

- [validPool](#validpool)

### validPool

```js
modifier validPool() internal
```

## Functions

- [setK(uint256 _k)](#setk)
- [write(uint256 _price0, uint256 _price1)](#write)
- [read()](#read)
- [latestAnswer()](#latestanswer)
- [latestPrice(address _baseToken)](#latestprice)
- [setLiquidityPool(address _newLiquidityPool)](#setliquiditypool)

---    

> ### setK

Used to set the value of k

```solidity
function setK(uint256 _k) external nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _k | uint256 | new value of k | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setK(uint256 _k) external ownerOnly {
		require(_k != 0 && _k <= IS_EQUAL_TO_10000, "ERR_INVALID_K_VALUE");
		k = _k;
		emit KValueUpdate(_k);
	}
```
</details>

---    

> ### write

Used to write new price observations
only valid liquidity pool contract can call this function

```solidity
function write(uint256 _price0, uint256 _price1) external nonpayable validPool 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _price0 | uint256 | price of token0 | 
| _price1 | uint256 | price of token1 | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function write(uint256 _price0, uint256 _price1) external validPool {
		if (blockNumber == block.number) return;

		uint256 timeElapsed;
		if (timestamp == 0) {
			ema0 = _price0;
			ema1 = _price1;

			timeElapsed = 1;
		} else {
			ema0 = k.mul(_price0).add((IS_EQUAL_TO_10000 - k).mul(ema0)).div(IS_EQUAL_TO_10000);
			ema1 = k.mul(_price1).add((IS_EQUAL_TO_10000 - k).mul(ema1)).div(IS_EQUAL_TO_10000);

			timeElapsed = block.timestamp.sub(timestamp);
		}

		lastCumulativePrice0 = lastCumulativePrice0.add(_price0.mul(timeElapsed));
		lastCumulativePrice1 = lastCumulativePrice1.add(_price1.mul(timeElapsed));

		blockNumber = block.number;
		timestamp = block.timestamp;

		emit ObservationsUpdated(ema0, ema1, blockNumber, timestamp, lastCumulativePrice0, lastCumulativePrice1);
	}
```
</details>

---    

> ### read

used to read the latest observations recorded

```solidity
function read() external view
returns(uint256, uint256, uint256, uint256, uint256, uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function read()
		external
		view
		returns (
			uint256,
			uint256,
			uint256,
			uint256,
			uint256,
			uint256
		)
	{
		return (ema0, ema1, blockNumber, timestamp, lastCumulativePrice0, lastCumulativePrice1);
	}
```
</details>

---    

> ### latestAnswer

returns the price of a reserve in base currency (assuming one of the reserves is always BTC)
This function is kept to comply with the chainlink interface

```solidity
function latestAnswer() external view
returns(answer uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function latestAnswer() external view returns (uint256 answer) {
		if (ILiquidityPoolV1Converter(liquidityPool).reserveTokens(0) == btcAddress) {
			answer = ema0;
		} else if (ILiquidityPoolV1Converter(liquidityPool).reserveTokens(1) == btcAddress) {
			answer = ema1;
		}
	}
```
</details>

---    

> ### latestPrice

returns the price of a reserve in base currency

```solidity
function latestPrice(address _baseToken) external view
returns(answer uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _baseToken | address | address of token considered as base currency | 

**Returns**

ema EMA of other token in pool

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function latestPrice(address _baseToken) external view returns (uint256 answer) {
		if (ILiquidityPoolV1Converter(liquidityPool).reserveTokens(0) == _baseToken) {
			answer = ema0;
		} else if (ILiquidityPoolV1Converter(liquidityPool).reserveTokens(1) == _baseToken) {
			answer = ema1;
		}
	}
```
</details>

---    

> ### setLiquidityPool

```solidity
function setLiquidityPool(address _newLiquidityPool) external nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _newLiquidityPool | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setLiquidityPool(address _newLiquidityPool) external ownerOnly {
		require(_newLiquidityPool != address(0), "ERR_ZERO_POOL_ADDRESS");

		address oldLiquidityPool = liquidityPool;
		liquidityPool = _newLiquidityPool;
		emit LiquidityPoolUpdate(msg.sender, oldLiquidityPool, liquidityPool);
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
