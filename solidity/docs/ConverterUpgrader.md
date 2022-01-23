# ConverterUpgrader.sol

View Source: [contracts/converter/ConverterUpgrader.sol](../contracts/converter/ConverterUpgrader.sol)

**↗ Extends: [IConverterUpgrader](IConverterUpgrader.md), [ContractRegistryClient](ContractRegistryClient.md)**

**ConverterUpgrader**

Converter Upgrader
 * The converter upgrader contract allows upgrading an older converter contract (0.4 and up)
to the latest version.
To begin the upgrade process, simply execute the 'upgrade' function.
At the end of the process, the ownership of the newly upgraded converter will be transferred
back to the original owner and the original owner will need to execute the 'acceptOwnership' function.
 * The address of the new converter is available in the ConverterUpgrade event.
 * Note that for older converters that don't yet have the 'upgrade' function, ownership should first
be transferred manually to the ConverterUpgrader contract using the 'transferOwnership' function
and then the upgrader 'upgrade' function should be executed directly.

## Constructor

initializes a new ConverterUpgrader instance
	 *

```js
constructor(IContractRegistry _registry) public
```

**Arguments**

## Contract Members
**Constants & Variables**

```js
//private members
address private constant ETH_RESERVE_ADDRESS;
bytes4 private constant IS_V28_OR_HIGHER_FUNC_SELECTOR;

//public members
contract IEtherToken public etherToken;

```

**Events**

```js
event ConverterOwned(address indexed _converter, address indexed _owner);
event ConverterUpgrade(address indexed _oldConverter, address indexed _newConverter);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _registry | IContractRegistry | address of a contract registry contract | 

## Functions

- [upgrade(bytes32 _version)](#upgrade)
- [upgrade(uint16 _version)](#upgrade)
- [upgradeOld(IConverter _converter, bytes32 _version)](#upgradeold)
- [acceptConverterOwnership(IConverter _oldConverter)](#acceptconverterownership)
- [createConverter(IConverter _oldConverter)](#createconverter)
- [copyReserves(IConverter _oldConverter, IConverter _newConverter)](#copyreserves)
- [copyConversionFee(IConverter _oldConverter, IConverter _newConverter)](#copyconversionfee)
- [transferReserveBalances(IConverter _oldConverter, IConverter _newConverter)](#transferreservebalances)
- [handleTypeSpecificData(IConverter _oldConverter, IConverter _newConverter, bool _activate)](#handletypespecificdata)
- [isV28OrHigherConverter(IConverter _converter)](#isv28orhigherconverter)

### upgrade

⤾ overrides [IConverterUpgrader.upgrade](IConverterUpgrader.md#upgrade)

upgrades an old converter to the latest version
will throw if ownership wasn't transferred to the upgrader before calling this function.
ownership of the new converter will be transferred back to the original owner.
fires the ConverterUpgrade event upon success.
can only be called by a converter
	 *

```js
function upgrade(bytes32 _version) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _version | bytes32 | old converter version | 

### upgrade

⤾ overrides [IConverterUpgrader.upgrade](IConverterUpgrader.md#upgrade)

upgrades an old converter to the latest version
will throw if ownership wasn't transferred to the upgrader before calling this function.
ownership of the new converter will be transferred back to the original owner.
fires the ConverterUpgrade event upon success.
can only be called by a converter
	 *

```js
function upgrade(uint16 _version) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _version | uint16 | old converter version | 

### upgradeOld

upgrades an old converter to the latest version
will throw if ownership wasn't transferred to the upgrader before calling this function.
ownership of the new converter will be transferred back to the original owner.
fires the ConverterUpgrade event upon success.
	 *

```js
function upgradeOld(IConverter _converter, bytes32 _version) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | old converter contract address | 
| _version | bytes32 | old converter version | 

### acceptConverterOwnership

the first step when upgrading a converter is to transfer the ownership to the local contract.
the upgrader contract then needs to accept the ownership transfer before initiating
the upgrade process.
fires the ConverterOwned event upon success
	 *

```js
function acceptConverterOwnership(IConverter _oldConverter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | converter to accept ownership of | 

### createConverter

creates a new converter with same basic data as the original old converter
the newly created converter will have no reserves at this step.
	 *

```js
function createConverter(IConverter _oldConverter) private nonpayable
returns(contract IConverter)
```

**Returns**

the new converter  new converter contract address

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address
	 * | 

### copyReserves

copies the reserves from the old converter to the new one.
note that this will not work for an unlimited number of reserves due to block gas limit constraints.
	 *

```js
function copyReserves(IConverter _oldConverter, IConverter _newConverter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address | 
| _newConverter | IConverter | new converter contract address | 

### copyConversionFee

copies the conversion fee from the old converter to the new one
	 *

```js
function copyConversionFee(IConverter _oldConverter, IConverter _newConverter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address | 
| _newConverter | IConverter | new converter contract address | 

### transferReserveBalances

transfers the balance of each reserve in the old converter to the new one.
note that the function assumes that the new converter already has the exact same number of
also, this will not work for an unlimited number of reserves due to block gas limit constraints.
	 *

```js
function transferReserveBalances(IConverter _oldConverter, IConverter _newConverter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address | 
| _newConverter | IConverter | new converter contract address | 

### handleTypeSpecificData

handles upgrading custom (type specific) data from the old converter to the new one
	 *

```js
function handleTypeSpecificData(IConverter _oldConverter, IConverter _newConverter, bool _activate) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address | 
| _newConverter | IConverter | new converter contract address | 
| _activate | bool | activate the new converter | 

### isV28OrHigherConverter

```js
function isV28OrHigherConverter(IConverter _converter) internal view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 

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
