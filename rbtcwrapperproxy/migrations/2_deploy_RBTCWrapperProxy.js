const fs = require("fs");

const RBTCWrapperProxy = artifacts.require("RBTCWrapperProxy");

const getConfig = () => {
	return JSON.parse(fs.readFileSync("../solidity/utils/config_rsk.json", { encoding: "utf8" }));
};

module.exports = function (deployer) {
	deployer.deploy(RBTCWrapperProxy, getConfig()["reserves"][0].address, getConfig()["sovrynSwapNetwork"].addr, getConfig()["contractRegistry"].addr);
};
