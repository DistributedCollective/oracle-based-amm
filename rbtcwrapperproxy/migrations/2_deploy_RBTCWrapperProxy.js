const fs = require("fs");

const RBTCWrapperProxy = artifacts.require("RBTCWrapperProxy");
const LiquidityMining = artifacts.require("LiquidityMining");
const LoanToken = artifacts.require("LoanToken");

const getConfig = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/config_rsk.json", { encoding: "utf8" }));
};
const getSOVConfig = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/addSOV.json", { encoding: "utf8" }));
};

module.exports = function (deployer, network) {
	if(network == "development" || network == "truffle"){
		console.log(getConfig()["SUSD"].addr);

		return deployer.deploy(LoanToken, getConfig()["SUSD"].addr).then(function() {
			return deployer.deploy(LiquidityMining, getSOVConfig()["SOV"].addr).then(function() {
				return deployer.deploy(RBTCWrapperProxy, getConfig()["RBTC"].addr, getConfig()["sovrynSwapNetwork"].addr, getConfig()["contractRegistry"].addr, LiquidityMining.address);
			});
		});
	}
		
	else{
		liquidityMiningAddress = '0xe28aEbA913c34EC8F10DF0D9C92D2Aa27545870e';
		wrbtcAddress = '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab';
		swapNetworkAddress = '0x61172B53423E205a399640e5283e51FE60EC2256';
		contractRegistry = '0x0E7CcF6A67e614B507Aa524572F72C7e5Dec23CB';
		return deployer.deploy(RBTCWrapperProxy, wrbtcAddress, swapNetworkAddress, contractRegistry, liquidityMiningAddress);

	}

};
