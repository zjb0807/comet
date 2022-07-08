import { event, expect, exp, setTotalsBasic } from '../helpers';

import { HttpNetworkConfig } from 'hardhat/types/config';
import hre, { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  CometExt__factory,
  CometHarness__factory,
  CometHarnessInterface,
  Liquidator,
  Liquidator__factory
} from '../../build/types';

import daiAbi from './dai-abi';
import usdcAbi from './usdc-abi';
import wethAbi from './weth-abi';
import wbtcAbi from './wbtc-abi';
import uniAbi from './uni-abi';
// import compAbi from './comp-abi';
import {
  COMP,
  COMP_USDC_PRICE_FEED,
  DAI,
  DAI_USDC_PRICE_FEED,
  DAI_WHALE,
  LINK,
  LINK_USDC_PRICE_FEED,
  SWAP_ROUTER,
  UNI,
  UNI_USDC_PRICE_FEED,
  UNI_WHALE,
  USDC,
  USDC_USD_PRICE_FEED,
  WBTC,
  WBTC_USDC_PRICE_FEED,
  WBTC_WHALE,
  WETH9,
  ETH_USDC_PRICE_FEED,
  WETH_WHALE,
  UNISWAP_V3_FACTORY,
} from './addresses';


async function makeProtocolAlt() {
  const CometExtFactory = (await ethers.getContractFactory('CometExt')) as CometExt__factory;
  const symbol32 = ethers.utils.formatBytes32String('📈BASE');
  const extensionDelegate = await CometExtFactory.deploy({ symbol32 });
  await extensionDelegate.deployed();

  const CometFactory = (await ethers.getContractFactory('CometHarness')) as CometHarness__factory;
  const config = {
    governor: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    pauseGuardian: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    extensionDelegate: extensionDelegate.address,
    baseToken: USDC,
    baseTokenPriceFeed: USDC_USD_PRICE_FEED,
    kink: 800000000000000000n,
    perYearInterestRateBase: 5000000000000000n,
    perYearInterestRateSlopeLow: 100000000000000000n,
    perYearInterestRateSlopeHigh: 3000000000000000000n,
    reserveRate: 100000000000000000n,
    storeFrontPriceFactor: 1000000000000000000n,
    trackingIndexScale: 1000000000000000n,
    baseTrackingSupplySpeed: 1000000000000000n,
    baseTrackingBorrowSpeed: 1000000000000000n,
    baseMinForRewards: 1000000n,
    baseBorrowMin: 1000000n,
    targetReserves: 1000000000000000000n,
    assetConfigs: [
      {
        asset: DAI,
        priceFeed: DAI_USDC_PRICE_FEED,
        decimals: 18,
        borrowCollateralFactor: 999999999999999999n,
        liquidateCollateralFactor: 1000000000000000000n,
        liquidationFactor: 900000000000000000n,
        supplyCap: 1000000000000000000000000n
      },
      {
        asset: COMP,
        priceFeed: COMP_USDC_PRICE_FEED,
        decimals: 18,
        borrowCollateralFactor: 999999999999999999n,
        liquidateCollateralFactor: 1000000000000000000n,
        liquidationFactor: 900000000000000000n,
        supplyCap: 100000000000000000000n
      },
      {
        asset: WBTC,
        priceFeed: WBTC_USDC_PRICE_FEED,
        decimals: 8,
        borrowCollateralFactor: 999999999999999999n,
        liquidateCollateralFactor: 1000000000000000000n,
        liquidationFactor: 900000000000000000n,
        supplyCap: 1000000000000000000000000n
      },
      {
        asset: WETH9,
        priceFeed: ETH_USDC_PRICE_FEED,
        decimals: 18,
        borrowCollateralFactor: 999999999999999999n,
        liquidateCollateralFactor: 1000000000000000000n,
        liquidationFactor: 900000000000000000n,
        supplyCap: 1000000000000000000000000n
      },
      {
        asset: LINK,
        priceFeed: LINK_USDC_PRICE_FEED,
        decimals: 18,
        borrowCollateralFactor: 999999999999999999n,
        liquidateCollateralFactor: 1000000000000000000n,
        liquidationFactor: 900000000000000000n,
        supplyCap: 1000000000000000000000000n
      },
      {
        asset: UNI,
        priceFeed: UNI_USDC_PRICE_FEED,
        decimals: 18,
        borrowCollateralFactor: 999999999999999999n,
        liquidateCollateralFactor: 1000000000000000000n,
        liquidationFactor: 900000000000000000n,
        supplyCap: 1000000000000000000000000n
      },
    ]
  };

  const comet = await CometFactory.deploy(config);
  await comet.deployed();
  console.log(`comet.address: ${comet.address}`);
  const cometHarnessInterface = await ethers.getContractAt('CometHarnessInterface', comet.address) as CometHarnessInterface;
  return cometHarnessInterface;
}

describe.only('Liquidator', function () {
  let comet: CometHarnessInterface;
  let liquidator: Liquidator;

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addrs: SignerWithAddress[];

  let mockDAI;
  let mockUSDC;
  let mockWETH;
  let mockWBTC;
  let mockUNI;

  beforeEach(async () => {
    const mainnetConfig = hre.config.networks.mainnet as HttpNetworkConfig;
    // fork from mainnet to make use of real Uniswap pools
    await ethers.provider.send(
      'hardhat_reset',
      [
        {
          forking: {
            jsonRpcUrl: mainnetConfig.url,
            blockNumber: 15097212
          },
        },
      ],
    );

    [owner, addr1, ...addrs] = await ethers.getSigners();
    // Deploy comet
    comet = await makeProtocolAlt();

    // Deploy liquidator
    const Liquidator = await ethers.getContractFactory('Liquidator') as Liquidator__factory;
    liquidator = await Liquidator.deploy(
      ethers.utils.getAddress(SWAP_ROUTER),
      ethers.utils.getAddress(comet.address),
      ethers.utils.getAddress(UNISWAP_V3_FACTORY),
      ethers.utils.getAddress(WETH9),
      [
        ethers.utils.getAddress(DAI),
        ethers.utils.getAddress(WETH9),
        ethers.utils.getAddress(WBTC),
        ethers.utils.getAddress(UNI),
      ],
      [100, 500, 3000, 3000]
    );
    await liquidator.deployed();

    // Set underwater account
    await setTotalsBasic(comet, {
      baseBorrowIndex: 2e15,
      baseSupplyIndex: 2e15,
      totalSupplyBase: 20000000000000n,
      totalBorrowBase: 20000000000000n
    });

    mockDAI = new ethers.Contract(DAI, daiAbi, owner);
    mockWETH = new ethers.Contract(WETH9, wethAbi, owner);
    mockWBTC = new ethers.Contract(WBTC, wbtcAbi, owner);
    mockUSDC = new ethers.Contract(USDC, usdcAbi, owner);
    mockUNI = new ethers.Contract(UNI, uniAbi, owner);

    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [DAI_WHALE],
    });
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [WETH_WHALE],
    });
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [WBTC_WHALE],
    });
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [UNI_WHALE],
    });
    const daiWhaleSigner = await ethers.getSigner(DAI_WHALE);
    const wethWhaleSigner = await ethers.getSigner(WETH_WHALE);
    const wbtcWhaleSigner = await ethers.getSigner(WBTC_WHALE);
    const uniWhaleSigner = await ethers.getSigner(UNI_WHALE);

    await mockDAI.connect(daiWhaleSigner).transfer(addr1.address, 200000000000000000000n);
    await mockWETH.connect(wethWhaleSigner).transfer(addr1.address, 200000000000000000000n);
    await mockWBTC.connect(wbtcWhaleSigner).transfer(addr1.address, 200000000n);
    await mockUNI.connect(uniWhaleSigner).transfer(addr1.address, 200000000000000000000n);
  });

  afterEach(async () => {
    // reset to blank hardhat network
    await ethers.provider.send('hardhat_reset', []);
  });

  it('Should init liquidator', async function () {
    expect(await liquidator.swapRouter()).to.equal(SWAP_ROUTER);
    expect(await liquidator.comet()).to.equal(comet.address);
  });

  it('Should execute DAI flash swap with profit', async () => {
    await mockDAI.connect(addr1).approve(comet.address, 120000000000000000000n);
    await comet.connect(addr1).supply(DAI, 120000000000000000000n); //
    await comet.setBasePrincipal(addr1.address, -(exp(200, 6)));

    const beforeUSDCBalance = await mockUSDC.balanceOf(owner.address);
    const tx = await liquidator.connect(owner).initFlash({
      accounts: [addr1.address],
      pairToken: ethers.utils.getAddress(DAI),
      poolFee: 500,
      reversedPair: false,
    });

    const afterUSDCBalance = await mockUSDC.balanceOf(owner.address);
    const profit = afterUSDCBalance - beforeUSDCBalance;
    expect(tx.hash).to.be.not.null;
    expect(profit).to.be.greaterThan(0);
  });

  it('Should execute WETH flash swap with profit', async () => {
    await mockWETH.connect(addr1).approve(comet.address, 120000000000000000000n);
    await comet.connect(addr1).supply(WETH9, 120000000000000000000n); //
    await comet.setBasePrincipal(addr1.address, -(exp(4000, 6)));

    const beforeUSDCBalance = await mockUSDC.balanceOf(owner.address);
    const tx = await liquidator.connect(owner).initFlash({
      accounts: [addr1.address],
      pairToken: ethers.utils.getAddress(DAI),
      poolFee: 500,
      reversedPair: false,
    });

    const afterUSDCBalance = await mockUSDC.balanceOf(owner.address);
    const profit = afterUSDCBalance - beforeUSDCBalance;
    expect(tx.hash).to.be.not.null;
    expect(profit).to.be.greaterThan(0);
  });

  it('Should execute WBTC flash swap with profit', async () => {
    await mockWBTC.connect(addr1).approve(comet.address, 200000000n);
    await comet.connect(addr1).supply(WBTC, 200000000n); //
    await comet.setBasePrincipal(addr1.address, -(exp(40000, 6)));

    const beforeUSDCBalance = await mockUSDC.balanceOf(owner.address);
    const tx = await liquidator.connect(owner).initFlash({
      accounts: [addr1.address],
      pairToken: ethers.utils.getAddress(DAI),
      poolFee: 500,
      reversedPair: false,
    });

    const afterUSDCBalance = await mockUSDC.balanceOf(owner.address);
    const profit = afterUSDCBalance - beforeUSDCBalance;
    expect(tx.hash).to.be.not.null;
    expect(profit).to.be.greaterThan(0);
  });

  it('Should execute UNI flash swap with profit', async () => {
    await mockUNI.connect(addr1).approve(comet.address, exp(120, 18));
    await comet.connect(addr1).supply(UNI, exp(120, 18)); //
    await comet.setBasePrincipal(addr1.address, -(exp(40000, 6)));

    const beforeUSDCBalance = await mockUSDC.balanceOf(owner.address);
    const tx = await liquidator.connect(owner).initFlash({
      accounts: [addr1.address],
      pairToken: ethers.utils.getAddress(DAI),
      poolFee: 500,
      reversedPair: false,
    });

    const afterUSDCBalance = await mockUSDC.balanceOf(owner.address);
    const profit = afterUSDCBalance - beforeUSDCBalance;
    expect(tx.hash).to.be.not.null;
    expect(profit).to.be.greaterThan(0);
  });
});
