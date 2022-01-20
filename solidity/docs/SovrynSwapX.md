# SovrynSwapX.sol

View Source: [contracts/sovrynswapx/SovrynSwapX.sol](../contracts/sovrynswapx/SovrynSwapX.sol)

**↗ Extends: [ISovrynSwapX](ISovrynSwapX.md), [TokenHandler](TokenHandler.md), [TokenHolder](TokenHolder.md), [ContractRegistryClient](ContractRegistryClient.md)**

**SovrynSwapX**

The SovrynSwapX contract allows cross chain token transfers.
 * There are two processes that take place in the contract -
- Initiate a cross chain transfer to a target blockchain (locks tokens from the caller account on Ethereum)
- Report a cross chain transfer initiated on a source blockchain (releases tokens to an account on Ethereum)
 * Reporting cross chain transfers works similar to standard multisig contracts, meaning that multiple
callers are required to report a transfer before tokens are released to the target account.

## Constructor

initializes a new SovrynSwapX instance
	 *

```js
constructor(IContractRegistry _registry) public
```

**Arguments**

## Structs
### Transaction

```js
struct Transaction {
 uint256 amount,
 bytes32 fromBlockchain,
 address to,
 uint8 numOfReports,
 bool completed
}
```

## Contract Members
**Constants & Variables**

```js
uint16 public constant version;
uint256 public maxLockLimit;
uint256 public maxReleaseLimit;
uint256 public minLimit;
uint256 public prevLockLimit;
uint256 public prevReleaseLimit;
uint256 public limitIncPerBlock;
uint256 public prevLockBlockNumber;
uint256 public prevReleaseBlockNumber;
uint8 public minRequiredReports;
contract IERC20Token public token;
bool public xTransfersEnabled;
bool public reportingEnabled;
mapping(uint256 => struct SovrynSwapX.Transaction) public transactions;
mapping(uint256 => uint256) public transactionIds;
mapping(uint256 => mapping(address => bool)) public reportedTxs;
mapping(address => bool) public reporters;

```

**Events**

```js
event TokensLock(address indexed _from, uint256  _amount);
event TokensRelease(address indexed _to, uint256  _amount);
event XTransfer(address indexed _from, bytes32  _toBlockchain, bytes32 indexed _to, uint256  _amount, uint256  _id);
event TxReport(address indexed _reporter, bytes32  _fromBlockchain, uint256  _txId, address  _to, uint256  _amount, uint256  _xTransferId);
event XTransferComplete(address  _to, uint256  _id);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _registry | IContractRegistry | address of contract registry | 

## Modifiers

- [reporterOnly](#reporteronly)
- [xTransfersAllowed](#xtransfersallowed)
- [reportingAllowed](#reportingallowed)

### reporterOnly

```js
modifier reporterOnly() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### xTransfersAllowed

```js
modifier xTransfersAllowed() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### reportingAllowed

```js
modifier reportingAllowed() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [_reporterOnly()](#_reporteronly)
- [_xTransfersAllowed()](#_xtransfersallowed)
- [_reportingAllowed()](#_reportingallowed)
- [setMaxLockLimit(uint256 _maxLockLimit)](#setmaxlocklimit)
- [setMaxReleaseLimit(uint256 _maxReleaseLimit)](#setmaxreleaselimit)
- [setMinLimit(uint256 _minLimit)](#setminlimit)
- [setLimitIncPerBlock(uint256 _limitIncPerBlock)](#setlimitincperblock)
- [setMinRequiredReports(uint8 _minRequiredReports)](#setminrequiredreports)
- [setReporter(address _reporter, bool _active)](#setreporter)
- [enableXTransfers(bool _enable)](#enablextransfers)
- [enableReporting(bool _enable)](#enablereporting)
- [upgrade(address[] _reporters)](#upgrade)
- [xTransfer(bytes32 _toBlockchain, bytes32 _to, uint256 _amount)](#xtransfer)
- [xTransfer(bytes32 _toBlockchain, bytes32 _to, uint256 _amount, uint256 _id)](#xtransfer)
- [reportTx(bytes32 _fromBlockchain, uint256 _txId, address _to, uint256 _amount, uint256 _xTransferId)](#reporttx)
- [getXTransferAmount(uint256 _xTransferId, address _for)](#getxtransferamount)
- [getCurrentLockLimit()](#getcurrentlocklimit)
- [getCurrentReleaseLimit()](#getcurrentreleaselimit)
- [lockTokens(uint256 _amount)](#locktokens)
- [releaseTokens(address _to, uint256 _amount)](#releasetokens)

### _reporterOnly

```js
function _reporterOnly() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _xTransfersAllowed

```js
function _xTransfersAllowed() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _reportingAllowed

```js
function _reportingAllowed() internal view
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### setMaxLockLimit

setter
	 *

```js
function setMaxLockLimit(uint256 _maxLockLimit) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _maxLockLimit | uint256 | new maxLockLimit | 

### setMaxReleaseLimit

setter
	 *

```js
function setMaxReleaseLimit(uint256 _maxReleaseLimit) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _maxReleaseLimit | uint256 | new maxReleaseLimit | 

### setMinLimit

setter
	 *

```js
function setMinLimit(uint256 _minLimit) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _minLimit | uint256 | new minLimit | 

### setLimitIncPerBlock

setter
	 *

```js
function setLimitIncPerBlock(uint256 _limitIncPerBlock) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _limitIncPerBlock | uint256 | new limitIncPerBlock | 

### setMinRequiredReports

setter
	 *

```js
function setMinRequiredReports(uint8 _minRequiredReports) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _minRequiredReports | uint8 | new minRequiredReports | 

### setReporter

allows the owner to set/remove reporters
	 *

```js
function setReporter(address _reporter, bool _active) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reporter | address | reporter whos status is to be set | 
| _active | bool | true if the reporter is approved, false otherwise | 

### enableXTransfers

allows the owner enable/disable the xTransfer method
	 *

```js
function enableXTransfers(bool _enable) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _enable | bool | true to enable, false to disable | 

### enableReporting

allows the owner enable/disable the reportTransaction method
	 *

```js
function enableReporting(bool _enable) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _enable | bool | true to enable, false to disable | 

### upgrade

upgrades the contract to the latest version
can only be called by the owner
note that the owner needs to call acceptOwnership on the new contract after the upgrade
	 *

```js
function upgrade(address[] _reporters) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reporters | address[] | new list of reporters | 

### xTransfer

claims tokens from msg.sender to be converted to tokens on another blockchain
	 *

```js
function xTransfer(bytes32 _toBlockchain, bytes32 _to, uint256 _amount) public nonpayable xTransfersAllowed 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _toBlockchain | bytes32 | blockchain on which tokens will be issued | 
| _to | bytes32 | Blockchain    blockchain on which tokens will be issued | 
| _amount | uint256 | the amount of tokens to transfer | 

### xTransfer

⤾ overrides [ISovrynSwapX.xTransfer](ISovrynSwapX.md#xtransfer)

claims tokens from msg.sender to be converted to tokens on another blockchain
	 *

```js
function xTransfer(bytes32 _toBlockchain, bytes32 _to, uint256 _amount, uint256 _id) public nonpayable xTransfersAllowed 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _toBlockchain | bytes32 | blockchain on which tokens will be issued | 
| _to | bytes32 | Blockchain    blockchain on which tokens will be issued | 
| _amount | uint256 | the amount of tokens to transfer | 
| _id | uint256 | pre-determined unique (if non zero) id which refers to this transaction | 

### reportTx

allows reporter to report transaction which occured on another blockchain
	 *

```js
function reportTx(bytes32 _fromBlockchain, uint256 _txId, address _to, uint256 _amount, uint256 _xTransferId) public nonpayable reporterOnly reportingAllowed validAddress greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _fromBlockchain | bytes32 | blockchain in which tokens were destroyed | 
| _txId | uint256 | transactionId of transaction thats being reported | 
| _to | address | address to receive tokens | 
| _amount | uint256 | amount of tokens destroyed on another blockchain | 
| _xTransferId | uint256 | unique (if non zero) pre-determined id (unlike _txId which is determined after the transactions been mined) | 

### getXTransferAmount

⤾ overrides [ISovrynSwapX.getXTransferAmount](ISovrynSwapX.md#getxtransferamount)

gets x transfer amount by xTransferId (not txId)
	 *

```js
function getXTransferAmount(uint256 _xTransferId, address _for) public view
returns(uint256)
```

**Returns**

amount that was sent in xTransfer corresponding to _xTransferId

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _xTransferId | uint256 | unique (if non zero) pre-determined id (unlike _txId which is determined after the transactions been broadcasted) | 
| _for | address | address corresponding to xTransferId
	 * | 

### getCurrentLockLimit

method for calculating current lock limit
	 *

```js
function getCurrentLockLimit() public view
returns(uint256)
```

**Returns**

the current maximum limit of tokens that can be locked

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getCurrentReleaseLimit

method for calculating current release limit
	 *

```js
function getCurrentReleaseLimit() public view
returns(uint256)
```

**Returns**

the current maximum limit of tokens that can be released

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### lockTokens

claims and locks tokens from msg.sender to be converted to tokens on another blockchain
	 *

```js
function lockTokens(uint256 _amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | the amount of tokens to lock | 

### releaseTokens

private method to release tokens held by the contract
	 *

```js
function releaseTokens(address _to, uint256 _amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | the address to release tokens to | 
| _amount | uint256 | the amount of tokens to release | 

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
