# Multisignature wallet - Allows multiple parties to agree on
  transactions before execution.
 * (MultiSigWallet.sol)

View Source: [contracts/utility/MultiSigWallet.sol](../solidity/contracts/utility/MultiSigWallet.sol)

**MultiSigWallet**

## Constructor

Contract constructor sets initial owners and required number
  of confirmations.
	 *

```js
constructor(uint256 undefined, uint256 _required) public
```

**Arguments**

## Structs
### Transaction

```js
struct Transaction {
 address destination,
 uint256 value,
 bytes data,
 bool executed
}
```

## Contract Members
**Constants & Variables**

```js
uint256 public constant MAX_OWNER_COUNT;
mapping(uint256 => struct MultiSigWallet.Transaction) public transactions;
mapping(uint256 => mapping(address => bool)) public confirmations;
mapping(address => bool) public isOwner;
address[] public owners;
uint256 public required;
uint256 public transactionCount;

```

**Events**

```js
event Confirmation(address indexed sender, uint256 indexed transactionId);
event Revocation(address indexed sender, uint256 indexed transactionId);
event Submission(uint256 indexed transactionId);
event Execution(uint256 indexed transactionId);
event ExecutionFailure(uint256 indexed transactionId);
event Deposit(address indexed sender, uint256  value);
event OwnerAddition(address indexed owner);
event OwnerRemoval(address indexed owner);
event RequirementChange(uint256  required);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| undefined | uint256 |  | 
| _required | uint256 | Number of required confirmations. | 

## Modifiers

- [onlyWallet](#onlywallet)
- [ownerDoesNotExist](#ownerdoesnotexist)
- [ownerExists](#ownerexists)
- [transactionExists](#transactionexists)
- [confirmed](#confirmed)
- [notConfirmed](#notconfirmed)
- [notExecuted](#notexecuted)
- [notNull](#notnull)
- [validRequirement](#validrequirement)

### onlyWallet

```js
modifier onlyWallet() internal
```

### ownerDoesNotExist

```js
modifier ownerDoesNotExist(address owner) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| owner | address |  | 

### ownerExists

```js
modifier ownerExists(address owner) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| owner | address |  | 

### transactionExists

```js
modifier transactionExists(uint256 transactionId) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 |  | 

### confirmed

```js
modifier confirmed(uint256 transactionId, address owner) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 |  | 
| owner | address |  | 

### notConfirmed

```js
modifier notConfirmed(uint256 transactionId, address owner) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 |  | 
| owner | address |  | 

### notExecuted

```js
modifier notExecuted(uint256 transactionId) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 |  | 

### notNull

```js
modifier notNull(address _address) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _address | address |  | 

### validRequirement

```js
modifier validRequirement(uint256 ownerCount, uint256 _required) internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| ownerCount | uint256 |  | 
| _required | uint256 |  | 

## Functions

- [constructor()](#constructor)
- [addOwner(address owner)](#addowner)
- [removeOwner(address owner)](#removeowner)
- [replaceOwner(address owner, address newOwner)](#replaceowner)
- [changeRequirement(uint256 _required)](#changerequirement)
- [submitTransaction(address destination, uint256 value, bytes data)](#submittransaction)
- [confirmTransaction(uint256 transactionId)](#confirmtransaction)
- [revokeConfirmation(uint256 transactionId)](#revokeconfirmation)
- [executeTransaction(uint256 transactionId)](#executetransaction)
- [external_call(address destination, uint256 value, uint256 dataLength, bytes data)](#external_call)
- [isConfirmed(uint256 transactionId)](#isconfirmed)
- [addTransaction(address destination, uint256 value, bytes data)](#addtransaction)
- [getConfirmationCount(uint256 transactionId)](#getconfirmationcount)
- [getTransactionCount(bool pending, bool executed)](#gettransactioncount)
- [getOwners()](#getowners)
- [getConfirmations(uint256 transactionId)](#getconfirmations)
- [getTransactionIds(uint256 from, uint256 to, bool pending, bool executed)](#gettransactionids)

---    

> ### constructor

Fallback function allows to deposit ether.

```solidity
function () external payable
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function() external payable {
		if (msg.value > 0) emit Deposit(msg.sender, msg.value);
	}
```
</details>

---    

> ### addOwner

Allows to add a new owner. Transaction has to be sent by wallet.

```solidity
function addOwner(address owner) public nonpayable onlyWallet ownerDoesNotExist notNull validRequirement 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| owner | address | Address of new owner. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addOwner(address owner)
		public
		onlyWallet
		ownerDoesNotExist(owner)
		notNull(owner)
		validRequirement(owners.length + 1, required)
	{
		isOwner[owner] = true;
		owners.push(owner);
		emit OwnerAddition(owner);
	}
```
</details>

---    

> ### removeOwner

Allows to remove an owner. Transaction has to be sent by wallet.

```solidity
function removeOwner(address owner) public nonpayable onlyWallet ownerExists 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| owner | address | Address of owner. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function removeOwner(address owner) public onlyWallet ownerExists(owner) {
		isOwner[owner] = false;
		for (uint256 i = 0; i < owners.length - 1; i++)
			if (owners[i] == owner) {
				owners[i] = owners[owners.length - 1];
				break;
			}
		owners.length -= 1;
		if (required > owners.length) changeRequirement(owners.length);
		emit OwnerRemoval(owner);
	}
```
</details>

---    

> ### replaceOwner

Allows to replace an owner with a new owner. Transaction has
  to be sent by wallet.
	 *

```solidity
function replaceOwner(address owner, address newOwner) public nonpayable onlyWallet ownerExists ownerDoesNotExist 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| owner | address | Address of owner to be replaced. | 
| newOwner | address | Address of new owner. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function replaceOwner(address owner, address newOwner) public onlyWallet ownerExists(owner) ownerDoesNotExist(newOwner) {
		for (uint256 i = 0; i < owners.length; i++)
			if (owners[i] == owner) {
				owners[i] = newOwner;
				break;
			}
		isOwner[owner] = false;
		isOwner[newOwner] = true;
		emit OwnerRemoval(owner);
		emit OwnerAddition(newOwner);
	}
```
</details>

---    

> ### changeRequirement

Allows to change the number of required confirmations.
Transaction has to be sent by wallet.
	 *

```solidity
function changeRequirement(uint256 _required) public nonpayable onlyWallet validRequirement 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _required | uint256 | Number of required confirmations. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function changeRequirement(uint256 _required) public onlyWallet validRequirement(owners.length, _required) {
		required = _required;
		emit RequirementChange(_required);
	}
```
</details>

---    

> ### submitTransaction

Allows an owner to submit and confirm a transaction.
	 *

```solidity
function submitTransaction(address destination, uint256 value, bytes data) public nonpayable
returns(transactionId uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| destination | address | Transaction target address. | 
| value | uint256 | Transaction ether value. | 
| data | bytes | Transaction data payload. 	 * | 

**Returns**

Returns transaction ID.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function submitTransaction(
		address destination,
		uint256 value,
		bytes memory data
	) public returns (uint256 transactionId) {
		transactionId = addTransaction(destination, value, data);
		confirmTransaction(transactionId);
	}
```
</details>

---    

> ### confirmTransaction

Allows an owner to confirm a transaction.

```solidity
function confirmTransaction(uint256 transactionId) public nonpayable ownerExists transactionExists notConfirmed 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 | Transaction ID. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function confirmTransaction(uint256 transactionId)
		public
		ownerExists(msg.sender)
		transactionExists(transactionId)
		notConfirmed(transactionId, msg.sender)
	{
		confirmations[transactionId][msg.sender] = true;
		emit Confirmation(msg.sender, transactionId);
		executeTransaction(transactionId);
	}
```
</details>

---    

> ### revokeConfirmation

Allows an owner to revoke a confirmation for a transaction.

```solidity
function revokeConfirmation(uint256 transactionId) public nonpayable ownerExists confirmed notExecuted 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 | Transaction ID. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function revokeConfirmation(uint256 transactionId)
		public
		ownerExists(msg.sender)
		confirmed(transactionId, msg.sender)
		notExecuted(transactionId)
	{
		confirmations[transactionId][msg.sender] = false;
		emit Revocation(msg.sender, transactionId);
	}
```
</details>

---    

> ### executeTransaction

Allows anyone to execute a confirmed transaction.

```solidity
function executeTransaction(uint256 transactionId) public nonpayable ownerExists confirmed notExecuted 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 | Transaction ID. | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function executeTransaction(uint256 transactionId)
		public
		ownerExists(msg.sender)
		confirmed(transactionId, msg.sender)
		notExecuted(transactionId)
	{
		if (isConfirmed(transactionId)) {
			Transaction storage txn = transactions[transactionId];
			txn.executed = true;
			if (external_call(txn.destination, txn.value, txn.data.length, txn.data)) emit Execution(transactionId);
			else {
				emit ExecutionFailure(transactionId);
				txn.executed = false;
			}
		}
	}
```
</details>

---    

> ### external_call

Low level transaction execution.
	 *

```solidity
function external_call(address destination, uint256 value, uint256 dataLength, bytes data) internal nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| destination | address | The address of the Smart Contract to call. | 
| value | uint256 | The amout of rBTC to send w/ the transaction. | 
| dataLength | uint256 | The size of the payload. | 
| data | bytes | Length The size of the payload. | 

**Returns**

Success or failure.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function external_call(
		address destination,
		uint256 value,
		uint256 dataLength,
		bytes memory data
	) internal returns (bool) {
		bool result;
		assembly {
			let x := mload(0x40) /// "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
			let d := add(data, 32) /// First 32 bytes are the padded length of data, so exclude that
			result := call(
				sub(gas, 34710), /// 34710 is the value that solidity is currently emitting
				/// It includes callGas (700) + callVeryLow (3, to pay for SUB) + callValueTransferGas (9000) +
				/// callNewAccountGas (25000, in case the destination address does not exist and needs creating)
				destination,
				value,
				d,
				dataLength, /// Size of the input (in bytes) - this is what fixes the padding problem
				x,
				0 /// Output is ignored, therefore the output size is zero
			)
		}
		return result;
	}
```
</details>

---    

> ### isConfirmed

Returns the confirmation status of a transaction.

```solidity
function isConfirmed(uint256 transactionId) public view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 | Transaction ID. | 

**Returns**

Confirmation status.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function isConfirmed(uint256 transactionId) public view returns (bool) {
		uint256 count = 0;
		for (uint256 i = 0; i < owners.length; i++) {
			if (confirmations[transactionId][owners[i]]) count += 1;
			if (count == required) return true;
		}

		return false;
	}
```
</details>

---    

> ### addTransaction

Adds a new transaction to the transaction mapping,
  if transaction does not exist yet.
	 *

```solidity
function addTransaction(address destination, uint256 value, bytes data) internal nonpayable notNull 
returns(transactionId uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| destination | address | Transaction target address. | 
| value | uint256 | Transaction ether value. | 
| data | bytes | Transaction data payload. 	 * | 

**Returns**

Returns transaction ID.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function addTransaction(
		address destination,
		uint256 value,
		bytes memory data
	) internal notNull(destination) returns (uint256 transactionId) {
		transactionId = transactionCount;
		transactions[transactionId] = Transaction({ destination: destination, value: value, data: data, executed: false });
		transactionCount += 1;
		emit Submission(transactionId);
	}
```
</details>

---    

> ### getConfirmationCount

Get the number of confirmations of a transaction.

```solidity
function getConfirmationCount(uint256 transactionId) public view
returns(count uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 | Transaction ID. | 

**Returns**

Number of confirmations.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConfirmationCount(uint256 transactionId) public view returns (uint256 count) {
		for (uint256 i = 0; i < owners.length; i++) if (confirmations[transactionId][owners[i]]) count += 1;
	}
```
</details>

---    

> ### getTransactionCount

Get the total number of transactions after filers are applied.

```solidity
function getTransactionCount(bool pending, bool executed) public view
returns(count uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| pending | bool | Include pending transactions. | 
| executed | bool | Include executed transactions. | 

**Returns**

Total number of transactions after filters are applied.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getTransactionCount(bool pending, bool executed) public view returns (uint256 count) {
		for (uint256 i = 0; i < transactionCount; i++)
			if ((pending && !transactions[i].executed) || (executed && transactions[i].executed)) count += 1;
	}
```
</details>

---    

> ### getOwners

Get the list of owners.

```solidity
function getOwners() public view
returns(address[])
```

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getOwners() public view returns (address[] memory) {
		return owners;
	}
```
</details>

---    

> ### getConfirmations

Get the array with owner addresses, which confirmed transaction.

```solidity
function getConfirmations(uint256 transactionId) public view
returns(_confirmations address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| transactionId | uint256 | Transaction ID. | 

**Returns**

Returns array of owner addresses.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConfirmations(uint256 transactionId) public view returns (address[] memory _confirmations) {
		address[] memory confirmationsTemp = new address[](owners.length);
		uint256 count = 0;
		uint256 i;
		for (i = 0; i < owners.length; i++)
			if (confirmations[transactionId][owners[i]]) {
				confirmationsTemp[count] = owners[i];
				count += 1;
			}
		_confirmations = new address[](count);
		for (i = 0; i < count; i++) _confirmations[i] = confirmationsTemp[i];
	}
```
</details>

---    

> ### getTransactionIds

Get the list of transaction IDs in defined range.
	 *

```solidity
function getTransactionIds(uint256 from, uint256 to, bool pending, bool executed) public view
returns(_transactionIds uint256[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| from | uint256 | Index start position of transaction array. | 
| to | uint256 | Index end position of transaction array. | 
| pending | bool | Include pending transactions. | 
| executed | bool | Include executed transactions. 	 * | 

**Returns**

Returns array of transaction IDs.

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getTransactionIds(
		uint256 from,
		uint256 to,
		bool pending,
		bool executed
	) public view returns (uint256[] memory _transactionIds) {
		uint256[] memory transactionIdsTemp = new uint256[](transactionCount);
		uint256 count = 0;
		uint256 i;
		for (i = 0; i < transactionCount; i++)
			if ((pending && !transactions[i].executed) || (executed && transactions[i].executed)) {
				transactionIdsTemp[count] = i;
				count += 1;
			}
		_transactionIds = new uint256[](to - from);
		for (i = from; i < to; i++) _transactionIds[i - from] = transactionIdsTemp[i];
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
