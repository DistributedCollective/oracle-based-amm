pragma solidity 0.4.26;
import "./token/interfaces/IERC20Token.sol";

/*
    SovrynSwap Network interface
*/
contract ISovrynSwapNetwork {
	function convert2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public payable returns (uint256);

	function claimAndConvert2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public returns (uint256);

	function convertFor2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _for,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public payable returns (uint256);

	function claimAndConvertFor2(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _for,
		address _affiliateAccount,
		uint256 _affiliateFee
	) public returns (uint256);

	// deprecated, backward compatibility
	function convert(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn
	) public payable returns (uint256);

	// deprecated, backward compatibility
	function claimAndConvert(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn
	) public returns (uint256);

	// deprecated, backward compatibility
	function convertFor(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _for
	) public payable returns (uint256);

	// deprecated, backward compatibility
	function claimAndConvertFor(
		IERC20Token[] _path,
		uint256 _amount,
		uint256 _minReturn,
		address _for
	) public returns (uint256);
}