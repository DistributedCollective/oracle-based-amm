# ILegacyConverter.sol

View Source: [contracts/SovrynSwapNetwork.sol](../solidity/contracts/SovrynSwapNetwork.sol)

**↗ Extends: [ISovrynSwapNetwork](ISovrynSwapNetwork.md), [TokenHolder](TokenHolder.md), [ContractRegistryClient](ContractRegistryClient.md), [ReentrancyGuard](ReentrancyGuard.md)**

**ILegacyConverter**

## Constructor

initializes a new SovrynSwapNetwork instance
	 *

```js
constructor(IContractRegistry _registry) public
```

**Arguments**

## Structs
### ConversionStep

```js
struct ConversionStep {
 contract IConverter converter,
 contract IConverterAnchor anchor,
 contract IERC20Token sourceToken,
 contract IERC20Token targetToken,
 address beneficiary,
 bool isV28OrHigherConverter,
 bool processAffiliateFee
}
```

## Contract Members
**Constants & Variables**

```js
//private members
uint256 private constant CONVERSION_FEE_RESOLUTION;
uint256 private constant AFFILIATE_FEE_RESOLUTION;
address private constant ETH_RESERVE_ADDRESS;
bytes4 private constant GET_RETURN_FUNC_SELECTOR;
bytes4 private constant IS_V28_OR_HIGHER_FUNC_SELECTOR;

//public members
uint256 public maxAffiliateFee;
mapping(address => bool) public etherTokens;

```

**Events**

```js
event Conversion(address indexed _smartToken, address indexed _fromToken, address indexed _toToken, uint256  _fromAmount, uint256  _toAmount, address  _trader);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _registry | IContractRegistry | address of a contract registry contract | 

## Functions

- [change(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, uint256 _minReturn)](#change)
- [setMaxAffiliateFee(uint256 _maxAffiliateFee)](#setmaxaffiliatefee)
- [registerEtherToken(IEtherToken _token, bool _register)](#registerethertoken)
- [conversionPath(IERC20Token _sourceToken, IERC20Token _targetToken)](#conversionpath)
- [rateByPath(IERC20Token[] _path, uint256 _amount)](#ratebypath)
- [convertByPath(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee)](#convertbypath)
- [xConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, bytes32 _targetBlockchain, bytes32 _targetAccount, uint256 _conversionId)](#xconvert)
- [xConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, bytes32 _targetBlockchain, bytes32 _targetAccount, uint256 _conversionId, address _affiliateAccount, uint256 _affiliateFee)](#xconvert2)
- [completeXConversion(IERC20Token[] _path, ISovrynSwapX _sovrynSwapX, uint256 _conversionId, uint256 _minReturn, address _beneficiary)](#completexconversion)
- [doConversion(struct SovrynSwapNetwork.ConversionStep[] _data, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee)](#doconversion)
- [handleSourceToken(IERC20Token _sourceToken, IConverterAnchor _anchor, uint256 _amount)](#handlesourcetoken)
- [handleTargetToken(struct SovrynSwapNetwork.ConversionStep[] _data, uint256 _amount, address _beneficiary)](#handletargettoken)
- [createConversionData(IERC20Token[] _conversionPath, address _beneficiary, bool _affiliateFeeEnabled)](#createconversiondata)
- [ensureAllowance(IERC20Token _token, address _spender, uint256 _value)](#ensureallowance)
- [getConverterEtherTokenAddress(IConverter _converter)](#getconverterethertokenaddress)
- [getConverterTokenAddress(IConverter _converter, IERC20Token _token)](#getconvertertokenaddress)
- [getReturn(address _dest, address _sourceToken, address _targetToken, uint256 _amount)](#getreturn)
- [isV28OrHigherConverter(IConverter _converter)](#isv28orhigherconverter)
- [getReturnByPath(IERC20Token[] _path, uint256 _amount)](#getreturnbypath)
- [convert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn)](#convert)
- [convert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee)](#convert2)
- [convertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary)](#convertfor)
- [convertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee)](#convertfor2)
- [claimAndConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn)](#claimandconvert)
- [claimAndConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee)](#claimandconvert2)
- [claimAndConvertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary)](#claimandconvertfor)
- [claimAndConvertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee)](#claimandconvertfor2)

---    

> ### change

```solidity
function change(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, uint256 _minReturn) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token |  | 
| _targetToken | IERC20Token |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function change(
		IERC20Token _sourceToken,
		IERC20Token _targetToken,
		uint256 _amount,
		uint256 _minReturn
	) public returns (uint256);
```
</details>

---    

> ### setMaxAffiliateFee

allows the owner to update the maximum affiliate-fee
	 *

```solidity
function setMaxAffiliateFee(uint256 _maxAffiliateFee) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _maxAffiliateFee | uint256 | maximum affiliate-fee | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function setMaxAffiliateFee(uint256 _maxAffiliateFee) public ownerOnly {
		require(_maxAffiliateFee <= AFFILIATE_FEE_RESOLUTION, "ERR_INVALID_AFFILIATE_FEE");
		maxAffiliateFee = _maxAffiliateFee;
	}
```
</details>

---    

> ### registerEtherToken

allows the owner to register/unregister ether tokens
	 *

```solidity
function registerEtherToken(IEtherToken _token, bool _register) public nonpayable ownerOnly validAddress notThis 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IEtherToken | ether token contract address | 
| _register | bool | true to register, false to unregister | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function registerEtherToken(IEtherToken _token, bool _register) public ownerOnly validAddress(_token) notThis(_token) {
		etherTokens[_token] = _register;
	}
```
</details>

---    

> ### conversionPath

⤿ Overridden Implementation(s): [SovrynSwapNetworkMockup.conversionPath](SovrynSwapNetworkMockup.md#conversionpath)

returns the conversion path between two tokens in the network
note that this method is quite expensive in terms of gas and should generally be called off-chain
	 *

```solidity
function conversionPath(IERC20Token _sourceToken, IERC20Token _targetToken) public view
returns(address[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source token address | 
| _targetToken | IERC20Token | target token address 	 * | 

**Returns**

conversion path between the two tokens

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function conversionPath(IERC20Token _sourceToken, IERC20Token _targetToken) public view returns (address[]) {
		IConversionPathFinder pathFinder = IConversionPathFinder(addressOf(CONVERSION_PATH_FINDER));
		return pathFinder.findPath(_sourceToken, _targetToken);
	}
```
</details>

---    

> ### rateByPath

⤿ Overridden Implementation(s): [SovrynSwapNetworkMockup.rateByPath](SovrynSwapNetworkMockup.md#ratebypath)

returns the expected target amount of converting a given amount on a given path
note that there is no support for circular paths
	 *

```solidity
function rateByPath(IERC20Token[] _path, uint256 _amount) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path (see conversion path format above) | 
| _amount | uint256 | amount of _path[0] tokens received from the sender 	 * | 

**Returns**

expected target amount

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function rateByPath(IERC20Token[] _path, uint256 _amount) public view returns (uint256) {
		uint256 amount;
		uint256 fee;
		uint256 supply;
		uint256 balance;
		uint32 weight;
		IConverter converter;
		ISovrynSwapFormula formula = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA));

		amount = _amount;

		// verify that the number of elements is larger than 2 and odd
		require(_path.length > 2 && _path.length % 2 == 1, "ERR_INVALID_PATH");

		// iterate over the conversion path
		for (uint256 i = 2; i < _path.length; i += 2) {
			IERC20Token sourceToken = _path[i - 2];
			IERC20Token anchor = _path[i - 1];
			IERC20Token targetToken = _path[i];

			converter = IConverter(IConverterAnchor(anchor).owner());

			// backward compatibility
			sourceToken = getConverterTokenAddress(converter, sourceToken);
			targetToken = getConverterTokenAddress(converter, targetToken);

			if (targetToken == anchor) {
				// buy the smart token
				// check if the current smart token has changed
				if (i < 3 || anchor != _path[i - 3]) supply = ISmartToken(anchor).totalSupply();

				// get the amount & the conversion fee
				balance = converter.getConnectorBalance(sourceToken);
				(, weight, , , ) = converter.connectors(sourceToken);
				amount = formula.purchaseTargetAmount(supply, balance, weight, amount);
				fee = amount.mul(converter.conversionFee()).div(CONVERSION_FEE_RESOLUTION);
				amount -= fee;

				// update the smart token supply for the next iteration
				supply = supply.add(amount);
			} else if (sourceToken == anchor) {
				// sell the smart token
				// check if the current smart token has changed
				if (i < 3 || anchor != _path[i - 3]) supply = ISmartToken(anchor).totalSupply();

				// get the amount & the conversion fee
				balance = converter.getConnectorBalance(targetToken);
				(, weight, , , ) = converter.connectors(targetToken);
				amount = formula.saleTargetAmount(supply, balance, weight, amount);
				fee = amount.mul(converter.conversionFee()).div(CONVERSION_FEE_RESOLUTION);
				amount -= fee;

				// update the smart token supply for the next iteration
				supply = supply.sub(amount);
			} else {
				// cross reserve conversion
				(amount, fee) = getReturn(converter, sourceToken, targetToken, amount);
			}
		}

		return amount;
	}
```
</details>

---    

> ### convertByPath

converts the token to any other token in the sovrynSwap network by following
a predefined conversion path and transfers the result tokens to a target account
affiliate account/fee can also be passed in to receive a conversion fee (on top of the liquidity provider fees)
note that the network should already have been given allowance of the source token (if not ETH)
	 *

```solidity
function convertByPath(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee) public payable protected greaterThanZero 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path, see conversion path format above | 
| _amount | uint256 | amount to convert from, in the source token | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero | 
| _beneficiary | address | account that will receive the conversion result or 0x0 to send the result to the sender account | 
| _affiliateAccount | address | wallet address to receive the affiliate fee or 0x0 to disable affiliate fee | 
| _affiliateFee | uint256 | affiliate fee in PPM or 0 to disable affiliate fee 	 * | 

**Returns**

amount of tokens received from the conversion

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convertByPath(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _beneficiary,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public payable protected greaterThanZero(_minReturn) returns (uint256) {
		// verify that the path contrains at least a single 'hop' and that the number of elements is odd
		require(_path.length > 2 && _path.length % 2 == 1, "ERR_INVALID_PATH");

		// validate msg.value and prepare the source token for the conversion
		handleSourceToken(_path[0], IConverterAnchor(_path[1]), _amount);

		// check if affiliate fee is enabled
		bool affiliateFeeEnabled = false;
		if (address(_affiliateAccount) == 0) {
			require(_affiliateFee == 0, "ERR_INVALID_AFFILIATE_FEE");
		} else {
			require(0 < _affiliateFee && _affiliateFee <= maxAffiliateFee, "ERR_INVALID_AFFILIATE_FEE");
			affiliateFeeEnabled = true;
		}

		// check if beneficiary is set
		address beneficiary = msg.sender;
		if (_beneficiary != address(0)) beneficiary = _beneficiary;

		// convert and get the resulting amount
		ConversionStep[] memory data = createConversionData(_path, beneficiary, affiliateFeeEnabled);
		uint256 amount = doConversion(data, _amount, _minReturn, _affiliateAccount, _affiliateFee);

		// handle the conversion target tokens
		handleTargetToken(data, amount, beneficiary);

		return amount;
	}
```
</details>

---    

> ### xConvert

converts any other token to BNT in the sovrynSwap network by following
a predefined conversion path and transfers the result to an account on a different blockchain
note that the network should already have been given allowance of the source token (if not ETH)
      *

```solidity
function xConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, bytes32 _targetBlockchain, bytes32 _targetAccount, uint256 _conversionId) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path, see conversion path format above | 
| _amount | uint256 | amount to convert from, in the source token | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero | 
| _targetBlockchain | bytes32 | blockchain BNT will be issued on | 
| _targetAccount | bytes32 | address/account on the target blockchain to send the BNT to | 
| _conversionId | uint256 | pre-determined unique (if non zero) id which refers to this transaction       * | 

**Returns**

the amount of BNT received from this conversion

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function xConvert(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		bytes32 _targetBlockchain,
		bytes32 _targetAccount,
		uint256 _conversionId
	) public payable returns (uint256) {
		return xConvert2(_path, _amount, _minReturn, _targetBlockchain, _targetAccount, _conversionId, address(0), 0);
	}
```
</details>

---    

> ### xConvert2

converts any other token to BNT in the sovrynSwap network by following
a predefined conversion path and transfers the result to an account on a different blockchain
note that the network should already have been given allowance of the source token (if not ETH)
      *

```solidity
function xConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, bytes32 _targetBlockchain, bytes32 _targetAccount, uint256 _conversionId, address _affiliateAccount, uint256 _affiliateFee) public payable greaterThanZero 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path, see conversion path format above | 
| _amount | uint256 | amount to convert from, in the source token | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero | 
| _targetBlockchain | bytes32 | blockchain BNT will be issued on | 
| _targetAccount | bytes32 | address/account on the target blockchain to send the BNT to | 
| _conversionId | uint256 | pre-determined unique (if non zero) id which refers to this transaction | 
| _affiliateAccount | address | affiliate account | 
| _affiliateFee | uint256 | affiliate fee in PPM       * | 

**Returns**

the amount of BNT received from this conversion

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function xConvert2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		bytes32 _targetBlockchain,
		bytes32 _targetAccount,
		uint256 _conversionId,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public payable greaterThanZero(_minReturn) returns (uint256) {
		IERC20Token targetToken = _path[_path.length - 1];
		ISovrynSwapX sovrynSwapX = ISovrynSwapX(addressOf(SOVRYNSWAP_X));

		// verify that the destination token is BNT
		require(targetToken == addressOf(BNT_TOKEN), "ERR_INVALID_TARGET_TOKEN");

		// convert and get the resulting amount
		uint256 amount = convertByPath(_path, _amount, _minReturn, this, _affiliateAccount, _affiliateFee);

		// grant SovrynSwapX allowance
		ensureAllowance(targetToken, sovrynSwapX, amount);

		// transfer the resulting amount to SovrynSwapX
		sovrynSwapX.xTransfer(_targetBlockchain, _targetAccount, amount, _conversionId);

		return amount;
	}
```
</details>

---    

> ### completeXConversion

allows a user to convert a token that was sent from another blockchain into any other
token on the SovrynSwapNetwork
ideally this transaction is created before the previous conversion is even complete, so
so the input amount isn't known at that point - the amount is actually take from the
SovrynSwapX contract directly by specifying the conversion id
	 *

```solidity
function completeXConversion(IERC20Token[] _path, ISovrynSwapX _sovrynSwapX, uint256 _conversionId, uint256 _minReturn, address _beneficiary) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] | conversion path | 
| _sovrynSwapX | ISovrynSwapX | address of the SovrynSwapX contract for the source token | 
| _conversionId | uint256 | pre-determined unique (if non zero) id which refers to this conversion | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be nonzero | 
| _beneficiary | address | wallet to receive the conversion result 	 * | 

**Returns**

amount of tokens received from the conversion

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function completeXConversion(
		IERC20Token[] _path,
		ISovrynSwapX _sovrynSwapX,
		uint256 _conversionId,
		uint256 _minReturn,
		address _beneficiary
	) public returns (uint256) {
		// verify that the source token is the SovrynSwapX token
		require(_path[0] == _sovrynSwapX.token(), "ERR_INVALID_SOURCE_TOKEN");

		// get conversion amount from SovrynSwapX contract
		uint256 amount = _sovrynSwapX.getXTransferAmount(_conversionId, msg.sender);

		// perform the conversion
		return convertByPath(_path, amount, _minReturn, _beneficiary, address(0), 0);
	}
```
</details>

---    

> ### doConversion

executes the actual conversion by following the conversion path
	 *

```solidity
function doConversion(struct SovrynSwapNetwork.ConversionStep[] _data, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee) private nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _data | struct SovrynSwapNetwork.ConversionStep[] | conversion data, see ConversionStep struct above | 
| _amount | uint256 | amount to convert from, in the source token | 
| _minReturn | uint256 | if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero | 
| _affiliateAccount | address | affiliate account | 
| _affiliateFee | uint256 | affiliate fee in PPM 	 * | 

**Returns**

amount of tokens received from the conversion

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function doConversion(
		ConversionStep[] _data,
		uint256 _amount,
		uint256 _minReturn,
		address _affiliateAccount,
		uint256 _affiliateFee
	) private returns (uint256) {
		uint256 toAmount;
		uint256 fromAmount = _amount;

		// iterate over the conversion data
		for (uint256 i = 0; i < _data.length; i++) {
			ConversionStep memory stepData = _data[i];

			// newer converter
			if (stepData.isV28OrHigherConverter) {
				// transfer the tokens to the converter only if the network contract currently holds the tokens
				// not needed with ETH or if it's the first conversion step
				if (i != 0 && _data[i - 1].beneficiary == address(this) && !etherTokens[stepData.sourceToken])
					safeTransfer(stepData.sourceToken, stepData.converter, fromAmount);
			}
			// older converter
			// if the source token is the smart token, no need to do any transfers as the converter controls it
			else if (stepData.sourceToken != ISmartToken(stepData.anchor)) {
				// grant allowance for it to transfer the tokens from the network contract
				ensureAllowance(stepData.sourceToken, stepData.converter, fromAmount);
			}

			// do the conversion
			if (!stepData.isV28OrHigherConverter)
				toAmount = ILegacyConverter(stepData.converter).change(stepData.sourceToken, stepData.targetToken, fromAmount, 1);
			else if (etherTokens[stepData.sourceToken])
				toAmount = stepData.converter.convert.value(msg.value)(
					stepData.sourceToken,
					stepData.targetToken,
					fromAmount,
					msg.sender,
					stepData.beneficiary
				);
			else toAmount = stepData.converter.convert(stepData.sourceToken, stepData.targetToken, fromAmount, msg.sender, stepData.beneficiary);

			// pay affiliate-fee if needed
			if (stepData.processAffiliateFee) {
				uint256 affiliateAmount = toAmount.mul(_affiliateFee).div(AFFILIATE_FEE_RESOLUTION);
				require(stepData.targetToken.transfer(_affiliateAccount, affiliateAmount), "ERR_FEE_TRANSFER_FAILED");
				toAmount -= affiliateAmount;
			}

			emit Conversion(stepData.anchor, stepData.sourceToken, stepData.targetToken, fromAmount, toAmount, msg.sender);
			fromAmount = toAmount;
		}

		// ensure the trade meets the minimum requested amount
		require(toAmount >= _minReturn, "ERR_RETURN_TOO_LOW");

		return toAmount;
	}
```
</details>

---    

> ### handleSourceToken

validates msg.value and prepares the conversion source token for the conversion
	 *

```solidity
function handleSourceToken(IERC20Token _sourceToken, IConverterAnchor _anchor, uint256 _amount) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _sourceToken | IERC20Token | source token of the first conversion step | 
| _anchor | IConverterAnchor | converter anchor of the first conversion step | 
| _amount | uint256 | amount to convert from, in the source token | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function handleSourceToken(
		IERC20Token _sourceToken,
		IConverterAnchor _anchor,
		uint256 _amount
	) private {
		IConverter firstConverter = IConverter(_anchor.owner());
		bool isNewerConverter = isV28OrHigherConverter(firstConverter);

		// ETH
		if (msg.value > 0) {
			// validate msg.value
			require(msg.value == _amount, "ERR_ETH_AMOUNT_MISMATCH");

			// EtherToken converter - deposit the ETH into the EtherToken
			// note that it can still be a non ETH converter if the path is wrong
			// but such conversion will simply revert
			if (!isNewerConverter) IEtherToken(getConverterEtherTokenAddress(firstConverter)).deposit.value(msg.value)();
		}
		// EtherToken
		else if (etherTokens[_sourceToken]) {
			// claim the tokens - if the source token is ETH reserve, this call will fail
			// since in that case the transaction must be sent with msg.value
			safeTransferFrom(_sourceToken, msg.sender, this, _amount);

			// ETH converter - withdraw the ETH
			if (isNewerConverter) IEtherToken(_sourceToken).withdraw(_amount);
		}
		// other ERC20 token
		else {
			// newer converter - transfer the tokens from the sender directly to the converter
			// otherwise claim the tokens
			if (isNewerConverter) safeTransferFrom(_sourceToken, msg.sender, firstConverter, _amount);
			else safeTransferFrom(_sourceToken, msg.sender, this, _amount);
		}
	}
```
</details>

---    

> ### handleTargetToken

handles the conversion target token if the network still holds it at the end of the conversion
	 *

```solidity
function handleTargetToken(struct SovrynSwapNetwork.ConversionStep[] _data, uint256 _amount, address _beneficiary) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _data | struct SovrynSwapNetwork.ConversionStep[] | conversion data, see ConversionStep struct above | 
| _amount | uint256 | conversion target amount | 
| _beneficiary | address | wallet to receive the conversion result | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function handleTargetToken(
		ConversionStep[] _data,
		uint256 _amount,
		address _beneficiary
	) private {
		ConversionStep memory stepData = _data[_data.length - 1];

		// network contract doesn't hold the tokens, do nothing
		if (stepData.beneficiary != address(this)) return;

		IERC20Token targetToken = stepData.targetToken;

		// ETH / EtherToken
		if (etherTokens[targetToken]) {
			// newer converter should send ETH directly to the beneficiary
			assert(!stepData.isV28OrHigherConverter);

			// EtherToken converter - withdraw the ETH and transfer to the beneficiary
			IEtherToken(targetToken).withdrawTo(_beneficiary, _amount);
		}
		// other ERC20 token
		else {
			safeTransfer(targetToken, _beneficiary, _amount);
		}
	}
```
</details>

---    

> ### createConversionData

creates a memory cache of all conversion steps data to minimize logic and external calls during conversions
	 *

```solidity
function createConversionData(IERC20Token[] _conversionPath, address _beneficiary, bool _affiliateFeeEnabled) private view
returns(struct SovrynSwapNetwork.ConversionStep[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _conversionPath | IERC20Token[] | conversion path, see conversion path format above | 
| _beneficiary | address | wallet to receive the conversion result | 
| _affiliateFeeEnabled | bool | true if affiliate fee was requested by the sender, false if not 	 * | 

**Returns**

cached conversion data to be ingested later on by the conversion flow

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function createConversionData(
		IERC20Token[] _conversionPath,
		address _beneficiary,
		bool _affiliateFeeEnabled
	) private view returns (ConversionStep[]) {
		ConversionStep[] memory data = new ConversionStep[](_conversionPath.length / 2);

		bool affiliateFeeProcessed = false;
		address bntToken = addressOf(BNT_TOKEN);
		// iterate the conversion path and create the conversion data for each step
		uint256 i;
		for (i = 0; i < _conversionPath.length - 1; i += 2) {
			IConverterAnchor anchor = IConverterAnchor(_conversionPath[i + 1]);
			IConverter converter = IConverter(anchor.owner());
			IERC20Token targetToken = _conversionPath[i + 2];

			// check if the affiliate fee should be processed in this step
			bool processAffiliateFee = _affiliateFeeEnabled && !affiliateFeeProcessed && targetToken == bntToken;
			if (processAffiliateFee) affiliateFeeProcessed = true;

			data[i / 2] = ConversionStep({
				anchor: // set the converter anchor
				anchor,
				converter: // set the converter
				converter,
				sourceToken: // set the source/target tokens
				_conversionPath[i],
				targetToken: targetToken,
				beneficiary: // requires knowledge about the next step, so initialize in the next phase
				address(0),
				isV28OrHigherConverter: // set flags
				isV28OrHigherConverter(converter),
				processAffiliateFee: processAffiliateFee
			});
		}

		// ETH support
		// source is ETH
		ConversionStep memory stepData = data[0];
		if (etherTokens[stepData.sourceToken]) {
			// newer converter - replace the source token address with ETH reserve address
			if (stepData.isV28OrHigherConverter)
				stepData.sourceToken = IERC20Token(ETH_RESERVE_ADDRESS);
				// older converter - replace the source token with the EtherToken address used by the converter
			else stepData.sourceToken = IERC20Token(getConverterEtherTokenAddress(stepData.converter));
		}

		// target is ETH
		stepData = data[data.length - 1];
		if (etherTokens[stepData.targetToken]) {
			// newer converter - replace the target token address with ETH reserve address
			if (stepData.isV28OrHigherConverter)
				stepData.targetToken = IERC20Token(ETH_RESERVE_ADDRESS);
				// older converter - replace the target token with the EtherToken address used by the converter
			else stepData.targetToken = IERC20Token(getConverterEtherTokenAddress(stepData.converter));
		}

		// set the beneficiary for each step
		for (i = 0; i < data.length; i++) {
			stepData = data[i];

			// first check if the converter in this step is newer as older converters don't even support the beneficiary argument
			if (stepData.isV28OrHigherConverter) {
				// if affiliate fee is processed in this step, beneficiary is the network contract
				if (stepData.processAffiliateFee)
					stepData.beneficiary = this;
					// if it's the last step, beneficiary is the final beneficiary
				else if (i == data.length - 1)
					stepData.beneficiary = _beneficiary;
					// if the converter in the next step is newer, beneficiary is the next converter
				else if (data[i + 1].isV28OrHigherConverter)
					stepData.beneficiary = data[i + 1].converter;
					// the converter in the next step is older, beneficiary is the network contract
				else stepData.beneficiary = this;
			} else {
				// converter in this step is older, beneficiary is the network contract
				stepData.beneficiary = this;
			}
		}

		return data;
	}
```
</details>

---    

> ### ensureAllowance

utility, checks whether allowance for the given spender exists and approves one if it doesn't.
Note that we use the non standard erc-20 interface in which `approve` has no return value so that
this function will work for both standard and non standard tokens
	 *

```solidity
function ensureAllowance(IERC20Token _token, address _spender, uint256 _value) private nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | IERC20Token | token to check the allowance in | 
| _spender | address | approved address | 
| _value | uint256 | allowance amount | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function ensureAllowance(
		IERC20Token _token,
		address _spender,
		uint256 _value
	) private {
		uint256 allowance = _token.allowance(this, _spender);
		if (allowance < _value) {
			if (allowance > 0) safeApprove(_token, _spender, 0);
			safeApprove(_token, _spender, _value);
		}
	}
```
</details>

---    

> ### getConverterEtherTokenAddress

```solidity
function getConverterEtherTokenAddress(IConverter _converter) private view
returns(address)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConverterEtherTokenAddress(IConverter _converter) private view returns (address) {
		uint256 reserveCount = _converter.connectorTokenCount();
		for (uint256 i = 0; i < reserveCount; i++) {
			address reserveTokenAddress = _converter.connectorTokens(i);
			if (etherTokens[reserveTokenAddress]) return reserveTokenAddress;
		}

		return ETH_RESERVE_ADDRESS;
	}
```
</details>

---    

> ### getConverterTokenAddress

```solidity
function getConverterTokenAddress(IConverter _converter, IERC20Token _token) private view
returns(contract IERC20Token)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _converter | IConverter |  | 
| _token | IERC20Token |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getConverterTokenAddress(IConverter _converter, IERC20Token _token) private view returns (IERC20Token) {
		if (!etherTokens[_token]) return _token;

		if (isV28OrHigherConverter(_converter)) return IERC20Token(ETH_RESERVE_ADDRESS);

		return IERC20Token(getConverterEtherTokenAddress(_converter));
	}
```
</details>

---    

> ### getReturn

```solidity
function getReturn(address _dest, address _sourceToken, address _targetToken, uint256 _amount) internal view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _dest | address |  | 
| _sourceToken | address |  | 
| _targetToken | address |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReturn(
		address _dest,
		address _sourceToken,
		address _targetToken,
		uint256 _amount
	) internal view returns (uint256, uint256) {
		uint256[2] memory ret;
		bytes memory data = abi.encodeWithSelector(GET_RETURN_FUNC_SELECTOR, _sourceToken, _targetToken, _amount);

		assembly {
			let success := staticcall(
				gas, // gas remaining
				_dest, // destination address
				add(data, 32), // input buffer (starts after the first 32 bytes in the `data` array)
				mload(data), // input length (loaded from the first 32 bytes in the `data` array)
				ret, // output buffer
				64 // output length
			)
			if iszero(success) {
				revert(0, 0)
			}
		}

		return (ret[0], ret[1]);
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

---    

> ### getReturnByPath

deprecated, backward compatibility

```solidity
function getReturnByPath(IERC20Token[] _path, uint256 _amount) public view
returns(uint256, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function getReturnByPath(IERC20Token[] _path, uint256 _amount) public view returns (uint256, uint256) {
		return (rateByPath(_path, _amount), 0);
	}
```
</details>

---    

> ### convert

⤾ overrides [ISovrynSwapNetwork.convert](ISovrynSwapNetwork.md#.convert)

⤿ Overridden Implementation(s): [SovrynSwapNetworkMockup.convert](SovrynSwapNetworkMockup.md#convert)

deprecated, backward compatibility

```solidity
function convert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convert(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn
	) public payable returns (uint256) {
		return convertByPath(_path, _amount, _minReturn, address(0), address(0), 0);
	}
```
</details>

---    

> ### convert2

⤾ overrides [ISovrynSwapNetwork.convert2](ISovrynSwapNetwork.md#.convert2)

deprecated, backward compatibility

```solidity
function convert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convert2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public payable returns (uint256) {
		return convertByPath(_path, _amount, _minReturn, address(0), _affiliateAccount, _affiliateFee);
	}
```
</details>

---    

> ### convertFor

⤾ overrides [ISovrynSwapNetwork.convertFor](ISovrynSwapNetwork.md#.convertfor)

deprecated, backward compatibility

```solidity
function convertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary) public payable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _beneficiary | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convertFor(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _beneficiary
	) public payable returns (uint256) {
		return convertByPath(_path, _amount, _minReturn, _beneficiary, address(0), 0);
	}
```
</details>

---    

> ### convertFor2

⤾ overrides [ISovrynSwapNetwork.convertFor2](ISovrynSwapNetwork.md#.convertfor2)

deprecated, backward compatibility

```solidity
function convertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee) public payable greaterThanZero 
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _beneficiary | address |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function convertFor2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _beneficiary,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public payable greaterThanZero(_minReturn) returns (uint256) {
		return convertByPath(_path, _amount, _minReturn, _beneficiary, _affiliateAccount, _affiliateFee);
	}
```
</details>

---    

> ### claimAndConvert

⤾ overrides [ISovrynSwapNetwork.claimAndConvert](ISovrynSwapNetwork.md#.claimandconvert)

deprecated, backward compatibility

```solidity
function claimAndConvert(IERC20Token[] _path, uint256 _amount, uint256 _minReturn) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimAndConvert(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn
	) public returns (uint256) {
		return convertByPath(_path, _amount, _minReturn, address(0), address(0), 0);
	}
```
</details>

---    

> ### claimAndConvert2

⤾ overrides [ISovrynSwapNetwork.claimAndConvert2](ISovrynSwapNetwork.md#.claimandconvert2)

deprecated, backward compatibility

```solidity
function claimAndConvert2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _affiliateAccount, uint256 _affiliateFee) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimAndConvert2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public returns (uint256) {
		return convertByPath(_path, _amount, _minReturn, address(0), _affiliateAccount, _affiliateFee);
	}
```
</details>

---    

> ### claimAndConvertFor

⤾ overrides [ISovrynSwapNetwork.claimAndConvertFor](ISovrynSwapNetwork.md#.claimandconvertfor)

deprecated, backward compatibility

```solidity
function claimAndConvertFor(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _beneficiary | address |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimAndConvertFor(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _beneficiary
	) public returns (uint256) {
		return convertByPath(_path, _amount, _minReturn, _beneficiary, address(0), 0);
	}
```
</details>

---    

> ### claimAndConvertFor2

⤾ overrides [ISovrynSwapNetwork.claimAndConvertFor2](ISovrynSwapNetwork.md#.claimandconvertfor2)

deprecated, backward compatibility

```solidity
function claimAndConvertFor2(IERC20Token[] _path, uint256 _amount, uint256 _minReturn, address _beneficiary, address _affiliateAccount, uint256 _affiliateFee) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _path | IERC20Token[] |  | 
| _amount | uint256 |  | 
| _minReturn | uint256 |  | 
| _beneficiary | address |  | 
| _affiliateAccount | address |  | 
| _affiliateFee | uint256 |  | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function claimAndConvertFor2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _beneficiary,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public returns (uint256) {
		return convertByPath(_path, _amount, _minReturn, _beneficiary, _affiliateAccount, _affiliateFee);
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
