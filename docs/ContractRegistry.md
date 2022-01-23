# ContractRegistry.sol

View Source: [contracts/utility/ContractRegistry.sol](../solidity/contracts/utility/ContractRegistry.sol)

**↗ Extends: [IContractRegistry](IContractRegistry.md), [Owned](Owned.md), [Utils](Utils.md)**

**ContractRegistry**

Contract Registry
 * The contract registry keeps contract addresses by name.
The owner can update contract addresses so that a contract name always points to the latest version
of the given contract.
Other contracts can query the registry to get updated addresses instead of depending on specific
addresses.
 * Note that contract names are limited to 32 bytes UTF8 encoded ASCII strings to optimize gas costs

## Structs
### RegistryItem

```js
struct RegistryItem {
 address contractAddress,
 uint256 nameIndex
}
```

## Contract Members
**Constants & Variables**

```js
//private members
mapping(bytes32 => struct ContractRegistry.RegistryItem) private items;

//public members
string[] public contractNames;

```

**Events**

```js
event AddressUpdate(bytes32 indexed _contractName, address  _contractAddress);
```

## Functions

- [itemCount()](#itemcount)
- [addressOf(bytes32 _contractName)](#addressof)
- [registerAddress(bytes32 _contractName, address _contractAddress)](#registeraddress)
- [unregisterAddress(bytes32 _contractName)](#unregisteraddress)
- [bytes32ToString(bytes32 _bytes)](#bytes32tostring)
- [stringToBytes32(string _string)](#stringtobytes32)
- [getAddress(bytes32 _contractName)](#getaddress)

> ### function itemCount

returns the number of items in the registry
	 *

```solidity
function itemCount() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function itemCount() public view returns (uint256) {
		return contractNames.length;
	}
```
</details>

> ### function addressOf

⤾ overrides [IContractRegistry.addressOf](IContractRegistry.md#addressof)

returns the address associated with the given contract name
	 *

```solidity
function addressOf(bytes32 _contractName) public view
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
function addressOf(bytes32 _contractName) public view returns (address) {
		return items[_contractName].contractAddress;
	}
```
</details>

> ### function registerAddress

registers a new address for the contract name in the registry
	 *

```solidity
function registerAddress(bytes32 _contractName, address _contractAddress) public nonpayable ownerOnly validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _contractName | bytes32 | contract name | 
| _contractAddress | address | contract address | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function registerAddress(bytes32 _contractName, address _contractAddress) public ownerOnly validAddress(_contractAddress) {
		// validate input
		require(_contractName.length > 0, "ERR_INVALID_NAME");

		// check if any change is needed
		address currentAddress = items[_contractName].contractAddress;
		if (_contractAddress == currentAddress) return;

		if (currentAddress == address(0)) {
			// add the contract name to the name list
			uint256 i = contractNames.push(bytes32ToString(_contractName));
			// update the item's index in the list
			items[_contractName].nameIndex = i - 1;
		}

		// update the address in the registry
		items[_contractName].contractAddress = _contractAddress;

		// dispatch the address update event
		emit AddressUpdate(_contractName, _contractAddress);
	}
```
</details>

> ### function unregisterAddress

removes an existing contract address from the registry
	 *

```solidity
function unregisterAddress(bytes32 _contractName) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _contractName | bytes32 | contract name | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function unregisterAddress(bytes32 _contractName) public ownerOnly {
		// validate input
		require(_contractName.length > 0, "ERR_INVALID_NAME");
		require(items[_contractName].contractAddress != address(0), "ERR_INVALID_NAME");

		// remove the address from the registry
		items[_contractName].contractAddress = address(0);

		// if there are multiple items in the registry, move the last element to the deleted element's position
		// and modify last element's registryItem.nameIndex in the items collection to point to the right position in contractNames
		if (contractNames.length > 1) {
			string memory lastContractNameString = contractNames[contractNames.length - 1];
			uint256 unregisterIndex = items[_contractName].nameIndex;

			contractNames[unregisterIndex] = lastContractNameString;
			bytes32 lastContractName = stringToBytes32(lastContractNameString);
			RegistryItem storage registryItem = items[lastContractName];
			registryItem.nameIndex = unregisterIndex;
		}

		// remove the last element from the name list
		contractNames.length--;
		// zero the deleted element's index
		items[_contractName].nameIndex = 0;

		// dispatch the address update event
		emit AddressUpdate(_contractName, address(0));
	}
```
</details>

> ### function bytes32ToString

utility, converts bytes32 to a string
note that the bytes32 argument is assumed to be UTF8 encoded ASCII string
	 *

```solidity
function bytes32ToString(bytes32 _bytes) private pure
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _bytes | bytes32 |  | 

**Returns**

string representation of the given bytes32 argument

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function bytes32ToString(bytes32 _bytes) private pure returns (string) {
		bytes memory byteArray = new bytes(32);
		for (uint256 i = 0; i < 32; i++) {
			byteArray[i] = _bytes[i];
		}

		return string(byteArray);
	}
```
</details>

> ### function stringToBytes32

utility, converts string to bytes32
note that the bytes32 argument is assumed to be UTF8 encoded ASCII string
	 *

```solidity
function stringToBytes32(string _string) private pure
returns(bytes32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _string | string |  | 

**Returns**

string representation of the given bytes32 argument

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function stringToBytes32(string memory _string) private pure returns (bytes32) {
		bytes32 result;
		assembly {
			result := mload(add(_string, 32))
		}
		return result;
	}
```
</details>

> ### function getAddress

⤾ overrides [IContractRegistry.getAddress](IContractRegistry.md#getaddress)

deprecated, backward compatibility

```solidity
function getAddress(bytes32 _contractName) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _contractName | bytes32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAddress(bytes32 _contractName) public view returns (address) {
		return addressOf(_contractName);
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
