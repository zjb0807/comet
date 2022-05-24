import { DeploymentManager } from '../../../plugins/deployment_manager/DeploymentManager';
import { migration } from '../../../plugins/deployment_manager/Migration';
import { exp, wait } from '../../../test/helpers';

interface Vars {};

migration<Vars>('1653357106_mint_to_fauceteer', {
  prepare: async (deploymentManager: DeploymentManager) => {
    const [signer] = await deploymentManager.hre.ethers.getSigners();
    const signerAddress = await signer.getAddress();

    console.log(`signerAddress: ${signerAddress}`);

    const contracts = await deploymentManager.contracts();
    const USDC = contracts.get('USDC');
    const fauceteer = contracts.get('fauceteer');
    const fauceteerAddress = fauceteer.address;

    console.log(`USDC.address: ${USDC.address}`);
    console.log(`fauceteer.address: ${fauceteer.address}`);
    console.log(`await USDC.masterMinter(): ${await USDC.masterMinter()}`);

    console.log(`minting USDC@${USDC.address} to fauceteer@${fauceteerAddress}`);

    await wait(USDC.configureMinter(signerAddress, BigInt(100_000_000 * 1e6))); // mint 100M USDC
    await wait(USDC.mint(fauceteerAddress, BigInt(100_000_000 * 1e6)));

    console.log(`USDC.balanceOf(fauceteerAddress): ${await USDC.balanceOf(fauceteerAddress)}`);


    return {};
  },
  enact: async (deploymentManager: DeploymentManager, vars: Vars) => {

  },
  enacted: async (deploymentManager: DeploymentManager) => {
    return false;
  },
});
