const RBTCWrapperProxy = artifacts.require("RBTCWrapperProxy");

module.exports = function (deployer) {
	deployer.deploy(RBTCWrapperProxy, "0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab", "0x61172B53423E205a399640e5283e51FE60EC2256", "0x0e7ccf6a67e614b507aa524572f72c7e5dec23cb");
};
