# ContractRegistryClient.sol

View Source: [contracts/utility/ContractRegistryClient.sol](../solidity/contracts/utility/ContractRegistryClient.sol)

**↗ Extends: [Owned](Owned.md), [Utils](Utils.md)**
**↘ Derived Contracts: [ConversionPathFinder](ConversionPathFinder.md), [ConverterBase](ConverterBase.md), [ConverterRegistry](ConverterRegistry.md), [ConverterRegistryData](ConverterRegistryData.md), [ConverterUpgrader](ConverterUpgrader.md), [IFeeSharingProxy](IFeeSharingProxy.md), [IInternalSovrynSwapNetwork](IInternalSovrynSwapNetwork.md), [ILegacyConverter](ILegacyConverter.md), [ISwapSettings](ISwapSettings.md), [SovrynSwapNetwork](SovrynSwapNetwork.md), [SovrynSwapX](SovrynSwapX.md), [TestContractRegistryClient](TestContractRegistryClient.md)**

**ContractRegistryClient**

Base contract for ContractRegistry clients

## Constructor

initializes a new ContractRegistryClient instance
	 *

```js
constructor(IContractRegistry _registry) internal
```

**Arguments**

## Contract Members
**Constants & Variables**

```js
//internal members
bytes32 internal constant CONTRACT_REGISTRY;
bytes32 internal constant SOVRYNSWAP_NETWORK;
bytes32 internal constant SOVRYNSWAP_FORMULA;
bytes32 internal constant CONVERTER_FACTORY;
bytes32 internal constant CONVERSION_PATH_FINDER;
bytes32 internal constant CONVERTER_UPGRADER;
bytes32 internal constant CONVERTER_REGISTRY;
bytes32 internal constant CONVERTER_REGISTRY_DATA;
bytes32 internal constant BNT_TOKEN;
bytes32 internal constant SOVRYNSWAP_X;
bytes32 internal constant SOVRYNSWAP_X_UPGRADER;
bytes32 internal constant CHAINLINK_ORACLE_WHITELIST;

//public members
contract IContractRegistry public registry;
contract IContractRegistry public prevRegistry;
bool public onlyOwnerCanUpdateRegistry;

```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _registry | IContractRegistry |  | 

## Modifiers

- [only](#only)

### only

verifies that the caller is mapped to the given contract name
	 *

```js
modifier only(bytes32 _contractName) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _contractName | bytes32 | contract name | 

## Functions

- [_only(bytes32 _contractName)](#_only)
- [updateRegistry()](#updateregistry)
- [restoreRegistry()](#restoreregistry)
- [restrictRegistryUpdate(bool _onlyOwnerCanUpdateRegistry)](#restrictregistryupdate)
- [addressOf(bytes32 _contractName)](#addressof)

---    

> ### _only

```solidity
function _only(bytes32 _contractName) internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _contractName | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _only(bytes32 _contractName) internal view {
		require(msg.sender == addressOf(_contractName), "ERR_ACCESS_DENIED");
	}
```
</details>

---    

> ### updateRegistry

updates to the new contract-registry

```solidity
function updateRegistry() public nonpayable
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function updateRegistry() public {
		// verify that this function is permitted
		require(msg.sender == owner || !onlyOwnerCanUpdateRegistry, "ERR_ACCESS_DENIED");

		// get the new contract-registry
		IContractRegistry newRegistry = IContractRegistry(addressOf(CONTRACT_REGISTRY));

		// verify that the new contract-registry is different and not zero
		require(newRegistry != address(registry) && newRegistry != address(0), "ERR_INVALID_REGISTRY");

		// verify that the new contract-registry is pointing to a non-zero contract-registry
		require(newRegistry.addressOf(CONTRACT_REGISTRY) != address(0), "ERR_INVALID_REGISTRY");

		// save a backup of the current contract-registry before replacing it
		prevRegistry = registry;

		// replace the current contract-registry with the new contract-registry
		registry = newRegistry;
	}
```
</details>

---    

> ### restoreRegistry

restores the previous contract-registry

```solidity
function restoreRegistry() public nonpayable ownerOnly 
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function restoreRegistry() public ownerOnly {
		// restore the previous contract-registry
		registry = prevRegistry;
	}
```
</details>

---    

> ### restrictRegistryUpdate

restricts the permission to update the contract-registry
	 *

```solidity
function restrictRegistryUpdate(bool _onlyOwnerCanUpdateRegistry) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _onlyOwnerCanUpdateRegistry | bool | indicates whether or not permission is restricted to owner only | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function restrictRegistryUpdate(bool _onlyOwnerCanUpdateRegistry) public ownerOnly {
		// change the permission to update the contract-registry
		onlyOwnerCanUpdateRegistry = _onlyOwnerCanUpdateRegistry;
	}
```
</details>

---    

> ### addressOf

returns the address associated with the given contract name
	 *

```solidity
function addressOf(bytes32 _contractName) internal view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _contractName | bytes32 | contract name 	 * | 

**Returns**

contract address

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addressOf(bytes32 _contractName) internal view returns (address) {
		return registry.addressOf(_contractName);
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
