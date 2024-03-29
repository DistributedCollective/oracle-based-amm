# IERC20Token.sol

View Source: [contracts/token/interfaces/IERC20Token.sol](../solidity/contracts/token/interfaces/IERC20Token.sol)

**↘ Derived Contracts: [ERC20Token](ERC20Token.md), [IEtherToken](IEtherToken.md), [ISmartToken](ISmartToken.md)**

**IERC20Token**

## Functions

- [name()](#name)
- [symbol()](#symbol)
- [decimals()](#decimals)
- [totalSupply()](#totalsupply)
- [balanceOf(address _owner)](#balanceof)
- [allowance(address _owner, address _spender)](#allowance)
- [transfer(address _to, uint256 _value)](#transfer)
- [transferFrom(address _from, address _to, uint256 _value)](#transferfrom)
- [approve(address _spender, uint256 _value)](#approve)

---    

> ### name

```solidity
function name() public view
returns(string)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function name() public view returns (string) {
		this;
	}
```
</details>

---    

> ### symbol

```solidity
function symbol() public view
returns(string)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function symbol() public view returns (string) {
		this;
	}
```
</details>

---    

> ### decimals

```solidity
function decimals() public view
returns(uint8)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function decimals() public view returns (uint8) {
		this;
	}
```
</details>

---    

> ### totalSupply

```solidity
function totalSupply() public view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function totalSupply() public view returns (uint256) {
		this;
	}
```
</details>

---    

> ### balanceOf

```solidity
function balanceOf(address _owner) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function balanceOf(address _owner) public view returns (uint256) {
		_owner;
		this;
	}
```
</details>

---    

> ### allowance

```solidity
function allowance(address _owner, address _spender) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address |  | 
| _spender | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function allowance(address _owner, address _spender) public view returns (uint256) {
		_owner;
		_spender;
		this;
	}
```
</details>

---    

> ### transfer

⤿ Overridden Implementation(s): [ERC20Token.transfer](ERC20Token.md#transfer),[EtherToken.transfer](EtherToken.md#transfer),[SmartToken.transfer](SmartToken.md#transfer)

```solidity
function transfer(address _to, uint256 _value) public nonpayable
returns(success bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address |  | 
| _value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transfer(address _to, uint256 _value) public returns (bool success);
```
</details>

---    

> ### transferFrom

⤿ Overridden Implementation(s): [ERC20Token.transferFrom](ERC20Token.md#transferfrom),[EtherToken.transferFrom](EtherToken.md#transferfrom),[SmartToken.transferFrom](SmartToken.md#transferfrom)

```solidity
function transferFrom(address _from, address _to, uint256 _value) public nonpayable
returns(success bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _from | address |  | 
| _to | address |  | 
| _value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferFrom(
		address _from,
		address _to,
		uint256 _value
	) public returns (bool success);
```
</details>

---    

> ### approve

⤿ Overridden Implementation(s): [ERC20Token.approve](ERC20Token.md#approve)

```solidity
function approve(address _spender, uint256 _value) public nonpayable
returns(success bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address |  | 
| _value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function approve(address _spender, uint256 _value) public returns (bool success);
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
