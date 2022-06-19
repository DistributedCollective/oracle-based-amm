# ConverterRegistry.sol

View Source: [contracts/converter/ConverterRegistry.sol](../solidity/contracts/converter/ConverterRegistry.sol)

**↗ Extends: [IConverterRegistry](IConverterRegistry.md), [ContractRegistryClient](ContractRegistryClient.md), [TokenHandler](TokenHandler.md)**
**↘ Derived Contracts: [TestConverterRegistry](TestConverterRegistry.md)**

**ConverterRegistry**

The ConverterRegistry maintains a list of all active converters in the SovrynSwap Network.
 * Since converters can be upgraded and thus their address can change, the registry actually keeps
converter anchors internally and not the converters themselves.
The active converter for each anchor can be easily accessed by querying the anchor's owner.
 * The registry exposes 3 differnet lists that can be accessed and iterated, based on the use-case of the caller:
- Anchors - can be used to get all the latest / historical data in the network
- Liquidity pools - can be used to get all liquidity pools for funding, liquidation etc.
- Convertible tokens - can be used to get all tokens that can be converted in the network (excluding pool
  tokens), and for each one - all anchors that hold it in their reserves
 *
The contract fires events whenever one of the primitives is added to or removed from the registry
 * The contract is upgradable.

## Constructor

initializes a new ConverterRegistry instance
	 *

```js
constructor(IContractRegistry _registry) public
```

**Arguments**

## Contract Members
**Constants & Variables**

```js
address private constant ETH_RESERVE_ADDRESS;
mapping(address => address) private deployer;
bytes4 private constant CONNECTORS_FUNC_SELECTOR;

```

**Events**

```js
event ConverterAnchorAdded(address indexed _anchor);
event ConverterAnchorRemoved(address indexed _anchor);
event LiquidityPoolAdded(address indexed _liquidityPool);
event LiquidityPoolRemoved(address indexed _liquidityPool);
event ConvertibleTokenAdded(address indexed _convertibleToken, address indexed _smartToken);
event ConvertibleTokenRemoved(address indexed _convertibleToken, address indexed _smartToken);
event SmartTokenAdded(address indexed _smartToken);
event SmartTokenRemoved(address indexed _smartToken);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _registry | IContractRegistry | address of a contract registry contract | 

## Functions

- [newConverter(uint16 _type, string _name, string _symbol, uint8 _decimals, uint32 _maxConversionFee, IERC20Token[] _reserveTokens, uint32[] _reserveWeights)](#newconverter)
- [setupConverter(uint16 _type, IERC20Token[] _reserveTokens, uint32[] _reserveWeights, IConverter _converter)](#setupconverter)
- [addConverter(IConverter _converter)](#addconverter)
- [removeConverter(IConverter _converter)](#removeconverter)
- [getAnchorCount()](#getanchorcount)
- [getAnchors()](#getanchors)
- [getAnchor(uint256 _index)](#getanchor)
- [isAnchor(address _value)](#isanchor)
- [getLiquidityPoolCount()](#getliquiditypoolcount)
- [getLiquidityPools()](#getliquiditypools)
- [getLiquidityPool(uint256 _index)](#getliquiditypool)
- [isLiquidityPool(address _value)](#isliquiditypool)
- [getConvertibleTokenCount()](#getconvertibletokencount)
- [getConvertibleTokens()](#getconvertibletokens)
- [getConvertibleToken(uint256 _index)](#getconvertibletoken)
- [isConvertibleToken(address _value)](#isconvertibletoken)
- [getConvertibleTokenAnchorCount(address _convertibleToken)](#getconvertibletokenanchorcount)
- [getConvertibleTokenAnchors(address _convertibleToken)](#getconvertibletokenanchors)
- [getConvertibleTokenAnchor(address _convertibleToken, uint256 _index)](#getconvertibletokenanchor)
- [isConvertibleTokenAnchor(address _convertibleToken, address _value)](#isconvertibletokenanchor)
- [getConvertersByAnchors(address[] _anchors)](#getconvertersbyanchors)
- [isConverterValid(IConverter _converter)](#isconvertervalid)
- [isSimilarLiquidityPoolRegistered(IConverter _converter)](#issimilarliquiditypoolregistered)
- [getLiquidityPoolByConfig(uint16 _type, IERC20Token[] _reserveTokens, uint32[] _reserveWeights)](#getliquiditypoolbyconfig)
- [addAnchor(IConverterRegistryData _converterRegistryData, address _anchor)](#addanchor)
- [removeAnchor(IConverterRegistryData _converterRegistryData, address _anchor)](#removeanchor)
- [addLiquidityPool(IConverterRegistryData _converterRegistryData, address _liquidityPool)](#addliquiditypool)
- [removeLiquidityPool(IConverterRegistryData _converterRegistryData, address _liquidityPool)](#removeliquiditypool)
- [addConvertibleToken(IConverterRegistryData _converterRegistryData, address _convertibleToken, address _anchor)](#addconvertibletoken)
- [removeConvertibleToken(IConverterRegistryData _converterRegistryData, address _convertibleToken, address _anchor)](#removeconvertibletoken)
- [addConverterInternal(IConverter _converter)](#addconverterinternal)
- [removeConverterInternal(IConverter _converter)](#removeconverterinternal)
- [getLeastFrequentTokenAnchors(IERC20Token[] _reserveTokens)](#getleastfrequenttokenanchors)
- [isConverterReserveConfigEqual(IConverter _converter, uint16 _type, IERC20Token[] _reserveTokens, uint32[] _reserveWeights)](#isconverterreserveconfigequal)
- [getReserveWeight(address _converter, address _reserveToken)](#getreserveweight)
- [getSmartTokenCount()](#getsmarttokencount)
- [getSmartTokens()](#getsmarttokens)
- [getSmartToken(uint256 _index)](#getsmarttoken)
- [isSmartToken(address _value)](#issmarttoken)
- [getConvertibleTokenSmartTokenCount(address _convertibleToken)](#getconvertibletokensmarttokencount)
- [getConvertibleTokenSmartTokens(address _convertibleToken)](#getconvertibletokensmarttokens)
- [getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index)](#getconvertibletokensmarttoken)
- [isConvertibleTokenSmartToken(address _convertibleToken, address _value)](#isconvertibletokensmarttoken)
- [getConvertersBySmartTokens(address[] _smartTokens)](#getconvertersbysmarttokens)
- [getLiquidityPoolByReserveConfig(IERC20Token[] _reserveTokens, uint32[] _reserveWeights)](#getliquiditypoolbyreserveconfig)

---    

> ### newConverter

⤿ Overridden Implementation(s): [TestConverterRegistry.newConverter](TestConverterRegistry.md#newconverter)

creates a zero supply liquid token / empty liquidity pool and adds its converter to the registry
	 *

```solidity
function newConverter(uint16 _type, string _name, string _symbol, uint8 _decimals, uint32 _maxConversionFee, IERC20Token[] _reserveTokens, uint32[] _reserveWeights) public nonpayable
returns(contract IConverter)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _type | uint16 | converter type, see ConverterBase contract main doc | 
| _name | string | token / pool name | 
| _symbol | string | token / pool symbol | 
| _decimals | uint8 | token / pool decimals | 
| _maxConversionFee | uint32 | maximum conversion-fee | 
| _reserveTokens | IERC20Token[] | reserve tokens | 
| _reserveWeights | uint32[] | reserve weights 	 * | 

**Returns**

new converter

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function newConverter(
		uint16 _type,
		string _name,
		string _symbol,
		uint8 _decimals,
		uint32 _maxConversionFee,
		IERC20Token[] memory _reserveTokens,
		uint32[] memory _reserveWeights
	) public returns (IConverter) {
		uint256 length = _reserveTokens.length;
		require(length == _reserveWeights.length, "ERR_INVALID_RESERVES");
		require(getLiquidityPoolByConfig(_type, _reserveTokens, _reserveWeights) == IConverterAnchor(0), "ERR_ALREADY_EXISTS");

		IConverterFactory factory = IConverterFactory(addressOf(CONVERTER_FACTORY));
		IConverterAnchor anchor = IConverterAnchor(factory.createAnchor(_type, _name, _symbol, _decimals));
		IConverter converter = IConverter(factory.createConverter(_type, anchor, registry, _maxConversionFee));

		//remember the deployer to make sure only the deployer may finish the setup of the converter
		deployer[converter] = msg.sender;

		return converter;
	}
```
</details>

---    

> ### setupConverter

completes the configuration for a converter
	 *

```solidity
function setupConverter(uint16 _type, IERC20Token[] _reserveTokens, uint32[] _reserveWeights, IConverter _converter) public nonpayable
returns(contract IConverter)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _type | uint16 | converter type, see ConverterBase contract main doc | 
| _reserveTokens | IERC20Token[] | reserve tokens | 
| _reserveWeights | uint32[] | reserve weights | 
| _converter | IConverter | the converter previously created through newConverter method 	 * | 

**Returns**

converter

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setupConverter(
		uint16 _type,
		IERC20Token[] memory _reserveTokens,
		uint32[] memory _reserveWeights,
		IConverter _converter
	) public returns (IConverter) {
		require(deployer[_converter] == msg.sender, "only the deployer may finish the converter setup");

		uint256 length = _reserveTokens.length;
		require(length == _reserveWeights.length, "ERR_INVALID_RESERVES");
		require(getLiquidityPoolByConfig(_type, _reserveTokens, _reserveWeights) == IConverterAnchor(0), "ERR_ALREADY_EXISTS");

		IConverterAnchor anchor = _converter.anchor();

		anchor.acceptOwnership();
		_converter.acceptOwnership();

		for (uint256 i = 0; i < length; i++) _converter.addReserve(_reserveTokens[i], _reserveWeights[i]);

		anchor.transferOwnership(_converter);
		_converter.acceptAnchorOwnership();
		_converter.transferOwnership(msg.sender);

		addConverterInternal(_converter);
		return _converter;
	}
```
</details>

---    

> ### addConverter

adds an existing converter to the registry
can only be called by the owner
	 *

```solidity
function addConverter(IConverter _converter) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | converter | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addConverter(IConverter _converter) public ownerOnly {
		require(isConverterValid(_converter), "ERR_INVALID_CONVERTER");
		addConverterInternal(_converter);
	}
```
</details>

---    

> ### removeConverter

removes a converter from the registry
anyone can remove an existing converter from the registry, as long as the converter is invalid
note that the owner can also remove valid converters
	 *

```solidity
function removeConverter(IConverter _converter) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | converter | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeConverter(IConverter _converter) public {
		require(msg.sender == owner || !isConverterValid(_converter), "ERR_ACCESS_DENIED");
		removeConverterInternal(_converter);
	}
```
</details>

---    

> ### getAnchorCount

⤾ overrides [IConverterRegistry.getAnchorCount](IConverterRegistry.md#getanchorcount)

returns the number of converter anchors in the registry
	 *

```solidity
function getAnchorCount() public view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAnchorCount() public view returns (uint256) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getSmartTokenCount();
	}
```
</details>

---    

> ### getAnchors

⤾ overrides [IConverterRegistry.getAnchors](IConverterRegistry.md#getanchors)

returns the list of converter anchors in the registry
	 *

```solidity
function getAnchors() public view
returns(address[])
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAnchors() public view returns (address[]) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getSmartTokens();
	}
```
</details>

---    

> ### getAnchor

⤾ overrides [IConverterRegistry.getAnchor](IConverterRegistry.md#getanchor)

returns the converter anchor at a given index
	 *

```solidity
function getAnchor(uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

**Returns**

anchor at the given index

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getAnchor(uint256 _index) public view returns (address) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getSmartToken(_index);
	}
```
</details>

---    

> ### isAnchor

⤾ overrides [IConverterRegistry.isAnchor](IConverterRegistry.md#isanchor)

checks whether or not a given value is a converter anchor
	 *

```solidity
function isAnchor(address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

**Returns**

true if the given value is an anchor, false if not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isAnchor(address _value) public view returns (bool) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).isSmartToken(_value);
	}
```
</details>

---    

> ### getLiquidityPoolCount

⤾ overrides [IConverterRegistry.getLiquidityPoolCount](IConverterRegistry.md#getliquiditypoolcount)

returns the number of liquidity pools in the registry
	 *

```solidity
function getLiquidityPoolCount() public view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPoolCount() public view returns (uint256) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getLiquidityPoolCount();
	}
```
</details>

---    

> ### getLiquidityPools

⤾ overrides [IConverterRegistry.getLiquidityPools](IConverterRegistry.md#getliquiditypools)

returns the list of liquidity pools in the registry
	 *

```solidity
function getLiquidityPools() public view
returns(address[])
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPools() public view returns (address[]) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getLiquidityPools();
	}
```
</details>

---    

> ### getLiquidityPool

⤾ overrides [IConverterRegistry.getLiquidityPool](IConverterRegistry.md#getliquiditypool)

returns the liquidity pool at a given index
	 *

```solidity
function getLiquidityPool(uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

**Returns**

liquidity pool at the given index

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPool(uint256 _index) public view returns (address) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getLiquidityPool(_index);
	}
```
</details>

---    

> ### isLiquidityPool

⤾ overrides [IConverterRegistry.isLiquidityPool](IConverterRegistry.md#isliquiditypool)

checks whether or not a given value is a liquidity pool
	 *

```solidity
function isLiquidityPool(address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

**Returns**

true if the given value is a liquidity pool, false if not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isLiquidityPool(address _value) public view returns (bool) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).isLiquidityPool(_value);
	}
```
</details>

---    

> ### getConvertibleTokenCount

⤾ overrides [IConverterRegistry.getConvertibleTokenCount](IConverterRegistry.md#getconvertibletokencount)

returns the number of convertible tokens in the registry
	 *

```solidity
function getConvertibleTokenCount() public view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenCount() public view returns (uint256) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getConvertibleTokenCount();
	}
```
</details>

---    

> ### getConvertibleTokens

⤾ overrides [IConverterRegistry.getConvertibleTokens](IConverterRegistry.md#getconvertibletokens)

returns the list of convertible tokens in the registry
	 *

```solidity
function getConvertibleTokens() public view
returns(address[])
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokens() public view returns (address[]) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getConvertibleTokens();
	}
```
</details>

---    

> ### getConvertibleToken

⤾ overrides [IConverterRegistry.getConvertibleToken](IConverterRegistry.md#getconvertibletoken)

returns the convertible token at a given index
	 *

```solidity
function getConvertibleToken(uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

**Returns**

convertible token at the given index

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleToken(uint256 _index) public view returns (address) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getConvertibleToken(_index);
	}
```
</details>

---    

> ### isConvertibleToken

⤾ overrides [IConverterRegistry.isConvertibleToken](IConverterRegistry.md#isconvertibletoken)

checks whether or not a given value is a convertible token
	 *

```solidity
function isConvertibleToken(address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

**Returns**

true if the given value is a convertible token, false if not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConvertibleToken(address _value) public view returns (bool) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).isConvertibleToken(_value);
	}
```
</details>

---    

> ### getConvertibleTokenAnchorCount

⤾ overrides [IConverterRegistry.getConvertibleTokenAnchorCount](IConverterRegistry.md#getconvertibletokenanchorcount)

returns the number of converter anchors associated with a given convertible token
	 *

```solidity
function getConvertibleTokenAnchorCount(address _convertibleToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 

**Returns**

number of anchors associated with the given convertible token

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenAnchorCount(address _convertibleToken) public view returns (uint256) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getConvertibleTokenSmartTokenCount(_convertibleToken);
	}
```
</details>

---    

> ### getConvertibleTokenAnchors

⤾ overrides [IConverterRegistry.getConvertibleTokenAnchors](IConverterRegistry.md#getconvertibletokenanchors)

returns the list of converter anchors associated with a given convertible token
	 *

```solidity
function getConvertibleTokenAnchors(address _convertibleToken) public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 

**Returns**

list of anchors associated with the given convertible token

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenAnchors(address _convertibleToken) public view returns (address[]) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getConvertibleTokenSmartTokens(_convertibleToken);
	}
```
</details>

---    

> ### getConvertibleTokenAnchor

⤾ overrides [IConverterRegistry.getConvertibleTokenAnchor](IConverterRegistry.md#getconvertibletokenanchor)

returns the converter anchor associated with a given convertible token at a given index
	 *

```solidity
function getConvertibleTokenAnchor(address _convertibleToken, uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _index | uint256 | index | 

**Returns**

anchor associated with the given convertible token at the given index

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenAnchor(address _convertibleToken, uint256 _index) public view returns (address) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).getConvertibleTokenSmartToken(_convertibleToken, _index);
	}
```
</details>

---    

> ### isConvertibleTokenAnchor

⤾ overrides [IConverterRegistry.isConvertibleTokenAnchor](IConverterRegistry.md#isconvertibletokenanchor)

checks whether or not a given value is a converter anchor of a given convertible token
	 *

```solidity
function isConvertibleTokenAnchor(address _convertibleToken, address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _value | address | value | 

**Returns**

true if the given value is an anchor of the given convertible token, false if not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConvertibleTokenAnchor(address _convertibleToken, address _value) public view returns (bool) {
		return IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA)).isConvertibleTokenSmartToken(_convertibleToken, _value);
	}
```
</details>

---    

> ### getConvertersByAnchors

returns a list of converters for a given list of anchors
this is a utility function that can be used to reduce the number of calls to the contract
	 *

```solidity
function getConvertersByAnchors(address[] _anchors) public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _anchors | address[] | list of converter anchors | 

**Returns**

list of converters

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertersByAnchors(address[] _anchors) public view returns (address[]) {
		address[] memory converters = new address[](_anchors.length);

		for (uint256 i = 0; i < _anchors.length; i++) converters[i] = IConverterAnchor(_anchors[i]).owner();

		return converters;
	}
```
</details>

---    

> ### isConverterValid

checks whether or not a given converter is valid
	 *

```solidity
function isConverterValid(IConverter _converter) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | converter | 

**Returns**

true if the given converter is valid, false if not

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConverterValid(IConverter _converter) public view returns (bool) {
		// verify that the converter is active
		return _converter.token().owner() == address(_converter);
	}
```
</details>

---    

> ### isSimilarLiquidityPoolRegistered

checks if a liquidity pool with given configuration is already registered
	 *

```solidity
function isSimilarLiquidityPoolRegistered(IConverter _converter) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | converter with specific configuration | 

**Returns**

if a liquidity pool with the same configuration is already registered

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isSimilarLiquidityPoolRegistered(IConverter _converter) public view returns (bool) {
		uint256 reserveTokenCount = _converter.connectorTokenCount();
		IERC20Token[] memory reserveTokens = new IERC20Token[](reserveTokenCount);
		uint32[] memory reserveWeights = new uint32[](reserveTokenCount);

		// get the reserve-configuration of the converter
		for (uint256 i = 0; i < reserveTokenCount; i++) {
			IERC20Token reserveToken = _converter.connectorTokens(i);
			reserveTokens[i] = reserveToken;
			reserveWeights[i] = getReserveWeight(_converter, reserveToken);
		}

		// return if a liquidity pool with the same configuration is already registered
		return getLiquidityPoolByConfig(_converter.converterType(), reserveTokens, reserveWeights) != IConverterAnchor(0);
	}
```
</details>

---    

> ### getLiquidityPoolByConfig

searches for a liquidity pool with specific configuration
	 *

```solidity
function getLiquidityPoolByConfig(uint16 _type, IERC20Token[] _reserveTokens, uint32[] _reserveWeights) public view
returns(contract IConverterAnchor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _type | uint16 | converter type, see ConverterBase contract main doc | 
| _reserveTokens | IERC20Token[] | reserve tokens | 
| _reserveWeights | uint32[] | reserve weights | 

**Returns**

the liquidity pool, or zero if no such liquidity pool exists

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPoolByConfig(
		uint16 _type,
		IERC20Token[] memory _reserveTokens,
		uint32[] memory _reserveWeights
	) public view returns (IConverterAnchor) {
		// verify that the input parameters represent a valid liquidity pool
		if (_reserveTokens.length == _reserveWeights.length && _reserveTokens.length > 1) {
			// get the anchors of the least frequent token (optimization)
			address[] memory convertibleTokenAnchors = getLeastFrequentTokenAnchors(_reserveTokens);
			// search for a converter with the same configuration
			for (uint256 i = 0; i < convertibleTokenAnchors.length; i++) {
				IConverterAnchor anchor = IConverterAnchor(convertibleTokenAnchors[i]);
				IConverter converter = IConverter(anchor.owner());
				if (isConverterReserveConfigEqual(converter, _type, _reserveTokens, _reserveWeights)) return anchor;
			}
		}

		return IConverterAnchor(0);
	}
```
</details>

---    

> ### addAnchor

adds a converter anchor to the registry
	 *

```solidity
function addAnchor(IConverterRegistryData _converterRegistryData, address _anchor) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _anchor | address | converter anchor | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addAnchor(IConverterRegistryData _converterRegistryData, address _anchor) internal {
		_converterRegistryData.addSmartToken(_anchor);
		emit ConverterAnchorAdded(_anchor);
		emit SmartTokenAdded(_anchor);
	}
```
</details>

---    

> ### removeAnchor

removes a converter anchor from the registry
	 *

```solidity
function removeAnchor(IConverterRegistryData _converterRegistryData, address _anchor) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _anchor | address | converter anchor | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeAnchor(IConverterRegistryData _converterRegistryData, address _anchor) internal {
		_converterRegistryData.removeSmartToken(_anchor);
		emit ConverterAnchorRemoved(_anchor);
		emit SmartTokenRemoved(_anchor);
	}
```
</details>

---    

> ### addLiquidityPool

adds a liquidity pool to the registry
	 *

```solidity
function addLiquidityPool(IConverterRegistryData _converterRegistryData, address _liquidityPool) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _liquidityPool | address | liquidity pool | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addLiquidityPool(IConverterRegistryData _converterRegistryData, address _liquidityPool) internal {
		_converterRegistryData.addLiquidityPool(_liquidityPool);
		emit LiquidityPoolAdded(_liquidityPool);
	}
```
</details>

---    

> ### removeLiquidityPool

removes a liquidity pool from the registry
	 *

```solidity
function removeLiquidityPool(IConverterRegistryData _converterRegistryData, address _liquidityPool) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _liquidityPool | address | liquidity pool | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeLiquidityPool(IConverterRegistryData _converterRegistryData, address _liquidityPool) internal {
		_converterRegistryData.removeLiquidityPool(_liquidityPool);
		emit LiquidityPoolRemoved(_liquidityPool);
	}
```
</details>

---    

> ### addConvertibleToken

adds a convertible token to the registry
	 *

```solidity
function addConvertibleToken(IConverterRegistryData _converterRegistryData, address _convertibleToken, address _anchor) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _convertibleToken | address | convertible token | 
| _anchor | address | associated converter anchor | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addConvertibleToken(
		IConverterRegistryData _converterRegistryData,
		address _convertibleToken,
		address _anchor
	) internal {
		_converterRegistryData.addConvertibleToken(_convertibleToken, _anchor);
		emit ConvertibleTokenAdded(_convertibleToken, _anchor);
	}
```
</details>

---    

> ### removeConvertibleToken

removes a convertible token from the registry
	 *

```solidity
function removeConvertibleToken(IConverterRegistryData _converterRegistryData, address _convertibleToken, address _anchor) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _convertibleToken | address | convertible token | 
| _anchor | address | associated converter anchor | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeConvertibleToken(
		IConverterRegistryData _converterRegistryData,
		address _convertibleToken,
		address _anchor
	) internal {
		_converterRegistryData.removeConvertibleToken(_convertibleToken, _anchor);
		emit ConvertibleTokenRemoved(_convertibleToken, _anchor);
	}
```
</details>

---    

> ### addConverterInternal

```solidity
function addConverterInternal(IConverter _converter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addConverterInternal(IConverter _converter) private {
		IConverterRegistryData converterRegistryData = IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA));
		IConverterAnchor anchor = IConverter(_converter).token();
		uint256 reserveTokenCount = _converter.connectorTokenCount();

		// add the converter anchor
		addAnchor(converterRegistryData, anchor);
		if (reserveTokenCount > 1) addLiquidityPool(converterRegistryData, anchor);
		else addConvertibleToken(converterRegistryData, anchor, anchor);

		// add all reserve tokens
		for (uint256 i = 0; i < reserveTokenCount; i++) addConvertibleToken(converterRegistryData, _converter.connectorTokens(i), anchor);
	}
```
</details>

---    

> ### removeConverterInternal

```solidity
function removeConverterInternal(IConverter _converter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeConverterInternal(IConverter _converter) private {
		IConverterRegistryData converterRegistryData = IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA));
		IConverterAnchor anchor = IConverter(_converter).token();
		uint256 reserveTokenCount = _converter.connectorTokenCount();

		// remove the converter anchor
		removeAnchor(converterRegistryData, anchor);
		if (reserveTokenCount > 1) removeLiquidityPool(converterRegistryData, anchor);
		else removeConvertibleToken(converterRegistryData, anchor, anchor);

		// remove all reserve tokens
		for (uint256 i = 0; i < reserveTokenCount; i++) removeConvertibleToken(converterRegistryData, _converter.connectorTokens(i), anchor);
	}
```
</details>

---    

> ### getLeastFrequentTokenAnchors

```solidity
function getLeastFrequentTokenAnchors(IERC20Token[] _reserveTokens) private view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLeastFrequentTokenAnchors(IERC20Token[] memory _reserveTokens) private view returns (address[] memory) {
		IConverterRegistryData converterRegistryData = IConverterRegistryData(addressOf(CONVERTER_REGISTRY_DATA));
		uint256 minAnchorCount = converterRegistryData.getConvertibleTokenSmartTokenCount(_reserveTokens[0]);
		uint256 index = 0;

		// find the reserve token which has the smallest number of converter anchors
		for (uint256 i = 1; i < _reserveTokens.length; i++) {
			uint256 convertibleTokenAnchorCount = converterRegistryData.getConvertibleTokenSmartTokenCount(_reserveTokens[i]);
			if (minAnchorCount > convertibleTokenAnchorCount) {
				minAnchorCount = convertibleTokenAnchorCount;
				index = i;
			}
		}

		return converterRegistryData.getConvertibleTokenSmartTokens(_reserveTokens[index]);
	}
```
</details>

---    

> ### isConverterReserveConfigEqual

```solidity
function isConverterReserveConfigEqual(IConverter _converter, uint16 _type, IERC20Token[] _reserveTokens, uint32[] _reserveWeights) private view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 
| _type | uint16 |  | 
| _reserveTokens | IERC20Token[] |  | 
| _reserveWeights | uint32[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConverterReserveConfigEqual(
		IConverter _converter,
		uint16 _type,
		IERC20Token[] memory _reserveTokens,
		uint32[] memory _reserveWeights
	) private view returns (bool) {
		if (_type != _converter.converterType()) return false;

		if (_reserveTokens.length != _converter.connectorTokenCount()) return false;

		for (uint256 i = 0; i < _reserveTokens.length; i++) {
			if (_reserveWeights[i] != getReserveWeight(_converter, _reserveTokens[i])) return false;
		}

		return true;
	}
```
</details>

---    

> ### getReserveWeight

```solidity
function getReserveWeight(address _converter, address _reserveToken) private view
returns(uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | address |  | 
| _reserveToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReserveWeight(address _converter, address _reserveToken) private view returns (uint32) {
		uint256[2] memory ret;
		bytes memory data = abi.encodeWithSelector(CONNECTORS_FUNC_SELECTOR, _reserveToken);

		assembly {
			let success := staticcall(
				gas, // gas remaining
				_converter, // destination address
				add(data, 32), // input buffer (starts after the first 32 bytes in the `data` array)
				mload(data), // input length (loaded from the first 32 bytes in the `data` array)
				ret, // output buffer
				64 // output length
			)
			if iszero(success) {
				revert(0, 0)
			}
		}

		return uint32(ret[1]);
	}
```
</details>

---    

> ### getSmartTokenCount

deprecated, backward compatibility, use `getAnchorCount`

```solidity
function getSmartTokenCount() public view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSmartTokenCount() public view returns (uint256) {
		return getAnchorCount();
	}
```
</details>

---    

> ### getSmartTokens

deprecated, backward compatibility, use `getAnchors`

```solidity
function getSmartTokens() public view
returns(address[])
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSmartTokens() public view returns (address[]) {
		return getAnchors();
	}
```
</details>

---    

> ### getSmartToken

deprecated, backward compatibility, use `getAnchor`

```solidity
function getSmartToken(uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getSmartToken(uint256 _index) public view returns (address) {
		return getAnchor(_index);
	}
```
</details>

---    

> ### isSmartToken

deprecated, backward compatibility, use `isAnchor`

```solidity
function isSmartToken(address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isSmartToken(address _value) public view returns (bool) {
		return isAnchor(_value);
	}
```
</details>

---    

> ### getConvertibleTokenSmartTokenCount

deprecated, backward compatibility, use `getConvertibleTokenAnchorCount`

```solidity
function getConvertibleTokenSmartTokenCount(address _convertibleToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenSmartTokenCount(address _convertibleToken) public view returns (uint256) {
		return getConvertibleTokenAnchorCount(_convertibleToken);
	}
```
</details>

---    

> ### getConvertibleTokenSmartTokens

deprecated, backward compatibility, use `getConvertibleTokenAnchors`

```solidity
function getConvertibleTokenSmartTokens(address _convertibleToken) public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenSmartTokens(address _convertibleToken) public view returns (address[]) {
		return getConvertibleTokenAnchors(_convertibleToken);
	}
```
</details>

---    

> ### getConvertibleTokenSmartToken

deprecated, backward compatibility, use `getConvertibleTokenAnchor`

```solidity
function getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index) public view returns (address) {
		return getConvertibleTokenAnchor(_convertibleToken, _index);
	}
```
</details>

---    

> ### isConvertibleTokenSmartToken

deprecated, backward compatibility, use `isConvertibleTokenAnchor`

```solidity
function isConvertibleTokenSmartToken(address _convertibleToken, address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _value | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConvertibleTokenSmartToken(address _convertibleToken, address _value) public view returns (bool) {
		return isConvertibleTokenAnchor(_convertibleToken, _value);
	}
```
</details>

---    

> ### getConvertersBySmartTokens

deprecated, backward compatibility, use `getConvertersByAnchors`

```solidity
function getConvertersBySmartTokens(address[] _smartTokens) public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartTokens | address[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConvertersBySmartTokens(address[] _smartTokens) public view returns (address[]) {
		return getConvertersByAnchors(_smartTokens);
	}
```
</details>

---    

> ### getLiquidityPoolByReserveConfig

deprecated, backward compatibility, use `getLiquidityPoolByConfig`

```solidity
function getLiquidityPoolByReserveConfig(IERC20Token[] _reserveTokens, uint32[] _reserveWeights) public view
returns(contract IConverterAnchor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] |  | 
| _reserveWeights | uint32[] |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getLiquidityPoolByReserveConfig(IERC20Token[] memory _reserveTokens, uint32[] memory _reserveWeights)
		public
		view
		returns (IConverterAnchor)
	{
		return getLiquidityPoolByConfig(1, _reserveTokens, _reserveWeights);
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
