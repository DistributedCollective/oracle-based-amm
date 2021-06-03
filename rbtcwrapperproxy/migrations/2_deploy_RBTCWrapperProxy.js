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
	if(network == "development"){
		console.log(getConfig()["SUSD"].addr)
		return deployer.deploy(LoanToken, getConfig()["SUSD"].addr).then(function() {
			return deployer.deploy(LiquidityMining, getSOVConfig()["SOV"].addr).then(function() {
				return deployer.deploy(RBTCWrapperProxy, getConfig()["RBTC"].addr, getConfig()["sovrynSwapNetwork"].addr, getConfig()["contractRegistry"].addr, LiquidityMining.address);
			});
		});
	}
		
	else{
		liquidityMiningAddress = '0x0000000000000000000000000000000000000000';
		wrbtcAddress = '0x44b13c278d02708B8995dA2AcdeE3A5959Ce645D';
		swapNetworkAddress = '0x57Afb71F46A67C269d3769d81c52a0Bfe21768fC';
		contractRegistry = '0x91371713075d65612da76c2EfB10c0dbcE7B9Ca2';
		return deployer.deploy(RBTCWrapperProxy, wrbtcAddress, swapNetworkAddress, contractRegistry, liquidityMiningAddress);

	}

};
