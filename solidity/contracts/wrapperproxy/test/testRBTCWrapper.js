const RBTCWrapperProxy = artifacts.require("../contracts/RBTCWrapperProxy.sol");
const IERC20Token = artifacts.require("../contracts/interfaces/IERC20Token.sol");
const ISmartToken = artifacts.require("../contracts/interfaces/ISmartToken.sol");
const ISovrynSwapNetwork = artifacts.require("../contracts/interfaces/ISovrynSwapNetwork.sol");
const IWrbtcERC20 = artifacts.require("../contracts/interfaces/IWrbtcERC20.sol");


contract('RBTCWrapperProxy', async (accounts) => {
    const poolTokenAddress = '0x7F433CC76298bB5099c15C1C7C8f2e89A8370111';
    const docTokenAddress = '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0';
    const sovrynSwapNetworkAddress = '0x61172B53423E205a399640e5283e51FE60EC2256';
    const wrbtcAddress = '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab';
    const rbtcWrapperProxy = await RBTCWrapperProxy.deployed();
    const poolToken = await ISmartToken.at(poolTokenAddress);
    const docToken = await IERC20Token.at(docTokenAddress);
    const sovrynSwapNetwork = await ISovrynSwapNetwork.at(sovrynSwapNetworkAddress);
    const wrbtc = await IWrbtcERC20.at(wrbtcAddress);
    const account = await web3.utils.toChecksumAddress(accounts[0]);

    it('verifies that users could send RBTC and then add liquidity to get pool token', async () => {
        console.log('The account address:', account);
        console.log('The amount of RBTC of the account:', await web3.eth.getBalance(account));
        console.log('The amount of pool token of the account:', await poolToken.balanceOf(account));
        await rbtcWrapperProxy.addLiquidity(web3.utils.toBN(1e16), 1, {from:account, to:RBTCWrapperProxy.address, value:1e16});
        console.log('The amount of RBTC of the account after sending 0.01 RBTC:', await web3.eth.getBalance(account));
        console.log('The amount of pool token of the account after sending 0.01 RBTC:', await poolToken.balanceOf(account));
    });

    it('verifies that users could remove liquidity to burn pool token and then get RBTC', async () => {
        console.log('The account address:', account);
        console.log('The amount of RBTC of the account:', await web3.eth.getBalance(account));
        console.log('The amount of pool token of the account:', await poolToken.balanceOf(account));
        await poolToken.approve(RBTCWrapperProxy.address, await web3.utils.toBN(1e16), {from:account});
        console.log('The allowance of pool token that the RBTCWrapperProxy smart contract could spend:', await poolToken.allowance(account, RBTCWrapperProxy.address));
        await rbtcWrapperProxy.removeLiquidity(web3.utils.toBN(1e16), 1, {from:account, to:RBTCWrapperProxy.address});
        console.log('The amount of RBTC of the account after burning 0.01 pool token:', await web3.eth.getBalance(account));
        console.log('The amount of pool token of the account after burning 0.01 pool token:', await poolToken.balanceOf(account));
    });
    
    it('verifies that users could send RBTC and then swap it to DoC', async () => {
        console.log('The account address:', account);
        console.log('The amount of RBTC of the account:', await web3.eth.getBalance(account));
        console.log('The amount of DoC of the account:', await docToken.balanceOf(account));
        var path = await sovrynSwapNetwork.conversionPath(IERC20Token(wrbtcAddress), IERC20Token(docTokenAddress));
        await rbtcWrapperProxy.convertByPath(path, web3.utils.toBN(1e16), 1, {from:account, to:RBTCWrapperProxy.address, value:1e16});
        console.log('The amount of RBTC of the account after sending 0.01 RBTC:', await web3.eth.getBalance(account));
        console.log('The amount of DoC of the account after sending 0.01 RBTC:', await docToken.balanceOf(account));
    });

    it('verifies that users could send DoC and then swap it to RBTC', async () => {
        console.log('The account address:', account);
        console.log('The amount of RBTC of the account:', await web3.eth.getBalance(account));
        console.log('The amount of DoC of the account:', await docToken.balanceOf(account));
        await docToken.approve(RBTCWrapperProxy.address, await web3.utils.toBN(1e20), {from:account});
        console.log('The allowance of DoC that the RBTCWrapperProxy smart contract could spend:', await docToken.allowance(account, RBTCWrapperProxy.address));
        var path = await sovrynSwapNetwork.conversionPath(IERC20Token(docTokenAddress), IERC20Token(wrbtcAddress));
        await rbtcWrapperProxy.convertByPath(path, web3.utils.toBN(1e20), 1, {from:account, to:RBTCWrapperProxy.address});
        console.log('The amount of RBTC of the account after sending 100 DoC:', await web3.eth.getBalance(account));
        console.log('The amount of DoC of the account after sending 100 DoC:', await docToken.balanceOf(account));
    });

});