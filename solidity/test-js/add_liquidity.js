const { assert } = require("chai");

const SovrynSwapNetwork = artifacts.require("SovrynSwapNetwork");
const SovrynSwapFormula = artifacts.require("SovrynSwapFormula");
const ContractRegistry = artifacts.require("ContractRegistry");
const ERC20Token = artifacts.require("ERC20Token");
const TestNonStandardToken = artifacts.require("TestNonStandardToken");
const ConverterFactory = artifacts.require("ConverterFactory");
const LiquidityPoolV2Converter = artifacts.require("LiquidityPoolV2Converter");
const LiquidityPoolV2ConverterFactory = artifacts.require(
  "LiquidityPoolV2ConverterFactory"
);
const LiquidityPoolV2ConverterAnchorFactory = artifacts.require(
  "LiquidityPoolV2ConverterAnchorFactory"
);
const LiquidityPoolV2ConverterCustomFactory = artifacts.require(
  "LiquidityPoolV2ConverterCustomFactory"
);
const PoolTokensContainer = artifacts.require("PoolTokensContainer");
const SmartToken = artifacts.require("SmartToken");
const ChainlinkPriceOracle = artifacts.require("TestChainlinkPriceOracle");
const Whitelist = artifacts.require("Whitelist");
const Forwarding = artifacts.require("Forwarding");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("AddLiquidity By forwarding", function(accounts) {
  let wei = web3.utils.toWei;
  it("should Adding liquidity  ", async () => {
    const maxConversionFee = 0;
    const contractRegistry = await ContractRegistry.new();

    //Need of sovrynSwapFormula because of getting balancedWeights
    const sovrynSwapFormula = await SovrynSwapFormula.new();
    await sovrynSwapFormula.init();
    const SOVRYNSWAP_FORMULA = web3.utils.asciiToHex("SovrynSwapFormula");
    await contractRegistry.registerAddress(
      SOVRYNSWAP_FORMULA,
      sovrynSwapFormula.address
    );

    //For activating: creates and initalizes the price oracle and sets initial rates

    const factory = await ConverterFactory.new();
    const CONVERTER_FACTORY = web3.utils.asciiToHex("ConverterFactory");
    await contractRegistry.registerAddress(CONVERTER_FACTORY, factory.address);

    await factory.registerTypedConverterFactory(
      (await LiquidityPoolV2ConverterFactory.new()).address
    );

    await factory.registerTypedConverterAnchorFactory(
      (await LiquidityPoolV2ConverterAnchorFactory.new()).address
    );
    await factory.registerTypedConverterCustomFactory(
      (await LiquidityPoolV2ConverterCustomFactory.new()).address
    );

    const sovrynSwapNetwork = await SovrynSwapNetwork.new(
      contractRegistry.address
    );
    const SOVRYNSWAP_NETWORK = web3.utils.asciiToHex("SovrynSwapNetwork");
    await contractRegistry.registerAddress(
      SOVRYNSWAP_NETWORK,
      sovrynSwapNetwork.address
    );

    const oracleWhitelist = await Whitelist.new();

    const CHAINLINK_ORACLE_WHITELIST = web3.utils.asciiToHex(
      "ChainlinkOracleWhitelist"
    );
    await contractRegistry.registerAddress(
      CHAINLINK_ORACLE_WHITELIST,
      oracleWhitelist.address
    );
    const INITIAL_ORACLE_A_PRICE = 10000;
    const INITIAL_ORACLE_B_PRICE = 20000;
    const createChainlinkOracle = async (answer) => {
      const chainlinkOracle = await ChainlinkPriceOracle.new();
      await chainlinkOracle.setAnswer(answer);

      // Set the last update time to a far enough future in order for the external oracle price to always take effect.
      await chainlinkOracle.setTimestamp(1642328302);

      return chainlinkOracle;
    };
    const chainlinkPriceOracleA = await createChainlinkOracle(
      INITIAL_ORACLE_A_PRICE
    );
    const chainlinkPriceOracleB = await createChainlinkOracle(
      INITIAL_ORACLE_B_PRICE
    );

    await oracleWhitelist.addAddress(chainlinkPriceOracleA.address);
    await oracleWhitelist.addAddress(chainlinkPriceOracleB.address);

    const reserveToken = await ERC20Token.new(
      "ERC Token 1",
      "ERC1",
      18,
      wei("12", "ether")
    );

    const reserveToken1 = await TestNonStandardToken.new(
      "ERC Token 2",
      "ERC2",
      18,
      wei("12", "ether")
    );
    const anchor = await PoolTokensContainer.new("usdrBTC", "POOL", 18);

    const converter = await LiquidityPoolV2Converter.new(
      anchor.address,
      contractRegistry.address,
      maxConversionFee
    );

    await converter.addReserve(reserveToken.address, 500000);

    await converter.addReserve(reserveToken1.address, 500000);
    await anchor.transferOwnership(converter.address);
    await converter.acceptAnchorOwnership();

    await converter.activate(
      reserveToken1.address,
      chainlinkPriceOracleB.address,
      chainlinkPriceOracleA.address
    );
    const INITIAL_RESERVE1_LIQUIDITY = wei("3", "ether");
    const MIN_RETURN = wei("1", "ether");
    const poolTokenAddress = await converter.poolToken(reserveToken.address);
    const poolToken = await SmartToken.at(poolTokenAddress);
    const poolTokenAddress1 = await converter.poolToken(reserveToken1.address);
    const poolToken1 = await SmartToken.at(poolTokenAddress1);

    assert.equal(
      await poolToken.name(),
      "usdrBTC1",
      "1st PoolToken name didn't set yet"
    );
    assert.equal(
      await poolToken1.name(),
      "usdrBTC2",
      "2nd PoolToken name didn't set yet"
    );
    await reserveToken1.approve(converter.address, INITIAL_RESERVE1_LIQUIDITY);
    const initialStaked = (await poolToken1.balanceOf(accounts[0])).toString();
    assert.equal(0, initialStaked, "Intial Balance is not zero");
    await converter.addLiquidity(
      reserveToken1.address,
      INITIAL_RESERVE1_LIQUIDITY,
      MIN_RETURN
    );

    const afterStaking_3ERCToken2 = (
      await poolToken1.balanceOf(accounts[0])
    ).toString();
    assert.equal(
      INITIAL_RESERVE1_LIQUIDITY,
      afterStaking_3ERCToken2,
      "3 ErcToken2 supply not provide in usdrBTC2 pool"
    );
    // await reserveToken1.approve(converter.address, INITIAL_RESERVE1_LIQUIDITY);
    // await converter.addLiquidity(
    //   reserveToken1.address,
    //   INITIAL_RESERVE1_LIQUIDITY,
    //   MIN_RETURN
    // );
    // const afterStaking_3Plus3ERCToken2 = (
    //   await poolToken1.balanceOf(accounts[0])
    // ).toString();
    // assert.equal(
    //   INITIAL_RESERVE1_LIQUIDITY * 2,
    //   afterStaking_3Plus3ERCToken2,
    //   "6 ErcToken2 supply not provide in usdrBTC2 pool"
    // );

    // ADDING LIQUIDITY BY ForwardingContract By erc20 token reserToken

    const forwarding = await Forwarding.new();
    await reserveToken.approve(forwarding.address, INITIAL_RESERVE1_LIQUIDITY);
    await forwarding.addLiquidity(
      converter.address,
      reserveToken.address,
      INITIAL_RESERVE1_LIQUIDITY,
      MIN_RETURN
    );
    const poolShare = (await poolToken.balanceOf(accounts[0])).toString();
    assert.equal(
      INITIAL_RESERVE1_LIQUIDITY,
      poolShare,
      "Liquidity providing getting error"
    );
  });
});
