# ConverterFactory.sol

View Source: [contracts/converter/ConverterFactory.sol](../solidity/contracts/converter/ConverterFactory.sol)

**↗ Extends: [IConverterFactory](IConverterFactory.md), [Owned](Owned.md)**

**ConverterFactory**

## Contract Members
**Constants & Variables**

```js
mapping(uint16 => contract ITypedConverterFactory) public converterFactories;
mapping(uint16 => contract ITypedConverterAnchorFactory) public anchorFactories;
mapping(uint16 => contract ITypedConverterCustomFactory) public customFactories;

```

**Events**

```js
event NewConverter(uint16 indexed _type, address indexed _converter, address indexed _owner);
```

## Functions

- [registerTypedConverterFactory(ITypedConverterFactory _factory)](#registertypedconverterfactory)
- [registerTypedConverterAnchorFactory(ITypedConverterAnchorFactory _factory)](#registertypedconverteranchorfactory)
- [registerTypedConverterCustomFactory(ITypedConverterCustomFactory _factory)](#registertypedconvertercustomfactory)
- [createAnchor(uint16 _converterType, string _name, string _symbol, uint8 _decimals)](#createanchor)
- [createConverter(uint16 _type, IConverterAnchor _anchor, IContractRegistry _registry, uint32 _maxConversionFee)](#createconverter)

---    

> ### registerTypedConverterFactory

initializes the factory with a specific typed converter factory
can only be called by the owner
	 *

```solidity
function registerTypedConverterFactory(ITypedConverterFactory _factory) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _factory | ITypedConverterFactory | typed converter factory | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function registerTypedConverterFactory(ITypedConverterFactory _factory) public ownerOnly {
		converterFactories[_factory.converterType()] = _factory;
	}
```
</details>

---    

> ### registerTypedConverterAnchorFactory

initializes the factory with a specific typed converter anchor factory
can only be called by the owner
	 *

```solidity
function registerTypedConverterAnchorFactory(ITypedConverterAnchorFactory _factory) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _factory | ITypedConverterAnchorFactory | typed converter anchor factory | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function registerTypedConverterAnchorFactory(ITypedConverterAnchorFactory _factory) public ownerOnly {
		anchorFactories[_factory.converterType()] = _factory;
	}
```
</details>

---    

> ### registerTypedConverterCustomFactory

initializes the factory with a specific typed converter custom factory
can only be called by the owner
	 *

```solidity
function registerTypedConverterCustomFactory(ITypedConverterCustomFactory _factory) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _factory | ITypedConverterCustomFactory | typed converter custom factory | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function registerTypedConverterCustomFactory(ITypedConverterCustomFactory _factory) public ownerOnly {
		customFactories[_factory.converterType()] = _factory;
	}
```
</details>

---    

> ### createAnchor

⤾ overrides [IConverterFactory.createAnchor](IConverterFactory.md#createanchor)

creates a new converter anchor with the given arguments and transfers
the ownership to the caller
	 *

```solidity
function createAnchor(uint16 _converterType, string _name, string _symbol, uint8 _decimals) public nonpayable
returns(contract IConverterAnchor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterType | uint16 | converter type, see ConverterBase contract main doc | 
| _name | string | name | 
| _symbol | string | symbol | 
| _decimals | uint8 | decimals 	 * | 

**Returns**

new converter anchor

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function createAnchor(
		uint16 _converterType,
		string _name,
		string _symbol,
		uint8 _decimals
	) public returns (IConverterAnchor) {
		IConverterAnchor anchor;
		ITypedConverterAnchorFactory factory = anchorFactories[_converterType];

		if (factory == address(0)) {
			// create default anchor (SmartToken)
			anchor = new SmartToken(_name, _symbol, _decimals);
		} else {
			// create custom anchor
			anchor = factory.createAnchor(_name, _symbol, _decimals);
			anchor.acceptOwnership();
		}

		anchor.transferOwnership(msg.sender);
		return anchor;
	}
```
</details>

---    

> ### createConverter

⤾ overrides [IConverterFactory.createConverter](IConverterFactory.md#createconverter)

creates a new converter with the given arguments and transfers
the ownership to the caller
	 *

```solidity
function createConverter(uint16 _type, IConverterAnchor _anchor, IContractRegistry _registry, uint32 _maxConversionFee) public nonpayable
returns(contract IConverter)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _type | uint16 | converter type, see ConverterBase contract main doc | 
| _anchor | IConverterAnchor | anchor governed by the converter | 
| _registry | IContractRegistry | address of a contract registry contract | 
| _maxConversionFee | uint32 | maximum conversion fee, represented in ppm 	 * | 

**Returns**

new converter

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function createConverter(
		uint16 _type,
		IConverterAnchor _anchor,
		IContractRegistry _registry,
		uint32 _maxConversionFee
	) public returns (IConverter) {
		IConverter converter = converterFactories[_type].createConverter(_anchor, _registry, _maxConversionFee);
		converter.acceptOwnership();
		converter.transferOwnership(msg.sender);

		emit NewConverter(_type, converter, msg.sender);
		return converter;
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
