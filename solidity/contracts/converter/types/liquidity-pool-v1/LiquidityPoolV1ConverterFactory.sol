pragma solidity 0.4.26;
import "./LiquidityPoolV1Converter.sol";
import "../../interfaces/IConverter.sol";
import "../../interfaces/ITypedConverterFactory.sol";
import "../../../token/interfaces/ISmartToken.sol";

/*
    LiquidityPoolV1Converter Factory
*/
contract LiquidityPoolV1ConverterFactory is ITypedConverterFactory {
    /**
      * @dev returns the converter type the factory is associated with
      *
      * @return converter type
    */
    function converterType() public pure returns (uint16) {
        return 1;
    }

    /**
      * @dev creates a new converter with the given arguments and transfers
      * the ownership to the caller
      *
      * @param _anchor            anchor governed by the converter
      * @param _registry          address of a contract registry contract
      * @param _maxConversionFee  maximum conversion fee, represented in ppm
      *
      * @return a new converter
    */
    function createConverter(IConverterAnchor _anchor, IContractRegistry _registry, uint32 _maxConversionFee) public returns (IConverter) {
        IConverter converter = new LiquidityPoolV1Converter(ISmartToken(_anchor), _registry, _maxConversionFee);
        converter.transferOwnership(msg.sender);
        return converter;
    }
}
