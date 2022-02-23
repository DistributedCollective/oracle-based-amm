pragma solidity 0.5.16;

import "./openzeppelin/Address.sol";
import "./openzeppelin/SafeMath.sol";
import "./interfaces/ILiquidityPoolV1Converter.sol";
import "./interfaces/ILiquidityPoolV2Converter.sol";
import "./interfaces/ISmartToken.sol";
import "./interfaces/IERC20Token.sol";
import "./interfaces/IWrbtcERC20.sol";
import "./interfaces/ISovrynSwapNetwork.sol";
import "./interfaces/ISovrynSwapFormula.sol";
import "./interfaces/IContractRegistry.sol";
import "./ContractRegistryClient.sol";
import "./mockups/LiquidityMining.sol";
import "./interfaces/ILoanToken.sol";

contract RBTCWrapperProxy is ContractRegistryClient {
    
    using Address for address;
    using SafeMath for uint256;

    address public wrbtcTokenAddress;
    address public sovrynSwapNetworkAddress;
    LiquidityMining public liquidityMiningContract;
    
    /**
     * @dev triggered after liquidity is added
     *
     * @param  _provider           liquidity provider
     * @param  _reserveAmount      provided reserve token amount
     * @param  _poolTokenAmount    minted pool token amount
     */
    event LiquidityAdded(
        address indexed _provider,
        uint256 _reserveAmount,
        uint256 _poolTokenAmount
    );

    /**
     * @dev triggered after liquidity is added to LiquidityPoolConverter V1
     *
     * @param  _provider           liquidity provider
     * @param  _reserveTokens      provided reserve token
     * @param  _reserveAmounts      provided reserve token amount
     * @param  _poolTokenAmount    minted pool token amount
     */
    event LiquidityAddedToV1(
        address indexed _provider,
        IERC20Token[] _reserveTokens, 
        uint256[] _reserveAmounts, 
        uint256 _poolTokenAmount
    );

    /**
     * @dev triggered after liquidity is removed
     *
     * @param  _provider           liquidity provider
     * @param  _reserveAmount      added reserve token amount
     * @param  _poolTokenAmount    burned pool token amount
     */
    event LiquidityRemoved(
        address indexed _provider,
        uint256 _reserveAmount,
        uint256 _poolTokenAmount
    );

    /**
     * @dev triggered after liquidity is removed from LiquidityPoolConverter V1
     *
     * @param  _provider          liquidity provider
     * @param  _reserveTokens     added reserve tokens
     * @param  _reserveAmounts    added reserve token amounts
     * @param  _poolTokenAmount    burned pool token amount
     */
    event LiquidityRemovedFromV1(
        address indexed _provider,
        IERC20Token[] _reserveTokens,
        uint256[] _reserveAmounts,
        uint256 _poolTokenAmount
    );

    /**
     * @dev triggered after liquidity is removed
     *
     * @param _beneficiary          account that will receive the conversion result or 0x0 to send the result to the sender account
     * @param _sourceTokenAmount    amount to convert from, in the source token
     * @param _targetTokenAmount    amount of tokens received from the conversion, in the target token
     * @param _path                 conversion path between two tokens in the network
     */
    event TokenConverted(
        address indexed _beneficiary,
        uint256 indexed _sourceTokenAmount,
        uint256 indexed _targetTokenAmount,
        IERC20Token[] _path
    );

    /**
     * @dev triggered after loan tokens are minted
     * @param user the user address
     * @param poolTokenAmount the minted amount of pool tokens
     * @param assetAmount the deposited amount of underlying asset tokens 
     */
    event LoanTokensMinted(
        address indexed user,
        uint256 poolTokenAmount,
        uint256 assetAmount
    );

    /**
     * @dev triggered after loan tokens are minted
     * @param user the user address
     * @param poolTokenAmount the burnt amount of pool tokens
     * @param assetAmount the withdrawn amount of underlying asset tokens 
     */
    event LoanTokensBurnt(
        address indexed user,
        uint256 poolTokenAmount,
        uint256 assetAmount
    );

    /**
     * @dev To check if ddress is contract address 
     */
    modifier checkAddress(address address_) {
        require(address_.isContract(), "The address is not a contract");
        _;
    }
    
    constructor(
        address _wrbtcTokenAddress, 
        address _sovrynSwapNetworkAddress,
        IContractRegistry _registry,
        address liquidityMiningAddress
    ) 
        public
        ContractRegistryClient(_registry)
        checkAddress(_wrbtcTokenAddress) 
        checkAddress(_sovrynSwapNetworkAddress) 
    {
        wrbtcTokenAddress = _wrbtcTokenAddress;
        sovrynSwapNetworkAddress = _sovrynSwapNetworkAddress;
        liquidityMiningContract = LiquidityMining(liquidityMiningAddress);
    }

    function() external payable {
        require(wrbtcTokenAddress == msg.sender, "Only can receive rBTC from WRBTC contract");
    }

    /**
     * @dev  
     * The process:
     * 1.Accepts RBTC
     * 2.Sends RBTC to WRBTC contract in order to wrap RBTC to WRBTC
     * 3.Calls 'addLiquidity' on LiquidityPoolConverter contract
     * 4.Transfers pool tokens to user
     * 
     * @param _liquidityPoolConverterAddress    address of LiquidityPoolConverter contract
     * @param _reserveAddress                   address of the reserve to add to the pool
     * @param _amount                           amount of liquidity to add
     * @param _minReturn                        minimum return-amount of reserve tokens
     *
     * @return amount of pool tokens minted
     */
    function addLiquidityToV2(
        address _liquidityPoolConverterAddress, 
        address _reserveAddress,
        uint256 _amount, 
        uint256 _minReturn
    )  
        public
        payable
        checkAddress(_liquidityPoolConverterAddress)
        returns(uint256) 
    {
        ILiquidityPoolV2Converter _liquidityPoolConverter = ILiquidityPoolV2Converter(_liquidityPoolConverterAddress);
        IERC20Token reserveToken = IERC20Token(_reserveAddress);
        ISmartToken _poolToken = _liquidityPoolConverter.poolToken(reserveToken);

        //wrap rbtc if required
        if(_reserveAddress == wrbtcTokenAddress){
            require(_amount == msg.value, "The provided amount should be identical to msg.value");
            IWrbtcERC20(wrbtcTokenAddress).deposit.value(_amount)();
        }
        else{
            reserveToken.transferFrom(msg.sender, address(this), _amount);
        }

        require(reserveToken.approve(_liquidityPoolConverterAddress, _amount), "token approval failed");

        uint256 poolTokenAmount = _liquidityPoolConverter.addLiquidity(reserveToken, _amount, _minReturn);
        
        //deposit the pool tokens in the liquidity mining contract on the sender's behalf
        _poolToken.approve(address(liquidityMiningContract), poolTokenAmount);
        liquidityMiningContract.deposit(address(_poolToken), poolTokenAmount, msg.sender);

        emit LiquidityAdded(msg.sender, _amount, poolTokenAmount);
        
        return poolTokenAmount;
    }

    /**
     * @dev  
     * This function support to provide liquidity for both wrbtc & non-wrbtc pool.
     * The process:
     * 1.Accepts RBTC
     * 2.If first index reserveTokens is wrbtc, it will just directly provide to the pool.
     * 3.If first index reserveTokens is not wrbtc, it will convert the RBTC to the first index of reserveTokens, then provide liquidity to the pool.
     * 4.Transfers pool tokens to user
     * 
     * @notice
     * If want to provide liquidity to WRBTC pairs, wrbtc address must be passed in the first index of reserveTokens.
     * If want to provide liquidity to NON-WRBTC pairs, first index of reserveAmounts must be 0.
     *
     * @param _liquidityPoolConverterAddress    address of LiquidityPoolConverter contract
     * @param _reserveTokens                    address of each reserve token. The first element should be the address of WRBTC
     * @param _reserveAmounts                   amount of each reserve token. The first element should be the amount of RBTC
     * @param _minReturn                        minimum return-amount of reserve tokens
     *
     * @return amount of pool tokens minted
     */
    function addLiquidityToV1(
        address _liquidityPoolConverterAddress,
        IERC20Token[] memory _reserveTokens, 
        uint256[] memory _reserveAmounts,
        uint256 _minReturn
    )  
        public
        payable
        checkAddress(_liquidityPoolConverterAddress)
        returns(uint256) 
    {
        require(address(_reserveTokens[1]) != wrbtcTokenAddress, "WRBTC must be in the 0 index");

        bool success;
        ILiquidityPoolV1Converter _liquidityPoolConverter = ILiquidityPoolV1Converter(_liquidityPoolConverterAddress);
        ISmartToken _poolToken = ISmartToken(address(_liquidityPoolConverter.token()));
        uint32 reserveRatio_ = _liquidityPoolConverter.reserveRatio();
        uint256 totalSupplyBefore = _poolToken.totalSupply();
        uint256[] memory rsvBalances = new uint256[](_reserveTokens.length);
        
        for (uint256 i = 0; i < _reserveTokens.length; i++) {
            if(address(_reserveTokens[i]) == wrbtcTokenAddress) {
                require(_reserveAmounts[i] == msg.value, "The provided amount of RBTC should be identical to msg.value");

                IWrbtcERC20(wrbtcTokenAddress).deposit.value(_reserveAmounts[i])();
                success = IWrbtcERC20(wrbtcTokenAddress).approve(_liquidityPoolConverterAddress, _reserveAmounts[i]);
                require(success, "Failed to approve converter to transfer WRBTC");
            } else {
                if (i == 0) {
                    require(_reserveAmounts[i] == 0, "0 amount required for non-wrbtc pairs");

                    // Swap rbtc to reserve token --> Use convertion helper to avoid stack too deep
                    _reserveAmounts[i] = convertionHelper(wrbtcTokenAddress, address(_reserveTokens[i]), address(this), msg.value);
                } else {
                    success = IERC20Token(_reserveTokens[i]).transferFrom(msg.sender, address(this), _reserveAmounts[i]);
                    require(success, "Failed to transfer reserve token from user");
                }

                require(IERC20Token(_reserveTokens[i]).approve(_liquidityPoolConverterAddress, _reserveAmounts[i]), "Failed to approve converter to transfer reserve token");
            }

            (rsvBalances[i], , , , ) = _liquidityPoolConverter.reserves(address(_reserveTokens[i]));
        }

        uint256 poolTokenAmountBefore = _poolToken.balanceOf(address(this));
        _liquidityPoolConverter.addLiquidity(_reserveTokens, _reserveAmounts, _minReturn);
        uint256 poolTokenAmount = _poolToken.balanceOf(address(this)).sub(poolTokenAmountBefore);
        
        //deposit the pool tokens in the liquidity mining contract on the sender's behalf
        _poolToken.approve(address(liquidityMiningContract), poolTokenAmount);
        liquidityMiningContract.deposit(address(_poolToken), poolTokenAmount, msg.sender);

        _refund(_liquidityPoolConverterAddress, _reserveTokens, _reserveAmounts, rsvBalances, totalSupplyBefore, poolTokenAmount, reserveRatio_);

        emit LiquidityAddedToV1(msg.sender, _reserveTokens, _reserveAmounts, poolTokenAmount);

        return poolTokenAmount;
    }
    
    /**
     * @notice 
     * Before calling this function to remove liquidity, users need approve this contract to be able to spend or transfer their pool tokens
     *
     * @dev  
     * The process:     
     * 1.Transfers pool tokens to this contract
     * 2.Calls 'removeLiquidity' on LiquidityPoolConverter contract
     * 3.Calls 'withdraw' on WRBTC contract in order to unwrap WRBTC to RBTC
     * 4.Sneds RBTC to user
     * 
     * @param _liquidityPoolConverterAddress    address of LiquidityPoolConverter contract
     * @param _reserveAddress                   address of the reserve to add to the pool
     * @param _amount                           amount of pool tokens to burn
     * @param _minReturn                        minimum return-amount of reserve tokens
     * 
     * @return amount of liquidity removed also WRBTC unwrapped to RBTC
     */
    function removeLiquidityFromV2(
        address _liquidityPoolConverterAddress, 
        address _reserveAddress,
        uint256 _amount, 
        uint256 _minReturn
    )   
        public 
        checkAddress(_liquidityPoolConverterAddress)
        returns(uint256) 
    {
        ILiquidityPoolV2Converter _liquidityPoolConverter = ILiquidityPoolV2Converter(_liquidityPoolConverterAddress);
        IERC20Token reserveToken = IERC20Token(_reserveAddress);
        ISmartToken _poolToken = _liquidityPoolConverter.poolToken(IERC20Token(_reserveAddress));

        //withdraw always transfers the pool tokens to the caller and the reward tokens to the passed address
        liquidityMiningContract.withdraw(address(_poolToken), _amount, msg.sender);

        uint256 reserveAmount = _liquidityPoolConverter.removeLiquidity(_poolToken, _amount, _minReturn);
        
        if(_reserveAddress == wrbtcTokenAddress){
            IWrbtcERC20(wrbtcTokenAddress).withdraw(reserveAmount);
            (bool success, ) = msg.sender.call.value(reserveAmount)("");
            require(success, "Failed to send RBTC to the user");
        }
        else{
            require(reserveToken.transfer(msg.sender, reserveAmount), "Failed to transfer reserve tokens to the user");
        }

        emit LiquidityRemoved(msg.sender, reserveAmount, _amount);

        return reserveAmount;
    }

    /**
     * @notice 
     * Before calling this function to remove liquidity, users need approve this contract to be able to spend or transfer their pool tokens
     *
     * @dev  
     * The process:     
     * 1.Transfers pool tokens to this contract
     * 2.Calls 'removeLiquidity' on LiquidityPoolConverter contract
     * 3.Calls 'withdraw' on WRBTC contract in order to unwrap WRBTC to RBTC
     * 4.Sneds RBTC and/or other reserve tokens to user
     * 
     * @param _liquidityPoolConverterAddress    address of LiquidityPoolConverter contract
     * @param _amount                           amount of pool tokens to burn
     * @param _reserveTokens                    address of each reserve token. The first element should be the address of WRBTC
     * @param _reserveMinReturnAmounts          minimum return-amount of each reserve token. The first element should be the minimum return-amount of WRBTC
     */
    function removeLiquidityFromV1(
        address _liquidityPoolConverterAddress,
        uint256 _amount, 
        IERC20Token[] memory _reserveTokens, 
        uint256[] memory _reserveMinReturnAmounts
    )   
        public 
        checkAddress(_liquidityPoolConverterAddress)
    {
        require(_amount > 0, "The amount should larger than zero");

        uint256[] memory reserveAmounts = new uint256[](_reserveTokens.length);
        ILiquidityPoolV1Converter _liquidityPoolConverter = ILiquidityPoolV1Converter(_liquidityPoolConverterAddress);
        
        //withdraw always transfers the pool tokens to the caller and the reward tokens to the passed address
        liquidityMiningContract.withdraw(address(_liquidityPoolConverter.token()), _amount, msg.sender);

        uint256 lengthOfToken = _reserveTokens.length;

        uint256[] memory reserveAmountBefore = new uint256[](lengthOfToken);
        for (uint256 i = 0; i < lengthOfToken; i++) {
            reserveAmountBefore[i] = _reserveTokens[i].balanceOf(address(this));
        }

        _liquidityPoolConverter.removeLiquidity(_amount, _reserveTokens, _reserveMinReturnAmounts);

        uint256 reserveAmount;
        bool successOfTransfer;
        for (uint256 i = 0; i < lengthOfToken; i++) {
            if(address(_reserveTokens[i]) == wrbtcTokenAddress) {
                uint256 wrbtcAmount = _reserveTokens[i].balanceOf(address(this)).sub(reserveAmountBefore[i]);
                reserveAmounts[i] = wrbtcAmount;
                IWrbtcERC20(wrbtcTokenAddress).withdraw(wrbtcAmount);
                (bool successOfSendRBTC,) = msg.sender.call.value(wrbtcAmount)("");
                require(successOfSendRBTC, "Failed to send RBTC to user");
            } else {
                reserveAmount = _reserveTokens[i].balanceOf(address(this)).sub(reserveAmountBefore[i]); 
                reserveAmounts[i] = reserveAmount;

                successOfTransfer = IERC20Token(_reserveTokens[i]).transfer(msg.sender, reserveAmount);
                require(successOfTransfer, "Failed to transfer reserve token to user");
            }
        }

        emit LiquidityRemovedFromV1(msg.sender, _reserveTokens, reserveAmounts, _amount);
    }
    
    /**
     * @notice
     * Before calling this function to swap token to RBTC, users need approve this contract to be able to spend or transfer their tokens
     *
     * @param _path         conversion path between two tokens in the network
     * @param _amount       amount to convert from, in the source token
     * @param _recipient    the beneficiary of the conversion. If 0 address is passed, msg.sender will be considered as the recipient.
     * @param _minReturn    if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero
     * 
     * @return amount of tokens received from the conversion
     */
    function convertByPath(
        IERC20Token[] memory _path,
        uint256 _amount, 
        address _recipient,
        uint256 _minReturn
    ) 
        public 
        payable
        returns(uint256) 
    {    
        ISovrynSwapNetwork _sovrynSwapNetwork =  ISovrynSwapNetwork(sovrynSwapNetworkAddress);
        address recipient = _recipient != address(0) ? _recipient : msg.sender;
  
        if (msg.value != 0) {
            require(_path[0] == IERC20Token(wrbtcTokenAddress), "Value may only be sent for WRBTC transfers");
            require(_amount == msg.value, "The provided amount should be identical to msg.value");

            IWrbtcERC20(wrbtcTokenAddress).deposit.value(_amount)();

            bool successOfApprove = IWrbtcERC20(wrbtcTokenAddress).approve(sovrynSwapNetworkAddress, _amount);
            require(successOfApprove);

            uint256 _targetTokenAmount = _sovrynSwapNetwork.convertByPath(_path, _amount, _minReturn, recipient, address(0), 0);

            emit TokenConverted(recipient, _amount, _targetTokenAmount, _path);

            return _targetTokenAmount;
        }
        else {
            require(_path[_path.length-1] == IERC20Token(wrbtcTokenAddress), "It only could be swapped to WRBTC");
            
            IERC20Token _token = IERC20Token(_path[0]);

            bool successOfTransferFrom = _token.transferFrom(msg.sender, address(this), _amount);
            require(successOfTransferFrom);

            bool successOfApprove = _token.approve(sovrynSwapNetworkAddress, _amount);
            require(successOfApprove);
                 
            uint256 _targetTokenAmount = _sovrynSwapNetwork.convertByPath(_path, _amount, _minReturn, address(this), address(0), 0);

            IWrbtcERC20(wrbtcTokenAddress).withdraw(_targetTokenAmount);

            (bool successOfSendRBTC,) = recipient.call.value(_targetTokenAmount)("");
            require(successOfSendRBTC, "Failed to send RBTC to user");

            emit TokenConverted(recipient, _amount, _targetTokenAmount, _path);

            return _targetTokenAmount;
        }        
    }

    /**
     * @dev
     * The conversion function to do the refund.
     * This function will be called in order to refund the excess of non-wrbtc token in form of RBTC.
     *
     * @param _sourceToken the non-wrbtc token which will be converted to WRBTC, and then sent the RBTC to the sender.
     * @param _amount amount of _sourceToken for refund.
     *
     * @return THe total wrbtc refunded.
     */
    function convertForRBTCRefund(
        IERC20Token _sourceToken,
        uint256 _amount
    ) private returns(uint256) {
        ISovrynSwapNetwork _sovrynSwapNetwork =  ISovrynSwapNetwork(sovrynSwapNetworkAddress);
        IERC20Token[] memory _path = _sovrynSwapNetwork.conversionPath(_sourceToken, IERC20Token(wrbtcTokenAddress));

        bool successOfApprove = _sourceToken.approve(sovrynSwapNetworkAddress, _amount);
        require(successOfApprove);

        uint256 _targetTokenAmount = _sovrynSwapNetwork.convertByPath(_path, _amount, 1, address(this), address(0), 0);

        IWrbtcERC20(wrbtcTokenAddress).withdraw(_targetTokenAmount);

        (bool successOfSendRBTC,) = msg.sender.call.value(_targetTokenAmount)("");
        require(successOfSendRBTC, "Failed to send RBTC to user");

        emit TokenConverted(msg.sender, _amount, _targetTokenAmount, _path);

        return _targetTokenAmount;
    }

    /**
     * @dev
     * This function is meant to avoid the stack too deep issue which will be calling from the addLiquidity function.
     * Mostly, this function will convert the wrbtc to specific token, and then the address(this) will be the recipient.
     * 
     * @param sourceToken sourceToken for conversion.
     * @param destToken destToken for conversion.
     * @param recipient beneficiary of the conversion.
     *
     * @return amount of tokens received from the conversion
     */
    function convertionHelper(address sourceToken, address destToken, address recipient, uint256 amount) private returns(uint256) {
        // Swap rbtc to reserve token
        ISovrynSwapNetwork _sovrynSwapNetwork =  ISovrynSwapNetwork(sovrynSwapNetworkAddress);
        IERC20Token[] memory path = _sovrynSwapNetwork.conversionPath(IERC20Token(sourceToken), IERC20Token(destToken));
        return convertByPath(path, amount, recipient, 1);
    }

    /**
     * @dev
     * Function to do the refund there is any excess when providing the liquidity.
     * If the excess is the first index of reserveTokens: 
        - it's wrbtc, then will directly refund msg.sender as RBTC.
        - it's not wrbtc, then it will be converted to wrbtc and then refund to the msg.sender as RBTC.
     * If the excess is the second index of reserveTokens, then refund to the msg.sender as Token itself.
     * 
     * @notice
     * This function is one of the solution to fix the stack too deep issue.
     *
     * @param _liquidityPoolConverterAddress converter address.
     * @param _reserveTokens reserve tokens of the pool.
     * @param _reserveAmounts reserve amounts.
     * @param rsvBalances Reserve balances of the pool
     * @param totalSupplyBefore Total supply of the token pool before the liquidity process happened.
     * @param poolTokenAmountLatest Total supply of the token pool after the liquidity process happened.
     * @param reserveRatio_ Reserve ration of the pool.
     */
    function _refund(
        address _liquidityPoolConverterAddress,
        IERC20Token[] memory _reserveTokens,
        uint256[] memory _reserveAmounts,
        uint256[] memory rsvBalances,
        uint256 totalSupplyBefore,
        uint256 poolTokenAmountLatest,
        uint32 reserveRatio_
    ) private {
        for (uint256 i = 0; i < _reserveTokens.length; i++) {
            uint256 amount = _reserveAmounts[i].sub(ISovrynSwapFormula(addressOf(SOVRYNSWAP_FORMULA)).fundCost(totalSupplyBefore, rsvBalances[i], reserveRatio_, poolTokenAmountLatest));
            if (amount > 0) {
                require(_reserveTokens[i].approve(_liquidityPoolConverterAddress, 0), "Failed to approve converter to transfer reserve token");

                if(address(_reserveTokens[i]) == wrbtcTokenAddress ) {
                    IWrbtcERC20(wrbtcTokenAddress).withdraw(amount);
                    (bool success,) = msg.sender.call.value(amount)("");
                    require(success, "Failed to send extra RBTC back to user");
                } else {
                    // Convert back the token to rbtc for first index, for other tokens, need to be refunded as the token for itself.
                    if(i == 0) convertForRBTCRefund(_reserveTokens[i], amount);
                }
            }
        }
    }
}