// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const hreconfig = require("@nomicsfoundations/hardhat-config");
const { USDT_ADDRESS, PLATFORM_WALLET } = require("../config");

require('dotenv').config();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const verifyContract = async (address, constructorArguments) => {
  try {
    await hre.run('verify:verify', {
      address,
      constructorArguments
    })
  } catch (error) {
    console.log("verify error =======>", error)
  }
}

async function main() {
  try {
    console.log('deploying...')
    console.log('hardhat init...')
    const retVal = await hreconfig.hreInit(hre)
    if (!retVal) {
      console.log('hardhat init error!');
      return false;
    }
    await hre.run('clean')
    await hre.run('compile')
    console.log('hardhat init OK')

    console.log('ReferralSystem deploying...')

    const networkName = hre.network.name;
    const usdtAddress = USDT_ADDRESS[networkName];
    
    console.log("USDT Address: ", usdtAddress);
    console.log("Platform Wallet: ", PLATFORM_WALLET);

    const ReferralSystem = await hre.ethers.getContractFactory("ReferralSystem");
    const referralSystem = await ReferralSystem.deploy(usdtAddress, PLATFORM_WALLET);

    console.log('ReferralSystem deploy submitted')

    await referralSystem.deployed();
    console.log('referralSystem deploy OK')
    console.log("Deployed Contract Address:", referralSystem.address);

    console.log('verifying...')

    console.log('referralSystem verifying...')

    await verifyContract(
      referralSystem.address,
      [usdtAddress, PLATFORM_WALLET]
    )

    console.log('referralSystem verify OK')

    console.log('Verified Contract Address:', referralSystem.address)
  } catch (error) {
    console.log('hardhat try catch', error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
