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
    ILiquidityPoolV2Converter liquidityPoolV2Converter;
    ISmartToken poolToken;
    ISovrynSwapNetwork sovrynSwapNetwork;
    IERC20Token docToken;
    
    address public wrbtcTokenAddress;
    address public liquidityPoolV2ConverterAddress;
    address public poolTokenAddress;
    address public sovrynSwapNetworkAddress;
    address public docTokenAddress;
    
    /**
     * @dev To check if ddress is contract address 
     */
    modifier checkAddress(address address_) {
        require(address_.isContract(), "The address is not a contract");
        _;
    }
    
    constructor (
        address _wrbtcTokenAddress, 
        address _liquidityPoolV2ConverterAddress, 
        address _poolTokenAddress,
        address _sovrynSwapNetworkAddress,
        address _docTokenAddress
        ) 
        public 
        checkAddress(_wrbtcTokenAddress)
        checkAddress(_liquidityPoolV2ConverterAddress)
        checkAddress(_poolTokenAddress)
        checkAddress(_sovrynSwapNetworkAddress)
        checkAddress(_docTokenAddress)
        {
            wrbtcTokenAddress = _wrbtcTokenAddress;
            liquidityPoolV2ConverterAddress = _liquidityPoolV2ConverterAddress;
            poolTokenAddress = _poolTokenAddress;
            sovrynSwapNetworkAddress = _sovrynSwapNetworkAddress;
            docTokenAddress = _docTokenAddress;

            wrbtc = IWrbtcERC20(wrbtcTokenAddress);
            liquidityPoolV2Converter = ILiquidityPoolV2Converter(liquidityPoolV2ConverterAddress);
            poolToken = ISmartToken(poolTokenAddress);
            sovrynSwapNetwork = ISovrynSwapNetwork(sovrynSwapNetworkAddress);
            docToken = IERC20Token(docTokenAddress);
    }

    function() external payable { }

    /**
     * @dev  
     * The process:
     * 1.Accepts RBTC
     * 2.Sends RBTC to WRBTC contract in order to wrap RBTC to WRBTC
     * 3.Calls 'addLiquidity' on LiquidityPoolConverterV2 contract
     * 4.Transfers pool tokens to user
     * 
     * @param _amount       amount of liquidity to add
     * @param _minReturn    minimum return-amount of reserve tokens
     *
     * @return amount of pool tokens minted
     */
    function addLiquidity(uint256 _amount, uint256 _minReturn) payable public returns(uint256) {
        require(_amount == msg.value, "The provided amount should be identical to msg.value");

        (bool successOfDeposit, ) = wrbtcTokenAddress.call.value(_amount)(abi.encodeWithSignature("deposit()"));
        require(successOfDeposit);

        bool successOfApprove = wrbtc.approve(liquidityPoolV2ConverterAddress, _amount);
        require(successOfApprove);

        uint256 poolTokenAmount = liquidityPoolV2Converter.addLiquidity(IERC20Token(wrbtcTokenAddress), _amount, _minReturn);
        
        bool successOfTransfer = poolToken.transfer(msg.sender, poolTokenAmount);
        require(successOfTransfer);

        return poolTokenAmount;
    }
    
    /**
     * @notice 
     * Before calling this function to remove liquidity, users need approve this contract to be able to spend or transfer their pool tokens
     *
     * @dev  
     * The process:     
     * 1.Transfers pool tokens to this contract
     * 2.Calls 'removeLiquidity' on LiquidityPoolConverterV2 contract
     * 3.Calls 'withdraw' on WRBTC contract in order to unwrap WRBTC to RBTC
     * 4.Sneds RBTC to user
     * 
     * @param _amount       amount of pool tokens to burn
     * @param _minReturn    minimum return-amount of reserve tokens
     * 
     * @return amount of WRBTC unwrapped to RBTC
     */
    function removeLiquidity(uint256 _amount, uint256 _minReturn) public returns(uint256) {
        bool successOfTransferFrom = poolToken.transferFrom(msg.sender, address(this), _amount);
        require(successOfTransferFrom);

        uint256 reserveAmount = liquidityPoolV2Converter.removeLiquidity(ISmartToken(poolTokenAddress), _amount, _minReturn);
        
        wrbtc.withdraw(reserveAmount);
        
        msg.sender.transfer(reserveAmount);

        return reserveAmount;
    }
    
    /**
     * @notice
     * Before calling this function to swap DoC to RBTC, users need approve this contract to be able to spend or transfer their DoC tokens
     * 
     * @param _path         conversion path between two tokens in the network
     * @param _amount       amount to convert from, in the source token
     * @param _minReturn    if the conversion results in an amount smaller than the minimum return - it is cancelled, must be greater than zero
     * 
     * @return amount of tokens received from the conversion
     */
    function convertByPath(IERC20Token[] memory _path, uint256 _amount, uint256 _minReturn) public payable returns(uint256) {
        if (msg.value != 0) {
            require(_amount == msg.value, "The provided amount should be identical to msg.value");

            (bool successOfDeposit, ) = wrbtcTokenAddress.call.value(_amount)(abi.encodeWithSignature("deposit()"));
            require(successOfDeposit);

            bool successOfApprove = wrbtc.approve(sovrynSwapNetworkAddress, _amount);
            require(successOfApprove);

            uint256 amount = sovrynSwapNetwork.convertByPath(_path, _amount, _minReturn, msg.sender, address(0), 0);

            return amount;
        }
        else {
            if (_path[0] == docToken) {
                bool successOfTransferFrom = docToken.transferFrom(msg.sender, address(this), _amount);
                require(successOfTransferFrom);

                bool successOfApprove = docToken.approve(sovrynSwapNetworkAddress, _amount);
                require(successOfApprove);

                uint256 amount = sovrynSwapNetwork.convertByPath(_path, _amount, _minReturn, address(this), address(0), 0);

                wrbtc.withdraw(amount);

                msg.sender.transfer(amount);

                return amount;
            }
        }        
    }

}