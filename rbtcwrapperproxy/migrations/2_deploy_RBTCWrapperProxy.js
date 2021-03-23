const RBTCWrapperProxy = artifacts.require("RBTCWrapperProxy");

module.exports = function (deployer) {
	// Update the addresses of WRBTC and SovrynSwapNetwork here
	deployer.deploy(RBTCWrapperProxy, "0x602C71e4DAC47a042Ee7f46E0aee17F94A3bA0B6", "0x64B334435888bb5E44D890a7B319981c4Bb4B47d");
};
