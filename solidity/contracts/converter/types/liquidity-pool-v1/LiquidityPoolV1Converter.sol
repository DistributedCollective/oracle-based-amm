pragma solidity 0.4.26;
import "../../LiquidityPoolConverter.sol";
import "../../../token/interfaces/ISmartToken.sol";
import "../../../utility/EnumerableSet.sol";

/**
  * @dev Liquidity Pool v1 Converter
  *
  * The liquidity pool v1 converter is a specialized version of a converter that manages
  * a classic SovrynSwap liquidity pool.
  *
  * Even though classic pools can have many reserves, the most common configuration of
  * the pool has 2 reserves with 50%/50% weights.
*/
contract LiquidityPoolV1Converter is LiquidityPoolConverter {
    using EnumerableBytes32Set for EnumerableBytes32Set.Bytes32Set;

    IEtherToken internal etherToken = IEtherToken(0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315);

    struct Observation {
        bytes32 id;
        uint256 blockNumber;
		uint256 timestamp;
        uint256 ema0;
		uint256 ema1;
		uint256 lastCumulativePrice0;
	    uint256 lastCumulativePrice1;
    }

    uint256 public k;
    mapping(bytes32 => Observation) public observations; //id -> observations
    EnumerableBytes32Set.Bytes32Set internal observationsSet; //contains all id

    /**
      * @dev triggered after a conversion with new price data
      * deprecated, use `TokenRateUpdate` from version 28 and up
      *
      * @param  _connectorToken     reserve token
      * @param  _tokenSupply        smart token supply
      * @param  _connectorBalance   reserve balance
      * @param  _connectorWeight    reserve weight
    */
    event PriceDataUpdate(
        address indexed _connectorToken,
        uint256 _tokenSupply,
        uint256 _connectorBalance,
        uint32 _connectorWeight
    );

    event KValueUpdate(
        uint256 _k
    );

    /**
      * @dev initializes a new LiquidityPoolV1Converter instance
      *
      * @param  _token              pool token governed by the converter
      * @param  _registry           address of a contract registry contract
      * @param  _maxConversionFee   maximum conversion fee, represented in ppm
    */
    constructor(
        ISmartToken _token,
        IContractRegistry _registry,
        uint32 _maxConversionFee
    )
        public
        LiquidityPoolConverter(_token, _registry, _maxConversionFee)
    {
    }

    /**
      * @dev returns the converter type
      *
      * @return see the converter types in the the main contract doc
    */
    function converterType() public pure returns (uint16) {
        return 1;
    }

    /**
      * @dev accepts ownership of the anchor after an ownership transfer
      * also activates the converter
      * can only be called by the contract owner
      * note that prior to version 28, you should use 'acceptTokenOwnership' instead
    */
    function acceptAnchorOwnership() public ownerOnly {
        super.acceptAnchorOwnership();

        emit Activation(converterType(), anchor, true);
    }

    /**
      * @dev defines a new reserve token for the converter
      * can only be called by the owner while the converter is inactive and
      * 2 reserves aren't defined yet
      *
      * @param _token   address of the reserve token
      * @param  _weight  reserve weight, represented in ppm, 1-1000000
    */
    function addReserve(IERC20Token _token, uint32 _weight) public {
        // verify that the converter doesn't have 2 reserves yet
        require(reserveTokenCount() < 2, "ERR_INVALID_RESERVE_COUNT");
        super.addReserve(_token, _weight);
    }

    function setK(uint256 _k) public ownerOnly {
        //only owner check
        require(_k != 0 && _k < 100, "ERR_INVALID_K_VALUE");
        k = _k;
        emit KValueUpdate(_k);
    }

    function _write() internal {
        uint256 totalObservations = observationsSet.length();

        //handle initial observation
        if(totalObservations == 0) {
            _addInitialEMA();
            return;
        }

        bytes32 previousObservationId = keccak256(abi.encodePacked(totalObservations-1));
        Observation storage previousObservation = observations[previousObservationId];

        //return if same block number
        if (previousObservation.blockNumber == block.timestamp) return;

        //write new entry
        bytes32 id = keccak256(abi.encodePacked(totalObservations));
		uint256 price0 = (reserves[reserveTokens[1]].balance)
            .mul(1e18)
            .div(reserves[reserveTokens[0]].balance);

		uint256 price1 = (reserves[reserveTokens[0]].balance)
            .mul(1e18)
            .div(reserves[reserveTokens[1]].balance);

		Observation memory observation = observations[id];
			
		observation.id = id;
		observation.ema0 = k * price0 + (1 - k) * (previousObservation.lastCumulativePrice0);
		observation.ema1 = k * price1 + (1 - k) * (previousObservation.lastCumulativePrice1);
		observation.blockNumber = block.number;
		observation.timestamp = block.timestamp;
		observation.lastCumulativePrice0 = price0;
		observation.lastCumulativePrice1 = price1;
			
		observationsSet.addBytes32(id);
	}

    //to be called with initial liquidity addition
    function _addInitialEMA() internal {
        bytes32 id = keccak256(abi.encodePacked(uint256(0)));
		uint256 price0 = (reserves[reserveTokens[1]].balance)
            .mul(1e18)
            .div(reserves[reserveTokens[0]].balance);

		uint256 price1 = (reserves[reserveTokens[0]].balance)
            .mul(1e18)
            .div(reserves[reserveTokens[1]].balance);

		Observation memory observation = observations[id];
			
		observation.id = id;
		observation.ema0 = 0;
		observation.ema1 = 0;
		observation.blockNumber = block.number;
		observation.timestamp = block.timestamp;
		observation.lastCumulativePrice0 = price0;
		observation.lastCumulativePrice1 = price1;

		observationsSet.addBytes32(id);
    }

    /**
      * @dev returns the expected target amount of converting one reserve to another along with the fee
      *
      * @param _sourceToken contract address of the source reserve token
      * @param _targetToken contract address of the target reserve token
      * @param _amount      amount of tokens received from the user
      *
      * @return expected target amount
      * @return expected fee
    */
    function targetAmountAndFee(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount)
        public
        view
        active
        validReserve(_sourceToken)
        validReserve(_targetToken)
        returns (uint256, uint256)
    {
        // validate input
        require(_sourceToken != _targetToken, "ERR_SAME_SOURCE_TARGET");

        uint256 amount = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA)).crossReserveTargetAmount(
            reserveBalance(_sourceToken),
            reserves[_sourceToken].weight,
            reserveBalance(_targetToken),
            reserves[_targetToken].weight,
            _amount
        );

        // return the amount minus the conversion fee and the conversion fee
        uint256 fee = calculateFee(amount);
        return (amount - fee, fee);
    }

    /**
      * @dev converts a specific amount of source tokens to target tokens
      * can only be called by the SovrynSwap network contract
      *
      * @param _sourceToken source ERC20 token
      * @param _targetToken target ERC20 token
      * @param _amount      amount of tokens to convert (in units of the source token)
      * @param _trader      address of the caller who executed the conversion
      * @param _beneficiary wallet to receive the conversion result
      *
      * @return amount of tokens received (in units of the target token)
    */
    function doConvert(IERC20Token _sourceToken, IERC20Token _targetToken, uint256 _amount, address _trader, address _beneficiary)
        internal
        returns (uint256)
    {
        // get expected target amount and fee
        (uint256 amount, uint256 fee) = targetAmountAndFee(_sourceToken, _targetToken, _amount);

        // ensure that the trade gives something in return
        require(amount != 0, "ERR_ZERO_TARGET_AMOUNT");

        // ensure that the trade won't deplete the reserve balance
        uint256 targetReserveBalance = reserveBalance(_targetToken);
        assert(amount < targetReserveBalance);

        // ensure that the input amount was already deposited
        if (_sourceToken == ETH_RESERVE_ADDRESS)
            require(msg.value == _amount, "ERR_ETH_AMOUNT_MISMATCH");
        else
            require(msg.value == 0 && _sourceToken.balanceOf(this).sub(reserveBalance(_sourceToken)) >= _amount, "ERR_INVALID_AMOUNT");

        // sync the reserve balances
        syncReserveBalance(_sourceToken);
        reserves[_targetToken].balance = reserves[_targetToken].balance.sub(amount);

        // transfer funds to the beneficiary in the to reserve token
        if (_targetToken == ETH_RESERVE_ADDRESS)
            _beneficiary.transfer(amount);
        else
            safeTransfer(_targetToken, _beneficiary, amount);

        // dispatch the conversion event
        dispatchConversionEvent(_sourceToken, _targetToken, _trader, _amount, amount, fee);

        // dispatch rate updates
        dispatchRateEvents(_sourceToken, _targetToken);

        //Oracle observations
        _write();

        return amount;
    }

    /**
      * @dev increases the pool's liquidity and mints new shares in the pool to the caller
      * note that prior to version 28, you should use 'fund' instead
      *
      * @param _reserveTokens   address of each reserve token
      * @param _reserveAmounts  amount of each reserve token
      * @param _minReturn       token minimum return-amount
    */
    function addLiquidity(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts, uint256 _minReturn)
        public
        payable
        protected
        active
    {
        // verify the user input
        verifyLiquidityInput(_reserveTokens, _reserveAmounts, _minReturn);

        // if one of the reserves is ETH, then verify that the input amount of ETH is equal to the input value of ETH
        for (uint256 i = 0; i < _reserveTokens.length; i++)
            if (_reserveTokens[i] == ETH_RESERVE_ADDRESS)
                require(_reserveAmounts[i] == msg.value, "ERR_ETH_AMOUNT_MISMATCH");

        // if the input value of ETH is larger than zero, then verify that one of the reserves is ETH
        if (msg.value > 0)
            require(reserves[ETH_RESERVE_ADDRESS].isSet, "ERR_NO_ETH_RESERVE");

        // get the total supply
        uint256 totalSupply = ISmartToken(anchor).totalSupply();

        // transfer from the user an equally-worth amount of each one of the reserve tokens
        uint256 amount = addLiquidityToPool(_reserveTokens, _reserveAmounts, totalSupply);

        // verify that the equivalent amount of tokens is equal to or larger than the user's expectation
        require(amount >= _minReturn, "ERR_RETURN_TOO_LOW");

        // issue the tokens to the user
        ISmartToken(anchor).issue(msg.sender, amount);

        //Oracle observations
        _write();
    }

    /**
      * @dev decreases the pool's liquidity and burns the caller's shares in the pool
      * note that prior to version 28, you should use 'liquidate' instead
      *
      * @param _amount                  token amount
      * @param _reserveTokens           address of each reserve token
      * @param _reserveMinReturnAmounts minimum return-amount of each reserve token
    */
    function removeLiquidity(uint256 _amount, IERC20Token[] memory _reserveTokens, uint256[] memory _reserveMinReturnAmounts)
        public
        protected
        active
    {
        // verify the user input
        verifyLiquidityInput(_reserveTokens, _reserveMinReturnAmounts, _amount);

        // get the total supply BEFORE destroying the user tokens
        uint256 totalSupply = ISmartToken(anchor).totalSupply();

        // destroy the user tokens
        ISmartToken(anchor).destroy(msg.sender, _amount);

        // transfer to the user an equivalent amount of each one of the reserve tokens
        removeLiquidityFromPool(_reserveTokens, _reserveMinReturnAmounts, totalSupply, _amount);

        _write();
    }

    /**
      * @dev increases the pool's liquidity and mints new shares in the pool to the caller
      * for example, if the caller increases the supply by 10%,
      * then it will cost an amount equal to 10% of each reserve token balance
      * note that starting from version 28, you should use 'addLiquidity' instead
      *
      * @param _amount  amount to increase the supply by (in the pool token)
    */
    function fund(uint256 _amount) public payable protected {
        syncReserveBalances();
        reserves[ETH_RESERVE_ADDRESS].balance = reserves[ETH_RESERVE_ADDRESS].balance.sub(msg.value);

        uint256 supply = ISmartToken(anchor).totalSupply();
        ISovrynSwapFormula formula = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA));

        // iterate through the reserve tokens and transfer a percentage equal to the weight between
        // _amount and the total supply in each reserve from the caller to the converter
        uint256 reserveCount = reserveTokens.length;
        for (uint256 i = 0; i < reserveCount; i++) {
            IERC20Token reserveToken = reserveTokens[i];
            uint256 rsvBalance = reserves[reserveToken].balance;
            uint256 reserveAmount = formula.fundCost(supply, rsvBalance, reserveRatio, _amount);

            // transfer funds from the caller in the reserve token
            if (reserveToken == ETH_RESERVE_ADDRESS) {
                if (msg.value > reserveAmount) {
                    msg.sender.transfer(msg.value - reserveAmount);
                }
                else if (msg.value < reserveAmount) {
                    require(msg.value == 0, "ERR_INVALID_ETH_VALUE");
                    safeTransferFrom(etherToken, msg.sender, this, reserveAmount);
                    etherToken.withdraw(reserveAmount);
                }
            }
            else {
                safeTransferFrom(reserveToken, msg.sender, this, reserveAmount);
            }

            // sync the reserve balance
            uint256 newReserveBalance = rsvBalance.add(reserveAmount);
            reserves[reserveToken].balance = newReserveBalance;

            uint256 newPoolTokenSupply = supply.add(_amount);

            // dispatch liquidity update for the pool token/reserve
            emit LiquidityAdded(msg.sender, reserveToken, reserveAmount, newReserveBalance, newPoolTokenSupply);

            // dispatch the `TokenRateUpdate` event for the pool token
            uint32 reserveWeight = reserves[reserveToken].weight;
            dispatchPoolTokenRateEvent(newPoolTokenSupply, reserveToken, newReserveBalance, reserveWeight);
        }

        // issue new funds to the caller in the pool token
        ISmartToken(anchor).issue(msg.sender, _amount);

        //Oracle observations
        _write();
    }

    /**
      * @dev decreases the pool's liquidity and burns the caller's shares in the pool
      * for example, if the holder sells 10% of the supply,
      * then they will receive 10% of each reserve token balance in return
      * note that starting from version 28, you should use 'removeLiquidity' instead
      *
      * @param _amount  amount to liquidate (in the pool token)
    */
    function liquidate(uint256 _amount) public protected {
        require(_amount > 0, "ERR_ZERO_AMOUNT");

        uint256 totalSupply = ISmartToken(anchor).totalSupply();
        ISmartToken(anchor).destroy(msg.sender, _amount);

        uint256[] memory reserveMinReturnAmounts = new uint256[](reserveTokens.length);
        for (uint256 i = 0; i < reserveMinReturnAmounts.length; i++)
            reserveMinReturnAmounts[i] = 1;

        removeLiquidityFromPool(reserveTokens, reserveMinReturnAmounts, totalSupply, _amount);
    }

    /**
      * @dev verifies that a given array of tokens is identical to the converter's array of reserve tokens
      * we take this input in order to allow specifying the corresponding reserve amounts in any order
      *
      * @param _reserveTokens   array of reserve tokens
      * @param _reserveAmounts  array of reserve amounts
      * @param _amount          token amount
    */
    function verifyLiquidityInput(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts, uint256 _amount) private view {
        uint256 i;
        uint256 j;

        uint256 length = reserveTokens.length;
        require(length == _reserveTokens.length, "ERR_INVALID_RESERVE");
        require(length == _reserveAmounts.length, "ERR_INVALID_AMOUNT");

        for (i = 0; i < length; i++) {
            // verify that every input reserve token is included in the reserve tokens
            require(reserves[_reserveTokens[i]].isSet, "ERR_INVALID_RESERVE");
            for (j = 0; j < length; j++) {
                if (reserveTokens[i] == _reserveTokens[j])
                    break;
            }
            // verify that every reserve token is included in the input reserve tokens
            require(j < length, "ERR_INVALID_RESERVE");
            // verify that every input reserve token amount is larger than zero
            require(_reserveAmounts[i] > 0, "ERR_INVALID_AMOUNT");
        }

        // verify that the input token amount is larger than zero
        require(_amount > 0, "ERR_ZERO_AMOUNT");
    }

    /**
      * @dev adds liquidity (reserve) to the pool
      *
      * @param _reserveTokens   address of each reserve token
      * @param _reserveAmounts  amount of each reserve token
      * @param _totalSupply     token total supply
    */
    function addLiquidityToPool(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts, uint256 _totalSupply)
        private
        returns (uint256)
    {
        if (_totalSupply == 0)
            return addLiquidityToEmptyPool(_reserveTokens, _reserveAmounts);
        return addLiquidityToNonEmptyPool(_reserveTokens, _reserveAmounts, _totalSupply);
    }

    /**
      * @dev adds liquidity (reserve) to the pool when it's empty
      *
      * @param _reserveTokens   address of each reserve token
      * @param _reserveAmounts  amount of each reserve token
    */
    function addLiquidityToEmptyPool(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts)
        private
        returns (uint256)
    {
        // calculate the geometric-mean of the reserve amounts approved by the user
        uint256 amount = geometricMean(_reserveAmounts);

        // transfer each one of the reserve amounts from the user to the pool
        for (uint256 i = 0; i < _reserveTokens.length; i++) {
            if (_reserveTokens[i] != ETH_RESERVE_ADDRESS) // ETH has already been transferred as part of the transaction
                safeTransferFrom(_reserveTokens[i], msg.sender, this, _reserveAmounts[i]);

            reserves[_reserveTokens[i]].balance = _reserveAmounts[i];

            emit LiquidityAdded(msg.sender, _reserveTokens[i], _reserveAmounts[i], _reserveAmounts[i], amount);

            // dispatch the `TokenRateUpdate` event for the pool token
            uint32 reserveWeight = reserves[_reserveTokens[i]].weight;
            dispatchPoolTokenRateEvent(amount, _reserveTokens[i], _reserveAmounts[i], reserveWeight);
        }

        return amount;
    }

    /**
      * @dev adds liquidity (reserve) to the pool when it's not empty
      *
      * @param _reserveTokens   address of each reserve token
      * @param _reserveAmounts  amount of each reserve token
      * @param _totalSupply     token total supply
    */
    function addLiquidityToNonEmptyPool(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts, uint256 _totalSupply)
        private
        returns (uint256)
    {
        syncReserveBalances();
        reserves[ETH_RESERVE_ADDRESS].balance = reserves[ETH_RESERVE_ADDRESS].balance.sub(msg.value);

        ISovrynSwapFormula formula = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA));
        uint256 amount = getMinShare(formula, _totalSupply, _reserveTokens, _reserveAmounts);
        uint256 newPoolTokenSupply = _totalSupply.add(amount);

        for (uint256 i = 0; i < _reserveTokens.length; i++) {
            IERC20Token reserveToken = _reserveTokens[i];
            uint256 rsvBalance = reserves[reserveToken].balance;
            uint256 reserveAmount = formula.fundCost(_totalSupply, rsvBalance, reserveRatio, amount);
            require(reserveAmount > 0, "ERR_ZERO_TARGET_AMOUNT");
            assert(reserveAmount <= _reserveAmounts[i]);

            // transfer each one of the reserve amounts from the user to the pool
            if (reserveToken != ETH_RESERVE_ADDRESS) // ETH has already been transferred as part of the transaction
                safeTransferFrom(reserveToken, msg.sender, this, reserveAmount);
            else if (_reserveAmounts[i] > reserveAmount) // transfer the extra amount of ETH back to the user
                msg.sender.transfer(_reserveAmounts[i] - reserveAmount);

            uint256 newReserveBalance = rsvBalance.add(reserveAmount);
            reserves[reserveToken].balance = newReserveBalance;

            emit LiquidityAdded(msg.sender, reserveToken, reserveAmount, newReserveBalance, newPoolTokenSupply);

            // dispatch the `TokenRateUpdate` event for the pool token
            uint32 reserveWeight = reserves[_reserveTokens[i]].weight;
            dispatchPoolTokenRateEvent(newPoolTokenSupply, _reserveTokens[i], newReserveBalance, reserveWeight);
        }

        return amount;
    }

    /**
      * @dev removes liquidity (reserve) from the pool
      *
      * @param _reserveTokens           address of each reserve token
      * @param _reserveMinReturnAmounts minimum return-amount of each reserve token
      * @param _totalSupply             token total supply
      * @param _amount                  token amount
    */
    function removeLiquidityFromPool(IERC20Token[] memory _reserveTokens, uint256[] memory _reserveMinReturnAmounts, uint256 _totalSupply, uint256 _amount)
        private
    {
        syncReserveBalances();

        ISovrynSwapFormula formula = ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA));
        uint256 newPoolTokenSupply = _totalSupply.sub(_amount);

        for (uint256 i = 0; i < _reserveTokens.length; i++) {
            IERC20Token reserveToken = _reserveTokens[i];
            uint256 rsvBalance = reserves[reserveToken].balance;
            uint256 reserveAmount = formula.liquidateReserveAmount(_totalSupply, rsvBalance, reserveRatio, _amount);
            require(reserveAmount >= _reserveMinReturnAmounts[i], "ERR_ZERO_TARGET_AMOUNT");

            uint256 newReserveBalance = rsvBalance.sub(reserveAmount);
            reserves[reserveToken].balance = newReserveBalance;

            // transfer each one of the reserve amounts from the pool to the user
            if (reserveToken == ETH_RESERVE_ADDRESS)
                msg.sender.transfer(reserveAmount);
            else
                safeTransfer(reserveToken, msg.sender, reserveAmount);

            emit LiquidityRemoved(msg.sender, reserveToken, reserveAmount, newReserveBalance, newPoolTokenSupply);

            // dispatch the `TokenRateUpdate` event for the pool token
            uint32 reserveWeight = reserves[reserveToken].weight;
            dispatchPoolTokenRateEvent(newPoolTokenSupply, reserveToken, newReserveBalance, reserveWeight);
        }

        //Oracle observations
        _write();
    }

    function getMinShare(ISovrynSwapFormula formula, uint256 _totalSupply, IERC20Token[] memory _reserveTokens, uint256[] memory _reserveAmounts) private view returns (uint256) {
        uint256 minIndex = 0;
        for (uint256 i = 1; i < _reserveTokens.length; i++) {
            if (_reserveAmounts[i].mul(reserves[_reserveTokens[minIndex]].balance) < _reserveAmounts[minIndex].mul(reserves[_reserveTokens[i]].balance))
                minIndex = i;
        }
        return formula.fundSupplyAmount(_totalSupply, reserves[_reserveTokens[minIndex]].balance, reserveRatio, _reserveAmounts[minIndex]);
    }

    /**
      * @dev calculates the number of decimal digits in a given value
      *
      * @param _x   value (assumed positive)
      * @return the number of decimal digits in the given value
    */
    function decimalLength(uint256 _x) public pure returns (uint256) {
        uint256 y = 0;
        for (uint256 x = _x; x > 0; x /= 10)
            y++;
        return y;
    }

    /**
      * @dev calculates the nearest integer to a given quotient
      *
      * @param _n   quotient numerator
      * @param _d   quotient denominator
      * @return the nearest integer to the given quotient
    */
    function roundDiv(uint256 _n, uint256 _d) public pure returns (uint256) {
        return (_n + _d / 2) / _d;
    }

    /**
      * @dev calculates the average number of decimal digits in a given list of values
      *
      * @param _values  list of values (each of which assumed positive)
      * @return the average number of decimal digits in the given list of values
    */
    function geometricMean(uint256[] memory _values) public pure returns (uint256) {
        uint256 numOfDigits = 0;
        uint256 length = _values.length;
        for (uint256 i = 0; i < length; i++)
            numOfDigits += decimalLength(_values[i]);
        return uint256(10) ** (roundDiv(numOfDigits, length) - 1);
    }

     /**
      * @dev dispatches rate events for both reserves / pool tokens
      * only used to circumvent the `stack too deep` compiler error
      *
      * @param _sourceToken address of the source reserve token
      * @param _targetToken address of the target reserve token
    */
    function dispatchRateEvents(IERC20Token _sourceToken, IERC20Token _targetToken) private {
        uint256 poolTokenSupply = ISmartToken(anchor).totalSupply();
        uint256 sourceReserveBalance = reserveBalance(_sourceToken);
        uint256 targetReserveBalance = reserveBalance(_targetToken);
        uint32 sourceReserveWeight = reserves[_sourceToken].weight;
        uint32 targetReserveWeight = reserves[_targetToken].weight;

        // dispatch token rate update event
        uint256 rateN = targetReserveBalance.mul(sourceReserveWeight);
        uint256 rateD = sourceReserveBalance.mul(targetReserveWeight);
        emit TokenRateUpdate(_sourceToken, _targetToken, rateN, rateD);

        // dispatch the `TokenRateUpdate` event for the pool token
        dispatchPoolTokenRateEvent(poolTokenSupply, _sourceToken, sourceReserveBalance, sourceReserveWeight);
        dispatchPoolTokenRateEvent(poolTokenSupply, _targetToken, targetReserveBalance, targetReserveWeight);

        // dispatch price data update events (deprecated events)
        emit PriceDataUpdate(_sourceToken, poolTokenSupply, sourceReserveBalance, sourceReserveWeight);
        emit PriceDataUpdate(_targetToken, poolTokenSupply, targetReserveBalance, targetReserveWeight);
    }

    /**
      * @dev dispatches the `TokenRateUpdate` for the pool token
      * only used to circumvent the `stack too deep` compiler error
      *
      * @param _poolTokenSupply total pool token supply
      * @param _reserveToken    address of the reserve token
      * @param _reserveBalance  reserve balance
      * @param _reserveWeight   reserve weight
    */
    function dispatchPoolTokenRateEvent(uint256 _poolTokenSupply, IERC20Token _reserveToken, uint256 _reserveBalance, uint32 _reserveWeight) private {
        emit TokenRateUpdate(anchor, _reserveToken, _reserveBalance.mul(WEIGHT_RESOLUTION), _poolTokenSupply.mul(_reserveWeight));
    }
}
