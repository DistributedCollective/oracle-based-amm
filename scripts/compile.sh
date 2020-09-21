#!/bin/bash
solc="docker run -v $HOME/Projects/oracle-based-amm/solidity:/solidity ethereum/solc:0.4.26"
CONTRACTS_PATH=../solidity/contracts
OUTPUT_PATH=../solidity/build
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/SovrynSwapNetwork.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/ConversionPathFinder.sol

$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/sovrynSwapx/SovrynSwapX.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/sovrynSwapx/XTransferRerouter.sol

$solc --optimize --optimize-runs 20000 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/SovrynSwapFormula.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/ConverterFactory.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/ConverterRegistry.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/ConverterRegistryData.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/ConverterUpgrader.sol

$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/types/liquid-token/LiquidTokenConverter.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/types/liquid-token/LiquidTokenConverterFactory.sol

$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/types/liquidity-pool-v1/LiquidityPoolV1Converter.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/types/liquidity-pool-v1/LiquidityPoolV1ConverterFactory.sol

$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/types/liquidity-pool-v2/LiquidityPoolV2Converter.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/types/liquidity-pool-v2/LiquidityPoolV2ConverterFactory.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/types/liquidity-pool-v2/LiquidityPoolV2ConverterAnchorFactory.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/types/liquidity-pool-v2/LiquidityPoolV2ConverterCustomFactory.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/converter/types/liquidity-pool-v2/PoolTokensContainer.sol

$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/token/EtherToken.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/token/SmartToken.sol

$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/utility/ChainlinkETHToETHOracle.sol

$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/utility/MocBTCToUSDOracle.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/utility/MocBTCToBTCOracle.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/utility/MocUSDToBTCOracle.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/utility/MoCOracleMock.sol

$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/utility/ContractRegistry.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/utility/PriceOracle.sol
$solc --optimize --optimize-runs 200 --abi --bin --allow-paths $CONTRACTS_PATH, -o $OUTPUT_PATH --overwrite $CONTRACTS_PATH/utility/Whitelist.sol
