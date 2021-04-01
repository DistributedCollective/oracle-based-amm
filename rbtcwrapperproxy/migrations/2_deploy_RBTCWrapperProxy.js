const RBTCWrapperProxy = artifacts.require("RBTCWrapperProxy");

// constructor(
// 	address _wrbtcTokenAddress,
// 	address _sovrynSwapNetworkAddress
// )

// testnet_contracts.json
//"WRBTC" : "0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab",
//"swapNetwork":"0x61172B53423E205a399640e5283e51FE60EC2256",

// mainnet_contracts.json
// "WRBTC" : "0x542fda317318ebf1d3deaf76e0b632741a7e677d",
// "swapNetwork":"0x98aCE08D2b759a265ae326F010496bcD63C15afc",

module.exports = function (deployer) {
	deployer.deploy(RBTCWrapperProxy, "0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab", "0x61172B53423E205a399640e5283e51FE60EC2256");
};
