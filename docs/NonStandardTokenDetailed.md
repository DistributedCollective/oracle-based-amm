# NonStandardTokenDetailed.sol

View Source: [contracts/helpers/TestTokens.sol](../solidity/contracts/helpers/TestTokens.sol)

**↗ Extends: [Utils](Utils.md)**

**NonStandardTokenDetailed**

## Contract Members
**Constants & Variables**

```js
uint256 public totalSupply;
mapping(address => uint256) public balanceOf;
mapping(address => mapping(address => uint256)) public allowance;
string public name;
string public symbol;
uint8 public decimals;
bool public ok;
string public name;
string public symbol;
bool public ok;
bool public ret;

```

**Events**

```js
event Transfer(address indexed _from, address indexed _to, uint256  _value);
event Approval(address indexed _owner, address indexed _spender, uint256  _value);
```

## Functions

- [_transfer(address _to, uint256 _value)](#_transfer)
- [_transferFrom(address _from, address _to, uint256 _value)](#_transferfrom)
- [_approve(address _spender, uint256 _value)](#_approve)
- [set(bool _ok)](#set)
- [approve(address _spender, uint256 _value)](#approve)
- [transfer(address _to, uint256 _value)](#transfer)
- [transferFrom(address _from, address _to, uint256 _value)](#transferfrom)
- [approve(address _spender, uint256 _value)](#approve)
- [transfer(address _to, uint256 _value)](#transfer)
- [transferFrom(address _from, address _to, uint256 _value)](#transferfrom)
- [set(bool _ok, bool _ret)](#set)
- [approve(address _spender, uint256 _value)](#approve)
- [transfer(address _to, uint256 _value)](#transfer)
- [transferFrom(address _from, address _to, uint256 _value)](#transferfrom)

---    

> ### _transfer

send coins
throws on any error rather then return a false flag to minimize user errors
	 *

```solidity
function _transfer(address _to, uint256 _value) internal nonpayable validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | target address | 
| _value | uint256 | transfer amount 	 * | 

**Returns**

true if the transfer was successful, false if it wasn't

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _transfer(address _to, uint256 _value) internal validAddress(_to) {
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(msg.sender, _to, _value);
	}
```
</details>

---    

> ### _transferFrom

an account/contract attempts to get the coins
throws on any error rather then return a false flag to minimize user errors
	 *

```solidity
function _transferFrom(address _from, address _to, uint256 _value) internal nonpayable validAddress validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _from | address | source address | 
| _to | address | target address | 
| _value | uint256 | transfer amount 	 * | 

**Returns**

true if the transfer was successful, false if it wasn't

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _transferFrom(
		address _from,
		address _to,
		uint256 _value
	) internal validAddress(_from) validAddress(_to) {
		allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
		balanceOf[_from] = balanceOf[_from].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(_from, _to, _value);
	}
```
</details>

---    

> ### _approve

allow another account/contract to spend some tokens on your behalf
throws on any error rather then return a false flag to minimize user errors
	 * also, to minimize the risk of the approve/transferFrom attack vector
(see https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/), approve has to be called twice
in 2 separate transactions - once to change the allowance to 0 and secondly to change it to the new allowance value
	 *

```solidity
function _approve(address _spender, uint256 _value) internal nonpayable validAddress 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address | approved address | 
| _value | uint256 | allowance amount 	 * | 

**Returns**

true if the approval was successful, false if it wasn't

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _approve(address _spender, uint256 _value) internal validAddress(_spender) {
		// if the allowance isn't 0, it can only be updated to 0 to prevent an allowance change immediately after withdrawal
		require(_value == 0 || allowance[msg.sender][_spender] == 0);

		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
	}
```
</details>

---    

> ### set

```solidity
function set(bool _ok) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _ok | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function set(bool _ok) public {
		ok = _ok;
	}
```
</details>

---    

> ### approve

```solidity
function approve(address _spender, uint256 _value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address |  | 
| _value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function approve(address _spender, uint256 _value) public {
		_approve(_spender, _value);
		require(ok);
	}
```
</details>

---    

> ### transfer

```solidity
function transfer(address _to, uint256 _value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address |  | 
| _value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transfer(address _to, uint256 _value) public {
		_transfer(_to, _value);
		require(ok);
	}
```
</details>

---    

> ### transferFrom

```solidity
function transferFrom(address _from, address _to, uint256 _value) public nonpayable
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
	) public {
		_transferFrom(_from, _to, _value);
		require(ok);
	}
```
</details>

---    

> ### approve

```solidity
function approve(address _spender, uint256 _value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address |  | 
| _value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function approve(address _spender, uint256 _value) public {
		_approve(_spender, _value);
	}
```
</details>

---    

> ### transfer

```solidity
function transfer(address _to, uint256 _value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address |  | 
| _value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transfer(address _to, uint256 _value) public {
		_transfer(_to, _value);
	}
```
</details>

---    

> ### transferFrom

```solidity
function transferFrom(address _from, address _to, uint256 _value) public nonpayable
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
	) public {
		_transferFrom(_from, _to, _value);
	}
```
</details>

---    

> ### set

```solidity
function set(bool _ok, bool _ret) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _ok | bool |  | 
| _ret | bool |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function set(bool _ok, bool _ret) public {
		ok = _ok;
		ret = _ret;
	}
```
</details>

---    

> ### approve

```solidity
function approve(address _spender, uint256 _value) public nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address |  | 
| _value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function approve(address _spender, uint256 _value) public returns (bool) {
		_approve(_spender, _value);
		require(ok);
		return ret;
	}
```
</details>

---    

> ### transfer

```solidity
function transfer(address _to, uint256 _value) public nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address |  | 
| _value | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transfer(address _to, uint256 _value) public returns (bool) {
		_transfer(_to, _value);
		require(ok);
		return ret;
	}
```
</details>

---    

> ### transferFrom

```solidity
function transferFrom(address _from, address _to, uint256 _value) public nonpayable
returns(bool)
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
	) public returns (bool) {
		_transferFrom(_from, _to, _value);
		require(ok);
		return ret;
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
