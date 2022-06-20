# ConverterUpgrader.sol

View Source: [contracts/converter/ConverterUpgrader.sol](../solidity/contracts/converter/ConverterUpgrader.sol)

**↗ Extends: [IConverterUpgrader](IConverterUpgrader.md), [ContractRegistryClient](ContractRegistryClient.md)**

**ConverterUpgrader**

Converter Upgrader
 * The converter upgrader contract allows upgrading an older converter contract (0.4 and up)
to the latest version.
To begin the upgrade process, simply execute the 'upgrade' function.
At the end of the process, the ownership of the newly upgraded converter will be transferred
back to the original owner and the original owner will need to execute the 'acceptOwnership' function.
 * The address of the new converter is available in the ConverterUpgrade event.
 * Note that for older converters that don't yet have the 'upgrade' function, ownership should first
be transferred manually to the ConverterUpgrader contract using the 'transferOwnership' function
and then the upgrader 'upgrade' function should be executed directly.

## Constructor

initializes a new ConverterUpgrader instance
	 *

```js
constructor(IContractRegistry _registry) public
```

**Arguments**

## Contract Members
**Constants & Variables**

```js
//private members
address private constant ETH_RESERVE_ADDRESS;
bytes4 private constant IS_V28_OR_HIGHER_FUNC_SELECTOR;

//public members
contract IEtherToken public etherToken;

```

**Events**

```js
event ConverterOwned(address indexed _converter, address indexed _owner);
event ConverterUpgrade(address indexed _oldConverter, address indexed _newConverter);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _registry | IContractRegistry | address of a contract registry contract | 

## Functions

- [upgrade(bytes32 _version)](#upgrade)
- [upgrade(uint16 _version)](#upgrade)
- [upgradeOld(IConverter _converter, bytes32 _version)](#upgradeold)
- [acceptConverterOwnership(IConverter _oldConverter)](#acceptconverterownership)
- [createConverter(IConverter _oldConverter)](#createconverter)
- [copyReserves(IConverter _oldConverter, IConverter _newConverter)](#copyreserves)
- [copyConversionFee(IConverter _oldConverter, IConverter _newConverter)](#copyconversionfee)
- [transferReserveBalances(IConverter _oldConverter, IConverter _newConverter)](#transferreservebalances)
- [handleTypeSpecificData(IConverter _oldConverter, IConverter _newConverter, bool _activate)](#handletypespecificdata)
- [isV28OrHigherConverter(IConverter _converter)](#isv28orhigherconverter)

---    

> ### upgrade

⤾ overrides [IConverterUpgrader.upgrade](IConverterUpgrader.md#upgrade)

upgrades an old converter to the latest version
will throw if ownership wasn't transferred to the upgrader before calling this function.
ownership of the new converter will be transferred back to the original owner.
fires the ConverterUpgrade event upon success.
can only be called by a converter
	 *

```solidity
function upgrade(bytes32 _version) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _version | bytes32 | old converter version | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgrade(bytes32 _version) public {
		upgradeOld(IConverter(msg.sender), _version);
	}
```
</details>

---    

> ### upgrade

⤾ overrides [IConverterUpgrader.upgrade](IConverterUpgrader.md#upgrade)

upgrades an old converter to the latest version
will throw if ownership wasn't transferred to the upgrader before calling this function.
ownership of the new converter will be transferred back to the original owner.
fires the ConverterUpgrade event upon success.
can only be called by a converter
	 *

```solidity
function upgrade(uint16 _version) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _version | uint16 | old converter version | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgrade(uint16 _version) public {
		upgradeOld(IConverter(msg.sender), bytes32(_version));
	}
```
</details>

---    

> ### upgradeOld

upgrades an old converter to the latest version
will throw if ownership wasn't transferred to the upgrader before calling this function.
ownership of the new converter will be transferred back to the original owner.
fires the ConverterUpgrade event upon success.
	 *

```solidity
function upgradeOld(IConverter _converter, bytes32 _version) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter | old converter contract address | 
| _version | bytes32 | old converter version | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgradeOld(IConverter _converter, bytes32 _version) public {
		_version;
		IConverter converter = IConverter(_converter);
		address prevOwner = converter.owner();
		acceptConverterOwnership(converter);
		IConverter newConverter = createConverter(converter);
		copyReserves(converter, newConverter);
		copyConversionFee(converter, newConverter);
		transferReserveBalances(converter, newConverter);
		IConverterAnchor anchor = converter.token();

		// get the activation status before it's being invalidated
		bool activate = isV28OrHigherConverter(converter) && converter.isActive();

		if (anchor.owner() == address(converter)) {
			converter.transferTokenOwnership(newConverter);
			newConverter.acceptAnchorOwnership();
		}

		handleTypeSpecificData(converter, newConverter, activate);

		converter.transferOwnership(prevOwner);
		newConverter.transferOwnership(prevOwner);

		emit ConverterUpgrade(address(converter), address(newConverter));
	}
```
</details>

---    

> ### acceptConverterOwnership

the first step when upgrading a converter is to transfer the ownership to the local contract.
the upgrader contract then needs to accept the ownership transfer before initiating
the upgrade process.
fires the ConverterOwned event upon success
	 *

```solidity
function acceptConverterOwnership(IConverter _oldConverter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | converter to accept ownership of | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function acceptConverterOwnership(IConverter _oldConverter) private {
		_oldConverter.acceptOwnership();
		emit ConverterOwned(_oldConverter, this);
	}
```
</details>

---    

> ### createConverter

creates a new converter with same basic data as the original old converter
the newly created converter will have no reserves at this step.
	 *

```solidity
function createConverter(IConverter _oldConverter) private nonpayable
returns(contract IConverter)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address 	 * | 

**Returns**

the new converter  new converter contract address

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function createConverter(IConverter _oldConverter) private returns (IConverter) {
		IConverterAnchor anchor = _oldConverter.token();
		uint32 maxConversionFee = _oldConverter.maxConversionFee();
		uint16 reserveTokenCount = _oldConverter.connectorTokenCount();

		// determine new converter type
		uint16 newType = 0;
		// new converter - get the type from the converter itself
		if (isV28OrHigherConverter(_oldConverter))
			newType = _oldConverter.converterType();
			// old converter - if it has 1 reserve token, the type is a liquid token, otherwise the type liquidity pool
		else if (reserveTokenCount > 1) newType = 1;

		IConverterFactory converterFactory = IConverterFactory(addressOf(CONVERTER_FACTORY));
		IConverter converter = converterFactory.createConverter(newType, anchor, registry, maxConversionFee);

		converter.acceptOwnership();
		return converter;
	}
```
</details>

---    

> ### copyReserves

copies the reserves from the old converter to the new one.
note that this will not work for an unlimited number of reserves due to block gas limit constraints.
	 *

```solidity
function copyReserves(IConverter _oldConverter, IConverter _newConverter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address | 
| _newConverter | IConverter | new converter contract address | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function copyReserves(IConverter _oldConverter, IConverter _newConverter) private {
		uint16 reserveTokenCount = _oldConverter.connectorTokenCount();

		for (uint16 i = 0; i < reserveTokenCount; i++) {
			address reserveAddress = _oldConverter.connectorTokens(i);
			(, uint32 weight, , , ) = _oldConverter.connectors(reserveAddress);

			// Ether reserve
			if (reserveAddress == ETH_RESERVE_ADDRESS) {
				_newConverter.addReserve(IERC20Token(ETH_RESERVE_ADDRESS), weight);
			}
			// Ether reserve token
			else if (reserveAddress == address(etherToken)) {
				_newConverter.addReserve(IERC20Token(ETH_RESERVE_ADDRESS), weight);
			}
			// ERC20 reserve token
			else {
				_newConverter.addReserve(IERC20Token(reserveAddress), weight);
			}
		}
	}
```
</details>

---    

> ### copyConversionFee

copies the conversion fee from the old converter to the new one
	 *

```solidity
function copyConversionFee(IConverter _oldConverter, IConverter _newConverter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address | 
| _newConverter | IConverter | new converter contract address | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function copyConversionFee(IConverter _oldConverter, IConverter _newConverter) private {
		uint32 conversionFee = _oldConverter.conversionFee();
		_newConverter.setConversionFee(conversionFee);
	}
```
</details>

---    

> ### transferReserveBalances

transfers the balance of each reserve in the old converter to the new one.
note that the function assumes that the new converter already has the exact same number of
also, this will not work for an unlimited number of reserves due to block gas limit constraints.
	 *

```solidity
function transferReserveBalances(IConverter _oldConverter, IConverter _newConverter) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address | 
| _newConverter | IConverter | new converter contract address | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferReserveBalances(IConverter _oldConverter, IConverter _newConverter) private {
		uint256 reserveBalance;
		uint16 reserveTokenCount = _oldConverter.connectorTokenCount();

		for (uint16 i = 0; i < reserveTokenCount; i++) {
			address reserveAddress = _oldConverter.connectorTokens(i);
			// Ether reserve
			if (reserveAddress == ETH_RESERVE_ADDRESS) {
				_oldConverter.withdrawETH(address(_newConverter));
			}
			// Ether reserve token
			else if (reserveAddress == address(etherToken)) {
				reserveBalance = etherToken.balanceOf(_oldConverter);
				_oldConverter.withdrawTokens(etherToken, address(this), reserveBalance);
				etherToken.withdrawTo(address(_newConverter), reserveBalance);
			}
			// ERC20 reserve token
			else {
				IERC20Token connector = IERC20Token(reserveAddress);
				reserveBalance = connector.balanceOf(_oldConverter);
				_oldConverter.withdrawTokens(connector, address(_newConverter), reserveBalance);
			}
		}
	}
```
</details>

---    

> ### handleTypeSpecificData

handles upgrading custom (type specific) data from the old converter to the new one
	 *

```solidity
function handleTypeSpecificData(IConverter _oldConverter, IConverter _newConverter, bool _activate) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _oldConverter | IConverter | old converter contract address | 
| _newConverter | IConverter | new converter contract address | 
| _activate | bool | activate the new converter | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function handleTypeSpecificData(
		IConverter _oldConverter,
		IConverter _newConverter,
		bool _activate
	) private {
		if (!isV28OrHigherConverter(_oldConverter)) return;

		uint16 converterType = _oldConverter.converterType();
		if (converterType == 2) {
			uint16 reserveTokenCount = _oldConverter.connectorTokenCount();
			for (uint16 i = 0; i < reserveTokenCount; i++) {
				// copy reserve staked balance
				IERC20Token reserveTokenAddress = _oldConverter.connectorTokens(i);
				uint256 balance = ILiquidityPoolV2Converter(_oldConverter).reserveStakedBalance(reserveTokenAddress);
				ILiquidityPoolV2Converter(_newConverter).setReserveStakedBalance(reserveTokenAddress, balance);
			}

			if (!_activate) {
				return;
			}

			// get the primary reserve token
			IERC20Token primaryReserveToken = ILiquidityPoolV2Converter(_oldConverter).primaryReserveToken();

			// get the chainlink price oracles
			IPriceOracle priceOracle = ILiquidityPoolV2Converter(_oldConverter).priceOracle();
			IConsumerPriceOracle oracleA = priceOracle.tokenAOracle();
			IConsumerPriceOracle oracleB = priceOracle.tokenBOracle();

			// activate the new converter
			ILiquidityPoolV2Converter(_newConverter).activate(primaryReserveToken, oracleA, oracleB);
		}
	}
```
</details>

---    

> ### isV28OrHigherConverter

```solidity
function isV28OrHigherConverter(IConverter _converter) internal view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isV28OrHigherConverter(IConverter _converter) internal view returns (bool) {
		bool success;
		uint256[1] memory ret;
		bytes memory data = abi.encodeWithSelector(IS_V28_OR_HIGHER_FUNC_SELECTOR);

		assembly {
			success := staticcall(
				5000, // isV28OrHigher consumes 190 gas, but just for extra safety
				_converter, // destination address
				add(data, 32), // input buffer (starts after the first 32 bytes in the `data` array)
				mload(data), // input length (loaded from the first 32 bytes in the `data` array)
				ret, // output buffer
				32 // output length
			)
		}

		return success && ret[0] != 0;
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
