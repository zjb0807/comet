// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat';
import { ethers } from 'hardhat';
import { deployComet } from '../src/deploy';
import { DeploymentManager } from '../plugins/deployment_manager/DeploymentManager';

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
  // address governor;
  // address pauseGuardian;
  // address baseToken;
  // address baseTokenPriceFeed;
  // address extensionDelegate;

  // uint64 kink;
  // uint64 perYearInterestRateSlopeLow;
  // uint64 perYearInterestRateSlopeHigh;
  // uint64 perYearInterestRateBase;
  // uint64 reserveRate;
  // uint64 storeFrontPriceFactor;
  // uint64 trackingIndexScale;
  // uint64 baseTrackingSupplySpeed;
  // uint64 baseTrackingBorrowSpeed;
  // uint104 baseMinForRewards;
  // uint104 baseBorrowMin;
  // uint104 targetReserves;

  // AssetConfig[] assetConfigs;

//   struct Configuration {
//     address governor;
//     address pauseGuardian;
//     address baseToken;
//     address baseTokenPriceFeed;
//     address extensionDelegate;

//     uint64 kink;
//     uint64 perYearInterestRateSlopeLow;
//     uint64 perYearInterestRateSlopeHigh;
//     uint64 perYearInterestRateBase;
//     uint64 reserveRate;
//     uint64 storeFrontPriceFactor;
//     uint64 trackingIndexScale;
//     uint64 baseTrackingSupplySpeed;
//     uint64 baseTrackingBorrowSpeed;
//     uint104 baseMinForRewards;
//     uint104 baseBorrowMin;
//     uint104 targetReserves;

//     AssetConfig[] assetConfigs;
// }

//   struct AssetConfig {
//       address asset;
//       address priceFeed;
//       uint8 decimals;
//       uint64 borrowCollateralFactor;
//       uint64 liquidateCollateralFactor;
//       uint64 liquidationFactor;
//       uint128 supplyCap;
//   }


  let abi = [{
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "governor",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "pauseGuardian",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "baseToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "baseTokenPriceFeed",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "extensionDelegate",
            "type": "address"
          },
          {
            "internalType": "uint64",
            "name": "kink",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "perYearInterestRateSlopeLow",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "perYearInterestRateSlopeHigh",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "perYearInterestRateBase",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "reserveRate",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "storeFrontPriceFactor",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "trackingIndexScale",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "baseTrackingSupplySpeed",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "baseTrackingBorrowSpeed",
            "type": "uint64"
          },
          {
            "internalType": "uint104",
            "name": "baseMinForRewards",
            "type": "uint104"
          },
          {
            "internalType": "uint104",
            "name": "baseBorrowMin",
            "type": "uint104"
          },
          {
            "internalType": "uint104",
            "name": "targetReserves",
            "type": "uint104"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "asset",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "priceFeed",
                "type": "address"
              },
              {
                "internalType": "uint8",
                "name": "decimals",
                "type": "uint8"
              },
              {
                "internalType": "uint64",
                "name": "borrowCollateralFactor",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "liquidateCollateralFactor",
                "type": "uint64"
              },
              {
                "internalType": "uint64",
                "name": "liquidationFactor",
                "type": "uint64"
              },
              {
                "internalType": "uint128",
                "name": "supplyCap",
                "type": "uint128"
              }
            ],
            "internalType": "struct CometConfiguration.AssetConfig[]",
            "name": "assetConfigs",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct CometConfiguration.Configuration",
        "name": "config",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  }];
  let iface = new ethers.utils.Interface(abi);
  console.log(iface.format(ethers.utils.FormatTypes.minimal));
  let type = "tuple(address,address,address,address,address,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint104,uint104,uint104,tuple(address,address,uint8,uint64,uint64,uint64,uint128)[])";
  let bytes = "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000920002e8e3210f22b2759f320081694feadc444a0000000000000000000000001c2c3c2e3232080e0738187520372e30ce2e34cb0000000000000000000000004004fdd0ec968d955862806d500988d58b2e70300000000000000000000000009211c6b3bf41a10f78539810cf5c64e1bb78ec60000000000000000000000000f9c3eb5d8113d26f0e0f3a20163c0cfba8e129410000000000000000000000000000000000000000000000000b1a2bc2ec50000000000000000000000000000000000000000000000000000000470de4df820000000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002400000000000000000000000000000000000000000000000000000000000000005000000000000000000000000e38227061686df3ca2b48f270f1b037df8637e69000000000000000000000000ecf93d14d25e02ba2c13698eedca9aa98348efb600000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000853a0d2313c000000000000000000000000000000000000000000000000000009b6e64a8ec600000000000000000000000000000000000000000000000000000c7d713b49da00000000000000000000000000000000000000000000000000056bc75e2d631000000000000000000000000000009266be32dfcd78984775b2920927efbe44c5cefa0000000000000000000000006135b13325bfc4b00278b4abc5e20bbce2d6580e0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000058d15e17628000000000000000000000000000000000000000000000000000006f05b59d3b200000000000000000000000000000000000000000000000000000c7d713b49da000000000000000000000000000000000000000000000000000000000002540be40000000000000000000000000005c2cecf8c4c30e8be5c396488f0cbe53176f6200000000000000000000000009326bfa02add2366b30bacb125260af641031331000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000009b6e64a8ec600000000000000000000000000000000000000000000000000000b1a2bc2ec5000000000000000000000000000000000000000000000000000000c7d713b49da00000000000000000000000000000000000000000000000000056bc75e2d631000000000000000000000000000008cb051f87727e50879732f1e4f7b7d1d2b499267000000000000000000000000da5904bdbfb4ef12a3955aeca103f51dc87c7c39000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000009b6e64a8ec600000000000000000000000000000000000000000000000000000b1a2bc2ec5000000000000000000000000000000000000000000000000000000c7d713b49da00000000000000000000000000000000000000000000000000056bc75e2d631000000000000000000000000000009e787a03a3e05c375dc4be552862edfc51106722000000000000000000000000396c5e36dd0a0f5a5d33dae44368d4193f69a1f00000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000058d15e17628000000000000000000000000000000000000000000000000000006f05b59d3b200000000000000000000000000000000000000000000000000000c7d713b49da00000000000000000000000000000000000000000000000000056bc75e2d63100000";
  console.log(JSON.stringify(ethers.utils.defaultAbiCoder.decode([type], bytes), null, 4));

  let args = [
    {
      governor: "0x920002E8e3210f22B2759f320081694Feadc444a",
      pauseGuardian: "0x1C2C3c2E3232080e0738187520372e30Ce2e34CB",
      baseToken: "0x4004FdD0eC968d955862806d500988D58B2e7030",
      baseTokenPriceFeed: "0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60",
      extensionDelegate: "0xF9C3eB5d8113D26F0e0F3A20163c0cFBA8E12941",
      kink: "800000000000000000",
      perYearInterestRateSlopeLow: "20000000000000000",
      perYearInterestRateSlopeHigh: "100000000000000000",
      perYearInterestRateBase: "10000000000000000",
      reserveRate: "100000000000000000",
      storeFrontPriceFactor: "0",
      trackingIndexScale: "1000000000000000",
      baseTrackingSupplySpeed: "0",
      baseTrackingBorrowSpeed: "0",
      baseMinForRewards: "1",
      baseBorrowMin: "1000000",
      targetReserves: "0",
      assetConfigs: 
      [
        {
          asset: "0xE38227061686DF3cA2B48f270F1B037DF8637e69",
          priceFeed: "0xECF93D14d25E02bA2C13698eeDca9aA98348EFb6",
          decimals: 18,
          borrowCollateralFactor: "600000000000000000",
          liquidateCollateralFactor: "700000000000000000",
          liquidationFactor: "900000000000000000",
          supplyCap: "100000000000000000000",
        },      
        {
          asset: "0x9266BE32DFcD78984775B2920927EfBE44C5CEfa",
          priceFeed: "0x6135b13325bfC4B00278B4abC5e20bbce2D6580e",
          decimals: 8,
          borrowCollateralFactor: "400000000000000000",
          liquidateCollateralFactor: "500000000000000000",
          liquidationFactor: "900000000000000000",
          supplyCap: "10000000000",
        },
        {
          asset: "0x05C2cEcF8c4C30e8bE5c396488f0cBE53176f620",
          priceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
          decimals: 18,
          borrowCollateralFactor: "700000000000000000",
          liquidateCollateralFactor: "800000000000000000",
          liquidationFactor: "900000000000000000",
          supplyCap: "100000000000000000000",
        },
        {
          asset: "0x8cB051f87727E50879732f1e4f7B7D1D2B499267",
          priceFeed: "0xDA5904BdBfB4EF12a3955aEcA103F51dc87c7C39",
          decimals: 18,
          borrowCollateralFactor: "700000000000000000",
          liquidateCollateralFactor: "800000000000000000",
          liquidationFactor: "900000000000000000",
          supplyCap: "100000000000000000000",
        },
        {
          asset: "0x9E787a03A3E05C375dC4bE552862Edfc51106722",
          priceFeed: "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0",
          decimals: 18,
          borrowCollateralFactor: "400000000000000000",
          liquidateCollateralFactor: "500000000000000000",
          liquidationFactor: "900000000000000000",
          supplyCap: "100000000000000000000",
        }
      ]
    }
  ];

  let args2 = [
    {
      governor: "0x920002E8e3210f22B2759f320081694Feadc444a",
      pauseGuardian: "0x1C2C3c2E3232080e0738187520372e30Ce2e34CB",
      baseToken: "0x4004FdD0eC968d955862806d500988D58B2e7030",
      baseTokenPriceFeed: "0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60",
      extensionDelegate: "0xF9C3eB5d8113D26F0e0F3A20163c0cFBA8E12941",
      kink: "0x0b1a2bc2ec500000",
      perYearInterestRateSlopeLow: "0x470de4df820000",
      perYearInterestRateSlopeHigh: "0x016345785d8a0000",
      perYearInterestRateBase: "0x2386f26fc10000",
      reserveRate: "0x016345785d8a0000",
      storeFrontPriceFactor: "0x00",
      trackingIndexScale: "0x038d7ea4c68000",
      baseTrackingSupplySpeed: "0x00",
      baseTrackingBorrowSpeed: "0x00",
      baseMinForRewards: "0x01",
      baseBorrowMin: "0x0f4240",
      targetReserves: "0x00",
      assetConfigs: 
      [
        {
          asset: "0xE38227061686DF3cA2B48f270F1B037DF8637e69",
          priceFeed: "0xECF93D14d25E02bA2C13698eeDca9aA98348EFb6",
          decimals: 18,
          borrowCollateralFactor: "0x0853a0d2313c0000",
          liquidateCollateralFactor: "0x09b6e64a8ec60000",
          liquidationFactor: "0x0c7d713b49da0000",
          supplyCap: "0x056bc75e2d63100000",
        },      
        {
          asset: "0x9266BE32DFcD78984775B2920927EfBE44C5CEfa",
          priceFeed: "0x6135b13325bfC4B00278B4abC5e20bbce2D6580e",
          decimals: 8,
          borrowCollateralFactor: "0x058d15e176280000",
          liquidateCollateralFactor: "0x06f05b59d3b20000",
          liquidationFactor: "0x0c7d713b49da0000",
          supplyCap: "0x02540be400",
        },
        {
          asset: "0x05C2cEcF8c4C30e8bE5c396488f0cBE53176f620",
          priceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
          decimals: 18,
          borrowCollateralFactor: "0x09b6e64a8ec60000",
          liquidateCollateralFactor: "0x0b1a2bc2ec500000",
          liquidationFactor: "0x0c7d713b49da0000",
          supplyCap: "0x056bc75e2d63100000",
        },
        {
          asset: "0x8cB051f87727E50879732f1e4f7B7D1D2B499267",
          priceFeed: "0xDA5904BdBfB4EF12a3955aEcA103F51dc87c7C39",
          decimals: 18,
          borrowCollateralFactor: "0x09b6e64a8ec60000",
          liquidateCollateralFactor: "0x0b1a2bc2ec500000",
          liquidationFactor: "0x0c7d713b49da0000",
          supplyCap: "0x056bc75e2d63100000",
        },
        {
          asset: "0x9E787a03A3E05C375dC4bE552862Edfc51106722",
          priceFeed: "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0",
          decimals: 18,
          borrowCollateralFactor: "0x058d15e176280000",
          liquidateCollateralFactor: "0x06f05b59d3b20000",
          liquidationFactor: "0x0c7d713b49da0000",
          supplyCap: "0x056bc75e2d63100000",
        }
      ]
    }
  ];

  let encodedBytes = ethers.utils.defaultAbiCoder.encode([type], args2);
  if (encodedBytes === bytes) { 
    console.log('MATCH')
  } else {
    console.log('NO MATCH')
  }

  console.log('Starting verification!')

  // await verifyContract("0xa52dcb6bd70ac1af6aefd76d52726c38aff0046c", args2);

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