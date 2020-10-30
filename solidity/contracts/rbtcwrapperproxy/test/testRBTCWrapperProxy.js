require('@openzeppelin/test-helpers/configure')({
    provider: web3.currentProvider,
    singletons: {
      abstraction: 'truffle',
    },
  });

const assert = require('chai').assert;
const { expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const { before } = require('lodash');

const RBTCWrapperProxy = artifacts.require("../contracts/RBTCWrapperProxy.sol");
const IERC20Token = artifacts.require("../contracts/interfaces/IERC20Token.sol");
const ISmartToken = artifacts.require("../contracts/interfaces/ISmartToken.sol");
const ISovrynSwapNetwork = artifacts.require("../contracts/interfaces/ISovrynSwapNetwork.sol");
const ILiquidityPoolV2Converter = artifacts.require("../contracts/interfaces/ILiquidityPoolV2Converter.sol");

// Update following addresses to test on RSK testnet
/*
const liquidityPoolV2ConverterAddress = '0x3ED5C55D08F75488736fb4A2e512698E71251cf0';
const poolTokenAddress = '0x7F433CC76298bB5099c15C1C7C8f2e89A8370111';
const docTokenAddress = '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0';
const sovrynSwapNetworkAddress = '0x61172B53423E205a399640e5283e51FE60EC2256';
const wrbtcAddress = '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab';
*/

// Update following addresses to test locally

const liquidityPoolV2ConverterAddress = '0xaad5B2802FDBB33200F62A30CfD3Fce4FC5dDfBA';
const docTokenAddress = '0x3194cBDC3dbcd3E11a07892e7bA5c3394048Cc87';
const sovrynSwapNetworkAddress = '0x64B334435888bb5E44D890a7B319981c4Bb4B47d';
const wrbtcAddress = '0x602C71e4DAC47a042Ee7f46E0aee17F94A3bA0B6';


contract('RBTCWrapperProxy', async (accounts) => {

    let rbtcWrapperProxy;
    let liquidityPoolV2Converter;
    let poolTokenAddress;
    let poolToken;
    let docToken;
    let sovrynSwapNetwork;

    beforeEach(async () => {
        rbtcWrapperProxy = await RBTCWrapperProxy.deployed();
        liquidityPoolV2Converter = await ILiquidityPoolV2Converter.at(liquidityPoolV2ConverterAddress);
        poolTokenAddress = await liquidityPoolV2Converter.poolToken(wrbtcAddress);
        poolToken = await ISmartToken.at(poolTokenAddress);
        docToken = await IERC20Token.at(docTokenAddress);
        sovrynSwapNetwork = await ISovrynSwapNetwork.at(sovrynSwapNetworkAddress);
    });

    it('verifies that users could send RBTC and then add liquidity to get pool token', async () => {
        var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
        var poolTokenAmountBefore = web3.utils.fromWei(await poolToken.balanceOf(accounts[0]));
        console.log('The account address:', accounts[0]);
        console.log('The amount of RBTC of the account:', rbtcAmountBefore);
        console.log('The amount of pool token of the account:', poolTokenAmountBefore);

        var result = await rbtcWrapperProxy.addLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {from:accounts[0], to:RBTCWrapperProxy.address, value:1e16});
        console.log('The amount of RBTC of the account after sending 0.01 RBTC:', web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
        console.log('The amount of pool token of the account after sending 0.01 RBTC:', web3.utils.fromWei(await poolToken.balanceOf(accounts[0])));

        var gasCost = result.receipt.gasUsed * await web3.eth.getGasPrice();
        var addedPoolTokenAmount = web3.utils.fromWei(result.logs[0].args._poolTokenAmount);
        assert.equal(await web3.eth.getBalance(accounts[0]), web3.utils.toWei(rbtcAmountBefore) - gasCost - 1e16, "Wrong RBTC balance");
        assert.equal(web3.utils.BN(await poolToken.balanceOf(accounts[0])).toString(), parseInt(web3.utils.toWei(poolTokenAmountBefore)) + parseInt(web3.utils.toWei(addedPoolTokenAmount)), "Wrong pool token balance");
        await expectEvent(result.receipt, "LiquidityAdded", {_provider:accounts[0], _reserveAmount:web3.utils.toBN(1e16), _poolTokenAmount:web3.utils.toWei(addedPoolTokenAmount)});
    });

    it('verifies that users could remove liquidity to burn pool token and then get RBTC', async () => {
        console.log('The account address:', accounts[0]);
        console.log('The amount of RBTC of the account:', rbtcAmountBefore);
        console.log('The amount of pool token of the account:', poolTokenAmountBefore);
        
        await poolToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e16), {from:accounts[0]});
        console.log('The allowance of pool token that the RBTCWrapperProxy smart contract could spend:', web3.utils.fromWei(await poolToken.allowance(accounts[0], RBTCWrapperProxy.address)));
        var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
        var poolTokenAmountBefore = web3.utils.fromWei(await poolToken.balanceOf(accounts[0]));
        
        var result = await rbtcWrapperProxy.removeLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {from:accounts[0], to:RBTCWrapperProxy.address});
        console.log('The amount of RBTC of the account after burning 0.01 pool token:', web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
        console.log('The amount of pool token of the account after burning 0.01 pool token:', web3.utils.fromWei(await poolToken.balanceOf(accounts[0])));

        var gasCost = result.receipt.gasUsed * await web3.eth.getGasPrice();
        var addedRBTCAmount = web3.utils.BN(result.logs[0].args._reserveAmount).toString();
        assert.equal(await web3.eth.getBalance(accounts[0]), parseInt(web3.utils.toWei(rbtcAmountBefore)) + parseInt(addedRBTCAmount) - gasCost, "Wrong RBTC balance");
        assert.equal(await poolToken.balanceOf(accounts[0]), web3.utils.toWei(poolTokenAmountBefore) - 1e16, "Wrong pool token balance");
        await expectEvent(result.receipt, "LiquidityRemoved", {_provider:accounts[0], _reserveAmount:addedRBTCAmount, _poolTokenAmount:web3.utils.toBN(1e16)});
    });
    
    it('verifies that users could send RBTC and then swap it to DoC', async () => {
        var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
        var docTokenAmountBefore = web3.utils.fromWei((await docToken.balanceOf(accounts[0])));
        console.log('The account address:', accounts[0]);
        console.log('The amount of RBTC of the account:', rbtcAmountBefore);
        console.log('The amount of DoC of the account:', docTokenAmountBefore);

        var pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, docTokenAddress);
        var result = await rbtcWrapperProxy.convertByPath(sovrynSwapNetworkAddress, pathWRBTCToDoC, web3.utils.toBN(1e16), 1, {from:accounts[0], to:RBTCWrapperProxy.address, value:1e16});
        console.log('The amount of RBTC of the account after sending 0.01 RBTC:', web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
        console.log('The amount of DoC of the account after sending 0.01 RBTC:', web3.utils.fromWei((await docToken.balanceOf(accounts[0]))));
        
        var gasCost = result.receipt.gasUsed * await web3.eth.getGasPrice();
        var addedDoCTokenAmount = web3.utils.BN(result.logs[0].args._targetTokenAmount).toString();
        assert.equal(await web3.eth.getBalance(accounts[0]), parseInt(web3.utils.toWei(rbtcAmountBefore)) - gasCost - 1e16, "Wrong RBTC balance");
        assert.equal(web3.utils.BN(await docToken.balanceOf(accounts[0])).toString(), parseInt(web3.utils.toWei(docTokenAmountBefore)) + parseInt(addedDoCTokenAmount), "Wrong DoC token balance");
        await expectEvent(result.receipt, "TokenConverted", {_beneficiary:accounts[0], _sourceTokenAmount:web3.utils.toBN(1e16), _targetTokenAmount:addedDoCTokenAmount, _sovrynSwapNetworkAddress:sovrynSwapNetworkAddress, _path:pathWRBTCToDoC});
    });

    it('verifies that users could send DoC and then swap it to RBTC', async () => {
        console.log('The account address:', accounts[0]);
        console.log('The amount of RBTC of the account:', rbtcAmountBefore);
        console.log('The amount of DoC of the account:', docTokenAmountBefore);

        await docToken.approve(RBTCWrapperProxy.address, web3.utils.toBN(1e20), {from:accounts[0]});
        console.log('The allowance of DoC that the RBTCWrapperProxy smart contract could spend:', web3.utils.fromWei(((await docToken.allowance(accounts[0], RBTCWrapperProxy.address))).toString()));
        var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
        var docTokenAmountBefore = web3.utils.fromWei((await docToken.balanceOf(accounts[0])));
        
        var pathDoCToWRBTC = await sovrynSwapNetwork.conversionPath(docTokenAddress, wrbtcAddress);
        var rbtcAmountBefore = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]));
        var result = await rbtcWrapperProxy.convertByPath(sovrynSwapNetworkAddress, pathDoCToWRBTC, web3.utils.toBN(1e20), 1, {from:accounts[0], to:RBTCWrapperProxy.address});
        console.log('The amount of RBTC of the account after sending 100 DoC:', web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
        console.log('The amount of DoC of the account after sending 100 DoC:', web3.utils.fromWei((await docToken.balanceOf(accounts[0]))));

        var gasCost = result.receipt.gasUsed * await web3.eth.getGasPrice();
        var addedRBTCAmount = web3.utils.BN(result.logs[0].args._targetTokenAmount).toString();
        assert.equal(await web3.eth.getBalance(accounts[0]), parseInt(web3.utils.toWei(rbtcAmountBefore)) + parseInt(addedRBTCAmount) - gasCost, "Wrong RBTC balance");
        assert.equal(web3.utils.BN(await docToken.balanceOf(accounts[0])).toString(), parseInt(web3.utils.toWei(docTokenAmountBefore)) - 1e20, "Wrong DoC token balance");
        await expectEvent(result.receipt, "TokenConverted", {_beneficiary:accounts[0], _sourceTokenAmount:web3.utils.toBN(1e20), _targetTokenAmount:addedRBTCAmount, _sovrynSwapNetworkAddress:sovrynSwapNetworkAddress, _path:pathDoCToWRBTC});
    });

    it('should revert when calling the addLIquidity() without sending RBTC', async () => {
        await expectRevert.unspecified(rbtcWrapperProxy.addLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {from:accounts[0], to:RBTCWrapperProxy.address}), "No RBTC");
    });

    it('should revert when amount param not identical to msg.value to call addLiquidity()', async () => {
        await expectRevert.unspecified(rbtcWrapperProxy.addLiquidity(liquidityPoolV2ConverterAddress, web3.utils.toBN(1e16), 1, {from:accounts[0], to:RBTCWrapperProxy.address, value:1e8}), "The provided amount not identical to msg.value");
    });
    
    it('should revert when passing wrong path param to convertByPath()', async () => {
        var pathWRBTCToDoC = await sovrynSwapNetwork.conversionPath(wrbtcAddress, docTokenAddress);
        var pathDoCToWRBTC = await sovrynSwapNetwork.conversionPath(docTokenAddress, wrbtcAddress);
        await expectRevert.unspecified(rbtcWrapperProxy.convertByPath(sovrynSwapNetworkAddress, pathDoCToWRBTC, web3.utils.toBN(1e16), 1, {from:accounts[0], to:RBTCWrapperProxy.address, value:1e16}), "Wrong path param");
        await expectRevert.unspecified(rbtcWrapperProxy.convertByPath(sovrynSwapNetworkAddress, pathWRBTCToDoC, web3.utils.toBN(1e20), 1, {from:accounts[0], to:RBTCWrapperProxy.address}), "Wrong path param");
    });

});