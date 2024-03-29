# MocBTCToUSDOracle.sol

View Source: [contracts/utility/MocBTCToUSDOracle.sol](../solidity/contracts/utility/MocBTCToUSDOracle.sol)

**↗ Extends: [IConsumerPriceOracle](IConsumerPriceOracle.md), [Owned](Owned.md)**

**MocBTCToUSDOracle**

## Contract Members
**Constants & Variables**

```js
address public mocOracleAddress;

```

**Events**

```js
event SetMoCOracleAddress(address indexed mocOracleAddress, address  changerAddress);
```

## Functions

- [peek()](#peek)
- [latestAnswer()](#latestanswer)
- [latestTimestamp()](#latesttimestamp)
- [setMoCOracleAddress(address _mocOracleAddress)](#setmocoracleaddress)

---    

> ### peek

```solidity
function peek() external view
returns(bytes32, bool)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function peek() external view returns (bytes32, bool);
```
</details>

---    

> ### latestAnswer

⤾ overrides [IConsumerPriceOracle.latestAnswer](IConsumerPriceOracle.md#latestanswer)

returns the USD/BTC rate.
	 *

```solidity
function latestAnswer() external view
returns(int256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function latestAnswer() external view returns (int256) {
		(bytes32 value, bool hasValue) = Medianizer(mocOracleAddress).peek();
		require(hasValue, "Doesn't has value");
		return int256(value);
	}
```
</details>

---    

> ### latestTimestamp

⤾ overrides [IConsumerPriceOracle.latestTimestamp](IConsumerPriceOracle.md#latesttimestamp)

returns the USD/BTC update time.
	 *

```solidity
function latestTimestamp() external view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function latestTimestamp() external view returns (uint256) {
		return now; // MoC oracle doesn't return update timestamp
	}
```
</details>

---    

> ### setMoCOracleAddress

set MoC oracle address
	 *

```solidity
function setMoCOracleAddress(address _mocOracleAddress) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _mocOracleAddress | address | MoC oracle address | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMoCOracleAddress(address _mocOracleAddress) public ownerOnly {
		require(_mocOracleAddress != address(0), "_mocOracleAddress shall not be zero address");
		mocOracleAddress = _mocOracleAddress;
		emit SetMoCOracleAddress(mocOracleAddress, msg.sender);
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
* [IConsumerPriceOracle](IConsumerPriceOracle.md)
* [IContractRegistry](IContractRegistry.md)
* [IConversionPathFinder](IConversionPathFinder.md)
* [IConverter](IConverter.md)
* [IConverterAnchor](IConverterAnchor.md)
* [IConverterFactory](IConverterFactory.md)
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
* [SovrynSwapX](SovrynSwapX.md)
* [SwapSettings](SwapSettings.md)
* [TokenHandler](TokenHandler.md)
* [TokenHolder](TokenHolder.md)
* [Utils](Utils.md)
* [Whitelist](Whitelist.md)
* [XTransferRerouter](XTransferRerouter.md)
