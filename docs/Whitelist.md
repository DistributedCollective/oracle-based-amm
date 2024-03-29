# Whitelist.sol

View Source: [contracts/utility/Whitelist.sol](../solidity/contracts/utility/Whitelist.sol)

**↗ Extends: [IWhitelist](IWhitelist.md), [Owned](Owned.md), [Utils](Utils.md)**

**Whitelist**

The contract manages a list of whitelisted addresses

## Contract Members
**Constants & Variables**

```js
mapping(address => bool) private whitelist;

```

**Events**

```js
event AddressAddition(address indexed _address);
event AddressRemoval(address indexed _address);
```

## Functions

- [isWhitelisted(address _address)](#iswhitelisted)
- [addAddress(address _address)](#addaddress)
- [addAddresses(address[] _addresses)](#addaddresses)
- [removeAddress(address _address)](#removeaddress)
- [removeAddresses(address[] _addresses)](#removeaddresses)

---    

> ### isWhitelisted

⤾ overrides [IWhitelist.isWhitelisted](IWhitelist.md#iswhitelisted)

returns true if a given address is whitelisted, false if not
	 *

```solidity
function isWhitelisted(address _address) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | address to check 	 * | 

**Returns**

true if the address is whitelisted, false if not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isWhitelisted(address _address) public view returns (bool) {
		return whitelist[_address];
	}
```
</details>

---    

> ### addAddress

adds a given address to the whitelist
	 *

```solidity
function addAddress(address _address) public nonpayable ownerOnly validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | address to add | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addAddress(address _address) public ownerOnly validAddress(_address) {
		if (whitelist[_address])
			// checks if the address is already whitelisted
			return;

		whitelist[_address] = true;
		emit AddressAddition(_address);
	}
```
</details>

---    

> ### addAddresses

adds a list of addresses to the whitelist
	 *

```solidity
function addAddresses(address[] _addresses) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _addresses | address[] | addresses to add | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addAddresses(address[] _addresses) public {
		for (uint256 i = 0; i < _addresses.length; i++) {
			addAddress(_addresses[i]);
		}
	}
```
</details>

---    

> ### removeAddress

removes a given address from the whitelist
	 *

```solidity
function removeAddress(address _address) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address | address to remove | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeAddress(address _address) public ownerOnly {
		if (!whitelist[_address])
			// checks if the address is actually whitelisted
			return;

		whitelist[_address] = false;
		emit AddressRemoval(_address);
	}
```
</details>

---    

> ### removeAddresses

removes a list of addresses from the whitelist
	 *

```solidity
function removeAddresses(address[] _addresses) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _addresses | address[] | addresses to remove | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeAddresses(address[] _addresses) public {
		for (uint256 i = 0; i < _addresses.length; i++) {
			removeAddress(_addresses[i]);
		}
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
