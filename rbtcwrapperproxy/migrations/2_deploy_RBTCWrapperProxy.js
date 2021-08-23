const fs = require("fs");

const RBTCWrapperProxy = artifacts.require("RBTCWrapperProxy");
const LiquidityMining = artifacts.require("LiquidityMining");

const getConfig = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/config_rsk.json", { encoding: "utf8" }));
};
const getSOVConfig = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/addSOV.json", { encoding: "utf8" }));
};

module.exports = function (deployer, network) {
	if(network == "development"){
		console.log(getConfig()["SUSD"].addr)
		return deployer.deploy(LiquidityMining, getSOVConfig()["SOV"].addr).then(function() {
			return deployer.deploy(RBTCWrapperProxy, getConfig()["RBTC"].addr, getConfig()["sovrynSwapNetwork"].addr, getConfig()["contractRegistry"].addr, LiquidityMining.address);
		});
	}
		
	else{//mainnet
		liquidityMiningAddress = '0xf730af26e87D9F55E46A6C447ED2235C385E55e0';
		wrbtcAddress = '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d';
		swapNetworkAddress = '0x98aCE08D2b759a265ae326F010496bcD63C15afc';
		contractRegistry = '0x46EBC03EF2277308BdB106a73d11c65109C4B89B';
		return deployer.deploy(RBTCWrapperProxy, wrbtcAddress, swapNetworkAddress, contractRegistry, liquidityMiningAddress);

	}

	//testnet
	/**
	 liquidityMiningAddress = '0xe28aEbA913c34EC8F10DF0D9C92D2Aa27545870e';
	 wrbtcAddress = '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab';
	 swapNetworkAddress = '0x61172B53423E205a399640e5283e51FE60EC2256';
	 contractRegistry = '0x0E7CcF6A67e614B507Aa524572F72C7e5Dec23CB';
	 */

};
