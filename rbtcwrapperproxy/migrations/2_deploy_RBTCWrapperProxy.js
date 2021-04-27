const fs = require("fs");

const RBTCWrapperProxy = artifacts.require("RBTCWrapperProxy");
const LiquidityMining = artifacts.require("LiquidityMining");

const getConfig = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/config_rsk.json", { encoding: "utf8" }));
};
const getSOVConfig = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/addSOV.json", { encoding: "utf8" }));
};

module.exports = function (deployer) {
	deployer.deploy(LiquidityMining, getSOVConfig()["SOV"].addr).then(function() {
		deployer.deploy(RBTCWrapperProxy, getConfig()["RBTC"].addr, getConfig()["sovrynSwapNetwork"].addr, getConfig()["contractRegistry"].addr, LiquidityMining.address);
	});
};
