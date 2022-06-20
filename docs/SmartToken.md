# SmartToken.sol

View Source: [contracts/token/SmartToken.sol](../solidity/contracts/token/SmartToken.sol)

**↗ Extends: [ISmartToken](ISmartToken.md), [Owned](Owned.md), [ERC20Token](ERC20Token.md), [TokenHolder](TokenHolder.md)**

**SmartToken**

Smart Token
 * 'Owned' is specified here for readability reasons

## Constructor

initializes a new SmartToken instance
	 *

```js
constructor(string memory _name, string memory _symbol, uint8 _decimals, int_const 0 undefined) public
```

**Arguments**

## Contract Members
**Constants & Variables**

```js
uint16 public constant version;
bool public transfersEnabled;

```

**Events**

```js
event Issuance(uint256  _amount);
event Destruction(uint256  _amount);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _name | string memory | token name | 
| _symbol | string memory | token short symbol, minimum 1 character | 
| _decimals | uint8 | for display purposes only | 
| undefined | int_const 0 |  | 

## Modifiers

- [transfersAllowed](#transfersallowed)

### transfersAllowed

```js
modifier transfersAllowed() internal
```

## Functions

- [_transfersAllowed()](#_transfersallowed)
- [disableTransfers(bool _disable)](#disabletransfers)
- [issue(address _to, uint256 _amount)](#issue)
- [destroy(address _from, uint256 _amount)](#destroy)
- [transfer(address _to, uint256 _value)](#transfer)
- [transferFrom(address _from, address _to, uint256 _value)](#transferfrom)

---    

> ### _transfersAllowed

```solidity
function _transfersAllowed() internal view
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _transfersAllowed() internal view {
		require(transfersEnabled, "ERR_TRANSFERS_DISABLED");
	}
```
</details>

---    

> ### disableTransfers

⤾ overrides [ISmartToken.disableTransfers](ISmartToken.md#disabletransfers)

disables/enables transfers
can only be called by the contract owner
	 *

```solidity
function disableTransfers(bool _disable) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _disable | bool | true to disable transfers, false to enable them | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function disableTransfers(bool _disable) public ownerOnly {
		transfersEnabled = !_disable;
	}
```
</details>

---    

> ### issue

⤾ overrides [ISmartToken.issue](ISmartToken.md#issue)

increases the token supply and sends the new tokens to the given account
can only be called by the contract owner
	 *

```solidity
function issue(address _to, uint256 _amount) public nonpayable ownerOnly validAddress notThis 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | account to receive the new amount | 
| _amount | uint256 | amount to increase the supply by | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function issue(address _to, uint256 _amount) public ownerOnly validAddress(_to) notThis(_to) {
		totalSupply = totalSupply.add(_amount);
		balanceOf[_to] = balanceOf[_to].add(_amount);

		emit Issuance(_amount);
		emit Transfer(address(0), _to, _amount);
	}
```
</details>

---    

> ### destroy

⤾ overrides [ISmartToken.destroy](ISmartToken.md#destroy)

removes tokens from the given account and decreases the token supply
can only be called by the contract owner
	 *

```solidity
function destroy(address _from, uint256 _amount) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _from | address | account to remove the amount from | 
| _amount | uint256 | amount to decrease the supply by | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function destroy(address _from, uint256 _amount) public ownerOnly {
		balanceOf[_from] = balanceOf[_from].sub(_amount);
		totalSupply = totalSupply.sub(_amount);

		emit Transfer(_from, address(0), _amount);
		emit Destruction(_amount);
	}
```
</details>

---    

> ### transfer

⤾ overrides [ERC20Token.transfer](ERC20Token.md#transfer)

send coins
throws on any error rather then return a false flag to minimize user errors
in addition to the standard checks, the function throws if transfers are disabled
	 *

```solidity
function transfer(address _to, uint256 _value) public nonpayable transfersAllowed 
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
function transfer(address _to, uint256 _value) public transfersAllowed returns (bool success) {
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
in addition to the standard checks, the function throws if transfers are disabled
	 *

```solidity
function transferFrom(address _from, address _to, uint256 _value) public nonpayable transfersAllowed 
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
	) public transfersAllowed returns (bool success) {
		assert(super.transferFrom(_from, _to, _value));
		return true;
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
