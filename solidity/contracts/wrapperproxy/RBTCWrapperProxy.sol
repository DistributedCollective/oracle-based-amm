pragma solidity >=0.5.0 <0.6.0;

import "./openzeppelin/Address.sol";
import "./interfaces/IWrbtcERC20.sol";
import "./interfaces/ILiquidityPoolV2Converter.sol";
import "./interfaces/ISmartToken.sol";

contract RBTCWrapperProxy{
    
    using Address for address;

    IWrbtcERC20 wrbtc;
    ILiquidityPoolV2Converter liquidityPoolV2Converter;
    ISmartToken poolToken;
    
    address public wrbtcTokenAddress;
    address public liquidityPoolV2ConverterAddress;
    address public poolTokenAddress;
    
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
        address _poolTokenAddress) 
        public 
        checkAddress(_wrbtcTokenAddress)
        checkAddress(_liquidityPoolV2ConverterAddress)
        checkAddress(_poolTokenAddress)
        {
            wrbtcTokenAddress = _wrbtcTokenAddress;
            liquidityPoolV2ConverterAddress = _liquidityPoolV2ConverterAddress;
            poolTokenAddress = _poolTokenAddress;
            wrbtc = IWrbtcERC20(wrbtcTokenAddress);
            liquidityPoolV2Converter = ILiquidityPoolV2Converter(liquidityPoolV2ConverterAddress);
            poolToken = ISmartToken(poolTokenAddress);
    }

    function() external payable { }

    /**
     * @dev  
     * 1.Accepts RBTC
     * 2.Sends RBTC to WRBTC contract in order to wrap RBTC to WRBTC
     * 3.Calls 'addLiquidity' on LiquidityPoolConverterV2 contract
     * 4.Transfers pool tokens to user
     * 
     * @param _amount amount of liquidity to add
     * @param _minReturn minimum return-amount of reserve tokens
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
     * @dev  
     * 1.Transfers pool tokens to this contract
     * 2.Calls 'removeLiquidity' on LiquidityPoolConverterV2 contract
     * 3.Calls 'withdraw' on WRBTC contract in order to unwrap WRBTC to RBTC
     * 4.Sneds RBTC to user
     * 
     * @param _amount amount of pool tokens to burn
     * @param _minReturn minimum return-amount of reserve tokens
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
    
}