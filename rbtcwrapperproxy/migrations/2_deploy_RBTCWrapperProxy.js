const RBTCWrapperProxy = artifacts.require("RBTCWrapperProxy");

module.exports = function (deployer) {
	deployer.deploy(RBTCWrapperProxy, "0x602C71e4DAC47a042Ee7f46E0aee17F94A3bA0B6", "0x3B9BFeC104021662b6A2d7430533D4D29398f6E1", "0xb3FaB4d04285292B305F1c1E0F73A6Be40440471");
};
