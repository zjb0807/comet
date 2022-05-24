import { DeploymentManager } from '../../../plugins/deployment_manager/DeploymentManager';
import { migration } from '../../../plugins/deployment_manager/Migration';
import { exp, wait } from '../../../test/helpers';

interface Vars {};

migration<Vars>('1653357106_mint_to_fauceteer', {
  prepare: async (deploymentManager: DeploymentManager) => {
    const [signer] = await deploymentManager.hre.ethers.getSigners();
    const signerAddress = await signer.getAddress();

    console.log(`Minting as signer: ${signerAddress}`);

    const contracts = await deploymentManager.contracts();
    const fauceteer = contracts.get('fauceteer');
    const fauceteerAddress = fauceteer.address;

    // USDC (6 decimals)
    const USDC = contracts.get('USDC');
    console.log(`minting USDC@${USDC.address} to fauceteer@${fauceteerAddress}`);
    await wait(USDC.configureMinter(signerAddress, BigInt(100_000_000 * 1e6))); // mint 100M USDC
    await wait(USDC.mint(fauceteerAddress, BigInt(100_000_000 * 1e6)));
    console.log(`USDC.balanceOf(fauceteerAddress): ${await USDC.balanceOf(fauceteerAddress)}`);

    // WBTC (8 decimals)
    const WBTC = contracts.get('WBTC');
    console.log(`minting WBTC@${WBTC.address} to fauceteer${fauceteerAddress}`);
    await wait(WBTC.mint(fauceteerAddress, exp(100_000_000, 8))); // 100M WBTC
    console.log(`WBTC.balanceOf(fauceteerAddress): ${await WBTC.balanceOf(fauceteerAddress)}`);

    // COMP (18 decimals)
    const COMP = contracts.get('COMP');
    const signerCompBalance = await COMP.balanceOf(signerAddress);
    console.log(`transferring ${signerCompBalance.div(2)} COMP@${COMP.address} to fauceteer@${fauceteerAddress}`);
    await COMP.transfer(fauceteerAddress, signerCompBalance.div(2)); // transfer half of signer's balance
    console.log(`COMP.balanceOf(fauceteerAddress): ${await COMP.balanceOf(fauceteerAddress)}`);

    // UNI (18 decimals) XXX enable minting for UNI
    // const UNI = contracts.get('UNI');
    // console.log(`minting UNI@${UNI.address} to fauceteer@${fauceteerAddress}`);
    // await UNI.mint(fauceteerAddress, exp(100_000_000, 18)); // mint 100M UNI
    // console.log(`UNI.decimals(): ${await UNI.decimals()}`);

    // LINK (18 decimals)
    const LINK = contracts.get('LINK');
    const signerLinkBalance = await LINK.balanceOf(signerAddress);
    console.log(`transferring ${signerLinkBalance.div(2)} LINK@${LINK.address} to fauceteer@${fauceteerAddress}`);
    await LINK.transfer(fauceteerAddress, signerLinkBalance.div(2)); // transfer half of signer's balance
    console.log(`LINK.balanceOf(fauceteerAddress): ${await LINK.balanceOf(fauceteerAddress)}`);

    return {};
  },
  enact: async (deploymentManager: DeploymentManager, vars: Vars) => {

  },
  enacted: async (deploymentManager: DeploymentManager) => {
    return false;
  },
});
