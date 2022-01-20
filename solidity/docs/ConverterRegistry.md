# ConverterRegistry.sol

View Source: [contracts/converter/ConverterRegistry.sol](../contracts/converter/ConverterRegistry.sol)

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

### newConverter

⤿ Overridden Implementation(s): [TestConverterRegistry.newConverter](TestConverterRegistry.md#newconverter)

creates a zero supply liquid token / empty liquidity pool and adds its converter to the registry
	 *

```js
function newConverter(uint16 _type, string _name, string _symbol, uint8 _decimals, uint32 _maxConversionFee, IERC20Token[] _reserveTokens, uint32[] _reserveWeights) public nonpayable
returns(contract IConverter)
```

**Returns**

new converter

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _type | uint16 | converter type, see ConverterBase contract main doc | 
| _name | string | token / pool name | 
| _symbol | string | token / pool symbol | 
| _decimals | uint8 | token / pool decimals | 
| _maxConversionFee | uint32 | maximum conversion-fee | 
| _reserveTokens | IERC20Token[] | reserve tokens | 
| _reserveWeights | uint32[] | reserve weights
	 * | 

### setupConverter

completes the configuration for a converter
	 *

```js
function setupConverter(uint16 _type, IERC20Token[] _reserveTokens, uint32[] _reserveWeights, IConverter _converter) public nonpayable
returns(contract IConverter)
```

**Returns**

converter

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _type | uint16 | converter type, see ConverterBase contract main doc | 
| _reserveTokens | IERC20Token[] | reserve tokens | 
| _reserveWeights | uint32[] | reserve weights | 
| _converter | IConverter | the converter previously created through newConverter method
	 * | 

### addConverter

adds an existing converter to the registry
can only be called by the owner
	 *

```js
function addConverter(IConverter _converter) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | converter | 

### removeConverter

removes a converter from the registry
anyone can remove an existing converter from the registry, as long as the converter is invalid
note that the owner can also remove valid converters
	 *

```js
function removeConverter(IConverter _converter) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | converter | 

### getAnchorCount

⤾ overrides [IConverterRegistry.getAnchorCount](IConverterRegistry.md#getanchorcount)

returns the number of converter anchors in the registry
	 *

```js
function getAnchorCount() public view
returns(uint256)
```

**Returns**

number of anchors

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getAnchors

⤾ overrides [IConverterRegistry.getAnchors](IConverterRegistry.md#getanchors)

returns the list of converter anchors in the registry
	 *

```js
function getAnchors() public view
returns(address[])
```

**Returns**

list of anchors

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getAnchor

⤾ overrides [IConverterRegistry.getAnchor](IConverterRegistry.md#getanchor)

returns the converter anchor at a given index
	 *

```js
function getAnchor(uint256 _index) public view
returns(address)
```

**Returns**

anchor at the given index

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

### isAnchor

⤾ overrides [IConverterRegistry.isAnchor](IConverterRegistry.md#isanchor)

checks whether or not a given value is a converter anchor
	 *

```js
function isAnchor(address _value) public view
returns(bool)
```

**Returns**

true if the given value is an anchor, false if not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

### getLiquidityPoolCount

⤾ overrides [IConverterRegistry.getLiquidityPoolCount](IConverterRegistry.md#getliquiditypoolcount)

returns the number of liquidity pools in the registry
	 *

```js
function getLiquidityPoolCount() public view
returns(uint256)
```

**Returns**

number of liquidity pools

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getLiquidityPools

⤾ overrides [IConverterRegistry.getLiquidityPools](IConverterRegistry.md#getliquiditypools)

returns the list of liquidity pools in the registry
	 *

```js
function getLiquidityPools() public view
returns(address[])
```

**Returns**

list of liquidity pools

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getLiquidityPool

⤾ overrides [IConverterRegistry.getLiquidityPool](IConverterRegistry.md#getliquiditypool)

returns the liquidity pool at a given index
	 *

```js
function getLiquidityPool(uint256 _index) public view
returns(address)
```

**Returns**

liquidity pool at the given index

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

### isLiquidityPool

⤾ overrides [IConverterRegistry.isLiquidityPool](IConverterRegistry.md#isliquiditypool)

checks whether or not a given value is a liquidity pool
	 *

```js
function isLiquidityPool(address _value) public view
returns(bool)
```

**Returns**

true if the given value is a liquidity pool, false if not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

### getConvertibleTokenCount

⤾ overrides [IConverterRegistry.getConvertibleTokenCount](IConverterRegistry.md#getconvertibletokencount)

returns the number of convertible tokens in the registry
	 *

```js
function getConvertibleTokenCount() public view
returns(uint256)
```

**Returns**

number of convertible tokens

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getConvertibleTokens

⤾ overrides [IConverterRegistry.getConvertibleTokens](IConverterRegistry.md#getconvertibletokens)

returns the list of convertible tokens in the registry
	 *

```js
function getConvertibleTokens() public view
returns(address[])
```

**Returns**

list of convertible tokens

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getConvertibleToken

⤾ overrides [IConverterRegistry.getConvertibleToken](IConverterRegistry.md#getconvertibletoken)

returns the convertible token at a given index
	 *

```js
function getConvertibleToken(uint256 _index) public view
returns(address)
```

**Returns**

convertible token at the given index

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 | index | 

### isConvertibleToken

⤾ overrides [IConverterRegistry.isConvertibleToken](IConverterRegistry.md#isconvertibletoken)

checks whether or not a given value is a convertible token
	 *

```js
function isConvertibleToken(address _value) public view
returns(bool)
```

**Returns**

true if the given value is a convertible token, false if not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address | value | 

### getConvertibleTokenAnchorCount

⤾ overrides [IConverterRegistry.getConvertibleTokenAnchorCount](IConverterRegistry.md#getconvertibletokenanchorcount)

returns the number of converter anchors associated with a given convertible token
	 *

```js
function getConvertibleTokenAnchorCount(address _convertibleToken) public view
returns(uint256)
```

**Returns**

number of anchors associated with the given convertible token

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 

### getConvertibleTokenAnchors

⤾ overrides [IConverterRegistry.getConvertibleTokenAnchors](IConverterRegistry.md#getconvertibletokenanchors)

returns the list of converter anchors associated with a given convertible token
	 *

```js
function getConvertibleTokenAnchors(address _convertibleToken) public view
returns(address[])
```

**Returns**

list of anchors associated with the given convertible token

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 

### getConvertibleTokenAnchor

⤾ overrides [IConverterRegistry.getConvertibleTokenAnchor](IConverterRegistry.md#getconvertibletokenanchor)

returns the converter anchor associated with a given convertible token at a given index
	 *

```js
function getConvertibleTokenAnchor(address _convertibleToken, uint256 _index) public view
returns(address)
```

**Returns**

anchor associated with the given convertible token at the given index

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _index | uint256 | index | 

### isConvertibleTokenAnchor

⤾ overrides [IConverterRegistry.isConvertibleTokenAnchor](IConverterRegistry.md#isconvertibletokenanchor)

checks whether or not a given value is a converter anchor of a given convertible token
	 *

```js
function isConvertibleTokenAnchor(address _convertibleToken, address _value) public view
returns(bool)
```

**Returns**

true if the given value is an anchor of the given convertible token, false if not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address | convertible token | 
| _value | address | value | 

### getConvertersByAnchors

returns a list of converters for a given list of anchors
this is a utility function that can be used to reduce the number of calls to the contract
	 *

```js
function getConvertersByAnchors(address[] _anchors) public view
returns(address[])
```

**Returns**

list of converters

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _anchors | address[] | list of converter anchors | 

### isConverterValid

checks whether or not a given converter is valid
	 *

```js
function isConverterValid(IConverter _converter) public view
returns(bool)
```

**Returns**

true if the given converter is valid, false if not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | converter | 

### isSimilarLiquidityPoolRegistered

checks if a liquidity pool with given configuration is already registered
	 *

```js
function isSimilarLiquidityPoolRegistered(IConverter _converter) public view
returns(bool)
```

**Returns**

if a liquidity pool with the same configuration is already registered

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | converter with specific configuration | 

### getLiquidityPoolByConfig

searches for a liquidity pool with specific configuration
	 *

```js
function getLiquidityPoolByConfig(uint16 _type, IERC20Token[] _reserveTokens, uint32[] _reserveWeights) public view
returns(contract IConverterAnchor)
```

**Returns**

the liquidity pool, or zero if no such liquidity pool exists

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _type | uint16 | converter type, see ConverterBase contract main doc | 
| _reserveTokens | IERC20Token[] | reserve tokens | 
| _reserveWeights | uint32[] | reserve weights | 

### addAnchor

adds a converter anchor to the registry
	 *

```js
function addAnchor(IConverterRegistryData _converterRegistryData, address _anchor) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _anchor | address | converter anchor | 

### removeAnchor

removes a converter anchor from the registry
	 *

```js
function removeAnchor(IConverterRegistryData _converterRegistryData, address _anchor) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _anchor | address | converter anchor | 

### addLiquidityPool

adds a liquidity pool to the registry
	 *

```js
function addLiquidityPool(IConverterRegistryData _converterRegistryData, address _liquidityPool) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _liquidityPool | address | liquidity pool | 

### removeLiquidityPool

removes a liquidity pool from the registry
	 *

```js
function removeLiquidityPool(IConverterRegistryData _converterRegistryData, address _liquidityPool) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _liquidityPool | address | liquidity pool | 

### addConvertibleToken

adds a convertible token to the registry
	 *

```js
function addConvertibleToken(IConverterRegistryData _converterRegistryData, address _convertibleToken, address _anchor) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _convertibleToken | address | convertible token | 
| _anchor | address | associated converter anchor | 

### removeConvertibleToken

removes a convertible token from the registry
	 *

```js
function removeConvertibleToken(IConverterRegistryData _converterRegistryData, address _convertibleToken, address _anchor) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converterRegistryData | IConverterRegistryData | Converter Registry Data Address | 
| _convertibleToken | address | convertible token | 
| _anchor | address | associated converter anchor | 

### addConverterInternal

```js
function addConverterInternal(IConverter _converter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 

### removeConverterInternal

```js
function removeConverterInternal(IConverter _converter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 

### getLeastFrequentTokenAnchors

```js
function getLeastFrequentTokenAnchors(IERC20Token[] _reserveTokens) private view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] |  | 

### isConverterReserveConfigEqual

```js
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

### getReserveWeight

```js
function getReserveWeight(address _converter, address _reserveToken) private view
returns(uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | address |  | 
| _reserveToken | address |  | 

### getSmartTokenCount

deprecated, backward compatibility, use `getAnchorCount`

```js
function getSmartTokenCount() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getSmartTokens

deprecated, backward compatibility, use `getAnchors`

```js
function getSmartTokens() public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getSmartToken

deprecated, backward compatibility, use `getAnchor`

```js
function getSmartToken(uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

### isSmartToken

deprecated, backward compatibility, use `isAnchor`

```js
function isSmartToken(address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _value | address |  | 

### getConvertibleTokenSmartTokenCount

deprecated, backward compatibility, use `getConvertibleTokenAnchorCount`

```js
function getConvertibleTokenSmartTokenCount(address _convertibleToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

### getConvertibleTokenSmartTokens

deprecated, backward compatibility, use `getConvertibleTokenAnchors`

```js
function getConvertibleTokenSmartTokens(address _convertibleToken) public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 

### getConvertibleTokenSmartToken

deprecated, backward compatibility, use `getConvertibleTokenAnchor`

```js
function getConvertibleTokenSmartToken(address _convertibleToken, uint256 _index) public view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _index | uint256 |  | 

### isConvertibleTokenSmartToken

deprecated, backward compatibility, use `isConvertibleTokenAnchor`

```js
function isConvertibleTokenSmartToken(address _convertibleToken, address _value) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _convertibleToken | address |  | 
| _value | address |  | 

### getConvertersBySmartTokens

deprecated, backward compatibility, use `getConvertersByAnchors`

```js
function getConvertersBySmartTokens(address[] _smartTokens) public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _smartTokens | address[] |  | 

### getLiquidityPoolByReserveConfig

deprecated, backward compatibility, use `getLiquidityPoolByConfig`

```js
function getLiquidityPoolByReserveConfig(IERC20Token[] _reserveTokens, uint32[] _reserveWeights) public view
returns(contract IConverterAnchor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveTokens | IERC20Token[] |  | 
| _reserveWeights | uint32[] |  | 

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
