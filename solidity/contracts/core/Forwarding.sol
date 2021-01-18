// SPDX-License-Identifier:MIT
pragma solidity 0.4.26;
pragma experimental ABIEncoderV2;

interface IERC20 {
    function transfer(address _to, uint256 _value) external returns (bool);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool);

    function approve(address _spender, uint256 _value) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

interface ILiquidityPoolV2Converter {
    function addLiquidity(
        IERC20 _reserveToken,
        uint256 _amount,
        uint256 _minReturn
    ) external payable returns (uint256);

    function poolToken(IERC20 _reserveToken) external view returns (IERC20);
}

contract Forwarding {
    address private owner;
    mapping(address => bool) private reservToken;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "sender must be owner");
        _;
    }

    //Duplicate address can't be set here
    function setReserveToken(address[] memory _tokenContract) public onlyOwner {
        for (uint256 i = 0; i < _tokenContract.length; i++) {
            require(
                !reservToken[_tokenContract[i]],
                "Already in our reserv token list"
            );
            reservToken[_tokenContract[i]] = true;
        }
    }

    //Duplicate address can't be reset here
    function resetReserveToken(address[] memory _tokenContract)
        public
        onlyOwner
    {
        //require(reservToken[_tokenContract],"token address not in our reserve list");
        //reservToken[_tokenContract]=false;
        for (uint256 i = 0; i < _tokenContract.length; i++) {
            require(
                reservToken[_tokenContract[i]],
                "Token Address is not in  our reserv list"
            );
            reservToken[_tokenContract[i]] = false;
        }
    }

    modifier checkReserveToken(address _tokenContract) {
        require(
            reservToken[_tokenContract],
            "This token is not in our reserve"
        );
        _;
    }

    // checkReserveToken(_tokenContract) Secure our transferFrom MEthod using checkReserveToken modifier
    function doTransferFrom(
        address _tokenContract,
        address _calledContract,
        uint256 _ammount
    ) internal returns (bool approvedSuccess) {
        require(
            (
                IERC20(_tokenContract).transferFrom(
                    msg.sender,
                    address(this),
                    _ammount
                )
            ),
            "Not enough tokens to approve"
        );
        approvedSuccess = IERC20(_tokenContract).approve(
            _calledContract,
            _ammount
        );
    }

    event addLiquidityEvent(address indexed receiver, uint256 poolShare);

    function addLiquidity(
        address _calledContract,
        address _tokenContract,
        uint256 _tokenAmmount,
        uint256 _minReturn
    ) public returns (uint256 poolShare) {
        require(
            doTransferFrom(_tokenContract, _calledContract, _tokenAmmount),
            "Not approved tokens"
        );
        poolShare = ILiquidityPoolV2Converter(_calledContract).addLiquidity(
            IERC20(_tokenContract),
            _tokenAmmount,
            _minReturn
        );
        IERC20 poolToken =
            ILiquidityPoolV2Converter(_calledContract).poolToken(
                IERC20(_tokenContract)
            );
        require(
            poolToken.transfer(msg.sender, poolShare),
            "contract not transfer minted tokens"
        );
        emit addLiquidityEvent(msg.sender, poolShare);
    }
}
