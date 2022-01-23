# PoolTokensContainer.sol

View Source: [contracts/converter/types/liquidity-pool-v2/PoolTokensContainer.sol](../solidity/contracts/converter/types/liquidity-pool-v2/PoolTokensContainer.sol)

**↗ Extends: [IPoolTokensContainer](IPoolTokensContainer.md), [Owned](Owned.md), [TokenHolder](TokenHolder.md)**

**PoolTokensContainer**

The PoolTokensContainer contract serves as a container for multiple pool tokens.

It is used by specific liquidity pool types that require more than a single pool token,

while still maintaining the single converter / anchor relationship.

  * It maintains and provides a list of the underlying pool tokens.

## Contract Members
**Constants & Variables**

```js
//internal members
uint8 internal constant MAX_POOL_TOKENS;

//public members
string public name;
string public symbol;
uint8 public decimals;

//private members
contract ISmartToken[] private _poolTokens;

```

## Functions

- [poolTokens()](#pooltokens)
- [createToken()](#createtoken)
- [mint(ISmartToken _token, address _to, uint256 _amount)](#mint)
- [burn(ISmartToken _token, address _from, uint256 _amount)](#burn)
- [concatStrDigit(string _str, uint8 _digit)](#concatstrdigit)

---    

> ### poolTokens

⤾ overrides [IPoolTokensContainer.poolTokens](IPoolTokensContainer.md#.pooltokens)

returns the list of pool tokens

      *

```solidity
function poolTokens() public view
returns(contract ISmartToken[])
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function poolTokens() public view returns (ISmartToken[] memory) {

        return _poolTokens;

    }
```
</details>

---    

> ### createToken

⤾ overrides [IPoolTokensContainer.createToken](IPoolTokensContainer.md#.createtoken)

creates a new pool token and adds it to the list

      *

```solidity
function createToken() public nonpayable ownerOnly 
returns(contract ISmartToken)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function createToken() public ownerOnly returns (ISmartToken) {

        // verify that the max limit wasn't reached

        require(_poolTokens.length < MAX_POOL_TOKENS, "ERR_MAX_LIMIT_REACHED");

        string memory poolName = concatStrDigit(name, uint8(_poolTokens.length + 1));

        string memory poolSymbol = concatStrDigit(symbol, uint8(_poolTokens.length + 1));

        SmartToken token = new SmartToken(poolName, poolSymbol, decimals);

        _poolTokens.push(token);

        return token;

    }
```
</details>

---    

> ### mint

⤾ overrides [IPoolTokensContainer.mint](IPoolTokensContainer.md#.mint)

increases the pool token supply and sends the new tokens to the given account

can only be called by the contract owner

      *

```solidity
function mint(ISmartToken _token, address _to, uint256 _amount) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | ISmartToken | pool token address | 
| _to | address | ken   pool token address | 
| _amount | uint256 | amount to mint | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function mint(ISmartToken _token, address _to, uint256 _amount) public ownerOnly {

        _token.issue(_to, _amount);

    }
```
</details>

---    

> ### burn

⤾ overrides [IPoolTokensContainer.burn](IPoolTokensContainer.md#.burn)

removes tokens from the given account and decreases the pool token supply

can only be called by the contract owner

      *

```solidity
function burn(ISmartToken _token, address _from, uint256 _amount) public nonpayable ownerOnly 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token | ISmartToken | pool token address | 
| _from | address | account to remove the tokens from | 
| _amount | uint256 | amount to burn | 

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function burn(ISmartToken _token, address _from, uint256 _amount) public ownerOnly {

        _token.destroy(_from, _amount);

    }
```
</details>

---    

> ### concatStrDigit

concatenates a string and a digit (single only) and returns the result string

      *

```solidity
function concatStrDigit(string _str, uint8 _digit) private pure
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _str | string | string | 
| _digit | uint8 | digit | 

**Returns**

concatenated string

<details>
	<summary><strong>Source Code</strong></summary>

```javascript
function concatStrDigit(string _str, uint8 _digit) private pure returns (string) {

        return string(abi.encodePacked(_str, uint8(bytes1("0")) + _digit));

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
