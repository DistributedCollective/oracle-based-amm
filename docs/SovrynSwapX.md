# SovrynSwapX.sol

View Source: [contracts/sovrynswapx/SovrynSwapX.sol](../solidity/contracts/sovrynswapx/SovrynSwapX.sol)

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

### xTransfersAllowed

```js
modifier xTransfersAllowed() internal
```

### reportingAllowed

```js
modifier reportingAllowed() internal
```

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

---    

> ### _reporterOnly

```solidity
function _reporterOnly() internal view
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _reporterOnly() internal view {
		require(reporters[msg.sender], "ERR_ACCESS_DENIED");
	}
```
</details>

---    

> ### _xTransfersAllowed

```solidity
function _xTransfersAllowed() internal view
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _xTransfersAllowed() internal view {
		require(xTransfersEnabled, "ERR_DISABLED");
	}
```
</details>

---    

> ### _reportingAllowed

```solidity
function _reportingAllowed() internal view
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function _reportingAllowed() internal view {
		require(reportingEnabled, "ERR_DISABLED");
	}
```
</details>

---    

> ### setMaxLockLimit

setter
	 *

```solidity
function setMaxLockLimit(uint256 _maxLockLimit) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _maxLockLimit | uint256 | new maxLockLimit | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMaxLockLimit(uint256 _maxLockLimit) public ownerOnly greaterThanZero(_maxLockLimit) {
		maxLockLimit = _maxLockLimit;
	}
```
</details>

---    

> ### setMaxReleaseLimit

setter
	 *

```solidity
function setMaxReleaseLimit(uint256 _maxReleaseLimit) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _maxReleaseLimit | uint256 | new maxReleaseLimit | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMaxReleaseLimit(uint256 _maxReleaseLimit) public ownerOnly greaterThanZero(_maxReleaseLimit) {
		maxReleaseLimit = _maxReleaseLimit;
	}
```
</details>

---    

> ### setMinLimit

setter
	 *

```solidity
function setMinLimit(uint256 _minLimit) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _minLimit | uint256 | new minLimit | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinLimit(uint256 _minLimit) public ownerOnly greaterThanZero(_minLimit) {
		// validate input
		require(_minLimit <= maxLockLimit && _minLimit <= maxReleaseLimit, "ERR_INVALID_MIN_LIMIT");

		minLimit = _minLimit;
	}
```
</details>

---    

> ### setLimitIncPerBlock

setter
	 *

```solidity
function setLimitIncPerBlock(uint256 _limitIncPerBlock) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _limitIncPerBlock | uint256 | new limitIncPerBlock | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setLimitIncPerBlock(uint256 _limitIncPerBlock) public ownerOnly greaterThanZero(_limitIncPerBlock) {
		limitIncPerBlock = _limitIncPerBlock;
	}
```
</details>

---    

> ### setMinRequiredReports

setter
	 *

```solidity
function setMinRequiredReports(uint8 _minRequiredReports) public nonpayable ownerOnly greaterThanZero 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _minRequiredReports | uint8 | new minRequiredReports | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMinRequiredReports(uint8 _minRequiredReports) public ownerOnly greaterThanZero(_minRequiredReports) {
		minRequiredReports = _minRequiredReports;
	}
```
</details>

---    

> ### setReporter

allows the owner to set/remove reporters
	 *

```solidity
function setReporter(address _reporter, bool _active) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reporter | address | reporter whos status is to be set | 
| _active | bool | true if the reporter is approved, false otherwise | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setReporter(address _reporter, bool _active) public ownerOnly {
		reporters[_reporter] = _active;
	}
```
</details>

---    

> ### enableXTransfers

allows the owner enable/disable the xTransfer method
	 *

```solidity
function enableXTransfers(bool _enable) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _enable | bool | true to enable, false to disable | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function enableXTransfers(bool _enable) public ownerOnly {
		xTransfersEnabled = _enable;
	}
```
</details>

---    

> ### enableReporting

allows the owner enable/disable the reportTransaction method
	 *

```solidity
function enableReporting(bool _enable) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _enable | bool | true to enable, false to disable | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function enableReporting(bool _enable) public ownerOnly {
		reportingEnabled = _enable;
	}
```
</details>

---    

> ### upgrade

upgrades the contract to the latest version
can only be called by the owner
note that the owner needs to call acceptOwnership on the new contract after the upgrade
	 *

```solidity
function upgrade(address[] _reporters) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _reporters | address[] | new list of reporters | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function upgrade(address[] _reporters) public ownerOnly {
		ISovrynSwapXUpgrader sovrynSwapXUpgrader = ISovrynSwapXUpgrader(addressOf(SOVRYNSWAP_X_UPGRADER));

		transferOwnership(sovrynSwapXUpgrader);
		sovrynSwapXUpgrader.upgrade(version, _reporters);
		acceptOwnership();
	}
```
</details>

---    

> ### xTransfer

claims tokens from msg.sender to be converted to tokens on another blockchain
	 *

```solidity
function xTransfer(bytes32 _toBlockchain, bytes32 _to, uint256 _amount) public nonpayable xTransfersAllowed 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _toBlockchain | bytes32 | blockchain on which tokens will be issued | 
| _to | bytes32 | Blockchain    blockchain on which tokens will be issued | 
| _amount | uint256 | the amount of tokens to transfer | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function xTransfer(
		bytes32 _toBlockchain,
		bytes32 _to,
		uint256 _amount
	) public xTransfersAllowed {
		// get the current lock limit
		uint256 currentLockLimit = getCurrentLockLimit();

		// verify lock limit
		require(_amount >= minLimit && _amount <= currentLockLimit, "ERR_AMOUNT_TOO_HIGH");

		lockTokens(_amount);

		// set the previous lock limit and block number
		prevLockLimit = currentLockLimit.sub(_amount);
		prevLockBlockNumber = block.number;

		// emit XTransfer event with id of 0
		emit XTransfer(msg.sender, _toBlockchain, _to, _amount, 0);
	}
```
</details>

---    

> ### xTransfer

⤾ overrides [ISovrynSwapX.xTransfer](ISovrynSwapX.md#xtransfer)

claims tokens from msg.sender to be converted to tokens on another blockchain
	 *

```solidity
function xTransfer(bytes32 _toBlockchain, bytes32 _to, uint256 _amount, uint256 _id) public nonpayable xTransfersAllowed 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _toBlockchain | bytes32 | blockchain on which tokens will be issued | 
| _to | bytes32 | Blockchain    blockchain on which tokens will be issued | 
| _amount | uint256 | the amount of tokens to transfer | 
| _id | uint256 | pre-determined unique (if non zero) id which refers to this transaction | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function xTransfer(
		bytes32 _toBlockchain,
		bytes32 _to,
		uint256 _amount,
		uint256 _id
	) public xTransfersAllowed {
		// get the current lock limit
		uint256 currentLockLimit = getCurrentLockLimit();

		// require that; minLimit <= _amount <= currentLockLimit
		require(_amount >= minLimit && _amount <= currentLockLimit, "ERR_AMOUNT_TOO_HIGH");

		lockTokens(_amount);

		// set the previous lock limit and block number
		prevLockLimit = currentLockLimit.sub(_amount);
		prevLockBlockNumber = block.number;

		// emit XTransfer event
		emit XTransfer(msg.sender, _toBlockchain, _to, _amount, _id);
	}
```
</details>

---    

> ### reportTx

allows reporter to report transaction which occured on another blockchain
	 *

```solidity
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

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function reportTx(
		bytes32 _fromBlockchain,
		uint256 _txId,
		address _to,
		uint256 _amount,
		uint256 _xTransferId
	) public reporterOnly reportingAllowed validAddress(_to) greaterThanZero(_amount) {
		// require that the transaction has not been reported yet by the reporter
		require(!reportedTxs[_txId][msg.sender], "ERR_ALREADY_REPORTED");

		// set reported as true
		reportedTxs[_txId][msg.sender] = true;

		Transaction storage txn = transactions[_txId];

		// If the caller is the first reporter, set the transaction details
		if (txn.numOfReports == 0) {
			txn.to = _to;
			txn.amount = _amount;
			txn.fromBlockchain = _fromBlockchain;

			if (_xTransferId != 0) {
				// verify uniqueness of xTransfer id to prevent overwriting
				require(transactionIds[_xTransferId] == 0, "ERR_TX_ALREADY_EXISTS");
				transactionIds[_xTransferId] = _txId;
			}
		} else {
			// otherwise, verify transaction details
			require(txn.to == _to && txn.amount == _amount && txn.fromBlockchain == _fromBlockchain, "ERR_TX_MISMATCH");

			if (_xTransferId != 0) require(transactionIds[_xTransferId] == _txId, "ERR_TX_ALREADY_EXISTS");
		}

		// increment the number of reports
		txn.numOfReports++;

		emit TxReport(msg.sender, _fromBlockchain, _txId, _to, _amount, _xTransferId);

		// if theres enough reports, try to release tokens
		if (txn.numOfReports >= minRequiredReports) {
			require(!transactions[_txId].completed, "ERR_TX_ALREADY_COMPLETED");

			// set the transaction as completed
			transactions[_txId].completed = true;

			emit XTransferComplete(_to, _xTransferId);

			releaseTokens(_to, _amount);
		}
	}
```
</details>

---    

> ### getXTransferAmount

⤾ overrides [ISovrynSwapX.getXTransferAmount](ISovrynSwapX.md#getxtransferamount)

gets x transfer amount by xTransferId (not txId)
	 *

```solidity
function getXTransferAmount(uint256 _xTransferId, address _for) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _xTransferId | uint256 | unique (if non zero) pre-determined id (unlike _txId which is determined after the transactions been broadcasted) | 
| _for | address | address corresponding to xTransferId 	 * | 

**Returns**

amount that was sent in xTransfer corresponding to _xTransferId

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getXTransferAmount(uint256 _xTransferId, address _for) public view returns (uint256) {
		// xTransferId -> txId -> Transaction
		Transaction memory transaction = transactions[transactionIds[_xTransferId]];

		// verify that the xTransferId is for _for
		require(transaction.to == _for, "ERR_TX_MISMATCH");

		return transaction.amount;
	}
```
</details>

---    

> ### getCurrentLockLimit

method for calculating current lock limit
	 *

```solidity
function getCurrentLockLimit() public view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCurrentLockLimit() public view returns (uint256) {
		// prevLockLimit + ((currBlockNumber - prevLockBlockNumber) * limitIncPerBlock)
		uint256 currentLockLimit = prevLockLimit.add(((block.number).sub(prevLockBlockNumber)).mul(limitIncPerBlock));
		if (currentLockLimit > maxLockLimit) return maxLockLimit;
		return currentLockLimit;
	}
```
</details>

---    

> ### getCurrentReleaseLimit

method for calculating current release limit
	 *

```solidity
function getCurrentReleaseLimit() public view
returns(uint256)
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getCurrentReleaseLimit() public view returns (uint256) {
		// prevReleaseLimit + ((currBlockNumber - prevReleaseBlockNumber) * limitIncPerBlock)
		uint256 currentReleaseLimit = prevReleaseLimit.add(((block.number).sub(prevReleaseBlockNumber)).mul(limitIncPerBlock));
		if (currentReleaseLimit > maxReleaseLimit) return maxReleaseLimit;
		return currentReleaseLimit;
	}
```
</details>

---    

> ### lockTokens

claims and locks tokens from msg.sender to be converted to tokens on another blockchain
	 *

```solidity
function lockTokens(uint256 _amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _amount | uint256 | the amount of tokens to lock | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function lockTokens(uint256 _amount) private {
		safeTransferFrom(token, msg.sender, address(this), _amount);
		emit TokensLock(msg.sender, _amount);
	}
```
</details>

---    

> ### releaseTokens

private method to release tokens held by the contract
	 *

```solidity
function releaseTokens(address _to, uint256 _amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | the address to release tokens to | 
| _amount | uint256 | the amount of tokens to release | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function releaseTokens(address _to, uint256 _amount) private {
		// get the current release limit
		uint256 currentReleaseLimit = getCurrentReleaseLimit();

		require(_amount >= minLimit && _amount <= currentReleaseLimit, "ERR_AMOUNT_TOO_HIGH");

		// update the previous release limit and block number
		prevReleaseLimit = currentReleaseLimit.sub(_amount);
		prevReleaseBlockNumber = block.number;

		// no need to require, reverts on failure
		safeTransfer(token, _to, _amount);

		emit TokensRelease(_to, _amount);
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
