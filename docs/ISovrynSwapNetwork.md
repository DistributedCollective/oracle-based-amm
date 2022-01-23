# ISovrynSwapNetwork.sol

View Source: [contracts/ISovrynSwapNetwork.sol](../solidity/contracts/ISovrynSwapNetwork.sol)

**↘ Derived Contracts: [ILegacyConverter](ILegacyConverter.md), [SovrynSwapNetwork](SovrynSwapNetwork.md)**

**ISovrynSwapNetwork**

## Functions

- [convert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee)](#convert2)
- [claimAndConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee)](#claimandconvert2)
- [convertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _for, address _affiliateAccount, uint256 _affiliateFee)](#convertfor2)
- [claimAndConvertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _for, address _affiliateAccount, uint256 _affiliateFee)](#claimandconvertfor2)
- [convert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn)](#convert)
- [claimAndConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn)](#claimandconvert)
- [convertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _for)](#convertfor)
- [claimAndConvertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _for)](#claimandconvertfor)

---    

> ### convert2

⤿ Overridden Implementation(s): [ILegacyConverter.convert2](ILegacyConverter.md#convert2),[SovrynSwapNetwork.convert2](SovrynSwapNetwork.md#convert2)

```solidity
function convert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convert2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public payable returns (uint256);
```
</details>

---    

> ### claimAndConvert2

⤿ Overridden Implementation(s): [ILegacyConverter.claimAndConvert2](ILegacyConverter.md#claimandconvert2),[SovrynSwapNetwork.claimAndConvert2](SovrynSwapNetwork.md#claimandconvert2)

```solidity
function claimAndConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimAndConvert2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public returns (uint256);
```
</details>

---    

> ### convertFor2

⤿ Overridden Implementation(s): [ILegacyConverter.convertFor2](ILegacyConverter.md#convertfor2),[SovrynSwapNetwork.convertFor2](SovrynSwapNetwork.md#convertfor2)

```solidity
function convertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _for, address _affiliateAccount, uint256 _affiliateFee) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _for | address |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convertFor2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _for,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public payable returns (uint256);
```
</details>

---    

> ### claimAndConvertFor2

⤿ Overridden Implementation(s): [ILegacyConverter.claimAndConvertFor2](ILegacyConverter.md#claimandconvertfor2),[SovrynSwapNetwork.claimAndConvertFor2](SovrynSwapNetwork.md#claimandconvertfor2)

```solidity
function claimAndConvertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _for, address _affiliateAccount, uint256 _affiliateFee) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _for | address |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimAndConvertFor2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _for,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public returns (uint256);
```
</details>

---    

> ### convert

⤿ Overridden Implementation(s): [ILegacyConverter.convert](ILegacyConverter.md#convert),[SovrynSwapNetwork.convert](SovrynSwapNetwork.md#convert),[SovrynSwapNetworkMockup.convert](SovrynSwapNetworkMockup.md#convert)

```solidity
function convert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convert(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn
	) public payable returns (uint256);
```
</details>

---    

> ### claimAndConvert

⤿ Overridden Implementation(s): [ILegacyConverter.claimAndConvert](ILegacyConverter.md#claimandconvert),[SovrynSwapNetwork.claimAndConvert](SovrynSwapNetwork.md#claimandconvert)

```solidity
function claimAndConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimAndConvert(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn
	) public returns (uint256);
```
</details>

---    

> ### convertFor

⤿ Overridden Implementation(s): [ILegacyConverter.convertFor](ILegacyConverter.md#convertfor),[SovrynSwapNetwork.convertFor](SovrynSwapNetwork.md#convertfor)

```solidity
function convertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _for) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _for | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convertFor(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _for
	) public payable returns (uint256);
```
</details>

---    

> ### claimAndConvertFor

⤿ Overridden Implementation(s): [ILegacyConverter.claimAndConvertFor](ILegacyConverter.md#claimandconvertfor),[SovrynSwapNetwork.claimAndConvertFor](SovrynSwapNetwork.md#claimandconvertfor)

```solidity
function claimAndConvertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _for) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _for | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimAndConvertFor(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _for
	) public returns (uint256);
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
