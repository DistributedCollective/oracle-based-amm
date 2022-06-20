# EtherToken.sol

View Source: [contracts/token/EtherToken.sol](../solidity/contracts/token/EtherToken.sol)

**↗ Extends: [IEtherToken](IEtherToken.md), [ERC20Token](ERC20Token.md)**

**EtherToken**

Ether tokenization contract
 * 'Owned' is specified here for readability reasons

## Constructor

initializes a new EtherToken instance
	 *

```js
constructor(string memory _name, string memory _symbol, int_const 18 undefined, int_const 0 undefined) public
```

**Arguments**

**Events**

```js
event Issuance(uint256  _amount);
event Destruction(uint256  _amount);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _name | string memory | token name | 
| _symbol | string memory | token symbol | 
| undefined | int_const 18 |  | 
| undefined | int_const 0 |  | 

## Functions

- [deposit()](#deposit)
- [withdraw(uint256 _amount)](#withdraw)
- [depositTo(address _to)](#depositto)
- [withdrawTo(address _to, uint256 _amount)](#withdrawto)
- [transfer(address _to, uint256 _value)](#transfer)
- [transferFrom(address _from, address _to, uint256 _value)](#transferfrom)
- [constructor()](#constructor)

---    

> ### deposit

⤾ overrides [IEtherToken.deposit](IEtherToken.md#deposit)

deposit ether on behalf of the sender

```solidity
function deposit() public payable
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function deposit() public payable {
		depositTo(msg.sender);
	}
```
</details>

---    

> ### withdraw

⤾ overrides [IEtherToken.withdraw](IEtherToken.md#withdraw)

withdraw ether to the sender's account
	 *

```solidity
function withdraw(uint256 _amount) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | amount of ether to withdraw | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdraw(uint256 _amount) public {
		withdrawTo(msg.sender, _amount);
	}
```
</details>

---    

> ### depositTo

⤾ overrides [IEtherToken.depositTo](IEtherToken.md#depositto)

deposit ether to be entitled for a given account
	 *

```solidity
function depositTo(address _to) public payable notThis 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | account to be entitled for the ether | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function depositTo(address _to) public payable notThis(_to) {
		balanceOf[_to] = balanceOf[_to].add(msg.value); // add the value to the account balance
		totalSupply = totalSupply.add(msg.value); // increase the total supply

		emit Issuance(msg.value);
		emit Transfer(this, _to, msg.value);
	}
```
</details>

---    

> ### withdrawTo

⤾ overrides [IEtherToken.withdrawTo](IEtherToken.md#withdrawto)

withdraw ether entitled by the sender to a given account
	 *

```solidity
function withdrawTo(address _to, uint256 _amount) public nonpayable notThis 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | account to receive the ether | 
| _amount | uint256 | amount of ether to withdraw | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdrawTo(address _to, uint256 _amount) public notThis(_to) {
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_amount); // deduct the amount from the account balance
		totalSupply = totalSupply.sub(_amount); // decrease the total supply
		_to.transfer(_amount); // send the amount to the target account

		emit Transfer(msg.sender, this, _amount);
		emit Destruction(_amount);
	}
```
</details>

---    

> ### transfer

⤾ overrides [ERC20Token.transfer](ERC20Token.md#transfer)

send coins
throws on any error rather then return a false flag to minimize user errors
	 *

```solidity
function transfer(address _to, uint256 _value) public nonpayable notThis 
returns(success bool)
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
function transfer(address _to, uint256 _value) public notThis(_to) returns (bool success) {
		assert(super.transfer(_to, _value));
		return true;
	}
```
</details>

---    

> ### transferFrom

⤾ overrides [ERC20Token.transferFrom](ERC20Token.md#transferfrom)

an account/contract attempts to get the coins
throws on any error rather then return a false flag to minimize user errors
	 *

```solidity
function transferFrom(address _from, address _to, uint256 _value) public nonpayable notThis 
returns(success bool)
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
function transferFrom(
		address _from,
		address _to,
		uint256 _value
	) public notThis(_to) returns (bool success) {
		assert(super.transferFrom(_from, _to, _value));
		return true;
	}
```
</details>

---    

> ### constructor

deposit ether in the account

```solidity
function () external payable
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function() external payable {
		deposit();
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
