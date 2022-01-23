# IConverter.sol

View Source: [contracts/converter/interfaces/IConverter.sol](../solidity/contracts/converter/interfaces/IConverter.sol)

**↗ Extends: [IOwned](IOwned.md)**
**↘ Derived Contracts: [ConverterBase](ConverterBase.md), [IFeeSharingProxy](IFeeSharingProxy.md), [IInternalSovrynSwapNetwork](IInternalSovrynSwapNetwork.md), [ISwapSettings](ISwapSettings.md)**

**IConverter**

## Functions

- [converterType()](#convertertype)
- [anchor()](#anchor)
- [isActive()](#isactive)
- [targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)](#targetamountandfee)
- [convert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary)](#convert)
- [conversionWhitelist()](#conversionwhitelist)
- [conversionFee()](#conversionfee)
- [maxConversionFee()](#maxconversionfee)
- [reserveBalance(IERC20Token _reserveToken)](#reservebalance)
- [constructor()](#constructor)
- [transferAnchorOwnership(address _newOwner)](#transferanchorownership)
- [acceptAnchorOwnership()](#acceptanchorownership)
- [setConversionFee(uint32 _conversionFee)](#setconversionfee)
- [setConversionWhitelist(IWhitelist _whitelist)](#setconversionwhitelist)
- [withdrawTokens(IERC20Token _token, address _to, uint256 _amount)](#withdrawtokens)
- [withdrawETH(address _to)](#withdraweth)
- [addReserve(IERC20Token _token, uint32 _ratio)](#addreserve)
- [token()](#token)
- [transferTokenOwnership(address _newOwner)](#transfertokenownership)
- [acceptTokenOwnership()](#accepttokenownership)
- [connectors(address _address)](#connectors)
- [getConnectorBalance(IERC20Token _connectorToken)](#getconnectorbalance)
- [connectorTokens(uint256 _index)](#connectortokens)
- [connectorTokenCount()](#connectortokencount)

> ### converterType

⤿ Overridden Implementation(s): [LiquidityPoolV1Converter.converterType](LiquidityPoolV1Converter.md#convertertype),[LiquidityPoolV1ConverterMultiAsset.converterType](LiquidityPoolV1ConverterMultiAsset.md#convertertype),[LiquidityPoolV2Converter.converterType](LiquidityPoolV2Converter.md#convertertype),[LiquidTokenConverter.converterType](LiquidTokenConverter.md#convertertype)

```solidity
function converterType() public pure
returns(uint16)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function converterType() public pure returns (uint16);
```
</details>

> ### anchor

```solidity
function anchor() public view
returns(contract IConverterAnchor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function anchor() public view returns (IConverterAnchor) {
		this;
	}
```
</details>

> ### isActive

⤿ Overridden Implementation(s): [ConverterBase.isActive](ConverterBase.md#isactive),[IFeeSharingProxy.isActive](IFeeSharingProxy.md#isactive),[IInternalSovrynSwapNetwork.isActive](IInternalSovrynSwapNetwork.md#isactive),[ISwapSettings.isActive](ISwapSettings.md#isactive),[LiquidityPoolV2Converter.isActive](LiquidityPoolV2Converter.md#isactive)

```solidity
function isActive() public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isActive() public view returns (bool);
```
</details>

> ### targetAmountAndFee

⤿ Overridden Implementation(s): [LiquidityPoolV1Converter.targetAmountAndFee](LiquidityPoolV1Converter.md#targetamountandfee),[LiquidityPoolV1ConverterMultiAsset.targetAmountAndFee](LiquidityPoolV1ConverterMultiAsset.md#targetamountandfee),[LiquidityPoolV2Converter.targetAmountAndFee](LiquidityPoolV2Converter.md#targetamountandfee),[LiquidTokenConverter.targetAmountAndFee](LiquidTokenConverter.md#targetamountandfee)

```solidity
function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount) public view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token |  | 
| _targetToken | IERC20Token |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function targetAmountAndFee(
		IERC20Token _sourceToken,
		IERC20Token _targetToken,
		uint256 _amount
	) public view returns (uint256, uint256);
```
</details>

> ### convert

⤿ Overridden Implementation(s): [ConverterBase.convert](ConverterBase.md#convert),[IFeeSharingProxy.convert](IFeeSharingProxy.md#convert),[IInternalSovrynSwapNetwork.convert](IInternalSovrynSwapNetwork.md#convert),[ISwapSettings.convert](ISwapSettings.md#convert)

```solidity
function convert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token |  | 
| _targetToken | IERC20Token |  | 
| _amount | uint256 |  | 
| _trader | address |  | 
| _beneficiary | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convert(
		IERC20Token _sourceToken,
		IERC20Token _targetToken,
		uint256 _amount,
		address _trader,
		address _beneficiary
	) public payable returns (uint256);
```
</details>

> ### conversionWhitelist

```solidity
function conversionWhitelist() public view
returns(contract IWhitelist)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function conversionWhitelist() public view returns (IWhitelist) {
		this;
	}
```
</details>

> ### conversionFee

```solidity
function conversionFee() public view
returns(uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function conversionFee() public view returns (uint32) {
		this;
	}
```
</details>

> ### maxConversionFee

```solidity
function maxConversionFee() public view
returns(uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function maxConversionFee() public view returns (uint32) {
		this;
	}
```
</details>

> ### reserveBalance

⤿ Overridden Implementation(s): [ConverterBase.reserveBalance](ConverterBase.md#reservebalance),[IFeeSharingProxy.reserveBalance](IFeeSharingProxy.md#reservebalance),[IInternalSovrynSwapNetwork.reserveBalance](IInternalSovrynSwapNetwork.md#reservebalance),[ISwapSettings.reserveBalance](ISwapSettings.md#reservebalance)

```solidity
function reserveBalance(IERC20Token _reserveToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reserveToken | IERC20Token |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reserveBalance(IERC20Token _reserveToken) public view returns (uint256);
```
</details>

> ### constructor

⤿ Overridden Implementation(s): [ConverterBase.](ConverterBase.md#),[IFeeSharingProxy.](IFeeSharingProxy.md#),[IInternalSovrynSwapNetwork.](IInternalSovrynSwapNetwork.md#),[ISwapSettings.](ISwapSettings.md#)

```solidity
function () external payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function() external payable;
```
</details>

> ### transferAnchorOwnership

⤿ Overridden Implementation(s): [ConverterBase.transferAnchorOwnership](ConverterBase.md#transferanchorownership),[IFeeSharingProxy.transferAnchorOwnership](IFeeSharingProxy.md#transferanchorownership),[IInternalSovrynSwapNetwork.transferAnchorOwnership](IInternalSovrynSwapNetwork.md#transferanchorownership),[ISwapSettings.transferAnchorOwnership](ISwapSettings.md#transferanchorownership)

```solidity
function transferAnchorOwnership(address _newOwner) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _newOwner | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferAnchorOwnership(address _newOwner) public;
```
</details>

> ### acceptAnchorOwnership

⤿ Overridden Implementation(s): [ConverterBase.acceptAnchorOwnership](ConverterBase.md#acceptanchorownership),[IFeeSharingProxy.acceptAnchorOwnership](IFeeSharingProxy.md#acceptanchorownership),[IInternalSovrynSwapNetwork.acceptAnchorOwnership](IInternalSovrynSwapNetwork.md#acceptanchorownership),[ISwapSettings.acceptAnchorOwnership](ISwapSettings.md#acceptanchorownership),[LiquidityPoolConverter.acceptAnchorOwnership](LiquidityPoolConverter.md#acceptanchorownership),[LiquidityPoolV1Converter.acceptAnchorOwnership](LiquidityPoolV1Converter.md#acceptanchorownership),[LiquidityPoolV1ConverterMultiAsset.acceptAnchorOwnership](LiquidityPoolV1ConverterMultiAsset.md#acceptanchorownership),[LiquidTokenConverter.acceptAnchorOwnership](LiquidTokenConverter.md#acceptanchorownership)

```solidity
function acceptAnchorOwnership() public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function acceptAnchorOwnership() public;
```
</details>

> ### setConversionFee

⤿ Overridden Implementation(s): [ConverterBase.setConversionFee](ConverterBase.md#setconversionfee),[IFeeSharingProxy.setConversionFee](IFeeSharingProxy.md#setconversionfee),[IInternalSovrynSwapNetwork.setConversionFee](IInternalSovrynSwapNetwork.md#setconversionfee),[ISwapSettings.setConversionFee](ISwapSettings.md#setconversionfee)

```solidity
function setConversionFee(uint32 _conversionFee) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _conversionFee | uint32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setConversionFee(uint32 _conversionFee) public;
```
</details>

> ### setConversionWhitelist

⤿ Overridden Implementation(s): [ConverterBase.setConversionWhitelist](ConverterBase.md#setconversionwhitelist),[IFeeSharingProxy.setConversionWhitelist](IFeeSharingProxy.md#setconversionwhitelist),[IInternalSovrynSwapNetwork.setConversionWhitelist](IInternalSovrynSwapNetwork.md#setconversionwhitelist),[ISwapSettings.setConversionWhitelist](ISwapSettings.md#setconversionwhitelist)

```solidity
function setConversionWhitelist(IWhitelist _whitelist) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _whitelist | IWhitelist |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setConversionWhitelist(IWhitelist _whitelist) public;
```
</details>

> ### withdrawTokens

⤿ Overridden Implementation(s): [ConverterBase.withdrawTokens](ConverterBase.md#withdrawtokens),[IFeeSharingProxy.withdrawTokens](IFeeSharingProxy.md#withdrawtokens),[IInternalSovrynSwapNetwork.withdrawTokens](IInternalSovrynSwapNetwork.md#withdrawtokens),[ISwapSettings.withdrawTokens](ISwapSettings.md#withdrawtokens),[ITokenHolder.withdrawTokens](ITokenHolder.md#withdrawtokens),[TokenHolder.withdrawTokens](TokenHolder.md#withdrawtokens)

```solidity
function withdrawTokens(IERC20Token _token, address _to, uint256 _amount) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token |  | 
| _to | address |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdrawTokens(
		IERC20Token _token,
		address _to,
		uint256 _amount
	) public;
```
</details>

> ### withdrawETH

⤿ Overridden Implementation(s): [ConverterBase.withdrawETH](ConverterBase.md#withdraweth),[IFeeSharingProxy.withdrawETH](IFeeSharingProxy.md#withdraweth),[IInternalSovrynSwapNetwork.withdrawETH](IInternalSovrynSwapNetwork.md#withdraweth),[ISwapSettings.withdrawETH](ISwapSettings.md#withdraweth)

```solidity
function withdrawETH(address _to) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function withdrawETH(address _to) public;
```
</details>

> ### addReserve

⤿ Overridden Implementation(s): [ConverterBase.addReserve](ConverterBase.md#addreserve),[IFeeSharingProxy.addReserve](IFeeSharingProxy.md#addreserve),[IInternalSovrynSwapNetwork.addReserve](IInternalSovrynSwapNetwork.md#addreserve),[ISwapSettings.addReserve](ISwapSettings.md#addreserve),[LiquidityPoolV1Converter.addReserve](LiquidityPoolV1Converter.md#addreserve),[LiquidityPoolV2Converter.addReserve](LiquidityPoolV2Converter.md#addreserve),[LiquidTokenConverter.addReserve](LiquidTokenConverter.md#addreserve)

```solidity
function addReserve(IERC20Token _token, uint32 _ratio) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token |  | 
| _ratio | uint32 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addReserve(IERC20Token _token, uint32 _ratio) public;
```
</details>

> ### token

⤿ Overridden Implementation(s): [ConverterBase.token](ConverterBase.md#token),[IFeeSharingProxy.token](IFeeSharingProxy.md#token),[IInternalSovrynSwapNetwork.token](IInternalSovrynSwapNetwork.md#token),[ISwapSettings.token](ISwapSettings.md#token)

```solidity
function token() public view
returns(contract IConverterAnchor)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function token() public view returns (IConverterAnchor);
```
</details>

> ### transferTokenOwnership

⤿ Overridden Implementation(s): [ConverterBase.transferTokenOwnership](ConverterBase.md#transfertokenownership),[IFeeSharingProxy.transferTokenOwnership](IFeeSharingProxy.md#transfertokenownership),[IInternalSovrynSwapNetwork.transferTokenOwnership](IInternalSovrynSwapNetwork.md#transfertokenownership),[ISwapSettings.transferTokenOwnership](ISwapSettings.md#transfertokenownership)

```solidity
function transferTokenOwnership(address _newOwner) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _newOwner | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function transferTokenOwnership(address _newOwner) public;
```
</details>

> ### acceptTokenOwnership

⤿ Overridden Implementation(s): [ConverterBase.acceptTokenOwnership](ConverterBase.md#accepttokenownership),[IFeeSharingProxy.acceptTokenOwnership](IFeeSharingProxy.md#accepttokenownership),[IInternalSovrynSwapNetwork.acceptTokenOwnership](IInternalSovrynSwapNetwork.md#accepttokenownership),[ISwapSettings.acceptTokenOwnership](ISwapSettings.md#accepttokenownership)

```solidity
function acceptTokenOwnership() public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function acceptTokenOwnership() public;
```
</details>

> ### connectors

⤿ Overridden Implementation(s): [ConverterBase.connectors](ConverterBase.md#connectors),[IFeeSharingProxy.connectors](IFeeSharingProxy.md#connectors),[IInternalSovrynSwapNetwork.connectors](IInternalSovrynSwapNetwork.md#connectors),[ISwapSettings.connectors](ISwapSettings.md#connectors)

```solidity
function connectors(address _address) public view
returns(uint256, uint32, bool, bool, bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function connectors(address _address)
		public
		view
		returns (
			uint256,
			uint32,
			bool,
			bool,
			bool
		);
```
</details>

> ### getConnectorBalance

⤿ Overridden Implementation(s): [ConverterBase.getConnectorBalance](ConverterBase.md#getconnectorbalance),[IFeeSharingProxy.getConnectorBalance](IFeeSharingProxy.md#getconnectorbalance),[IInternalSovrynSwapNetwork.getConnectorBalance](IInternalSovrynSwapNetwork.md#getconnectorbalance),[ISwapSettings.getConnectorBalance](ISwapSettings.md#getconnectorbalance)

```solidity
function getConnectorBalance(IERC20Token _connectorToken) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _connectorToken | IERC20Token |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConnectorBalance(IERC20Token _connectorToken) public view returns (uint256);
```
</details>

> ### connectorTokens

⤿ Overridden Implementation(s): [ConverterBase.connectorTokens](ConverterBase.md#connectortokens),[IFeeSharingProxy.connectorTokens](IFeeSharingProxy.md#connectortokens),[IInternalSovrynSwapNetwork.connectorTokens](IInternalSovrynSwapNetwork.md#connectortokens),[ISwapSettings.connectorTokens](ISwapSettings.md#connectortokens)

```solidity
function connectorTokens(uint256 _index) public view
returns(contract IERC20Token)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _index | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function connectorTokens(uint256 _index) public view returns (IERC20Token);
```
</details>

> ### connectorTokenCount

⤿ Overridden Implementation(s): [ConverterBase.connectorTokenCount](ConverterBase.md#connectortokencount),[IFeeSharingProxy.connectorTokenCount](IFeeSharingProxy.md#connectortokencount),[IInternalSovrynSwapNetwork.connectorTokenCount](IInternalSovrynSwapNetwork.md#connectortokencount),[ISwapSettings.connectorTokenCount](ISwapSettings.md#connectortokencount)

```solidity
function connectorTokenCount() public view
returns(uint16)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function connectorTokenCount() public view returns (uint16);
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
