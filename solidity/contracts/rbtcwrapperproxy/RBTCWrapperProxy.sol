pragma solidity >=0.5.0 <0.6.0;

import "./openzeppelin/Address.sol";
import "./interfaces/IWrbtcERC20.sol";
import "./interfaces/ILiquidityPoolV2Converter.sol";
import "./interfaces/ISmartToken.sol";
import "./interfaces/ISovrynSwapNetwork.sol";
import "./interfaces/IERC20Token.sol";

contract RBTCWrapperProxy{
    
    using Address for address;

    IWrbtcERC20 wrbtc;
    ILiquidityPoolV2Converter liquidityPoolConverter;
    ISmartToken poolToken;
    ISovrynSwapNetwork sovrynSwapNetwork;
    IERC20Token token;
    
    address public wrbtcTokenAddress;
    address public liquidityPoolConverterAddress;
    address public sovrynSwapNetworkAddress;
    
    /**
     * @dev triggered after liquidity is added
     *
     * @param  _provider           liquidity provider
     * @param  _reserveAmount      provided reserve token amount
     * @param  _poolTokenAmount    minted pool token amount
     */
    event LiquidityAdded(
        address indexed _provider,
        uint256 indexed _reserveAmount,
        uint256 indexed _poolTokenAmount
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
        uint256 indexed _reserveAmount,
        uint256 indexed _poolTokenAmount
    );

    /**
     * @dev triggered after liquidity is removed
     *
     * @param _beneficiary                 account that will receive the conversion result or 0x0 to send the result to the sender account
     * @param _sourceTokenAmount           amount to convert from, in the source token
     * @param _targetTokenAmount           amount of tokens received from the conversion, in the target token
     * @param _sovrynSwapNetworkAddress    address of SovrynSwapNetwork contract
     * @param _path                        conversion path between two tokens in the network
     */
    event TokenConverted(
        address indexed _beneficiary,
        uint256 indexed _sourceTokenAmount,
        uint256 indexed _targetTokenAmount,
        address _sovrynSwapNetworkAddress,
        IERC20Token[] _path
    );

    /**
     * @dev To check if ddress is contract address 
     */
    modifier checkAddress(address address_) {
        require(address_.isContract(), "The address is not a contract");
        _;
    }
    
    constructor(address _wrbtcTokenAddress) public checkAddress(_wrbtcTokenAddress) {
        wrbtcTokenAddress = _wrbtcTokenAddress;
        wrbtc = IWrbtcERC20(wrbtcTokenAddress);        
    }

    function() external payable { }

    /**
     * @dev  
     * The process:
     * 1.Accepts RBTC
     * 2.Sends RBTC to WRBTC contract in order to wrap RBTC to WRBTC
     * 3.Calls 'addLiquidity' on LiquidityPoolConverter contract
     * 4.Transfers pool tokens to user
     * 
     * @param _liquidityPoolConverterAddress    address of LiquidityPoolConverter contract
     * @param _amount                           amount of liquidity to add
     * @param _minReturn                        minimum return-amount of reserve tokens
     *
     * @return amount of pool tokens minted
     */
    function addLiquidity(
        address _liquidityPoolConverterAddress, 
        uint256 _amount, 
        uint256 _minReturn
    )  
        public
        payable
        checkAddress(_liquidityPoolConverterAddress)
        returns(uint256) 
    {
        require(_amount == msg.value, "The provided amount should be identical to msg.value");

        liquidityPoolConverterAddress = _liquidityPoolConverterAddress;
        liquidityPoolConverter = ILiquidityPoolV2Converter(liquidityPoolConverterAddress);
        poolToken = liquidityPoolConverter.poolToken(IERC20Token(wrbtcTokenAddress));

        (bool successOfDeposit, ) = wrbtcTokenAddress.call.value(_amount)(abi.encodeWithSignature("deposit()"));
        require(successOfDeposit);

        bool successOfApprove = wrbtc.approve(liquidityPoolConverterAddress, _amount);
        require(successOfApprove);

        uint256 poolTokenAmount = liquidityPoolConverter.addLiquidity(IERC20Token(wrbtcTokenAddress), _amount, _minReturn);
        
        bool successOfTransfer = poolToken.transfer(msg.sender, poolTokenAmount);
        require(successOfTransfer);

        emit LiquidityAdded(msg.sender, _amount, poolTokenAmount);

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
     * @param _amount                           amount of pool tokens to burn
     * @param _minReturn                        minimum return-amount of reserve tokens
     * 
     * @return amount of liquidity removed also WRBTC unwrapped to RBTC
     */
    function removeLiquidity(
        address _liquidityPoolConverterAddress, 
        uint256 _amount, 
        uint256 _minReturn
    )   
        public 
        checkAddress(_liquidityPoolConverterAddress)
        returns(uint256) 
    {
        liquidityPoolConverterAddress = _liquidityPoolConverterAddress;
        liquidityPoolConverter = ILiquidityPoolV2Converter(liquidityPoolConverterAddress);
        poolToken = liquidityPoolConverter.poolToken(IERC20Token(wrbtcTokenAddress));

        bool successOfTransferFrom = poolToken.transferFrom(msg.sender, address(this), _amount);
        require(successOfTransferFrom);

        uint256 reserveAmount = liquidityPoolConverter.removeLiquidity(poolToken, _amount, _minReturn);
        
        wrbtc.withdraw(reserveAmount);
        
        msg.sender.transfer(reserveAmount);

        emit LiquidityRemoved(msg.sender, reserveAmount, _amount);

        return reserveAmount;
    }
    
    /**
     * @notice
     * Before calling this function to swap token to RBTC, users need approve this contract to be able to spend or transfer their tokens
     *
     * @param _sovrynSwapNetworkAddress    address of SovrynSwapNetwork contract
     * @param _path                        conversion path between two tokens in the network
     * @param _amount                      amount to convert from, in the source token
     * @param _minReturn                   if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero
     * 
     * @return amount of tokens received from the conversion
     */
    function convertByPath(
        address _sovrynSwapNetworkAddress,
        IERC20Token[] memory _path, 
        uint256 _amount, 
        uint256 _minReturn
    ) 
        public 
        payable
        checkAddress(_sovrynSwapNetworkAddress)
        returns(uint256) 
    {    
        sovrynSwapNetworkAddress = _sovrynSwapNetworkAddress;
        sovrynSwapNetwork = ISovrynSwapNetwork(sovrynSwapNetworkAddress);
  
        if (msg.value != 0) {
            require(_path[0] == IERC20Token(wrbtcTokenAddress), "value may only be sent for WRBTC transfers");
            require(_amount == msg.value, "The provided amount should be identical to msg.value");

            (bool successOfDeposit, ) = wrbtcTokenAddress.call.value(_amount)(abi.encodeWithSignature("deposit()"));
            require(successOfDeposit);

            bool successOfApprove = wrbtc.approve(sovrynSwapNetworkAddress, _amount);
            require(successOfApprove);

            uint256 _targetTokenAmount = sovrynSwapNetwork.convertByPath(_path, _amount, _minReturn, msg.sender, address(0), 0);

            emit TokenConverted(msg.sender, _amount, _targetTokenAmount, sovrynSwapNetworkAddress, _path);

            return _targetTokenAmount;
        }
        else {
            require(_path[_path.length-1] == IERC20Token(wrbtcTokenAddress), "It only could be swapped to WRBTC");
            
            token = IERC20Token(_path[0]);

            bool successOfTransferFrom = token.transferFrom(msg.sender, address(this), _amount);
            require(successOfTransferFrom);

            bool successOfApprove = token.approve(sovrynSwapNetworkAddress, _amount);
            require(successOfApprove);
                 
            uint256 _targetTokenAmount = sovrynSwapNetwork.convertByPath(_path, _amount, _minReturn, address(this), address(0), 0);

            wrbtc.withdraw(_targetTokenAmount);

            msg.sender.transfer(_targetTokenAmount);

            emit TokenConverted(msg.sender, _amount, _targetTokenAmount, sovrynSwapNetworkAddress, _path);

            return _targetTokenAmount;
        }        
    }

}