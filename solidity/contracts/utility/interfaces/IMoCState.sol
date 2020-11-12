pragma solidity >=0.5.0 <0.6.0;

interface IMoCState {

  function setMaxDiscountRate(uint256 rate) external;

  function getMaxDiscountRate() external view returns(uint256);

  function setDayBlockSpan(uint256 blockSpan) external;

  function setBtcPriceProvider(address btcProviderAddress) external;

  function getBtcPriceProvider() external view returns(address);

  function getDayBlockSpan() external view returns(uint256);

  function subtractRbtcFromSystem(uint256 btcAmount) external;

  function addToRbtcInSystem(uint256 btcAmount) external;

  function bproTotalSupply() external view returns(uint256);

  function docTotalSupply() external view returns(uint256);

  function cobj() external view returns(uint256);

  function collateralRbtcInSystem() external view returns(uint256);

  function globalCoverage() external view returns(uint256);

  function lockedBitcoin(bytes32 bucket) external view returns(uint256);

  function getRbtcInBitPro(bytes32 bucket) external view returns(uint256);

  function getRbtcRemainder() external view returns(uint256);

  function coverage(bytes32 bucket) external view returns(uint256);

  function abundanceRatio(uint256 doc0) external view returns(uint256);

  function currentAbundanceRatio() external view returns(uint256);

  function leverage(bytes32 bucket) external view returns(uint256);

  function globalMaxDoc() external view returns(uint256);

  function freeDoc() external view returns(uint256);

  function maxDoc(bytes32 bucket) external view returns(uint256);

  function globalMaxBPro() external view returns(uint256);

  function absoluteMaxDoc() external view returns(uint256);

  function maxBPro(bytes32 bucket) external view returns(uint256);

  function maxBProx(bytes32 bucket) external view returns(uint256);

  function maxBProxBtcValue(bytes32 bucket) external view returns(uint256);

  function absoluteMaxBPro() external view returns(uint256);

  function maxBProWithDiscount() external view returns(uint256);

  function globalLockedBitcoin() external view returns(uint256);

  function bproTecPrice() external view returns(uint256);

  function bucketBProTecPrice(bytes32 bucket) external view returns(uint256);

  function bproDiscountPrice() external view returns(uint256);

  function bproUsdPrice() external view returns(uint256);

  function maxBProxBProValue(bytes32 bucket) external view returns(uint256);

  function bproxBProPrice(bytes32 bucket) external view returns(uint256);

  function bproSpotDiscountRate() external view returns(uint256);

  function daysToSettlement() external view returns(uint256);

  function blocksToSettlement() external view returns(uint256);

  function isLiquidationReached() external view returns(bool);

  function getLiquidationPrice() external view returns(uint256);

  function getBucketNBTC(bytes32 bucket) external view returns(uint256);

  function getBucketNBPro(bytes32 bucket) external view returns(uint256);

  function getBucketNDoc(bytes32 bucket) external view returns(uint256);

  function getBucketCobj(bytes32 bucket) external view returns(uint256);

  function getInrateBag(bytes32 bucket) external view returns(uint256);

  function getBcons() external view returns(uint256);

  function getBitcoinPrice() external view returns(uint256);

  function calculateBitcoinMovingAverage() external;

  function getLiq() external view returns(uint256);

  function setLiq(uint _liq) external;

  function getUtpdu() external view returns(uint256);

  function setUtpdu(uint _utpdu) external;

  function getPeg() external view returns(uint256);

  function setPeg(uint _peg) external;

  function nextState() external;

  function setMaxMintBPro(uint256 _maxMintBPro) external;

  function getMaxMintBPro() external view returns(uint256);

  function maxMintBProAvalaible() external view returns(uint256);
}
