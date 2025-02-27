require("@nomicfoundation/hardhat-toolbox");

require("@nomicfoundation/hardhat-ignition-ethers");

const {vars} = require("hardhat/config");
const TEST_API_KEY = vars.get("TEST_API_KEY");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "sepolia",
  networks: {
    sepolia:{
      url:`https://sepolia.infura.io/v3/${TEST_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`]
    },
  }
};

task( "accounts", "Prints the list of accounts", 
  async(taskArg, hre) => {
    const accounts = await hre.ethers.getSigners();

    for(const account of accounts)
    {
      console.log(account.address);
    }
  }
    

)
