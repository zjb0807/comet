// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat';
import { ethers } from 'hardhat';
import { deployComet } from '../src/deploy';
import { DeploymentManager } from '../plugins/deployment_manager/DeploymentManager';
import {
  Comet__factory,
  Comet,
  CometFactory__factory,
  CometFactory,
  Configurator,
  Configurator__factory,
} from '../build/types';
import { ConfigurationStruct } from '../build/types/CometFactory';

const delay = ms => new Promise(res => setTimeout(res, ms));

async function verifyContract(address: string, constructorArguments) {
  try {
    return await hre.run('verify:verify', {
      address,
      constructorArguments,
    });
  } catch (e) {
    const regex = /Already Verified/i;
    const result = e.message.match(regex);
    if (result) {
      console.log(
        'Contract at address ' + address + ' is already verified on Etherscan'
      );
      return;
    }
    throw e;
  }
}

async function main() {
  await hre.run('compile');
  let isDevelopment = hre.network.name === 'hardhat';
  let dm = new DeploymentManager(hre.network.name, hre, {
    writeCacheToDisk: true,
    verifyContracts: !isDevelopment,
    debug: true,
  });

  const signers = await dm.hre.ethers.getSigners();
  const admin = await signers[0];
  // let cometFactory = await dm.deploy<CometFactory, CometFactory__factory, []>(
  //   'CometFactory.sol',
  //   []
  // );
  // console.log('comet factory deployed at ', cometFactory.address)

  let configurator = (await ethers.getContractAt("Configurator", "0x62f5a823efcd2bac5df35141acccd2099cc83b72", admin)) as Configurator;
  let config: ConfigurationStruct = await configurator.getConfiguration();
  console.log(config)


  const comet = await dm.deploy<Comet, Comet__factory, [ConfigurationStruct]>(
    'Comet.sol',
    [config]
  );
  console.log('comet deployed at ', comet.address)

  console.log('waiting 1 min before verification')
  await delay(60000);

  console.log('Starting verification!')

  await verifyContract(comet.address, [config]);

  console.log('Finished verifying!')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });