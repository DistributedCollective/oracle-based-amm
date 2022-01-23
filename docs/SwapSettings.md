# SwapSettings.sol

View Source: [contracts/converter/SwapSettings.sol](../solidity/contracts/converter/SwapSettings.sol)

**↗ Extends: [Owned](Owned.md)**

**SwapSettings**

## Contract Members
**Constants & Variables**

```js
//internal members
uint32 internal constant PROTOCOL_FEE_RESOLUTION;

//public members
address public wrbtcAddress;
address public sovTokenAddress;
address public feesController;
uint32 public protocolFee;

```

**Events**

```js
event ProtocolFeeUpdate(uint32  _prevProtocolFee, uint32  _newProtocolFee);
event SetFeesController(address indexed sender, address indexed oldController, address indexed newController);
event SetWrbtcAddress(address indexed sender, address indexed oldWrbtcAddress, address indexed newWrbtcAddress);
event SetSOVTokenAddress(address indexed sender, address indexed oldSOVTokenAddress, address indexed newSOVTokenAddress);
```

## Functions

- [setFeesController(address newController)](#setfeescontroller)
- [setWrbtcAddress(address newWrbtcAddress)](#setwrbtcaddress)
- [setSOVTokenAddress(address newSOVTokenAddress)](#setsovtokenaddress)
- [setProtocolFee(uint32 _protocolFee)](#setprotocolfee)

> ### setFeesController

Set the feesController (The one who can withdraw / collect the protocolFee from this converter)
	 *

```solidity
function setFeesController(address newController) external nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newController | address | new feesController | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setFeesController(address newController) external ownerOnly() {
		require(newController != address(0), "ERR_ZERO_ADDRESS");
		address oldController = feesController;
		feesController = newController;

		emit SetFeesController(msg.sender, oldController, newController);
	}
```
</details>

> ### setWrbtcAddress

Set the wrBTC contract address.
	 *

```solidity
function setWrbtcAddress(address newWrbtcAddress) external nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newWrbtcAddress | address | The address of the wrBTC contract. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setWrbtcAddress(address newWrbtcAddress) external ownerOnly() {
		require(newWrbtcAddress != address(0), "ERR_ZERO_ADDRESS");
		address oldwrbtcAddress = address(wrbtcAddress);
		wrbtcAddress = newWrbtcAddress;

		emit SetWrbtcAddress(msg.sender, oldwrbtcAddress, newWrbtcAddress);
	}
```
</details>

> ### setSOVTokenAddress

Set the SOVToken contract address.
	 *

```solidity
function setSOVTokenAddress(address newSOVTokenAddress) external nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newSOVTokenAddress | address | The address of the SOV Token contract. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setSOVTokenAddress(address newSOVTokenAddress) external ownerOnly() {
		require(newSOVTokenAddress != address(0), "ERR_ZERO_ADDRESS");
		address oldSOVTokenAddress = address(sovTokenAddress);
		sovTokenAddress = newSOVTokenAddress;

		emit SetSOVTokenAddress(msg.sender, oldSOVTokenAddress, newSOVTokenAddress);
	}
```
</details>

> ### setProtocolFee

allows the owner to update the x% of protocol fee
	 *

```solidity
function setProtocolFee(uint32 _protocolFee) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _protocolFee | uint32 | x% of protocol fee | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setProtocolFee(uint32 _protocolFee) public ownerOnly() {
    require(_protocolFee <= PROTOCOL_FEE_RESOLUTION, "ERR_PROTOCOL_FEE_TOO_HIGH");
		emit ProtocolFeeUpdate(protocolFee, _protocolFee);
		protocolFee = _protocolFee;
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
