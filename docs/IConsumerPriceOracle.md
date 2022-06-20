# IConsumerPriceOracle.sol

View Source: [contracts/utility/interfaces/IConsumerPriceOracle.sol](../solidity/contracts/utility/interfaces/IConsumerPriceOracle.sol)

**↘ Derived Contracts: [BProOracle](BProOracle.md), [ChainlinkBTCToUSDOracle](ChainlinkBTCToUSDOracle.md), [ChainlinkETHToETHOracle](ChainlinkETHToETHOracle.md), [ChainlinkUSDToBTCOracle](ChainlinkUSDToBTCOracle.md), [Medianizer](Medianizer.md), [MocBTCToBTCOracle](MocBTCToBTCOracle.md), [MocBTCToUSDOracle](MocBTCToUSDOracle.md), [MocUSDToBTCOracle](MocUSDToBTCOracle.md)**

**IConsumerPriceOracle**

## Functions

- [latestAnswer()](#latestanswer)
- [latestTimestamp()](#latesttimestamp)

---    

> ### latestAnswer

⤿ Overridden Implementation(s): [BProOracle.latestAnswer](BProOracle.md#latestanswer),[ChainlinkBTCToUSDOracle.latestAnswer](ChainlinkBTCToUSDOracle.md#latestanswer),[ChainlinkETHToETHOracle.latestAnswer](ChainlinkETHToETHOracle.md#latestanswer),[ChainlinkUSDToBTCOracle.latestAnswer](ChainlinkUSDToBTCOracle.md#latestanswer),[Medianizer.latestAnswer](Medianizer.md#latestanswer),[MocBTCToBTCOracle.latestAnswer](MocBTCToBTCOracle.md#latestanswer),[MocBTCToUSDOracle.latestAnswer](MocBTCToUSDOracle.md#latestanswer),[MocUSDToBTCOracle.latestAnswer](MocUSDToBTCOracle.md#latestanswer)

```solidity
function latestAnswer() external view
returns(int256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function latestAnswer() external view returns (int256);
```
</details>

---    

> ### latestTimestamp

⤿ Overridden Implementation(s): [BProOracle.latestTimestamp](BProOracle.md#latesttimestamp),[ChainlinkBTCToUSDOracle.latestTimestamp](ChainlinkBTCToUSDOracle.md#latesttimestamp),[ChainlinkETHToETHOracle.latestTimestamp](ChainlinkETHToETHOracle.md#latesttimestamp),[ChainlinkUSDToBTCOracle.latestTimestamp](ChainlinkUSDToBTCOracle.md#latesttimestamp),[Medianizer.latestTimestamp](Medianizer.md#latesttimestamp),[MocBTCToBTCOracle.latestTimestamp](MocBTCToBTCOracle.md#latesttimestamp),[MocBTCToUSDOracle.latestTimestamp](MocBTCToUSDOracle.md#latesttimestamp),[MocUSDToBTCOracle.latestTimestamp](MocUSDToBTCOracle.md#latesttimestamp)

```solidity
function latestTimestamp() external view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function latestTimestamp() external view returns (uint256);
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
