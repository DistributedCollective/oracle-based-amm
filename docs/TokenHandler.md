# TokenHandler.sol

View Source: [contracts/utility/TokenHandler.sol](../solidity/contracts/utility/TokenHandler.sol)

**↘ Derived Contracts: [ConverterBase](ConverterBase.md), [ConverterRegistry](ConverterRegistry.md), [IFeeSharingProxy](IFeeSharingProxy.md), [IInternalSovrynSwapNetwork](IInternalSovrynSwapNetwork.md), [ISwapSettings](ISwapSettings.md), [SovrynSwapX](SovrynSwapX.md), [TokenHolder](TokenHolder.md)**

**TokenHandler**

## Contract Members
**Constants & Variables**

```js
bytes4 private constant APPROVE_FUNC_SELECTOR;
bytes4 private constant TRANSFER_FUNC_SELECTOR;
bytes4 private constant TRANSFER_FROM_FUNC_SELECTOR;

```

## Functions

- [safeApprove(IERC20Token _token, address _spender, uint256 _value)](#safeapprove)
- [safeTransfer(IERC20Token _token, address _to, uint256 _value)](#safetransfer)
- [safeTransferFrom(IERC20Token _token, address _from, address _to, uint256 _value)](#safetransferfrom)
- [execute(IERC20Token _token, bytes _data)](#execute)

---    

> ### safeApprove

executes the ERC20 token's `approve` function and reverts upon failure
the main purpose of this function is to prevent a non standard ERC20 token
from failing silently
	 *

```solidity
function safeApprove(IERC20Token _token, address _spender, uint256 _value) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | ERC20 token address | 
| _spender | address | approved address | 
| _value | uint256 | allowance amount | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function safeApprove(
		IERC20Token _token,
		address _spender,
		uint256 _value
	) internal {
		execute(_token, abi.encodeWithSelector(APPROVE_FUNC_SELECTOR, _spender, _value));
	}
```
</details>

---    

> ### safeTransfer

executes the ERC20 token's `transfer` function and reverts upon failure
the main purpose of this function is to prevent a non standard ERC20 token
from failing silently
	 *

```solidity
function safeTransfer(IERC20Token _token, address _to, uint256 _value) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | ERC20 token address | 
| _to | address | ken   ERC20 token address | 
| _value | uint256 | transfer amount | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function safeTransfer(
		IERC20Token _token,
		address _to,
		uint256 _value
	) internal {
		execute(_token, abi.encodeWithSelector(TRANSFER_FUNC_SELECTOR, _to, _value));
	}
```
</details>

---    

> ### safeTransferFrom

executes the ERC20 token's `transferFrom` function and reverts upon failure
the main purpose of this function is to prevent a non standard ERC20 token
from failing silently
	 *

```solidity
function safeTransferFrom(IERC20Token _token, address _from, address _to, uint256 _value) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | ERC20 token address | 
| _from | address | source address | 
| _to | address | ken   ERC20 token address | 
| _value | uint256 | transfer amount | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function safeTransferFrom(
		IERC20Token _token,
		address _from,
		address _to,
		uint256 _value
	) internal {
		execute(_token, abi.encodeWithSelector(TRANSFER_FROM_FUNC_SELECTOR, _from, _to, _value));
	}
```
</details>

---    

> ### execute

executes a function on the ERC20 token and reverts upon failure
the main purpose of this function is to prevent a non standard ERC20 token
from failing silently
	 *

```solidity
function execute(IERC20Token _token, bytes _data) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | ERC20 token address | 
| _data | bytes | data to pass in to the token's contract for execution | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function execute(IERC20Token _token, bytes memory _data) private {
		uint256[1] memory ret = [uint256(1)];

		assembly {
			let success := call(
				gas, // gas remaining
				_token, // destination address
				0, // no ether
				add(_data, 32), // input buffer (starts after the first 32 bytes in the `data` array)
				mload(_data), // input length (loaded from the first 32 bytes in the `data` array)
				ret, // output buffer
				32 // output length
			)
			if iszero(success) {
				revert(0, 0)
			}
		}

		require(ret[0] != 0, "ERR_TRANSFER_FAILED");
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
