# LiquidityPoolV2ConverterCustomFactory.sol

View Source: [contracts/converter/types/liquidity-pool-v2/LiquidityPoolV2ConverterCustomFactory.sol](../solidity/contracts/converter/types/liquidity-pool-v2/LiquidityPoolV2ConverterCustomFactory.sol)

**↗ Extends: [ITypedConverterCustomFactory](ITypedConverterCustomFactory.md)**

**LiquidityPoolV2ConverterCustomFactory**

## Functions

- [converterType()](#convertertype)
- [createPriceOracle(IERC20Token _primaryReserveToken, IERC20Token _secondaryReserveToken, IConsumerPriceOracle _primaryReserveOracle, IConsumerPriceOracle _secondaryReserveOracle)](#createpriceoracle)

---    

> ### converterType

⤾ overrides [ITypedConverterCustomFactory.converterType](ITypedConverterCustomFactory.md#convertertype)

returns the converter type the factory is associated with

      *

```solidity
function converterType() public pure
returns(uint16)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function converterType() public pure returns (uint16) {

        return 2;

    }
```
</details>

---    

> ### createPriceOracle

creates a new price oracle

note that the oracles must have the same common denominator (USD, ETH etc.)

      *

```solidity
function createPriceOracle(IERC20Token _primaryReserveToken, IERC20Token _secondaryReserveToken, IConsumerPriceOracle _primaryReserveOracle, IConsumerPriceOracle _secondaryReserveOracle) public nonpayable
returns(contract IPriceOracle)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _primaryReserveToken | IERC20Token |  | 
| _secondaryReserveToken | IERC20Token |  | 
| _primaryReserveOracle | IConsumerPriceOracle |  | 
| _secondaryReserveOracle | IConsumerPriceOracle |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function createPriceOracle(

        IERC20Token _primaryReserveToken,

        IERC20Token _secondaryReserveToken,

        IConsumerPriceOracle _primaryReserveOracle,

        IConsumerPriceOracle _secondaryReserveOracle)

        public

        returns (IPriceOracle)

    {

        return new PriceOracle(_primaryReserveToken, _secondaryReserveToken, _primaryReserveOracle, _secondaryReserveOracle);

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
